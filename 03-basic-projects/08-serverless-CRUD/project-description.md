# Serverless DynamoDB CRUD Operations

## Description
This project demonstrates how to create a serverless application that performs CRUD (Create, Read, Update, Delete) operations on a DynamoDB table using AWS Lambda and API Gateway using both the AWS console and the CLI. The implementation follows the principle of least privilege with specific policies for each Lambda function.

## Architecture Diagram

![Serverless DynamoDB CRUD Architecture](1_507-Bg9C2LbUI4RsDic1Vw.jpg)

## Understanding the Services Used

### Amazon DynamoDB
- A fully managed NoSQL database service that provides fast and predictable performance with seamless scalability
- Key features:
  - Serverless: No servers to manage
  - Automatic scaling: Handles traffic increases without intervention
  - Performance: Single-digit millisecond response times
  - Fully managed: AWS handles all the infrastructure work
- Why we use it in this project:
  - Perfect for serverless applications
  - Simple key-value data model suits our notes application
  - Automatic scaling matches our serverless architecture
  - Pay-per-request pricing aligns with our usage patterns

### AWS Lambda
- A serverless compute service that runs your code in response to events
- Key features:
  - Serverless: No server management needed
  - Event-driven: Runs code in response to events
  - Automatic scaling: Handles concurrent executions automatically
  - Pay-per-use: Only pay for the compute time you consume
- Why we use it in this project:
  - Handles API requests efficiently
  - Scales automatically with user demand
  - Cost-effective for variable workloads
  - Integrates well with API Gateway and DynamoDB

### Amazon API Gateway
- A fully managed service for creating, publishing, and managing APIs
- Key features:
  - API management
  - Traffic management
  - Security features
  - Monitoring and metrics
- Why we use it in this project:
  - Creates RESTful API endpoints
  - Handles request/response transformations
  - Provides security features
  - Offers usage plans and API keys if needed

## Important Concepts

### Lambda Proxy Integration
Lambda proxy integration is a simplified, powerful integration type in API Gateway that passes all request information to your Lambda function.

#### Why We Use It:
1. Simplifies API Gateway configuration
2. Provides access to all request information in Lambda:
   - Headers
   - Query string parameters
   - URL path parameters
   - Body
   - API Gateway context
   - Stage variables
3. Allows Lambda to control the complete response:
   - Status code
   - Headers
   - Body

#### When to Use Lambda Proxy vs. Non-Proxy:
- Use Lambda Proxy when:
  - You want complete control over the request/response in your Lambda code
  - You need access to request context information
  - You want to minimize API Gateway configuration
  
- Use Non-Proxy when:
  - You need API Gateway to handle request/response transformations
  - You want to use API Gateway mapping templates
  - You need to modify requests before they reach Lambda

### CORS (Cross-Origin Resource Sharing)
CORS is a security feature implemented by web browsers that controls how web pages in one domain can request and interact with resources in another domain.

#### When to Enable CORS:
Enable CORS when:
1. Your API is called from a web browser
2. The website calling your API is hosted on a different domain than your API
3. You're building a web application that makes JavaScript/AJAX calls to your API

#### Our CORS Configuration Explained:
In this project, we enable CORS because:
- The API might be called from web applications
- It allows testing from different domains
- It enables integration with front-end applications

To enable CORS in API Gateway:
1. The 'Access-Control-Allow-Origin' header in Lambda responses
2. OPTIONS method configuration in API Gateway
3. Proper handling of CORS headers

#### CORS Headers Used:
```json
{
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT,DELETE"
}
```

## Prerequisites

- AWS account with appropriate permissions
- AWS CLI installed and configured
  - [Installing the AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html)
  - [Configuring the AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html)
- Basic understanding of JSON and REST APIs

## Implementation Steps

### Step 1: Create DynamoDB Table

1. Navigate to DynamoDB in AWS Console
2. Click "Create table"
3. Enter the following details:
   - Table name: `notes`
   - Partition key: `id` (String)
4. Leave all other settings as default
5. Click "Create table"

### Step 2: Create IAM Policies

Create four separate policies for each DynamoDB operation:

1. createNotePolicy:
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "dynamodb:PutItem"
            ],
            "Resource": "arn:aws:dynamodb:*:*:table/notes"
        }
    ]
}
```

2. readNotePolicy:
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "dynamodb:GetItem"
            ],
            "Resource": "arn:aws:dynamodb:*:*:table/notes"
        }
    ]
}
```

3. updateNotePolicy:
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "dynamodb:UpdateItem"
            ],
            "Resource": "arn:aws:dynamodb:*:*:table/notes"
        }
    ]
}
```

4. deleteNotePolicy:
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "dynamodb:DeleteItem"
            ],
            "Resource": "arn:aws:dynamodb:*:*:table/notes"
        }
    ]
}
```

