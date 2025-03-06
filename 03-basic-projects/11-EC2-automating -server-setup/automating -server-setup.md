# How to Launch an EC2 Instance and Install Apache Web Server Using User Data

# Description
This step-by-step guide walks you through launching an EC2 instance and automating Apache installation using User Data. Follow along and get your web server up and running effortlessly!

## Project: Launching a Web Server on Amazon EC2 Using User Data
This project demonstrates how to set up and launch a web server on Amazon EC2 using User Data as a bootstrap script. We will cover this by using the AWS Management Console (GUI) method to provision an EC2 instance, configure security groups, and automate the installation of a web server through User Data. By the end of this project, you will have a fully functional web server running on EC2 with minimal manual configuration.

***

## Prerequisites
Before starting this project, ensure you have the following:
1.	**AWS Account** – A registered AWS account with the necessary permissions to create and manage EC2 instances. Preferably IAM User with Sufficient Permissions – An IAM user with EC2-related permissions (AmazonEC2FullAccess or custom policies allowing EC2 instance creation, security group management, and key pair access).
2.	Using AWS Management Console (GUI)

## Step 1: Log in to AWS Management Console

1. Open your browser and navigate to the (AWS Management Console).
2. Sign in with your AWS credentials.
3. In the search bar, type **EC2** and select the first result.

![EC2](https://github.com/user-attachments/assets/8755e969-2b8a-479a-b927-7c9931f4a8d1)

## Step 2: Launch a New EC2 Instance
1. On the EC2 Dashboard, click **Launch an instance**.

![Launch Instance](https://github.com/user-attachments/assets/e6e9b118-62ed-4c7a-9570-86a15fd20d74)
2. Provide a name for your instance, e.g., My First Instance.

![Naming The Instance](https://github.com/user-attachments/assets/b0f27c90-29e4-4630-bd16-de01b728ba05)
Give your instance a name e.g. My First Instance

## Step 3: Choose an Amazon Machine Image (AMI)
1. Select the base operating system for the instance.
2. Choose **Amazon Linux 2023 AMI (Free Tier Eligible)**.
3. Select your base image- the OS that instance will be running

![Choose an Amazon Machine Image (AMI)](https://github.com/user-attachments/assets/62612009-ca97-41f0-ad23-38a59ba5d53d)


## Step 4: Select an Instance Type
1.	Choose the instance type based on your needs.
2.	Select **t3.micro**, which is Free Tier Eligible and includes 1 vCPU and 1 GiB RAM.

![Select an Instance Type](https://github.com/user-attachments/assets/014429ec-7818-4721-8fd2-93d887f99323)

## Step 5: Configure Key Pair
1.	Click Create new key pair.
2.	Enter a key pair name.

![Configure Key Pair](https://github.com/user-attachments/assets/3663b92b-99f0-47cf-b39e-0e82a184f126)

3.	Click **Create key pair** and download the private key file **(.pem file)**.
![Create key pair](https://github.com/user-attachments/assets/d0bc7c6e-327b-4fb7-ad10-2057a17889f7)

4.	Select the created key pair from the dropdown list.

![Select the created key pair](https://github.com/user-attachments/assets/18c980e0-04a3-4466-955d-97c82e01f467)

## Step 6: Configure Security Group
1.	Ensure Allow HTTP traffic from the internet is selected.
2.	Leave other settings as default.

![Configure Security Group](https://github.com/user-attachments/assets/2d16cc8b-4330-437b-9815-c41cabaf07c9)

## Step 7: Configure Storage
1.	Use the default settings (8 GiB SSD recommended).

![Configure Storage](https://github.com/user-attachments/assets/01245bbe-1087-4bf4-8dfa-5f723ab85aa4)

## Step 8: Add User Data for Apache Installation
1.	Expand Advanced details.

![Advanced details](https://github.com/user-attachments/assets/ffdcd915-2064-451a-a208-10dffe9d7f1f)
2.	Scroll down to the User Data section

![User Data](https://github.com/user-attachments/assets/201d86ab-2b07-43fb-8933-7ce363255aea)
3.	Enter the following script to install Apache and create a test webpage:
````
#!/bin/bash
yum update -y
yum install -y httpd
systemctl start httpd
systemctl enable httpd
echo "<h1>Welcome to My Web Server</h1>" > /var/www/html/index.html

````
4.	This script will install Apache, start the service, enable it to run on boot, and create a simple HTML page.

![install Apache](https://github.com/user-attachments/assets/f55949a6-b1fa-4dde-8685-fcb8117af9f7)

## Step 9: Launch the Instance
1.	Click Launch Instance.
2.	Navigate to the Instances section to view your newly created instance.

![Launch Instance2](https://github.com/user-attachments/assets/ad75c714-47e9-4110-a95b-6302f43e3501)

## Step 10: View Instance Details

- **Instance ID**: Unique identifier for the instance.
- **Public IPv4 Address**: Used for accessing the instance over the internet.
- **Private IPv4 Address**: Used for internal communication within the VPC.

![View Instance Details](https://github.com/user-attachments/assets/b75ce3d4-a52e-4d2a-9aa8-9062255fd586)

## Step 11: Verify Apache Installation
1.	Copy the Public IPv4 Address.

![Public IPv4 Address](https://github.com/user-attachments/assets/91005447-9fc7-4dff-a5d0-7709e0feb12c)
2.	Open a new browser tab and paste the address.
3.	If the Apache web server is running successfully, you should see the message:
*Hello World From Server IP*

![Hello World From Server IP](https://github.com/user-attachments/assets/31db4c53-27ff-47b6-942a-7cb0b71fece4)


## Additional Resources
- [AWS EC2 Documentation](https://docs.aws.amazon.com/ec2/)
- [AWS EC2 WhitePapers](https://docs.aws.amazon.com/whitepapers/latest/ec2-networking-for-telecom/amazon-ec2.html)
