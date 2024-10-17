#### TERRAFORM CONFIGURATION ####

terraform {
  required_providers {
    aws = {
      source = "hashicorp/aws"
      version = "5.70.0"
    }
  }
}


##### NOT TO BE USED IN PRODUCTION CODE (ACCESS KEY,SECRET KEY) ######
##### MAKE USE OF REMOTE STATE BACKEND #######

#### PROVIDER CONFIGURATION ######
provider "aws" {
  region = "us-east-1"
  access_key = ""
  secret_key = ""
}


#### AWS VPC ####
resource "aws_vpc" "main" {
  cidr_block = "10.0.0.0/16"
  tags = { Name = "main-vpc" }
}

#### AWS SUBNETS ####

#### AWS WEB PUBLIC SUBNETS ####
resource "aws_subnet" "public_web_subnet" {
  count = 2
  vpc_id = aws_vpc.main.id
  cidr_block = cidrsubnet(aws_vpc.main.cidr_block, 8, count.index)
  availability_zone = ["us-east-1a", "us-east-1b"][count.index]
  map_public_ip_on_launch = true
  tags = { Name = "public-web-subnet-${count.index + 1}" }
}

#### AWS APP PRIVATE SUBNETS ####
resource "aws_subnet" "private_app_subnet" {
  count = 2
  vpc_id = aws_vpc.main.id
  cidr_block = cidrsubnet(aws_vpc.main.cidr_block, 8, count.index + 2)
  availability_zone = ["us-east-1a", "us-east-1b"][count.index]
  tags = { Name = "private-app-subnet-${count.index + 1}" }
}

#### AWS DB PRIVATE SUBNETS ####
resource "aws_subnet" "private_db_subnet" {
  count = 2
  vpc_id = aws_vpc.main.id
  cidr_block = cidrsubnet(aws_vpc.main.cidr_block, 8, count.index + 4)
  availability_zone = ["us-east-1a", "us-east-1b"][count.index]
  tags = { Name = "private-db-subnet-${count.index + 1}" }
}

#### AWS INTERNET GATEWAY ####
resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.main.id
  tags = { Name = "igw" }
}

#### AWS ELASTIC IP #####
resource "aws_eip" "nat_eip" {
    domain = "vpc" 
    tags = { Name = "nat-eip" }
}

#### AWS NAT GATEWAY ####
resource "aws_nat_gateway" "nat" {
  allocation_id = aws_eip.nat_eip.id
  subnet_id = aws_subnet.public_web_subnet[0].id
  tags = { Name = "main-nat-gateway" }
}

#### AWS ROUTE TABLES ####

#### AWS PUBLIC WEB ROUTE TABLE ####
resource "aws_route_table" "public_web_rt" {
  vpc_id = aws_vpc.main.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
    # nat_gateway_id = aws_nat_gateway.nat.id
  }
  tags = { Name = "public-web-rt" }
}

#### AWS PRIVATE ROUTE TABLES ####
resource "aws_route_table" "private_app_rt" {
  vpc_id = aws_vpc.main.id
  route {
    cidr_block = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.nat.id
  }
  tags = { Name = "private-app-rt" }
}

#### AWS PRIVATE DB ROUTE TABLES ####
resource "aws_route_table" "private_db_rt" {
  vpc_id = aws_vpc.main.id
   # Internal route to allow traffic within the VPC
  route {
    cidr_block = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.nat.id
  }
  tags = { Name = "private-db-rt" }
}

################## AWS ROUTE TABLE ASSOCIATIONS ################

#### AWS PUBLIC WEB ROUTE TABLE ASSOCIATIONS ####
resource "aws_route_table_association" "public_web_rt_associations" {
  count = 2
  subnet_id = aws_subnet.public_web_subnet[count.index].id
  route_table_id = aws_route_table.public_web_rt.id
  depends_on = [aws_internet_gateway.igw]

}