### Step 3: Create Lambda Functions

Create four Lambda functions, each with basic execution role first:

#### createNote Function
```python
# Required imports
import json              # For JSON parsing and serialization
import boto3            # AWS SDK for Python
import uuid             # For generating unique IDs

# Initialize DynamoDB resource and table reference
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('notes')    # Reference to our 'notes' table

def lambda_handler(event, context):
    """
    Creates a new note in DynamoDB table.
    
    Parameters:
        event (dict): API Gateway event information
        context (LambdaContext): Lambda runtime information
        
    Returns:
        dict: API Gateway response object
    """
    try:
        # Parse the JSON string from the request body
        body = json.loads(event['body'])
        
        # Create new item with UUID and request data
        item = {
            'id': str(uuid.uuid4()),    # Generate unique ID
            'title': body['title'],     # Extract title from request
            'content': body['content']  # Extract content from request
        }
        
        # Insert the item into DynamoDB
        table.put_item(Item=item)
        
        # Return success response
        return {
            'statusCode': 201,          # HTTP 201 Created
            'headers': {
                'Content-Type': 'application/json'
            },
            'body': json.dumps({
                'message': 'Note created successfully',
                'id': item['id']        # Return the generated ID
            })
        }
        
    except Exception as e:
        # Handle any errors and return 500 response
        return {
            'statusCode': 500,          # HTTP 500 Internal Server Error
            'headers': {
                'Content-Type': 'application/json'
            },
            'body': json.dumps({
                'error': str(e)
            })
        }
```

#### readNote Function
```python
import json
import boto3

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('notes')

def lambda_handler(event, context):
    try:
        note_id = event['pathParameters']['id']
        response = table.get_item(Key={'id': note_id})
        
        if 'Item' in response:
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json'
                },
                'body': json.dumps(response['Item'])
            }
        else:
            return {
                'statusCode': 404,
                'headers': {
                    'Content-Type': 'application/json'
                },
                'body': json.dumps({
                    'message': 'Note not found'
                })
            }
    except Exception as e:
        return {
            'statusCode': 500, 
            'headers': {
                'Content-Type': 'application/json'
            },
            'body': json.dumps({
                'error': str(e)
            })
        }
```

#### updateNote Function
```python
import json
import boto3

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('notes')

def lambda_handler(event, context):
    try:
        note_id = event['pathParameters']['id']
        body = json.loads(event['body'])
        
        response = table.update_item(
            Key={'id': note_id},
            UpdateExpression='SET title = :title, content = :content',
            ExpressionAttributeValues={
                ':title': body['title'],
                ':content': body['content']
            },
            ReturnValues='ALL_NEW'
        )
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json'
            },
            'body': json.dumps(response['Attributes'])
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json'
            },
            'body': json.dumps({
                'error': str(e)
            })
        }
```

#### deleteNote Function
```python
import json
import boto3

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('notes')

def lambda_handler(event, context):
    try:
        note_id = event['pathParameters']['id']
        table.delete_item(Key={'id': note_id})
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json'
            },
            'body': json.dumps({
                'message': 'Note deleted successfully'
            })
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json'
            },
            'body': json.dumps({
                'error': str(e)
            })
        }
```

### Step 4: Attach Policies to Lambda Functions

After creating each Lambda function with the basic execution role, attach the corresponding DynamoDB policy:
1. Go to each Lambda function's configuration
2. Under "Permissions", click on the execution role
3. Click "Attach policies"
4. Search for and attach the corresponding policy created in Step 2

### Step 5: Create API Gateway

1. Go to API Gateway Console
2. Create new REST API
3. Create resources and methods:

   POST /notes -> createNote Lambda
   GET /notes/{id} -> readNote Lambda
   PUT /notes/{id} -> updateNote Lambda
   DELETE /notes/{id} -> deleteNote Lambda

4. Deploy the API to a 'prod' stage

## Testing

### Lambda Function Tests

1. createNote Lambda test:
```json
{
  "body": "{\"title\": \"Test Note\", \"content\": \"This is a test note\"}"
}
```

2. readNote Lambda test:
```json
{
  "pathParameters": {
    "id": "YOUR-NOTE-ID"
  }
}
```

3. updateNote Lambda test:
```json
{
  "pathParameters": {
    "id": "YOUR-NOTE-ID"
  },
  "body": "{\"title\": \"Updated Test Note\", \"content\": \"This note has been updated\"}"
}
```

4. deleteNote Lambda test:
```json
{
  "pathParameters": {
    "id": "YOUR-NOTE-ID"
  }
}
```

