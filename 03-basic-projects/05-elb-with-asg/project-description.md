# Create an Elastic Load Balancer with Auto Scaling Group

## Description
This project demonstrates how to set up an Elastic Load Balancer (ELB) with an Auto Scaling Group (ASG) using Amazon EC2 instances. We will cover the AWS Management Console (GUI), AWS CLI, and Terraform methods to create a scalable and highly available web application infrastructure.

## Architecture Diagram

![ELB with ASG Architecture](1666880779368.png)

## Prerequisites

- AWS account with appropriate permissions
- Basic understanding of EC2, VPC, ELB, and ASG concepts
- For CLI method: AWS CLI installed and configured
  - [Installing the AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html)
  - [Configuring the AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html)
- For Terraform method: Terraform installed
  - [Installing Terraform](https://learn.hashicorp.com/tutorials/terraform/install-cli)

## Method 1: Using AWS Management Console (GUI)

### Step 1: Create a Launch Template

1. Navigate to EC2 in the AWS Management Console
2. In the left sidebar, under "Instances," click on "Launch Templates"
3. Click "Create launch template"
4. Provide a name and description for your template
5. For "Application and OS Images," select your desired Amazon Machine Image (AMI)
6. Choose an instance type (e.g., t2.micro for free tier)
7. Select or create a key pair for SSH access
8. Under "Network settings," select a VPC and subnet
9. In "Firewall (security groups)," create or select a security group that allows HTTP traffic (port 80)
10. Expand "Advanced details" and in the "User data" field, add a script to install and start a web server:

   ```bash
   #!/bin/bash
   yum update -y
   yum install -y httpd
   systemctl start httpd
   systemctl enable httpd
   echo "<h1>Hello from $(hostname -f)</h1>" > /var/www/html/index.html
   ```

11. Click "Create launch template"

### Step 2: Create an Auto Scaling Group

1. In the EC2 dashboard, under "Auto Scaling," click on "Auto Scaling Groups"
2. Click "Create Auto Scaling group"
3. Provide a name for your Auto Scaling group
4. Select the launch template you created in Step 1, then click "Next"
5. Choose the VPC and subnets where you want to launch instances
6. On the "Configure advanced options" page:
   - Select "Attach to a new load balancer"
   - Choose "Application Load Balancer"
   - Select "Create a new load balancer" and provide a name
   - Under "Load balancer scheme," choose "Internet-facing"
   - For "Listeners and routing," keep the default HTTP on port 80
   - Create a new target group and provide a name
7. On the "Configure group size and scaling policies" page:
   - Set Desired capacity: 2, Minimum capacity: 1, Maximum capacity: 4
   - Select "Target tracking scaling policy" and keep the default settings
8. Review and create the Auto Scaling group

### Step 3: Verify and Test

1. In the EC2 dashboard, under "Load Balancing," click on "Load Balancers"
2. Select your newly created load balancer
3. Copy the DNS name from the "Description" tab
4. Open a new browser tab and paste the DNS name
5. You should see the "Hello from" message with an instance hostname
6. Refresh the page multiple times to see responses from different instances

![Load Balancer Test](archalbasg.png)

## Method 2: Using AWS CLI

### Step 1: Create a Launch Template

1. Create a file named `user-data.sh` with the following content:

   ```bash
   #!/bin/bash
   yum update -y
   yum install -y httpd
   systemctl start httpd
   systemctl enable httpd
   echo "<h1>Hello from $(hostname -f)</h1>" > /var/www/html/index.html
   ```

2. Create the launch template:

   ```bash
   aws ec2 create-launch-template \
     --launch-template-name my-template \
     --version-description v1 \
     --launch-template-data '{
       "ImageId": "ami-0aa7d40eeae50c9a9",
       "InstanceType": "t2.micro",
       "KeyName": "your-key-pair",
       "UserData": "'"$(base64 < user-data.sh)"'",
       "NetworkInterfaces": [{
         "DeviceIndex": 0,
         "AssociatePublicIpAddress": true,
         "Groups": ["sg-0123456789abcdef0"]
       }]
     }'
   ```

   Replace `ami-0aa7d40eeae50c9a9` with the appropriate AMI ID for your region, `your-key-pair` with your EC2 key pair name, and `sg-0123456789abcdef0` with your security group ID.

### Step 2: Create a Target Group

```bash
aws elbv2 create-target-group \
  --name my-targets \
  --protocol HTTP \
  --port 80 \
  --vpc-id vpc-0123456789abcdef0 \
  --health-check-path / \
  --health-check-interval-seconds 30
```

Replace `vpc-0123456789abcdef0` with your VPC ID.

### Step 3: Create an Application Load Balancer

```bash
aws elbv2 create-load-balancer \
  --name my-load-balancer \
  --subnets subnet-0123456789abcdef0 subnet-0123456789abcdef1 \
  --security-groups sg-0123456789abcdef0
```

Replace the subnet and security group IDs with your own.

### Step 4: Create a Listener

```bash
aws elbv2 create-listener \
  --load-balancer-arn <load-balancer-arn> \
  --protocol HTTP \
  --port 80 \
  --default-actions Type=forward,TargetGroupArn=<target-group-arn>
```

Replace `<load-balancer-arn>` and `<target-group-arn>` with the ARNs from the previous steps.

### Step 5: Create an Auto Scaling Group

```bash
aws autoscaling create-auto-scaling-group \
  --auto-scaling-group-name my-asg \
  --launch-template LaunchTemplateName=my-template,Version='$Latest' \
  --target-group-arns <target-group-arn> \
  --health-check-type ELB \
  --health-check-grace-period 300 \
  --min-size 1 \
  --max-size 4 \
  --desired-capacity 2 \
  --vpc-zone-identifier "subnet-0123456789abcdef0,subnet-0123456789abcdef1"
```

Replace `<target-group-arn>` with the ARN from Step 2 and the subnet IDs with your own.

### Step 6: Create a Scaling Policy

```bash
aws autoscaling put-scaling-policy \
  --auto-scaling-group-name my-asg \
  --policy-name my-scaling-policy \
  --policy-type TargetTrackingScaling \
  --target-tracking-configuration file://scaling-config.json
```

Create a file named `scaling-config.json` with the following content:

```json
{
  "TargetValue": 50.0,
  "PredefinedMetricSpecification": {
    "PredefinedMetricType": "ASGAverageCPUUtilization"
  }
}
```
## Testing Your Setup

1. Obtain the DNS name of your load balancer:
   - For Console and CLI methods: Find it in the EC2 Dashboard under Load Balancers
   - For Terraform method: It will be output after applying the configuration

2. Open a web browser and navigate to the load balancer's DNS name

3. You should see a "Hello from" message with an instance hostname

4. Refresh the page multiple times to see responses from different instances

## Cleanup

### For Console method:
1. Delete the Auto Scaling group
2. Delete the Application Load Balancer
3. Delete the Launch Template

### For CLI method:
```bash
aws autoscaling delete-auto-scaling-group --auto-scaling-group-name my-asg --force-delete
aws elbv2 delete-load-balancer --load-balancer-arn <load-balancer-arn>
aws elbv2 delete-target-group --target-group-arn <target-group-arn>
aws ec2 delete-launch-template --launch-template-name my-template
```

## Additional Resources

- [Elastic Load Balancing Documentation](https://docs.aws.amazon.com/elasticloadbalancing/)
- [Auto Scaling Groups Documentation](https://docs.aws.amazon.com/autoscaling/ec2/userguide/AutoScalingGroup.html)
- [Terraform AWS Provider Documentation](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
- [AWS CLI Command Reference](https://docs.aws.amazon.com/cli/latest/reference/)