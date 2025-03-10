# Antenore's Jekyll Blog

This repository contains a Jekyll-based blog with a custom theme, GitLab integration, and a No-Comment commenting system with email encryption.

## Setup Instructions

### Prerequisites

- Ruby (recommended version: 2.7.x or newer)
- Bundler
- Git
- Node.js and npm (for No-Comment deployment)

### Local Development

1. Clone the repository:
   ```bash
   git clone https://gitlab.com/YOUR_USERNAME/antenore.simbiosi.org.git
   cd antenore.simbiosi.org
   ```

2. Install dependencies:
   ```bash
   bundle install
   ```

3. Start the local server:
   ```bash
   bundle exec jekyll serve --livereload
   ```

4. Visit `http://localhost:4000` in your browser

## No-Comment Setup

This blog uses a modified version of [No-Comment](https://github.com/antenore/no-comment), based on [Geoff Williams' fork](https://github.com/GeoffWilliams/no-comment) that supports GitLab instead of GitHub (Gitlab implementation has been merged into the original repository). No-Comment is a Cloudflare Worker-based commenting system that creates merge requests with comment data files.

### GitLab Setup

1. **Create a Personal Access Token**
   - Go to GitLab → Settings → Access Tokens
   - Create a token with the following scopes:
     - `api` (for API access)
     - `read_repository` and `write_repository` (for repository operations)
   - Save the token securely as it will only be displayed once

### Deploy Cloudflare Worker

1. Fork the No-Comment repository (with GitLab support)
2. Clone to your workstation
3. Edit `wrangler.toml`, set variables:
   ```toml
   GITLAB_PROJECT_ID = "your-project-id" # Either numeric ID or URL-encoded path
   GIT_AUTHOR = "Your Name"
   GIT_EMAIL = "your.email@example.com"
   GIT_BRANCH_TO_MERGE_INTO = "main" # or your default branch
   COMMENT_DIR = "_data/comments"
   ```

4. Install dependencies and deploy:
   ```bash
   npm install
   npx wrangler login
   npm run deploy
   ```
   Note the deployment URL from this command, you'll need it for Jekyll configuration.

5. Add your GitLab token as a secret:
   ```bash
   npx wrangler secret put GITLAB_TOKEN
   ```
   When prompted, enter the GitLab token created earlier.

6. Monitor your worker (optional):
   ```bash
   npx wrangler tail no-comment
   ```

### Jekyll Configuration

1. Add the following to your `_config.yml`:
   ```yaml
   no_comment_url: "https://your-worker.your-subdomain.workers.dev"
   no_comment_redirect: "https://your-blog-url.com/thank-you"
   ```

2. The comment form is already set up in `_layouts/post.html` with the following features:
   - Anti-spam protection (honeypot, math challenge, timing check)
   - Email encryption using RSA
   - Markdown support for comments

## Email Encryption Setup

The blog includes client-side email encryption for the No-Comment system:

1. **Generate RSA Key Pair** (if not already done):
   ```bash
   # Generate private key
   openssl genrsa -out private.pem 4096
   
   # Extract public key
   openssl rsa -in private.pem -pubout -out public.pem
   ```

2. The public key is already embedded in the comment form JavaScript in `_layouts/post.html`.

3. For decryption (optional), you can store the private key in AWS Parameter Store:
   ```bash
   aws ssm put-parameter --name "/blog/comment-email-key" --type "SecureString" --value "$(cat private.pem)" --overwrite
   ```

## AWS Integration (Optional)

For email notifications or additional functionality:

1. **API Gateway**:
   - Create a REST API in AWS API Gateway
   - Set up a resource with POST method
   - Integrate with Lambda function
   - Deploy to a stage (e.g., `prod`)

2. **Lambda Function**:
   - Create a function to process notifications
   - Add permissions for SES and Parameter Store
   - Configure environment variables for your blog settings

3. **SES (Simple Email Service)**:
   - Verify your domain or email address
   - Configure appropriate sending limits
   - Set up proper SPF and DKIM records

## GitLab CI/CD

The blog uses GitLab CI/CD for automated building and deployment. The configuration is in `.gitlab-ci.yml`.

## Customization

- **Theme**: Modify files in `_sass/` directory
- **Layouts**: Edit templates in `_layouts/`
- **Includes**: Common components are in `_includes/`

## License

This project is licensed under the terms specified in the LICENSE file.