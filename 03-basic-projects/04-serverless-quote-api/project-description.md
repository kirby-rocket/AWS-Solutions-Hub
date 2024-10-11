# Create a Serverless Random Quote API with AWS Lambda and API Gateway

## Description
This project demonstrates how to create a simple serverless API using AWS Lambda and Amazon API Gateway. You will build a RESTful API that returns random inspirational quotes. We'll cover three methods: AWS Management Console, AWS CLI, and Terraform.

## Architecture Diagram

![Serverless Quote API Architecture](simplelambda.jpeg)

## Prerequisites
- AWS account with appropriate permissions
- Basic understanding of AWS services and JSON
- For CLI method: AWS CLI installed and configured
- For Terraform method: Terraform installed

## Method 1: Using AWS Management Console

### Step 1: Create a Lambda Function
1. Navigate to Lambda in the AWS Management Console
2. Click "Create function"
3. Choose "Author from scratch"
4. Set function name as "RandomQuoteFunction"
5. Select runtime as Python 3.12
6. Under Permissions, choose "Create a new role with basic Lambda permissions"
7. Click "Create function"
8. In the Function code section, replace the existing code with:

```python
import json
import random

quotes = [
    {"author": "Nelson Mandela", "quote": "It always seems impossible until it's done."},
    {"author": "Walt Disney", "quote": "All our dreams can come true, if we have the courage to pursue them."},
    {"author": "Eleanor Roosevelt", "quote": "The future belongs to those who believe in the beauty of their dreams."},
    {"author": "Oprah Winfrey", "quote": "You become what you believe."},
    {"author": "Tony Robbins", "quote": "The only impossible journey is the one you never begin."}
]

def lambda_handler(event, context):
    quote = random.choice(quotes)
    return {
        'statusCode': 200,
        'body': json.dumps(quote),
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    }
```

9. Click "Deploy" to save the function

### Step 2: Create an API in API Gateway
1. Go to API Gateway in the AWS Management Console
2. Click "Create API" and choose "REST API"
3. Set API name as "QuoteAPI" and click "Create API"
4. Click "Actions" > "Create Resource"
5. Set Resource Name as "quote" and click "Create Resource"
6. With the /quote resource selected, click "Actions" > "Create Method"
7. Select GET from the dropdown and click the checkmark
8. Set Integration type to "Lambda Function"
9. Select your region and enter "RandomQuoteFunction" in the Lambda Function field
10. Click "Save" and "OK" to grant permission

### Step 3: Deploy the API
1. Click "Actions" > "Deploy API"
2. For Deployment stage, select "[New Stage]"
3. Set Stage name as "prod"
4. Click "Deploy"
5. Note the Invoke URL provided

### Testing
Use the Invoke URL in a web browser or with curl:
```
https://[your-api-id].execute-api.[your-region].amazonaws.com/prod/quote
```

## Method 2: Using AWS CLI

### Step 1: Create Lambda Function

1. Create a file named `lambda_function.py` with the following content:

```python
import json
import random

quotes = [
    {"author": "Nelson Mandela", "quote": "It always seems impossible until it's done."},
    {"author": "Walt Disney", "quote": "All our dreams can come true, if we have the courage to pursue them."},
    {"author": "Eleanor Roosevelt", "quote": "The future belongs to those who believe in the beauty of their dreams."},
    {"author": "Oprah Winfrey", "quote": "You become what you believe."},
    {"author": "Tony Robbins", "quote": "The only impossible journey is the one you never begin."}
]

def lambda_handler(event, context):
    quote = random.choice(quotes)
    return {
        'statusCode': 200,
        'body': json.dumps(quote),
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    }
```

2. Create a deployment package:
```bash
zip function.zip lambda_function.py
```

3. Create an IAM role for Lambda:
```bash
ROLE_NAME="LambdaBasicExecution"
ROLE_ARN=$(aws iam create-role \
    --role-name $ROLE_NAME \
    --assume-role-policy-document '{
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Principal": {
                    "Service": "lambda.amazonaws.com"
                },
                "Action": "sts:AssumeRole"
            }
        ]
    }' \
    --query 'Role.Arn' \
    --output text)

echo "Created role: $ROLE_ARN"
```

4. Attach the AWSLambdaBasicExecutionRole policy to the role:
```bash
aws iam attach-role-policy \
    --role-name $ROLE_NAME \
    --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole
```

5. Wait for the role to be fully created:
```bash
sleep 10
```

6. Create the Lambda function:
```bash
aws lambda create-function \
    --function-name RandomQuoteFunction \
    --zip-file fileb://function.zip \
    --handler lambda_function.lambda_handler \
    --runtime python3.12 \
    --role $ROLE_ARN
```

### Step 2: Create API Gateway

1. Create a new REST API:
```bash
API_ID=$(aws apigateway create-rest-api --name QuoteAPI --query 'id' --output text)
```

2. Get the root resource ID:
```bash
ROOT_RESOURCE_ID=$(aws apigateway get-resources --rest-api-id $API_ID --query 'items[0].id' --output text)
```

