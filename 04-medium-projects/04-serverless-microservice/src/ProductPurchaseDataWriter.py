import json
import boto3
import logging
import uuid
from datetime import datetime
from botocore.exceptions import ClientError

# Configure logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)

database = boto3.resource('dynamodb')
table = database.Table('ProductPurchase')

def lambda_handler(event, context):
    
    try:
        for record in event["Records"]:
            
            payload = json.loads(record["body"])
            logger.info('Processing record', extra={
                'payload': payload,
                'message_id': record.get('messageId'),
                'event_source': record.get('eventSource')
            })
            
            if payload['action'] == 'create':
                payload['ProductPurchaseId'] = str(uuid.uuid4())
                table.put_item(Item=payload)
            elif payload['action'] == 'update':
                table.put_item(Item=payload)
            elif payload['action'] == 'delete':
                table.delete_item(Key={'ProductPurchaseId': payload['ProductPurchaseId']})
            else:
                logger.error(f"Unknown action: {payload['action']}")
                raise ClientError(
                    error_response={
                        'Error': {
                            'Code': 'ValidationException',
                            'Message': f"Unknown action: {payload['action']}"
                        }
                    },
                    operation_name='ProcessProductPurchase'
                )
        
        logger.info('Successfully processed data into DynamoDB')
        return {
            "statusCode": 200,
            "body": json.dumps({
                "message": "Successfully processed data!"
            })
        }
        
    except ClientError as e:
        logger.error(f"Error processing data into DynamoDB: {str(e)}")
        raise Exception(f"Error processing data: {str(e)}")  # Raise an exception to trigger DLQ
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise  # Re-raise the exception to trigger DLQ
