import fetch from "node-fetch";

// Service to fetch full article content from external URLs
export const fetchFullArticleContent = async (articleUrl) => {
  try {
    // First, try using Puppeteer for JavaScript-heavy sites
    const puppeteer = await import('puppeteer');
    
    // Launch a headless browser
    const browser = await puppeteer.default.launch({
      headless: 'new', // Use the newer headless mode
      args: [
        '--no-sandbox', 
        '--disable-setuid-sandbox', 
        '--disable-dev-shm-usage',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu'
      ]
    });
    
    const page = await browser.newPage();
    
    // Set a more realistic user agent
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    // Set extra HTTP headers to appear more like a real browser
    await page.setExtraHTTPHeaders({
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'none',
      'Cache-Control': 'max-age=0'
    });
    
    // Navigate to the page
    await page.goto(articleUrl, { 
      waitUntil: 'domcontentloaded', 
      timeout: 30000 
    });
    
    // Wait a bit for dynamic content to load
    await page.waitForTimeout(2000);
    
    // Extract text content using Puppeteer with enhanced selectors
    const content = await page.evaluate(async () => {
      // Remove unwanted elements
      const elementsToRemove = document.querySelectorAll(
        'script, style, nav, header, footer, aside, .ads, .advertisement, .sidebar, .cookie-banner, .modal-backdrop, .overlay, iframe, noscript'
      );
      elementsToRemove.forEach(el => {
        if (el && el.parentNode) {
          el.parentNode.removeChild(el);
        }
      });
      
      // Look for main content areas with more selectors
      const contentSelectors = [
        'article', '.article-body', '.post-content', '.entry-content',
        '.content', '#content', '.story-body', '.article-content',
        '.main-content', '[data-testid="article-body"]', '.article__body',
        '.story-content', '.article-text', '.post-body', '.entry',
        '.post-area', '.news-content', '.article-content', '.main-article',
        '.article-inner', '.post-inner', '.content-area', '.single-content',
        '.entry-content', '.post-content', '.article-post', '.article-page',
        '.article-section', '.story-content', '.news-story', '.post-wrap'
      ];
      
      let content = '';
      
      // Try to find content with priority on article tags
      for (const selector of contentSelectors) {
        const elements = document.querySelectorAll(selector);
        for (const element of elements) {
          const text = element.textContent.trim();
          // Look for elements with substantial text content
          if (text.length > 200) {
            content = text;
            // Stop if we find a good candidate
            break;
          }
        }
        if (content) break;
      }
      
      // If still no content found, try paragraph tags specifically
      if (!content) {
        const paragraphs = document.querySelectorAll('p');
        if (paragraphs.length > 3) {
          const paraTexts = Array.from(paragraphs)
            .map(p => p.textContent.trim())
            .filter(text => text.length > 10);
          content = paraTexts.join(' ').substring(0, 10000); // Limit to 10k chars
        }
      }
      
      // If still no content, try body with more aggressive cleaning
      if (!content) {
        const body = document.querySelector('body');
        if (body) {
          // Create a copy and remove unwanted elements
          const bodyClone = body.cloneNode(true);
          const unwanted = bodyClone.querySelectorAll('nav, header, footer, aside, script, style, .ads, .advertisement, .sidebar, .cookie-consent, .banner');
          unwanted.forEach(el => {
            if (el && el.parentNode) {
              el.parentNode.removeChild(el);
            }
          });
          content = bodyClone.textContent.trim();
        }
      }
      
      // Clean up content
      if (content) {
        // Remove extra whitespace and clean up
        content = content.replace(/\s+/g, ' ').trim();
        // Remove common boilerplate phrases
        content = content.replace(/Advertisement|Advertise with us|Subscribe to our newsletter/gi, '');
      }
      
      return content || '';
    });
    
    await browser.close();
    
    // Return content if it's substantial
    if (content && content.length > 200) {
      return content;
    }
    // fall through to fetch fallback
  } catch {
    // Puppeteer failed, fall through to fetch fallback
  }
  
  // Fallback to the original fetch method
  try {
    // Dynamically import cheerio
    const { default: cheerio } = await import('cheerio');
    
    // Fetch the HTML content of the article
    const response = await fetch(articleUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Cache-Control': 'max-age=0'
      },
      timeout: 15000, // Increased timeout
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Remove unwanted elements
    $('script, style, nav, header, footer, aside, .ads, .advertisement, .cookie-consent, .banner, iframe, noscript').remove();

    // Try to find the main content area
    let content = '';
    
    // Look for common content selectors
    const contentSelectors = [
      'article', '.article-body', '.post-content', '.entry-content',
      '.content', '#content', '.story-body', '.article-content',
      '.main-content', '[data-testid="article-body"]', '.article__body',
      '.story-content', '.article-text', '.post-body', '.entry',
      '.post-area', '.news-content', '.main-article', '.article-inner',
      '.content-area', '.single-content', '.post-content', '.article-post',
      '.article-section', '.story-content', '.news-story', '.post-wrap'
    ];

    for (const selector of contentSelectors) {
      const element = $(selector);
      if (element.length > 0) {
        const text = element.text().trim();
        if (text.length > 200) { // Increased threshold
          content = text;
          break;
        }
      }
    }

    // If still no content found, try combining paragraph tags
    if (!content) {
      const paragraphs = $('p').toArray();
      if (paragraphs.length > 3) {
        const texts = paragraphs.map(p => $(p).text().trim()).filter(t => t.length > 10);
        content = texts.join(' ').substring(0, 10000); // Limit to 10k chars
      }
    }

    // If no specific content area found, try to extract from body
    if (!content) {
      // Remove common non-content elements
      const body = $('body').clone();
      body.find('nav, header, footer, aside, script, style, .ads, .advertisement, .sidebar, .cookie-consent, .banner').remove();
      content = body.text().trim();
    }

    // Clean up the content
    content = content.replace(/\s+/g, ' ').trim();
    
    // Remove common boilerplate
    content = content.replace(/Advertisement|Advertise with us|Subscribe to our newsletter/gi, '');
    
    // Only return content if it's substantial (more than 200 characters)
    if (content.length >= 200) {
      return content;
    }

    return null;
  } catch {
    return null;
  }
};