# Mystical Magic 8 Ball Experience - Serverless Application

This project is a serverless implementation of the classic Magic 8 Ball, offering users an interactive web interface to engage with the mystical oracle. Powered by AWS Lambda for backend processing and hosted on an S3 bucket for the frontend, this application provides random responses to user questions, creating an entertaining and immersive experience.

## Features

- Serverless architecture using AWS Lambda and API Gateway
- Interactive web interface with animations and sound effects
- Random response generation with multiple categories (positive, negative, neutral, mysterious, playful)
- CORS-enabled API for seamless integration with web applications
- Easy deployment using AWS SAM (Serverless Application Model)

## Project Structure

- `index.html`: The main frontend file, providing the user interface for the Magic 8 Ball experience.
- `app.py`: The Lambda function that processes API requests and returns random Magic 8 Ball responses.
- `template.yaml`: AWS SAM template defining the serverless architecture, including Lambda function and API Gateway.

## Prerequisites

Before you begin, ensure you have the following installed:

- [AWS CLI](https://aws.amazon.com/cli/) configured with your credentials
- [AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html)
- [Python 3.9](https://www.python.org/downloads/) or later
- An AWS account with appropriate permissions

## Deployment Instructions

1. **Clone the Repository**

   ```bash
   git clone https://github.com/AmirMalaeb/magic-8-ball-SAM.git
   cd magic-8-ball-SAM
   ```

2. **Package the Application**

   Replace `your-s3-bucket` with an S3 bucket in your account for storing deployment artifacts.

   ```bash
   sam package --template-file template.yaml --output-template-file packaged.yaml --s3-bucket your-s3-bucket
   ```

3. **Deploy the Application**

   ```bash
   sam deploy --template-file packaged.yaml --stack-name magic-8-ball-stack --capabilities CAPABILITY_IAM
   ```

4. **Note the API Endpoint**

   After deployment, note the API Gateway endpoint URL from the `Magic8BallApiUrl` output in the terminal.

5. **Update the Frontend**

   Open `index.html` in a text editor and replace the placeholder API URL in the script section (around line 232) with your actual API Gateway URL.

6. **Host the Frontend (Optional)**

   To host the frontend on S3:
   - Create a new S3 bucket in the AWS S3 Console.
   - Enable static website hosting on the bucket.
   - Upload the `index.html` file to the bucket.
   - Set the file permissions to be publicly readable.

## Usage

Access the `index.html` file in your browser or via the S3 bucket URL. Enter your question, click the Magic 8 Ball, and receive your mystical answer!

## Local Testing

To test the Lambda function locally:

1. Invoke the function directly:
   ```
   sam local invoke Magic8BallFunction
   ```

2. Start a local API:
   ```
   sam local start-api
   ```
   Then, you can send requests to `http://localhost:3000/ask`

## Customization

Modify the `responses` dictionary in `app.py` to customize the Magic 8 Ball's answers. Add, remove, or modify responses in each category as desired.

## Troubleshooting

- **CORS Issues**: Ensure CORS is properly configured in the API Gateway as outlined in `template.yaml`.
- **API Not Responding**: Verify that the API Gateway URL in `index.html` is correct and the Lambda function is successfully deployed.
- **Deployment Fails**: Check AWS CloudFormation console for error messages and ensure you have the necessary permissions.

## Cleanup

To remove the application and all associated resources from your AWS account:

```bash
aws cloudformation delete-stack --stack-name magic-8-ball-stack
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For issues, suggestions, or queries, please contact Amir Malaeb at amir.malaeb@gmail.com.