### API Testing with curl

1. Create Note:
```bash
curl -X POST \
  https://YOUR-API-ID.execute-api.us-east-1.amazonaws.com/prod/notes \
  -H 'Content-Type: application/json' \
  -d '{"title": "Test Note", "content": "This is a test note using curl"}'
```

2. Read Note:
```bash
curl -X GET \
  https://YOUR-API-ID.execute-api.us-east-1.amazonaws.com/prod/notes/YOUR-NOTE-ID
```

3. Update Note:
```bash
curl -X PUT \
  https://YOUR-API-ID.execute-api.us-east-1.amazonaws.com/prod/notes/YOUR-NOTE-ID \
  -H 'Content-Type: application/json' \
  -d '{"title": "Updated Note", "content": "This note has been updated via API"}'
```

4. Delete Note:
```bash
curl -X DELETE \
  https://YOUR-API-ID.execute-api.us-east-1.amazonaws.com/prod/notes/YOUR-NOTE-ID
```

## Cleanup

1. Delete the API Gateway API
2. Delete all Lambda functions
3. Delete the DynamoDB table
4. Delete the IAM policies
5. Delete the Lambda execution roles

# Method 2: AWS CLI Implementation

This section provides a complete guide for implementing the serverless CRUD application using AWS CLI commands. All commands are shown in sequence and can be run in a terminal or command prompt.

## Prerequisites for CLI Method
- AWS CLI installed and configured with appropriate permissions
- jq tool installed (optional, but helpful for JSON processing)
- A terminal or command prompt
- Python 3.9 or later installed

---

## Step-by-Step CLI Implementation

### Step 1: Set Up Environment Variables
```bash
# Set your AWS region
export AWS_REGION="us-east-1"

# Get your AWS account ID
export ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
```

### Step 2: Create DynamoDB Table
```bash
aws dynamodb create-table \
    --table-name notes \
    --attribute-definitions AttributeName=id,AttributeType=S \
    --key-schema AttributeName=id,KeyType=HASH \
    --billing-mode PAY_PER_REQUEST \
    --region ${AWS_REGION}
```

### Step 3: Create IAM Roles and Policies

First, create the trust policy document:
```bash
cat > trust-policy.json << 'EOF'
{
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
}
EOF
```

Create policy documents for each Lambda function:

```bash
# Create Note Policy
cat > createNote-policy.json << 'EOF'
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "dynamodb:PutItem"
            ],
            "Resource": "arn:aws:dynamodb:*:*:table/notes"
        }
    ]
}
EOF

# Read Note Policy
cat > readNote-policy.json << 'EOF'
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "dynamodb:GetItem"
            ],
            "Resource": "arn:aws:dynamodb:*:*:table/notes"
        }
    ]
}
EOF

# Update Note Policy
cat > updateNote-policy.json << 'EOF'
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "dynamodb:UpdateItem"
            ],
            "Resource": "arn:aws:dynamodb:*:*:table/notes"
        }
    ]
}
EOF

# Delete Note Policy
cat > deleteNote-policy.json << 'EOF'
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "dynamodb:DeleteItem"
            ],
            "Resource": "arn:aws:dynamodb:*:*:table/notes"
        }
    ]
}
EOF
```

Create roles and attach policies:
```bash
# Create roles and attach policies for each function
for func in create read update delete; do
    # Create role
    aws iam create-role \
        --role-name ${func}NoteLambdaRole \
        --assume-role-policy-document file://trust-policy.json

    # Attach basic Lambda execution role
    aws iam attach-role-policy \
        --role-name ${func}NoteLambdaRole \
        --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole

    # Create function-specific policy
    POLICY_ARN=$(aws iam create-policy \
        --policy-name ${func}NotePolicy \
        --policy-document file://${func}Note-policy.json \
        --query 'Policy.Arn' --output text)

    # Attach the specific policy
    aws iam attach-role-policy \
        --role-name ${func}NoteLambdaRole \
        --policy-arn $POLICY_ARN

    echo "Created and configured role for ${func}Note"
done

# Wait for roles to propagate
sleep 10
```

### Step 4: Create Lambda Functions

Create Python files for each function:

```bash
# Create Note Lambda
cat > createNote.py << 'EOF'
import json
import boto3
import uuid

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('notes')

def lambda_handler(event, context):
    try:
        body = json.loads(event['body'])
        item = {
            'id': str(uuid.uuid4()),
            'title': body['title'],
            'content': body['content']
        }
        table.put_item(Item=item)
        return {
            'statusCode': 201,
            'headers': {
                'Content-Type': 'application/json'
            },
            'body': json.dumps({
                'message': 'Note created successfully',
                'id': item['id']
            })
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json'
            },
            'body': json.dumps({
                'error': str(e)
            })
        }
EOF

# Create deployment packages
zip createNote.zip createNote.py

# Create Lambda function
aws lambda create-function \
    --function-name createNote \
    --runtime python3.9 \
    --handler createNote.lambda_handler \
    --role arn:aws:iam::${ACCOUNT_ID}:role/createNoteLambdaRole \
    --zip-file fileb://createNote.zip

# Repeat similar process for other functions (readNote, updateNote, deleteNote)
```

### Step 5: Create API Gateway

```bash
# Create API
API_ID=$(aws apigateway create-rest-api \
    --name NotesAPI \
    --endpoint-configuration types=REGIONAL \
    --query 'id' --output text)

# Get root resource ID
ROOT_RESOURCE_ID=$(aws apigateway get-resources \
    --rest-api-id $API_ID \
    --query 'items[0].id' --output text)

# Create /notes resource
NOTES_RESOURCE_ID=$(aws apigateway create-resource \
    --rest-api-id $API_ID \
    --parent-id $ROOT_RESOURCE_ID \
    --path-part notes \
    --query 'id' --output text)

# Create /notes/{id} resource
NOTES_ID_RESOURCE_ID=$(aws apigateway create-resource \
    --rest-api-id $API_ID \
    --parent-id $NOTES_RESOURCE_ID \
    --path-part {id} \
    --query 'id' --output text)

# Create POST method and integration
aws apigateway put-method \
    --rest-api-id $API_ID \
    --resource-id $NOTES_RESOURCE_ID \
    --http-method POST \
    --authorization-type NONE

aws apigateway put-integration \
    --rest-api-id $API_ID \
    --resource-id $NOTES_RESOURCE_ID \
    --http-method POST \
    --type AWS_PROXY \
    --integration-http-method POST \
    --uri arn:aws:apigateway:${AWS_REGION}:lambda:path/2015-03-31/functions/arn:aws:lambda:${AWS_REGION}:${ACCOUNT_ID}:function:createNote/invocations

# Deploy API
aws apigateway create-deployment \
    --rest-api-id $API_ID \
    --stage-name prod

# Add Lambda permissions
aws lambda add-permission \
    --function-name createNote \
    --statement-id apigateway-post \
    --action lambda:InvokeFunction \
    --principal apigateway.amazonaws.com \
    --source-arn "arn:aws:execute-api:${AWS_REGION}:${ACCOUNT_ID}:${API_ID}/*/*"
```

### Step 6: Testing the Setup

```bash
# Get your API endpoint
API_ENDPOINT="https://${API_ID}.execute-api.${AWS_REGION}.amazonaws.com/prod"

# Test create note
curl -X POST \
  ${API_ENDPOINT}/notes \
  -H 'Content-Type: application/json' \
  -d '{"title": "CLI Test Note", "content": "This note was created using CLI setup"}'
```

### Cleanup Commands

```bash
# Delete API Gateway
aws apigateway delete-rest-api --rest-api-id $API_ID

# Delete Lambda functions
aws lambda delete-function --function-name createNote
aws lambda delete-function --function-name readNote
aws lambda delete-function --function-name updateNote
aws lambda delete-function --function-name deleteNote

# Delete DynamoDB table
aws dynamodb delete-table --table-name notes

# Delete IAM roles and policies
for func in create read update delete; do
    # Get policy ARN
    POLICY_ARN="arn:aws:iam::${ACCOUNT_ID}:policy/${func}NotePolicy"
    
    # Detach and delete policies
    aws iam detach-role-policy \
        --role-name ${func}NoteLambdaRole \
        --policy-arn $POLICY_ARN
    
    aws iam detach-role-policy \
        --role-name ${func}NoteLambdaRole \
        --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole
    
    aws iam delete-policy --policy-arn $POLICY_ARN
    
    # Delete role
    aws iam delete-role --role-name ${func}NoteLambdaRole
done
```

## Important Notes
- Replace `${AWS_REGION}` with your desired region if not using environment variables
- The `sleep 10` command is used to allow IAM role creation to propagate
- All commands assume you're in a bash-compatible shell
- Make sure you have appropriate AWS credentials configured
- Keep track of created resources to ensure proper cleanup

## Additional Resources

- [AWS Lambda Developer Guide](https://docs.aws.amazon.com/lambda/latest/dg/welcome.html)
- [Amazon DynamoDB Developer Guide](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Introduction.html)
- [Amazon API Gateway Developer Guide](https://docs.aws.amazon.com/apigateway/latest/developerguide/welcome.html)