3. Create a new resource:
```bash
RESOURCE_ID=$(aws apigateway create-resource \
    --rest-api-id $API_ID \
    --parent-id $ROOT_RESOURCE_ID \
    --path-part quote \
    --query 'id' \
    --output text)
```

4. Create a GET method:
```bash
aws apigateway put-method \
    --rest-api-id $API_ID \
    --resource-id $RESOURCE_ID \
    --http-method GET \
    --authorization-type NONE
```

5. Set up the Lambda integration:
```bash
REGION=$(aws configure get region)
ACCOUNT_ID=$(aws sts get-caller-identity --query 'Account' --output text)
LAMBDA_ARN="arn:aws:lambda:${REGION}:${ACCOUNT_ID}:function:RandomQuoteFunction"

aws apigateway put-integration \
    --rest-api-id $API_ID \
    --resource-id $RESOURCE_ID \
    --http-method GET \
    --type AWS_PROXY \
    --integration-http-method POST \
    --uri arn:aws:apigateway:${REGION}:lambda:path/2015-03-31/functions/${LAMBDA_ARN}/invocations
```

### Step 3: Add Lambda Permission

Add permission for API Gateway to invoke the Lambda function:
```bash
aws lambda add-permission \
    --function-name RandomQuoteFunction \
    --statement-id apigateway-get-quote \
    --action lambda:InvokeFunction \
    --principal apigateway.amazonaws.com \
    --source-arn "arn:aws:execute-api:${REGION}:${ACCOUNT_ID}:${API_ID}/*/GET/quote"
```

### Step 4: Deploy the API

1. Create a deployment:
```bash
aws apigateway create-deployment \
    --rest-api-id $API_ID \
    --stage-name prod
```

2. Get the invoke URL:
```bash
echo "https://${API_ID}.execute-api.${REGION}.amazonaws.com/prod/quote"
```

### Testing Your API

Use the invoke URL provided in the last step to test your API. You can use a web browser or a tool like curl:

```bash
curl https://${API_ID}.execute-api.${REGION}.amazonaws.com/prod/quote
```

## Method 3: Using Terraform

### Step 1: Set Up Terraform Files

1. Create a file named `main.tf` with the following content:

```hcl
provider "aws" {
  region = "us-east-1"  # Change to your preferred region
}

resource "aws_iam_role" "lambda_role" {
  name = "RandomQuoteLambdaRole"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_policy" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

data "archive_file" "lambda_zip" {
  type        = "zip"
  source_file = "lambda_function.py"
  output_path = "function.zip"
}

resource "aws_lambda_function" "quote_function" {
  filename      = "function.zip"
  function_name = "RandomQuoteFunction"
  role          = aws_iam_role.lambda_role.arn
  handler       = "lambda_function.lambda_handler"
  runtime       = "python3.12"

  source_code_hash = data.archive_file.lambda_zip.output_base64sha256
}

resource "aws_api_gateway_rest_api" "quote_api" {
  name        = "QuoteAPI"
  description = "Random Quote API"
}

resource "aws_api_gateway_resource" "quote_resource" {
  rest_api_id = aws_api_gateway_rest_api.quote_api.id
  parent_id   = aws_api_gateway_rest_api.quote_api.root_resource_id
  path_part   = "quote"
}

resource "aws_api_gateway_method" "quote_method" {
  rest_api_id   = aws_api_gateway_rest_api.quote_api.id
  resource_id   = aws_api_gateway_resource.quote_resource.id
  http_method   = "GET"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "lambda_integration" {
  rest_api_id = aws_api_gateway_rest_api.quote_api.id
  resource_id = aws_api_gateway_resource.quote_resource.id
  http_method = aws_api_gateway_method.quote_method.http_method

  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.quote_function.invoke_arn
}

resource "aws_lambda_permission" "api_gw" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.quote_function.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.quote_api.execution_arn}/*/*"
}

resource "aws_api_gateway_deployment" "quote_deployment" {
  depends_on = [aws_api_gateway_integration.lambda_integration]

  rest_api_id = aws_api_gateway_rest_api.quote_api.id
  stage_name  = "prod"
}

output "api_url" {
  value = "${aws_api_gateway_deployment.quote_deployment.invoke_url}/quote"
}
```

2. Create `lambda_function.py` in the same directory with the Python code (same as in the CLI method).

### Step 2: Initialize and Apply Terraform

1. Initialize Terraform:
```bash
terraform init
```

2. Review the planned changes:
```bash
terraform plan
```

3. Apply the configuration:
```bash
terraform apply
```

4. When prompted, type 'yes' to create the resources.

### Testing

Use the URL output by Terraform to test your API:
```bash
curl $(terraform output -raw api_url)
```

## Cleanup

### For Console and CLI methods:
1. Delete the API Gateway API
2. Delete the Lambda function
3. Delete the IAM role

### For Terraform method:
Run `terraform destroy` and confirm with 'yes'

## Additional Resources
- [AWS Lambda Developer Guide](https://docs.aws.amazon.com/lambda/latest/dg/welcome.html)
- [Amazon API Gateway Developer Guide](https://docs.aws.amazon.com/apigateway/latest/developerguide/welcome.html)
- [Terraform AWS Provider Documentation](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)