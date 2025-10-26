import * as cheerio from 'cheerio';

// Validate URL to prevent SSRF attacks
function isValidJobUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    
    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return false;
    }
    
    // Prevent localhost and private IP ranges
    const hostname = parsed.hostname.toLowerCase();
    const privatePatterns = [
      /^localhost$/i,
      /^127\./,
      /^10\./,
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
      /^192\.168\./,
      /^169\.254\./,
      /^::1$/,
      /^fc00:/,
      /^fe80:/,
    ];
    
    if (privatePatterns.some(pattern => pattern.test(hostname))) {
      return false;
    }
    
    return true;
  } catch {
    return false;
  }
}

export async function fetchJobDescription(url: string): Promise<string> {
  // Validate URL to prevent SSRF
  if (!isValidJobUrl(url)) {
    throw new Error('Invalid or unsafe URL. Please provide a valid public job posting URL.');
  }

  try {
    // Create abort controller for timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; ResumeAnalyzer/1.0)',
      },
    });
    
    clearTimeout(timeout);
    
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
      throw new Error('Could not extract meaningful content from the URL. Please ensure the URL contains a job description.');
    }
    
    // Limit content length to prevent excessive API costs
    return cleanedText.slice(0, 10000);
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout. The job description URL took too long to respond.');
      }
      throw error;
    }
    throw new Error('Failed to fetch job description from URL');
  }
}
