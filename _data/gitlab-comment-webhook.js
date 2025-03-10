import { SSMClient, GetParameterCommand } from '@aws-sdk/client-ssm';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import crypto from 'crypto';

// Configuration constants from environment variables
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "noreply@simbiosi.org";
const SENDER_EMAIL = process.env.SENDER_EMAIL || ADMIN_EMAIL;

/**
 * Lambda handler function for GitLab comment webhook
 * @param {Object} event - Lambda event object
 * @param {Object} context - Lambda context object
 * @returns {Object} - Response object
 */
export const handler = async (event, context) => {
  try {
    console.log('Received event:', JSON.stringify(event, null, 2));
    
    // Parse the incoming webhook payload
    // Handle both direct invocation and API Gateway proxy integration
    let body;
    
    if (event.body) {
      // API Gateway proxy integration - body is a string
      body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
      console.log('Parsed body from API Gateway:', JSON.stringify(body, null, 2));
    } else {
      // Direct invocation - event is the body
      body = event;
      console.log('Using event directly:', JSON.stringify(body, null, 2));
    }
    
    // Check if this is a merge request event
    if (body.object_kind === 'merge_request') {
      console.log('Processing merge request webhook');
      
      // Extract merge request information
      const mergeStatus = body.object_attributes?.state || 'unknown';
      const mergeAction = body.object_attributes?.action || 'unknown';
      const projectName = body.project?.name || 'unknown';
      const mergeTitle = body.object_attributes?.title || 'unknown';
      const description = body.object_attributes?.description || '';
      
      console.log(`Received merge request event: ${mergeAction} with status ${mergeStatus}`);
      console.log(`Project: ${projectName}, Title: ${mergeTitle}`);
      
      // Try to extract comment data from the description field
      let commentData = null;
      try {
        // Look for JSON data in the description
        const jsonMatch = description.match(/```json\n([\s\S]*?)\n```/);
        if (jsonMatch && jsonMatch[1]) {
          console.log('Found JSON data in description, attempting to parse');
          commentData = JSON.parse(jsonMatch[1]);
          console.log('Successfully parsed comment data from description:', JSON.stringify(commentData, null, 2));
        }
      } catch (parseError) {
        console.error(`Error parsing JSON from description: ${parseError.message}`);
        // Continue execution, we'll handle missing data later
      }
      
      // If we found comment data, process it regardless of merge status
      if (commentData) {
        console.log('Processing comment data extracted from merge request description');
        return await processCommentData(commentData);
      }
      
      // If no comment data found and not merged, just return success
      if (mergeStatus !== 'merged') {
        console.log(`Merge request is not in 'merged' state (current: ${mergeStatus}) and no comment data found. Skipping notification.`);
        
        // If it's a closed or rejected merge request, send admin notification
        if (['closed', 'rejected'].includes(mergeStatus)) {
          await sendAdminNotification(
            `Merge request not processed: ${mergeStatus}`,
            `A merge request was ${mergeStatus} and not processed:\n\nProject: ${projectName}\nTitle: ${mergeTitle}\nStatus: ${mergeStatus}\nAction: ${mergeAction}`
          );
        }
        
        // Return success to prevent GitLab from disabling the webhook
        return {
          statusCode: 200,
          body: JSON.stringify({
            message: `Webhook received but skipped processing (merge status: ${mergeStatus})`,
            status: 'skipped'
          })
        };
      }
      
      // If merged but no comment data found, log and return success
      console.log('Merge request is in merged state but no comment data found in description');
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: 'Webhook received but no comment data found',
          status: 'skipped'
        })
      };
    }
    
    // If not a merge request, assume it's direct comment data
    return await processCommentData(body);
  } catch (error) {
    console.error(`Error processing webhook: ${error.message}`);
    console.error(`Error stack: ${error.stack}`);
    
    // Send admin notification about the error
    try {
      await sendAdminNotification(
        "Webhook Processing Error",
        `An error occurred while processing a webhook:\n\nError: ${error.message}\n\nStack: ${error.stack}`
      );
    } catch (notificationError) {
      console.error(`Failed to send admin notification: ${notificationError.message}`);
    }
    
    // Return success status even on error to prevent GitLab from disabling the webhook
    return {
      statusCode: 200, // Changed from 500 to 200 to prevent webhook disabling
      body: JSON.stringify({
        message: `Webhook received but encountered an error: ${error.message}`,
        status: 'error'
      })
    };
  }
};

