import * as cheerio from 'cheerio';

export async function fetchJobDescription(url: string): Promise<string> {
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch job description: ${response.statusText}`);
    }
    
    const html = await response.text();
    const $ = cheerio.load(html);
    
    // Remove script and style elements
    $('script, style, nav, header, footer').remove();
    
    // Extract text content
    const text = $('body').text();
    
    // Clean up whitespace
    const cleanedText = text
      .replace(/\s+/g, ' ')
      .trim();
    
    if (!cleanedText || cleanedText.length < 50) {
      throw new Error('Could not extract meaningful content from the URL');
    }
    
    return cleanedText;
  } catch (error) {
    console.error('Error fetching job description:', error);
    throw new Error(`Failed to fetch job description from URL: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
