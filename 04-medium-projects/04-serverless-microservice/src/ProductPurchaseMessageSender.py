import json
import boto3
import logging
import os
from botocore.exceptions import ClientError

# Configure logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)

# Initialize SQS client
sqs = boto3.client('sqs')
QUEUE_URL = os.environ['QUEUE_URL']

def lambda_handler(event, context):
    try:
        # Determine HTTP method
        http_method = event['httpMethod']
        
        if http_method == 'POST':
            # Parse request body
            body = json.loads(event['body'])
            body['action'] = 'create'  # Add an action field to indicate a creation
        
        elif http_method == 'PUT':
            # Validate that 'id' is present in the path parameters
            path_parameters = event.get('pathParameters')
            if not path_parameters or 'id' not in path_parameters:
                logger.error("Missing 'id' path parameter for update operation")
                # Raise a ClientError for missing ProductPurchaseId
                raise ClientError(
                    error_response = {
                        'Error': {
                            'Code': 'ValidationException',
                            'Message': "Missing 'id' path parameter for update operation"
                        }
                    },
                    operation_name = 'PutProductPurchase'
                )
                
            # Parse the request body
            body = json.loads(event['body'])
            body['action'] = 'update'  # Add an action field to indicate an update
            body['ProductPurchaseId'] = path_parameters['id']  # Add ProductPurchaseId to the body
            
        elif http_method == 'DELETE':
            # Extract path parameters
            path_parameters = event.get('pathParameters')
            
            # Validate that 'id' is present in the path parameters
            if not path_parameters or 'id' not in path_parameters:
                logger.error("Missing 'id' path parameter for delete operation")
                # Raise a ClientError for missing ProductPurchaseId
                raise ClientError(
                    error_response={
                        'Error': {
                            'Code': 'ValidationException',
                            'Message': "Missing 'id' path parameter for delete operation"
                        }
                    },
                    operation_name='DeleteProductPurchase'
                )
            
            # Initialize the body for the DELETE action
            body = {
                'action': 'delete',  # Specify the action as 'delete'
                'ProductPurchaseId': path_parameters['id']  # Add the ProductPurchaseId from the path parameters
            }
            
        else:
            # Handle unsupported methods
            logger.error(f"Method {http_method} not allowed")
            # Raise a ClientError for unsupported methods
            raise ClientError(
                error_response = {
                    'Error': {
                        'Code': 'NotImplementedException',
                        'Message': f"Method {http_method} not allowed"
                    }
                },
                operation_name = 'UnsupportedMethod'
            )   
        
        # Send message to SQS queue
        response = sqs.send_message(
            QueueUrl=QUEUE_URL,
            MessageBody=json.dumps(body)
        )
        
        logger.info('Message sent to queue', extra={
            'message_id': response['MessageId'],
            'payload': body
        })
        
        return {
            'statusCode': 200,
            'body': json.dumps({
                'message': 'Message sent successfully',
                'messageId': response['MessageId']
            })
        }
        
    except ClientError as e:
        logger.error(f"Error sending message: {str(e)}")
        return {
            'statusCode': 400,
            'body': json.dumps({
                'error': str(e)
            })
        }
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        return {
            'statusCode': 500,
            'body': json.dumps({
                'error': 'Internal server error'
            })
        }