/**
 * Process comment data and send notification
 * @param {Object} commentData - The comment data to process
 * @returns {Object} - Response object
 */
async function processCommentData(commentData) {
  try {
    // Extract the comment information from the payload
    const commentId = commentData._id;
    const name = commentData.name;
    const encryptedEmail = commentData.email;
    const message = commentData.message;
    const date = commentData.date;
    
    // Check if we have the required data
    if (!name || !encryptedEmail || !message) {
      console.warn('Missing required comment data, but returning 200 to prevent webhook disabling');
      await sendAdminNotification(
        "Missing Comment Data",
        `Received webhook with missing required data:\n\nReceived data: ${JSON.stringify(commentData, null, 2)}`
      );
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: 'Webhook received but missing required data',
          status: 'skipped'
        })
      };
    }
    
    // Log the received data (for debugging)
    console.log(`Received comment from ${name} with ID ${commentId}`);
    console.log(`Encrypted email: ${encryptedEmail ? encryptedEmail.substring(0, 10) + '...' : 'undefined'}`);
    
    // Decrypt the email using RSA private key
    const decryptedEmail = await decryptEmail(encryptedEmail);
    
    if (!decryptedEmail) {
      console.error("Failed to decrypt email address, but returning 200 to prevent webhook disabling");
      await sendAdminNotification(
        "Email Decryption Failed",
        `Failed to decrypt email for comment from ${name}\n\nMessage: ${message}\n\nPlease check the logs for more details.`
      );
      
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: 'Webhook received but email decryption failed',
          status: 'error',
          commentId: commentId
        })
      };
    }
    
    // Send notification email
    await sendNotificationEmail(decryptedEmail, name, message);
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Notification sent successfully',
        status: 'success',
        commentId: commentId
      })
    };
  } catch (error) {
    console.error(`Error in processCommentData: ${error.message}`);
    throw error; // Let the main handler catch this
  }
}

/**
 * Decrypt the email using RSA private key
 * @param {string} encryptedEmail - Base64 encoded encrypted email
 * @returns {Promise<string>} - Decrypted email address
 */
async function decryptEmail(encryptedEmail) {
  try {
    console.log(`Starting email decryption process for encrypted data: ${encryptedEmail ? encryptedEmail.substring(0, 10) + '...' : 'undefined'}`);
    
    if (!encryptedEmail) {
      console.error('Error: encryptedEmail is null or undefined');
      return null;
    }
    
    // Get the RSA private key from AWS Parameter Store
    console.log('Retrieving private key from Parameter Store...');
    const ssmClient = new SSMClient();
    const getParameterCommand = new GetParameterCommand({
      Name: '/simbiosi.org/gitlab-webhook/rsa-private-key',
      WithDecryption: true
    });
    
    const response = await ssmClient.send(getParameterCommand);
    
    console.log('Private key retrieved successfully');
    const privateKeyPem = response.Parameter.Value;
    console.log(`Private key length: ${privateKeyPem.length} characters`);
    console.log(`Private key format check: ${privateKeyPem.includes('BEGIN') && privateKeyPem.includes('END') ? 'Valid PEM format' : 'Invalid PEM format'}`);
    
    // Base64 decode the encrypted email
    console.log('Decoding base64 encrypted email...');
    let encryptedData;
    try {
      encryptedData = Buffer.from(encryptedEmail, 'base64');
      console.log(`Decoded data length: ${encryptedData.length} bytes`);
    } catch (decodeError) {
      console.error(`Error decoding base64: ${decodeError.message}`);
      console.error(`Raw encrypted email value: ${encryptedEmail}`);
      throw decodeError;
    }
    
    // Decrypt the email using Node.js crypto module
    console.log('Attempting to decrypt the email with private key...');
    let decryptedData;
    try {
      decryptedData = crypto.privateDecrypt(
        {
          key: privateKeyPem,
          padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
          oaepHash: 'sha256'
        },
        encryptedData
      );
      console.log('Decryption operation completed successfully');
    } catch (decryptError) {
      console.error(`Decryption failed: ${decryptError.message}`);
      console.error(`Decryption error stack: ${decryptError.stack}`);
      
      // Try alternative padding as fallback
      console.log('Trying alternative padding (PKCS1) as fallback...');
      try {
        decryptedData = crypto.privateDecrypt(
          {
            key: privateKeyPem,
            padding: crypto.constants.RSA_PKCS1_PADDING
          },
          encryptedData
        );
        console.log('Fallback decryption succeeded with PKCS1 padding');
      } catch (fallbackError) {
        console.error(`Fallback decryption also failed: ${fallbackError.message}`);
        throw decryptError; // Throw the original error
      }
    }
    
    // Return the decrypted email address as a string
    const result = decryptedData.toString('utf8');
    console.log(`Successfully decrypted email: ${result.includes('@') ? result.substring(0, 3) + '...@' + result.split('@')[1] : 'Invalid email format'}`);
    return result;
  } catch (error) {
    console.error(`Error in decryptEmail function: ${error.message}`);
    console.error(`Error stack: ${error.stack}`);
    return null;
  }
}

