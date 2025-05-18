import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Basic URL validation (can be improved)
    if (!url.startsWith('https://www.fiverr.com/')) {
      return NextResponse.json({ error: 'Invalid Fiverr URL' }, { status: 400 });
    }

    // Placeholder for actual scraping logic
    console.log(`Received URL to scrape: ${url}`);

    // Simulate scraping delay and success
    await new Promise(resolve => setTimeout(resolve, 1000));

    const scrapedData = {
      message: `Successfully received URL: ${url}. Actual scraping not yet implemented.`,
      gigTitle: 'Placeholder Title from API',
      sellerName: 'Placeholder Seller from API',
      price: 'Placeholder Price from API',
      // Add more fields as scraping logic is built
    };

    return NextResponse.json(scrapedData, { status: 200 });

  } catch (error) {
    console.error('[API SCRAPE ERROR]', error);
    let errorMessage = 'Internal Server Error';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
} 