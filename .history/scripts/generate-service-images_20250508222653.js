// Add dotenv configuration to load environment variables from .env file
require('dotenv').config();

const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Configuration for image generation
const STABILITY_AI_API = process.env.STABILITY_AI_API; // Correct environment variable name
const STABILITY_API_URL = 'https://api.stability.ai/v1/generation/stable-diffusion-v1-6/text-to-image';

// Project image definitions
const projectImages = [
  // Web Development Projects
  {
    prompt: "Realistic professional e-commerce platform UI with dark theme, showing product catalog with high-quality product images, shopping cart, checkout flow, payment gateway integration, inventory management dashboard with sales metrics and graphs, photorealistic rendering",
    outputPath: 'public/images/services/web-development/ecommerce-platform.png',
    serviceName: 'Web Development',
    projectName: 'E-commerce Platform',
    projectId: 'ecommerce-platform'
  },
  {
    prompt: "Realistic corporate web portal interface with secure login screen, document management system with file browser, team collaboration tools, notification center, and user profiles, dark professional theme with blue accents, photorealistic rendering",
    outputPath: 'public/images/services/web-development/corporate-portal.png',
    serviceName: 'Web Development',
    projectName: 'Corporate Web Portal',
    projectId: 'corporate-portal'
  },
  {
    prompt: "Realistic progressive web app interface showing multiple device screens (smartphone, tablet, laptop) with offline functionality indicators, data synchronization status bars, responsive design elements that adapt to different screen sizes, photorealistic rendering",
    outputPath: 'public/images/services/web-development/progressive-app.png',
    serviceName: 'Web Development',
    projectName: 'Progressive Web App',
    projectId: 'progressive-app'
  },
  
  // Software Development Projects
  {
    prompt: "Realistic cryptocurrency trading platform dashboard with dark theme, multiple real-time price charts and candlestick graphs, order book display, trading pair selection, advanced order type controls, live market data ticker, wallet balance overview, photorealistic rendering",
    outputPath: 'public/images/services/software-development/crypto-trading.png',
    serviceName: 'Software Development',
    projectName: 'Crypto Trading Platform',
    projectId: 'crypto-trading'
  },
  {
    prompt: "Realistic smart contract audit tool interface showing code analysis panel with highlighted vulnerabilities, security validation across multiple blockchain networks, technical metrics dashboard, risk assessment report, detailed code scanning results with severity levels, photorealistic rendering",
    outputPath: 'public/images/services/software-development/smart-contract-audit.png',
    serviceName: 'Software Development',
    projectName: 'Smart Contract Audit Tool',
    projectId: 'smart-contract-audit'
  },
  {
    prompt: "Realistic AI-powered analytics dashboard with machine learning insights, data visualization panels showing predictive trends with colorful graphs, business intelligence metrics, actionable insight recommendations highlighted in a sidebar, real-time data processing indicators, photorealistic rendering",
    outputPath: 'public/images/services/software-development/ai-analytics.png',
    serviceName: 'Software Development',
    projectName: 'AI-Powered Analytics Dashboard',
    projectId: 'ai-analytics'
  },
  
  // Content Copywriting Projects
  {
    prompt: "Realistic tech industry whitepaper page layout with blockchain technology analysis, executive summary section with elegant typography, professional document design with branded elements, data visualization charts, technical diagrams explaining complex concepts, table of contents, photorealistic rendering",
    outputPath: 'public/images/services/content-copywriting/tech-whitepaper.png',
    serviceName: 'Content Copywriting',
    projectName: 'Tech Industry Whitepaper',
    projectId: 'tech-whitepaper'
  },
  {
    prompt: "Realistic luxury e-commerce product description page layout showing premium product presentation with professional photography, compelling marketing copy with elegant typography, persuasive text layout highlighting features and benefits, price and purchase options, customer reviews section, photorealistic rendering",
    outputPath: 'public/images/services/content-copywriting/product-descriptions.png',
    serviceName: 'Content Copywriting',
    projectName: 'E-commerce Product Descriptions',
    projectId: 'product-descriptions'
  },
  {
    prompt: "Realistic finance blog series webpage layout showing educational articles on personal finance, professional financial content with clear section headings, engaging visuals including charts and infographics, newsletter signup form, featured posts sidebar, structured information hierarchy, photorealistic rendering",
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
        cfg_scale: 12,
        height: 512,
        width: 768,
        samples: 1,
        steps: 40,
        style_preset: "photographic"
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