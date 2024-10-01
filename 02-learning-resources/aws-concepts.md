# AWS Concepts and Services

This guide provides an overview of key AWS concepts, services, and links to resources for further learning. Whether you're just starting with AWS or looking to enhance your skills, this document will guide you through the foundational aspects of AWS.

---

## Part 1: Understanding AWS Core Concepts

### 1. **Regions and Availability Zones (AZs)**
   - **Regions**: Geographic areas where AWS has data centers. Each region is independent of the others, allowing for geographical fault tolerance.
   - **Availability Zones (AZs)**: Data centers within a region that are isolated from each other to protect against outages.

### 2. **Virtual Private Cloud (VPC)**
   - A logically isolated network within AWS that allows you to control your own IP addresses, subnets, and routing rules.

### 3. **Elastic Compute Cloud (EC2)**
   - Virtual machines running in the cloud that can be easily scaled up or down depending on your needs. EC2 instances are the backbone of many cloud applications.

### 4. **Amazon S3 (Simple Storage Service)**
   - Object storage service designed for scalability, availability, and durability. You can store large amounts of unstructured data such as images, videos, and backups.

### 5. **Identity and Access Management (IAM)**
   - Securely control access to AWS services and resources. It provides fine-grained control over who can access what in your AWS environment.

## Links 

[AWS IAM User](https://www.youtube.com/watch?v=bO25vbkoJlA&list=PL7iMyoQPMtAN4xl6oWzafqJebfay7K8KP)

[AWS Assume Role](https://www.youtube.com/watch?v=MkiWa31iV6U&list=PL7iMyoQPMtAN4xl6oWzafqJebfay7K8KP&index=3)

[Setup VPC, Public, Private Subnet, NAT, Internet Gateway, Route Table](https://www.youtube.com/watch?v=43tIX7901Gs&list=PL7iMyoQPMtAN4xl6oWzafqJebfay7K8KP&index=5)

[AWS Networking Basics](https://www.youtube.com/watch?v=2doSoMN2xvI)

---

## Part 2: Learning Resources for AWS Concepts & Services

Here are some recommended courses and materials to help you learn AWS:

### 1. **AWS Free Tier Account**
   - [AWS Free Tier](https://aws.amazon.com/free/) lets you explore AWS services for free within a set usage limit for 12 months.

### 2. **Courses**
   - **AWS Training and Certification** (Official AWS Learning Resources):
     - [AWS Learning Library](https://aws.amazon.com/training/)
   - **Coursera**: [AWS Fundamentals: Going Cloud-Native](https://www.coursera.org/learn/aws-fundamentals-going-cloud-native)
   - **Udemy**: [AWS Certified Solutions Architect - Associate](https://www.udemy.com/course/aws-certified-solutions-architect-associate/)

### 3. **Books**
   - **"AWS Certified Solutions Architect Official Study Guide"** by Ben Piper and David Clinton.
   - **"Learning AWS: Design, Build, and Deploy Cloud Solutions"** by Aurobindo Sarkar and Amit Shah.

### 4. **Documentation**
   - **AWS Documentation**: [AWS Official Docs](https://docs.aws.amazon.com/)
   - **Terraform Basics with AWS**: [Terraform AWS Provider](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)

---

## Part 3: Basic AWS Projects

Once you have a solid understanding of AWS concepts, you can start working on basic projects to strengthen your skills.

### Project Structure:
#### 1. **EC2 Web Server Setup**
   - **Subdirectory**: `/basic-projects/ec2-web-server/`
   - **Objective**: Launch a web server on an EC2 instance.
   - **Skills Covered**: EC2 setup, security groups, SSH access, web server installation (Apache/NGINX).

#### 2. **S3 Static Website Hosting**
   - **Subdirectory**: `/basic-projects/s3-static-website/`
   - **Objective**: Host a static website using Amazon S3.
   - **Skills Covered**: S3 bucket creation, bucket policies, website configuration.

#### 3. **VPC and Networking Setup**
   - **Subdirectory**: `/basic-projects/vpc-setup/`
   - **Objective**: Create a custom VPC with public and private subnets.
   - **Skills Covered**: VPC, subnets, internet gateway, route tables, NAT gateway.

---

## Part 4: Terraform Basics

Terraform is widely used for Infrastructure as Code (IAC) and integrates well with AWS. Here are a few introductory concepts and commands:

### 1. **Installing Terraform**
   - [Download Terraform](https://www.terraform.io/downloads.html) and install it on your machine.

### 2. **Terraform Commands**
   - **`terraform init`**: Initializes the working directory.
   - **`terraform plan`**: Creates an execution plan.
   - **`terraform apply`**: Builds or changes infrastructure.

## Links 

[Terraform Zero to Hero](https://www.youtube.com/watch?v=fgp-t5SqQmM&list=PLdpzxOOAlwvI0O4PeKVV1-yJoX2AqIWuf)

[Terraform Course - FreeCodeCamp](https://www.youtube.com/watch?v=SLB_c_ayRMo&t=1251s)

---

### Conclusion
This document offers a starting point for learning AWS and organizing your projects. The more hands-on practice you get with AWS services and tools like Terraform, the more confident you'll become in cloud infrastructure management.