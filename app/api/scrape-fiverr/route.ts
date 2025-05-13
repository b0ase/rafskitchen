import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';

// Determine the correct path to the Python script
// This might need adjustment based on your final project structure and Vercel deployment
const isDevelopment = process.env.NODE_ENV === 'development';
// In development, scripts might be relative to project root
// In production (Vercel), they might be in the compiled output, often at the root or a specific dir.
// For Vercel, files included in the deployment need to be accessible.
// A common pattern is to place scripts in a top-level 'scripts' or 'lib/python' directory.
const scriptPath = isDevelopment 
    ? path.join(process.cwd(), 'scripts', 'fiverr_category_scraper.py') 
    : path.join(process.cwd(), 'scripts', 'fiverr_category_scraper.py'); // Adjust if Vercel places it differently

// Ensure Python executable is found. 'python3' is common.
// On Vercel, you might need to specify Python runtime in vercel.json
const pythonExecutable = 'python3'; 

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { targetUrl } = body; // targetUrl can be undefined for initial category fetch

    const scraperApiKey = process.env.SCRAPER_API_KEY;

    if (!scraperApiKey) {
      console.error('ScraperAPI key is not set in environment variables.');
      return NextResponse.json({ error: 'Server configuration error: ScraperAPI key missing' }, { status: 500 });
    }

    // Arguments for the Python script
    const scriptArgs: string[] = ['--api_key', scraperApiKey];
    if (targetUrl) {
      scriptArgs.push('--url', targetUrl);
    }

    return new Promise((resolve, reject) => {
      const pythonProcess = spawn(pythonExecutable, [scriptPath, ...scriptArgs]);

      let stdoutData = '';
      let stderrData = '';

      pythonProcess.stdout.on('data', (data) => {
        stdoutData += data.toString();
      });

      pythonProcess.stderr.on('data', (data) => {
        stderrData += data.toString();
      });

      pythonProcess.on('close', (code) => {
        if (code === 0) {
          try {
            const jsonData = JSON.parse(stdoutData);
            resolve(NextResponse.json(jsonData));
          } catch (parseError) {
            console.error('JSON Parse Error:', parseError, 'Raw stdout:', stdoutData);
            // Return the raw output if JSON parsing fails, as it might contain useful debug info
            reject(NextResponse.json({ error: 'Failed to parse Python script output', details: stdoutData }, { status: 500 }));
          }
        } else {
          console.error(`Python script exited with code ${code}: ${stderrData}`);
          reject(NextResponse.json({ error: 'Python script execution failed', details: stderrData, exitCode: code }, { status: 500 }));
        }
      });

      pythonProcess.on('error', (err) => {
        console.error('Failed to start Python script:', err);
        reject(NextResponse.json({ error: 'Failed to start Python script', details: err.message }, { status: 500 }));
      });
    });

  } catch (error: any) {
    console.error('API Route Error:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
} 