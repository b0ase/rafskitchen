import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    if (!url.startsWith('https://www.fiverr.com/')) {
      return NextResponse.json({ error: 'Invalid Fiverr URL' }, { status: 400 });
    }

    console.log(`Attempting to scrape URL: ${url}`);

    // Fetch HTML content from Fiverr
    const { data: html } = await axios.get(url, {
      headers: {
        // Mimic a browser user agent to reduce chances of being blocked
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
      }
    });

    const $ = cheerio.load(html);

    // Attempt to extract data - selectors might need adjustment!
    // These are educated guesses and likely need refinement based on Fiverr's current HTML structure.

    let gigTitle = $('h1[data-impression-id="main_title"]').first().text().trim();
    if (!gigTitle) {
        // Fallback selector for title (common on product pages)
        gigTitle = $('.gig-title h1').first().text().trim(); 
    }
    if (!gigTitle) {
        // A more generic h1, hoping it's the main one.
        gigTitle = $('h1').first().text().trim(); 
    }

    let sellerName = $('a[data-impression-id="seller_username"] span').first().text().trim();
    if (!sellerName) {
        // Fallback for seller name
        sellerName = $('.seller-name a span').first().text().trim();
    }
     if (!sellerName) {
        // Another common pattern for usernames in links
        sellerName = $('a[href*="/users/"]').find('span').first().text().trim();
    }


    // Price can be very tricky as it often involves complex structures or dynamic loading.
    // This looks for a common structure for package prices.
    let price = $('h2[data-impression-id="package_price"]').first().text().trim();
    if (!price) {
        // Fallback selector for price (often in a prominent display)
        price = $('.price span.money-symbol').first().next().text().trim();
        const currencySymbol = $('.price span.money-symbol').first().text().trim();
        if (price && currencySymbol) price = currencySymbol + price;
    }
    if (!price) {
        // More generic price class
        price = $('.price').first().text().trim();
    }

    // Add more fields as needed, e.g., reviews, rating, description
    // Example for description (often in a specific div)
    let description = $('div[data-impression-id="description"] .description-content').html() || '';
    if (!description) {
        description = $('.gig-description').html() || '';
    }

    const scrapedData = {
      requestedUrl: url,
      gigTitle: gigTitle || 'Title not found',
      sellerName: sellerName || 'Seller not found',
      price: price || 'Price not found',
      description: description.replace(/<br\s*\/?>/gi, '\n').trim() || 'Description not found',
      // Add more fields here
    };

    console.log('Scraped Data:', scrapedData);
    return NextResponse.json(scrapedData, { status: 200 });

  } catch (error: any) {
    console.error('[API SCRAPE ERROR]', error.message, error.stack);
    let errorMessage = 'Failed to scrape the Fiverr page. The structure might have changed or the page is protected.';
    if (axios.isAxiosError(error) && error.response) {
        console.error('Axios error details:', error.response.status, error.response.data);
        errorMessage = `Failed to fetch the Fiverr page. Status: ${error.response.status}`;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ error: errorMessage, details: error.stack }, { status: 500 });
  }
} 