# Generate IAM Credentials Reports

## Objective

Learn how to generate an IAM Credentials Report, a built-in AWS tool that provides information about users and user authentication in an AWS account. The report lists all users, their creation dates, and details about their authentication methods, including passwords, access keys, and MFA devices, along with timestamps of when these credentials were last used.

While reviewing the report, consider what specific security recommendations you would make based on your findings. This lab environment provides AWS Console, CLI, and CloudShell access.

### For Free Hands on Labs 

https://cybr.com/hands-on-labs/lab/generate-iam-credentials-reports/

## Scenario

Your manager requests a report that includes:
- All users in an AWS account
- When those users were created
- Whether they have credentials like passwords, access keys, or MFA devices
- When passwords and access keys were last used

Without using third-party tools, you can achieve this using IAM's Credentials Report.

## Accessing IAM Credentials Reports from the AWS Console

1. Log in to the AWS Console with permissions to `iam:GenerateCredentialReport`.
2. Navigate to **IAM** and look for **Credential report** in the menu.
3. Click **Download credentials report**.
4. The report will be downloaded as a `.CSV` file.

![alt text](IAM_Report.png)

The report includes information on all users, including whether they have passwords, access keys, or MFA devices, along with their last usage details.

## Accessing IAM Credentials Reports from the AWS CLI

Alternatively, you can generate the report via the AWS CLI or CloudShell.

1. Ensure you have authenticated into an AWS account.
2. Run the command:
   ```sh
   aws iam generate-credential-report
   ```
   Output:
   ```json
   {
       "State": "STARTED",
       "Description": "No report exists. Starting a new report generation task"
   }
   ```
   If the report was recently generated (within the last 4 hours), AWS will retrieve the existing report instead of creating a new one.

3. Once generated, retrieve the report with:
   ```sh
   aws iam get-credential-report
   ```
   This returns a Base64-encoded CSV file.

4. Decode and format the output for readability:
   ```sh
   aws iam get-credential-report --output text --query Content | base64 -d
   ```
   
   Alternatively, for improved readability:
   ```sh
   aws iam get-credential-report --output text --query Content | base64 -d | awk -F, '
   NR==1 {next}
   {
       print "User:", $1;
       print "ARN:", $2;
       print "Creation Time:", $3;
       print "Password Enabled:", $4;
       print "Password Last Used:", $5;
       print "Password Last Changed:", $6;
       print "Password Next Rotation:", $7;
       print "MFA Active:", $8;
       print "Access Key 1 Active:", $9;
       print "Access Key 1 Last Rotated:", $10;
       print "Access Key 1 Last Used Date:", $11;
       print "Access Key 1 Last Used Region:", $12;
       print "Access Key 1 Last Used Service:", $13;
       print "Access Key 2 Active:", $14;
       print "Access Key 2 Last Rotated:", $15;
       print "Access Key 2 Last Used Date:", $16;
       print "Access Key 2 Last Used Region:", $17;
       print "Access Key 2 Last Used Service:", $18;
       print "Cert 1 Active:", $19;
       print "Cert 1 Last Rotated:", $20;
       print "Cert 2 Active:", $21;
       print "Cert 2 Last Rotated:", $22;
       print "-------------------"
   }'
   ```
   
## Conclusion

The IAM Credentials Report is a powerful tool for auditing AWS account security. Use it to:
- Monitor IAM users and their credentials
- Identify inactive credentials
- Recommend security improvements, such as enabling MFA and rotating access keys

Additionally, consider transitioning from IAM users and long-term access keys to AWS **Identity Center** for improved security and centralized identity management.

