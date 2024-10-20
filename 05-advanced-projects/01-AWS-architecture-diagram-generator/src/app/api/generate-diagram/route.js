import { NextResponse } from 'next/server';
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

const client = new BedrockRuntimeClient({ 
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }
});

export async function POST(request) {
  try {
    const { prompt } = await request.json();
    
    const claudePrompt = `
      Based on the following description of an AWS architecture, identify the AWS services mentioned, 
      their relationships, and any specific configurations. Then, output this information in a structured JSON format 
      that can be used to generate a diagram. Here's the description:

      ${prompt}

      Please output your response in the following JSON format:
      {
        "services": [
          {
            "name": "Service Name",
            "type": "AWS Service Type",
            "config": "Any specific configuration details"
          }
        ],
        "relationships": [
          {
            "from": "Service Name 1",
            "to": "Service Name 2",
            "type": "relationship type (e.g., 'connects to', 'sends data to')"
          }
        ]
      }

      After generating the diagram details, also provide best practices and suggestions for optimizing this architecture, 
      including security, scalability, and cost-efficiency improvements based on the services used.
    `;

    console.log("Sending request to Claude with prompt:", claudePrompt);

    const command = new InvokeModelCommand({
      modelId: "anthropic.claude-3-5-sonnet-20240620-v1:0",
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify({
        anthropic_version: "bedrock-2023-05-31",
        max_tokens: 2048,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: claudePrompt
              }
            ]
          }
        ]
      }),
    });

    const response = await client.send(command);
    console.log("Received response from Claude:", JSON.stringify(response, null, 2));

    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    console.log("Parsed response body:", JSON.stringify(responseBody, null, 2));

    const completion = responseBody.content[0].text;
    console.log("Extracted completion:", completion);

    const jsonMatch = completion.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON object found in the completion');
    }

    const parsedArchitecture = JSON.parse(jsonMatch[0]);
    console.log("Parsed architecture:", JSON.stringify(parsedArchitecture, null, 2));
    
    // Extract best practices and suggestions from the response body
    const bestPracticesMatch = completion.split('Best practices and suggestions for optimizing this architecture:')[1]?.trim() || 'No suggestions available';
    
    // Generate Mermaid diagram
    let mermaidCode = "graph TD;\n";
    parsedArchitecture.services.forEach((service, index) => {
      const nodeId = `node${index}`;
      mermaidCode += `${nodeId}["${service.type}: ${service.name}"];\n`;
    });
    parsedArchitecture.relationships.forEach((rel) => {
      const fromIndex = parsedArchitecture.services.findIndex(s => s.name === rel.from);
      const toIndex = parsedArchitecture.services.findIndex(s => s.name === rel.to);
      mermaidCode += `node${fromIndex} -->|${rel.type}| node${toIndex};\n`;
    });

    console.log("Generated Mermaid code:", mermaidCode);

    // Return both the diagram and best practices in the response
    return NextResponse.json({ 
      mermaidCode: mermaidCode,
      architecture: parsedArchitecture,
      diagramTitle: `AWS Architecture Diagram - ${new Date().toISOString().split('T')[0]}`,
      bestPractices: bestPracticesMatch
    });
  } catch (error) {
    console.error('Detailed error in generate-diagram:', error);
    return NextResponse.json({ error: `Failed to generate diagram: ${error.message}` }, { status: 500 });
  }
}