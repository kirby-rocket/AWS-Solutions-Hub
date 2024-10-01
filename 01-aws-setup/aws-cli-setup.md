
# AWS CLI Setup

This guide will walk you through the steps to install and configure the AWS Command Line Interface (CLI), allowing you to manage your AWS services directly from the terminal.

## Step 1: Install AWS CLI

### Windows
1. Download the AWS CLI installer from the official AWS [CLI download page](https://aws.amazon.com/cli/).
2. Run the downloaded installer.
3. Verify the installation by opening Command Prompt and typing:
   ```bash
   aws --version
   ```

### macOS
1. Open the terminal and run the following command to install AWS CLI using `brew`:
   ```bash
   brew install awscli
   ```
2. Verify the installation:
   ```bash
   aws --version
   ```

### Linux
1. Open the terminal and run the following commands:
   ```bash
   curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
   unzip awscliv2.zip
   sudo ./aws/install
   ```
2. Verify the installation:
   ```bash
   aws --version
   ```

## Step 2: Configure AWS CLI

Once the AWS CLI is installed, you need to configure it with your AWS account credentials.

1. Open your terminal (or Command Prompt on Windows) and run the following command:
   ```bash
   aws configure
   ```

2. When prompted, enter the following details:
   - **AWS Access Key ID**: Your AWS Access Key ID.
   - **AWS Secret Access Key**: Your AWS Secret Access Key.
   - **Default region name**: Enter your preferred region (e.g., `us-east-1`).
   - **Default output format**: Choose a format for CLI outputs (e.g., `json`, `text`, or `table`).

You can get your **Access Key ID** and **Secret Access Key** from the [AWS IAM Console](https://console.aws.amazon.com/iam) by creating a new user or accessing an existing user's security credentials.

## Step 3: Verify Configuration

To ensure that AWS CLI is configured correctly, run a simple command to list your S3 buckets (if any):
```bash
aws s3 ls
```

If everything is set up correctly, you will see a list of your S3 buckets, or you’ll get a message if there are no buckets.

## Step 4: Get Identity Information Using AWS STS

To verify which AWS identity you are using with the AWS CLI, you can use the following command:

```
aws sts get-caller-identity
```

This command will return the following information:

- User ID: The unique identifier of the user.
- Account: The AWS account ID.
- ARN: The Amazon Resource Name associated with your credentials.



```
{
    "UserId": "AIDAEXAMPLEID",
    "Account": "123456789012",
    "Arn": "arn:aws:iam::123456789012:user/YourUsername"
}
```

This is useful to confirm that you're using the correct AWS identity for CLI operations.


## Step 5: Enable Command Autocompletion (Optional)

### macOS/Linux
Run the following commands to enable autocompletion for AWS CLI commands:
```bash
complete -C '/usr/local/bin/aws_completer' aws
```

Add this line to your `.bashrc` or `.zshrc` file to enable it permanently.

---

## Links

[AWS CLI (Command Line Interface)](https://www.youtube.com/watch?v=MU7TBOdmMW0)

[AWS Config, Credentials file and profiles](https://www.youtube.com/watch?v=ViFIojenFXs)

---

You have successfully installed and configured the AWS CLI. Now you can manage your AWS resources directly from the command line!

