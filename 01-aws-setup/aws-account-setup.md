
# AWS Account Setup

This guide will walk you through the steps to create and set up an AWS account, including configuring billing settings.

## Step 1: Go to AWS Website
- Visit the [AWS Website](https://aws.amazon.com).
- Click on **"Create an AWS Account"** at the top-right corner of the page.

## Step 2: Enter Your Account Information
- **Email Address**: Use a valid email address that you want to associate with the AWS account.
- **Password**: Choose a secure password.
- **AWS Account Name**: Pick a name for your AWS account (e.g., "MyAWSProjects").

## Step 3: Set Up Payment Information
- Enter your credit card or payment details. AWS requires this information even for the free tier, but you will only be charged if you go beyond free tier limits.

## Step 4: Verify Your Identity
- AWS will send a verification code to your phone. Enter the code when prompted.

## Step 5: Choose Your Support Plan
- You can choose the **Free** plan initially. You can upgrade later if needed.

## Step 6: Access Your AWS Console
- After the account setup is complete, log in to the [AWS Management Console](https://aws.amazon.com/console/).
- You can now start exploring AWS services!

## Step 7: Enable MFA (Multi-Factor Authentication) for Security (Optional but Recommended)
1. Go to **IAM** (Identity and Access Management) in the AWS Console.
2. Under **Users**, select your username.
3. Click on **Security Credentials** > **Manage MFA**.
4. Follow the steps to set up MFA using an authenticator app (e.g., Google Authenticator).

## Step 8: Configure Billing Alerts (Highly Recommended)
1. In the AWS Console, search for and go to **Billing**.
2. Under **Billing Preferences**, enable the option to receive billing alerts.
3. Next, go to **Billing Dashboard** > **Budgets** > **Create a Budget**:
   - Choose **Cost Budget**.
   - Set your budget limit and notification preferences. For example, you can set alerts to notify you when you reach 80% of your budget.

## Step 9: Set Up Cost Explorer (Optional but Useful)
1. In the AWS Console, search for **Cost Explorer**.
2. Enable **Cost Explorer** to get a detailed view of your AWS usage and spending.
3. You can visualize costs and forecast future expenses based on current usage.

**Links**
---
[Create AWS Account and Set Zero Spend Budget](https://www.youtube.com/watch?v=y7lRgSS28VI)

[How to Setup AWS Multi-Factor Authentication (MFA)](https://www.youtube.com/watch?v=JNpitLLKmWU)

[How to set up an AWS billing and budget alert](https://www.youtube.com/watch?v=lbjjxJ_QTo0)


---
You’re now ready to start using AWS with billing configurations in place! Continue with the setup of the AWS CLI in the next guide.