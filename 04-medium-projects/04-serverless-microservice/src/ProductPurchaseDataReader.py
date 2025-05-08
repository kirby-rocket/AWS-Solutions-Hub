import boto3
import os
import logging
import json

# Configure logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)

# Initialize DynamoDB
dynamodb = boto3.resource('dynamodb')
table_name = os.environ['TABLE_NAME']
table = dynamodb.Table(table_name)

def lambda_handler(event, context):
    try:
        # Check if the request is for a specific ID
        path_parameters = event.get('pathParameters')
        if path_parameters and 'id' in path_parameters:
            # Retrieve a specific item by ID
            id = path_parameters['id']
            response = table.get_item(Key={'ProductPurchaseId': id})
            if 'Item' in response:
                logger.info(f"Retrieved item: {response['Item']}")
                return {
                    "statusCode": 200,
                    "body": json.dumps(response['Item']),
                    "headers": {
                        "Content-Type": "application/json"
                    }
                }
            else:
                logger.warning(f"ProductPurchaseId {id} not found")
                return {
                    "statusCode": 404,
                    "body": json.dumps({"error": f"ProductPurchaseId {id} not found"}),
                    "headers": {
                        "Content-Type": "application/json"
                    }
                }
        else:
            # Retrieve all items
            response = table.scan()
            logger.info(f"Retrieved data: {response['Items']}")
            return {
                "statusCode": 200,
                "body": json.dumps(response['Items']),
                "headers": {
                    "Content-Type": "application/json"
                }
            }
    except Exception as e:
        logger.error(f"Error retrieving data: {str(e)}")
        return {
            "statusCode": 500,
            "body": json.dumps({"error": f"Error retrieving data: {str(e)}"}),
            "headers": {
                "Content-Type": "application/json"
            }
        }