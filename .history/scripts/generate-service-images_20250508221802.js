// Add dotenv configuration to load environment variables from .env file
require('dotenv').config();

const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Configuration for image generation
const STABILITY_AI_API = process.env.STABILITY_AI_API; // Correct environment variable name
const STABILITY_API_URL = 'https://api.stability.ai/v1/generation/stable-diffusion-xl-1.0/text-to-image';

// Project image definitions
const projectImages = [
  // Web Development Projects
  {
    prompt: "Professional e-commerce platform UI showing product catalog with payment gateway integration, dark sleek interface with shopping cart and inventory management dashboard, digital art style",
    outputPath: 'public/images/services/web-development/ecommerce-platform.png',
    serviceName: 'Web Development',
    projectName: 'E-commerce Platform',
    projectId: 'ecommerce-platform'
  },
  {
    prompt: "Corporate web portal interface with document management system, secure login, and collaboration tools, professional dark theme UI with document library and team workspace, digital art style",
    outputPath: 'public/images/services/web-development/corporate-portal.png',
    serviceName: 'Web Development',
    projectName: 'Corporate Web Portal',
    projectId: 'corporate-portal'
  },
  {
    prompt: "Progressive web app interface showing offline functionality and real-time data sync status, responsive design across devices with synchronized data visualization, digital art style",
    outputPath: 'public/images/services/web-development/progressive-app.png',
    serviceName: 'Web Development',
    projectName: 'Progressive Web App',
    projectId: 'progressive-app'
  },
  
  // Software Development Projects
  {
    prompt: "Cryptocurrency trading platform dashboard with real-time charts, market data, and advanced order types, dark sophisticated UI with crypto price graphs and trading interface, digital art style",
    outputPath: 'public/images/services/software-development/crypto-trading.png',
    serviceName: 'Software Development',
    projectName: 'Crypto Trading Platform',
    projectId: 'crypto-trading'
  },
  {
    prompt: "Smart contract audit tool interface showing code analysis and security validation across multiple blockchain networks, technical UI with code scanning results and vulnerability detection, digital art style",
    outputPath: 'public/images/services/software-development/smart-contract-audit.png',
    serviceName: 'Software Development',
    projectName: 'Smart Contract Audit Tool',
    projectId: 'smart-contract-audit'
  },
  {
    prompt: "AI-powered analytics dashboard with machine learning insights and business intelligence trend predictions, futuristic data visualization with predictive graphs and actionable insights, digital art style",
    outputPath: 'public/images/services/software-development/ai-analytics.png',
    serviceName: 'Software Development',
    projectName: 'AI-Powered Analytics Dashboard',
    projectId: 'ai-analytics'
  },
  
  // Content Copywriting Projects
  {
    prompt: "Professional tech industry whitepaper page layout with blockchain technology analysis, executive summary of complex technical concepts with elegant typography and branded elements, digital art style",
    outputPath: 'public/images/services/content-copywriting/tech-whitepaper.png',
    serviceName: 'Content Copywriting',
    projectName: 'Tech Industry Whitepaper',
    projectId: 'tech-whitepaper'
  },
  {
    prompt: "Luxury e-commerce product descriptions with compelling copy, premium product presentation with persuasive text layout and high-end visuals, digital art style",
    outputPath: 'public/images/services/content-copywriting/product-descriptions.png',
    serviceName: 'Content Copywriting',
    projectName: 'E-commerce Product Descriptions',
    projectId: 'product-descriptions'
  },
  {
    prompt: "Finance blog series layout with educational articles on personal finance, professional financial content with engaging visuals and structured information hierarchy, digital art style",
    outputPath: 'public/images/services/content-copywriting/finance-blog.png',
    serviceName: 'Content Copywriting',
    projectName: 'Finance Blog Series',
    projectId: 'finance-blog'
  }
];

// Function to ensure directory exists
function ensureDirectoryExists(filePath) {
  const dirname = path.dirname(filePath);
  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname, { recursive: true });
  }
}

// Function to generate an image using Stability AI
async function generateImage(prompt, outputPath) {
  if (!STABILITY_AI_API) {
    console.error('STABILITY_AI_API is not set. Please set it in your environment variables.');
    return false;
  }

  // Check if the image already exists
  if (fs.existsSync(outputPath)) {
    console.log(`Image already exists at ${outputPath}, skipping generation.`);
    return true;
  }

  try {
    console.log(`Generating image for: ${prompt}`);
    
    const response = await axios.post(
      STABILITY_API_URL,
      {
        text_prompts: [
          {
            text: prompt,
            weight: 1
          }
        ],
        cfg_scale: 7,
        height: 512,
        width: 768,
        samples: 1,
        steps: 30
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${STABILITY_AI_API}`
        },
        responseType: 'arraybuffer'
      }
    );

    // Ensure the directory exists
    ensureDirectoryExists(outputPath);

    // Save the image
    fs.writeFileSync(outputPath, response.data);
    console.log(`Image saved to ${outputPath}`);
    return true;
  } catch (error) {
    console.error(`Error generating image: ${error.message}`);
    if (error.response) {
      console.error(`Status code: ${error.response.status}`);
      console.error(`Response data: ${error.response.data.toString()}`);
    }
    return false;
  }
}

// Main function to generate all images
async function generateAllImages() {
  console.log('Starting image generation process...');
  
  for (const imgConfig of projectImages) {
    console.log(`\nProcessing: ${imgConfig.serviceName} - ${imgConfig.projectName}`);
    await generateImage(imgConfig.prompt, imgConfig.outputPath);
  }
  
  console.log('\nImage generation process completed!');
}

// Run the script
generateAllImages().catch(error => {
  console.error('An error occurred during image generation:', error);
}); 