#### AWS PRIVATE APP ROUTE TABLE ASSOCIATIONS ####
resource "aws_route_table_association" "private_app_rt_associations" {
  count = 2
  subnet_id = aws_subnet.private_app_subnet[count.index].id
  route_table_id = aws_route_table.private_app_rt.id
  depends_on = [ aws_internet_gateway.igw ]
}

#### AWS PRIVATE DB ROUTE TABLE ASSOCIATIONS ####
resource "aws_route_table_association" "private_db_rt_associations" {
  count = 2
  subnet_id = aws_subnet.private_db_subnet[count.index].id
  route_table_id = aws_route_table.private_db_rt.id
}

################ AWS SECURITY GROUPS ######################

#### AWS WEB SECURITY GROUPS ####
resource "aws_security_group" "web_sg" {
  name = "web-sg"
  vpc_id = aws_vpc.main.id
  ingress {
    from_port = 80
    to_port = 80
    protocol = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  egress {
    from_port = 0
    to_port = 0
    protocol = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
  tags = { Name = "web-sg" }
}


#### AWS APP SECURITY GROUPS ####
resource "aws_security_group" "app_sg" {
  name = "app-sg"
  vpc_id = aws_vpc.main.id
  ingress {
    from_port = 22
    to_port = 22
    protocol = "tcp"
    security_groups = [aws_security_group.web_sg.id]
  }
  ingress {
    from_port = 80
    to_port = 80
    protocol = "tcp"
    security_groups = [ aws_security_group.lb_sg.id ]
  }
  egress {
    from_port = 0
    to_port = 0
    protocol = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
  tags = { Name = "app-sg" }
}

#### AWS DB SECURITY GROUPS ####
resource "aws_security_group" "db_sg" {
  name = "db-sg"
  vpc_id = aws_vpc.main.id
  ingress {
    from_port = 3306
    to_port = 3306
    protocol = "tcp"
    security_groups = [aws_security_group.app_sg.id]
  }
  egress {
    from_port = 0
    to_port = 0
    protocol = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
  tags = { Name = "db-sg" }
}

#### AWS LOAD BALANCER SECURITY GROUP ####
resource "aws_security_group" "lb_sg" {
  name = "lb-sg"
  vpc_id = aws_vpc.main.id
  ingress {
    from_port = 80
    to_port = 80
    protocol = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  egress {
    from_port = 0
    to_port = 0
    protocol = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
  tags = { Name = "lb-sg" }
}

#### AWS JUMP SERVER SECURITY GROUP ####
resource "aws_security_group" "jump_server_sg" {
  name = "jump-server-sg"
  vpc_id = aws_vpc.main.id
  ingress {
    from_port = 22
    to_port = 22
    protocol = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  egress {
    from_port = 0
    to_port = 0
    protocol = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
  tags = { Name = "jump-server-sg" }
}

#### AWS WEB SERVER SECURITY GROUP ####
resource "aws_security_group" "web_server_sg" {
  name = "web-server-sg"
  vpc_id = aws_vpc.main.id
  ingress {
    from_port = 80
    to_port = 80
    protocol = "tcp"
    security_groups = [aws_security_group.lb_sg.id]
  }
  ingress {
    from_port = 22
    to_port = 22
    protocol = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  egress {
    from_port = 0
    to_port = 0
    protocol = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
  tags = { Name = "web-server-sg" }
}

#### AWS KEY PAIR ####
resource "aws_key_pair" "deployer" {
  key_name   = "aws-key-demo-1"
  public_key = "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQC+bprvm16cRzGg4pbYgFVMjMyNbolYHN8WCkGe/4rtkL7NHgLaLFJiZJTZu7XDqAWMHXEW0qC3Ya1DYvNnSemlOe8PFcYgdYHmjRm9ipW/SpZCoNAmieFVuT9hRl5zC2IHHBUo0g3Stukot0PFA0TERjuxeP7BS0B7dq/5hwkfwAHqHcE0KLKCfndMuvmSu9yZANoqAztAhUyaehzGCqNEiJkK4jt0PS/BWfd+HLLOCtxn6h26Rzvdnze2YEdDoCTlSchyQ1oN02aDh20591fV1HL2ZS7MMd3y6K5ruvT80a1c1e/yQiTl1RGjTwvW9cq5x64MPjLcM4qs3zBoRROP kumail@kumail-r7"
}

################ AWS EC2 INSTANCES ###############

##### AWS JUMP SERVER ####
resource "aws_instance" "jump_server" {
  ami = "ami-0fff1b9a61dec8a5f" # Amazon Linux 2
  instance_type = "t2.micro"
  vpc_security_group_ids = [aws_security_group.jump_server_sg.id]
  key_name = "aws-key-demo-1"
  subnet_id = aws_subnet.public_web_subnet[0].id
  tags = { Name = "jump-server" }
}

##### AWS WEB SERVER ####
resource "aws_instance" "php_server" {
  count = 2
  ami = "ami-0fff1b9a61dec8a5f"
  instance_type = "t2.micro"
  subnet_id = aws_subnet.private_app_subnet[count.index].id
  vpc_security_group_ids = [aws_security_group.web_server_sg.id]
  key_name = "aws-key-demo-1"
  user_data = <<-EOF
              #!/bin/bash
              yum update -y
              yum install -y httpd php
              systemctl start httpd
              systemctl enable httpd
              usermod -a -G apache ec2-user
              chmod 2775 /var/www && find /var/www -type d -exec sudo chmod 2775 {} \;
              find /var/www -type f -exec sudo chmod 0664 {} \;
              yum install php-mbstring php-xml -y
              systemctl restart httpd
              systemctl restart php-fpm
              cd /var/www/html
              wget https://www.phpmyadmin.net/downloads/phpMyAdmin-latest-all-languages.tar.gz
              mkdir phpMyAdmin && tar -xvzf phpMyAdmin-latest-all-languages.tar.gz -C phpMyAdmin --strip-components 1
              EOF
  tags = { Name = "php-server-${count.index + 1}" }
}

##### AWS ALB #####
resource "aws_alb" "app_alb" {
  name = "main-alb"
  load_balancer_type = "application"
  subnets = aws_subnet.public_web_subnet[*].id
  security_groups = [aws_security_group.lb_sg.id]
}

resource "aws_alb_target_group" "app_tg" {
  name = "main-tg"
  port = 80
  protocol = "HTTP"
  vpc_id = aws_vpc.main.id
}

resource "aws_alb_target_group_attachment" "app_tg_group" {
    count = 2
    target_group_arn = aws_alb_target_group.app_tg.arn
    target_id = aws_instance.php_server[count.index].id
    port = 80
}

resource "aws_alb_listener" "http_listener" {
  load_balancer_arn = aws_alb.app_alb.arn
  port = 80
  default_action {
    type = "forward"
    target_group_arn = aws_alb_target_group.app_tg.arn
  }
}

#### AWS RDS MYSQL DB SUBNET GROUP ####
resource "aws_db_subnet_group" "db_subnet_group" {
  name       = "rds-subnet-group"
  subnet_ids = aws_subnet.private_db_subnet[*].id  # Reference your private DB subnets here

  tags = {
    Name = "db-subnet-group"
  }
}

#### AWS RDS MYSQL DB INSTANCE ####
resource "aws_db_instance" "rds_instance" {
  allocated_storage = 20
  engine = "mysql"
  instance_class = "db.t3.micro"
  db_name = "mydb"
  username = "admin"
  password = "password"
  publicly_accessible = false
  multi_az = true
  vpc_security_group_ids = [aws_security_group.db_sg.id]
  db_subnet_group_name    = aws_db_subnet_group.db_subnet_group.name 
  tags = {
    Name = "rds-instance"
  }
}

