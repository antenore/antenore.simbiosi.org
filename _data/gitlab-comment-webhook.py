import json
import boto3
import base64
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.asymmetric import padding
from cryptography.hazmat.primitives.serialization import load_pem_private_key
import os

# Configuration constants
AWS_ACCOUNT_ID = '837806152926'
SENDER_EMAIL = "antenore@simbiosi.org"  # Corrected the typo in your email

def lambda_handler(event, context):
    try:
        # Parse the incoming webhook payload
        body = json.loads(event['body']) if isinstance(event.get('body'), str) else event.get('body', {})
        
        # Extract the information from the payload
        comment_id = body.get('_id')
        name = body.get('name')
        encrypted_email = body.get('email')
        message = body.get('message')
        date = body.get('date')
        
        # Log the received data (for debugging)
        print(f"Received comment from {name} with ID {comment_id}")
        
        # Decrypt the email using RSA private key
        decrypted_email = decrypt_email(encrypted_email)
        
        if not decrypted_email:
            raise Exception("Failed to decrypt email address")
        
        # Send notification email
        send_notification_email(decrypted_email, name, message)
        
        return {
            'statusCode': 200,
            'body': json.dumps({
                'message': 'Notification sent successfully',
                'commentId': comment_id
            })
        }
    except Exception as e:
        print(f"Error processing webhook: {str(e)}")
        return {
            'statusCode': 500,
            'body': json.dumps({
                'message': f'Error processing webhook: {str(e)}'
            })
        }

def decrypt_email(encrypted_email):
    """Decrypt the email using RSA private key"""
    try:
        # Get the RSA private key from AWS Secrets Manager or Parameter Store
        ssm = boto3.client('ssm')
        response = ssm.get_parameter(
            Name='/simbiosi.org/gitlab-webhook/rsa-private-key',
            WithDecryption=True
        )
        private_key_pem = response['Parameter']['Value']
        
        # Load the private key
        private_key = load_pem_private_key(
            private_key_pem.encode('utf-8'),
            password=None,
            backend=default_backend()
        )
        
        # Base64 decode the encrypted email
        encrypted_data = base64.b64decode(encrypted_email)
        
        # Decrypt the email
        decrypted_data = private_key.decrypt(
            encrypted_data,
            padding.OAEP(
                mgf=padding.MGF1(algorithm=hashes.SHA256()),
                algorithm=hashes.SHA256(),
                label=None
            )
        )
        
        # Return the decrypted email address as a string
        return decrypted_data.decode('utf-8')
    except Exception as e:
        print(f"Error decrypting email: {str(e)}")
        return None

def send_notification_email(email, name, message):
    """Send a notification email using Amazon SES"""
    try:
        ses = boto3.client('ses', region_name='us-east-1')
        
        # Customize your email content - in first person, signed by Antenore
        subject = "Your comment has been approved and merged"
        body_text = f"""
        Hello {name},
        
        I wanted to let you know that I've reviewed and approved your comment.
        It has been successfully merged into the main branch.
        
        Your original message: "{message}"
        
        Thank you for your contribution to this project!
        
        Best regards,
        Antenore
        """
        
        response = ses.send_email(
            Source=SENDER_EMAIL,
            Destination={
                'ToAddresses': [email]
            },
            Message={
                'Subject': {'Data': subject},
                'Body': {'Text': {'Data': body_text}}
            }
        )
        
        print(f"Email sent! Message ID: {response['MessageId']}")
        return True
    except Exception as e:
        print(f"Error sending email: {str(e)}")
        raise e