/**
 * Send a notification email using Amazon SES
 * @param {string} email - Recipient email address
 * @param {string} name - Recipient name
 * @param {string} message - Original comment message
 * @returns {Promise<boolean>} - Success status
 */
async function sendNotificationEmail(email, name, message) {
  try {
    console.log(`Sending notification email to: ${email}`);
    const sesClient = new SESClient({ region: 'us-east-1' });
    
    // Customize your email content - in first person, signed by Antenore
    const subject = "Your comment has been approved and merged";
    const bodyText = `
    Hello ${name},
    
    I wanted to let you know that I've reviewed and approved your comment.
    It has been successfully merged into the main branch.
    
    Your original message: "${message}"
    
    Thank you for your contribution to https://antenore.simbiosi.org !
    
    Best regards,
    Antenore
    `;
    
    console.log('Preparing to send email via SES...');
    const sendEmailCommand = new SendEmailCommand({
      Source: SENDER_EMAIL,
      Destination: {
        ToAddresses: [email],
        BccAddresses: [ADMIN_EMAIL] // Add BCC to admin email
      },
      Message: {
        Subject: { Data: subject },
        Body: { Text: { Data: bodyText } }
      }
    });
    
    const response = await sesClient.send(sendEmailCommand);
    
    console.log(`Email sent! Message ID: ${response.MessageId}`);
    return true;
  } catch (error) {
    console.error(`Error sending email: ${error.message}`);
    console.error(`Error stack: ${error.stack}`);
    throw error;
  }
}

/**
 * Send an admin notification email about errors or important events
 * @param {string} subject - Email subject
 * @param {string} message - Email message body
 * @returns {Promise<boolean>} - Success status
 */
async function sendAdminNotification(subject, message) {
  try {
    console.log(`Sending admin notification: ${subject}`);
    const sesClient = new SESClient({ region: 'us-east-1' });
    
    const bodyText = `
    Admin Notification: ${subject}
    
    ${message}
    
    Time: ${new Date().toISOString()}
    
    This is an automated message from your GitLab webhook Lambda function.
    `;
    
    const sendEmailCommand = new SendEmailCommand({
      Source: SENDER_EMAIL,
      Destination: {
        ToAddresses: [ADMIN_EMAIL]
      },
      Message: {
        Subject: { Data: `[Blog Webhook] ${subject}` },
        Body: { Text: { Data: bodyText } }
      }
    });
    
    const response = await sesClient.send(sendEmailCommand);
    console.log(`Admin notification sent! Message ID: ${response.MessageId}`);
    return true;
  } catch (error) {
    console.error(`Error sending admin notification: ${error.message}`);
    console.error(`Error stack: ${error.stack}`);
    // Don't throw here to prevent cascading errors
    return false;
  }
}
