# AWS Architecture Diagram Generator

## Description
This project demonstrates how to create an AI-powered AWS architecture diagram generator using Next.js, React, and Amazon Bedrock with Claude 3.5 Sonnet. The application allows users to input a text description of their AWS architecture and generates a visual diagram along with best practice suggestions.

## 🌟 Features

- AI-powered diagram generation from text descriptions
- Interactive diagram with zoom functionality
- Multiple download formats (SVG, JPEG, PDF)
- AWS best practices suggestions

## 🛠️ Tech Stack

- Frontend: React, Next.js, Tailwind CSS
- Backend: Node.js (Next.js API routes)
- AI: Claude 3.5 Sonnet via Amazon Bedrock
- Diagram rendering: Mermaid.js

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)
- An AWS account with access to Amazon Bedrock
- Access to Claude 3.5 Sonnet model on Amazon Bedrock
  - Ensure your AWS account has been granted access to the Claude 3.5 Sonnet model
  - You may need to request access through the AWS console if you haven't already

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/AmirMalaeb/aws-diagram-generator.git
   cd aws-diagram-generator
   ```

2. Install dependencies:
   ```
   npm install
   ```

   This will install the following main dependencies:
   - next
   - react
   - react-dom
   - tailwindcss
   - @radix-ui/react-slot
   - lucide-react
   - mermaid
   - html2canvas
   - jspdf
   - @aws-sdk/client-bedrock-runtime

   And dev dependencies:
   - postcss
   - autoprefixer

3. Create a `.env.local` file in the root directory and add your AWS credentials:
   ```
   AWS_REGION=your_aws_region
   AWS_ACCESS_KEY_ID=your_access_key
   AWS_SECRET_ACCESS_KEY=your_secret_key
   ```

   Make sure these credentials have the necessary permissions to access Amazon Bedrock and the Claude 3.5 Sonnet model.

4. (Optional) If you want to manually install or update specific dependencies, you can use:
   ```
   npm install next react react-dom tailwindcss @radix-ui/react-slot lucide-react mermaid html2canvas jspdf @aws-sdk/client-bedrock-runtime
   npm install -D postcss autoprefixer
   ```

### Running the Application

1. Start the development server:
   ```
   npm run dev
   ```

2. Open your browser and navigate to `http://localhost:3000`

## 📖 How to Use

1. Enter a description of your AWS architecture in the text area.
2. Click the "Generate Diagram" button.
3. View the generated diagram and best practices suggestions.
4. Use the zoom controls to adjust the diagram view.
5. Download the diagram in your preferred format (SVG, JPEG, or PDF).

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check [issues page](https://github.com/AmirMalaeb/aws-diagram-generator/issues).

## 📝 License

This project is [MIT](https://choosealicense.com/licenses/mit/) licensed.

## 🙏 Acknowledgements

- [Amazon Web Services](https://aws.amazon.com/)
- [Anthropic's Claude AI](https://www.anthropic.com/)
- [Mermaid.js](https://mermaid-js.github.io/mermaid/#/)
