import axios from 'axios';
import * as cheerio from 'cheerio';

export async function scrapeBlogContent(url: string): Promise<{ title: string; content: string }> {
  try {
    // Fetch the HTML content from the URL
    const response = await axios.get(url);
    const html = response.data;
    
    // Load the HTML into cheerio
    const $ = cheerio.load(html);
    
    // Extract the title (try different common selectors)
    let title = $('title').text().trim() || 
                $('h1').first().text().trim() || 
                $('h2').first().text().trim() || 
                'Untitled Blog';
    
    // Remove unnecessary parts from title
    title = title.split('|')[0].trim(); // Remove site name often separated by |
    title = title.split('-')[0].trim(); // Remove site name often separated by -
    
    // Extract the content
    // We'll focus on the main content areas where blog text typically appears
    let content = '';
    
    // Remove unwanted elements first
    $('script, style, nav, header, footer, .sidebar, .comments, .related-posts, .social-share, .advertisement, .ads, .popup, .modal, .cookie-notice, .newsletter-signup').remove();
    
    // Common content selectors (in order of preference)
    const contentSelectors = [
      'article .content',
      'article .post-content', 
      'article .entry-content',
      '.main-content article',
      'article',
      '.post-content', 
      '.entry-content', 
      '.content', 
      '.post', 
      'main article',
      'main .content',
      'main',
      '#content article',
      '#content', 
      '.blog-content', 
      '.article-content',
      '.blog-post', 
      '.blog-entry', 
      '.post-body',
      '[role="main"]'
    ];
    
    // Try each selector until we find substantial content
    for (const selector of contentSelectors) {
      const element = $(selector);
      if (element.length > 0) {
        // Clone and clean the element
        const cleanElement = element.clone();
        
        // Remove more noise elements
        cleanElement.find('script, style, nav, header, footer, .sidebar, .comments, .related-posts, .social-share, .advertisement, .ads, .share-buttons, .author-bio, .tags, .categories, .breadcrumb, .pagination, .newsletter, .subscription, .popup, .modal, .cookie, .banner, aside, .aside').remove();
        
        // Remove elements with certain classes that indicate non-content
        cleanElement.find('[class*="share"], [class*="social"], [class*="comment"], [class*="related"], [class*="sidebar"], [class*="widget"], [class*="ad"], [class*="banner"], [class*="popup"], [class*="modal"], [class*="newsletter"], [class*="subscription"]').remove();
        
        const text = cleanElement.text().trim();
        if (text.length > 300) { // Only use if we got substantial content
          content = text;
          break;
        }
      }
    }
    
    // If no content found with specific selectors, try getting clean body text
    if (!content || content.length < 300) {
      const bodyClone = $('body').clone();
      bodyClone.find('script, style, nav, header, footer, .sidebar, .comments, .related-posts, .social-share, .advertisement, .ads, .share-buttons, .author-bio, .tags, .categories, .breadcrumb, .pagination, .newsletter, .subscription, .popup, .modal, .cookie, .banner, aside, .aside, [class*="share"], [class*="social"], [class*="comment"], [class*="related"], [class*="sidebar"], [class*="widget"], [class*="ad"], [class*="banner"], [class*="popup"], [class*="modal"], [class*="newsletter"], [class*="subscription"]').remove();
      content = bodyClone.text().trim();
      
      // Clean up the content
      content = content.replace(/\s+/g, ' '); // Replace multiple spaces with a single space
    }
    
    // Final content cleaning
    if (content) {
      // Remove common website footer/header text
      content = content
        .replace(/Terms of Service|Privacy Policy|Cookie Policy/gi, '')
        .replace(/©.*?\d{4}.*?(All rights reserved|Inc\.|LLC)/gi, '')
        .replace(/Follow us on|Subscribe to|Newsletter|Email signup/gi, '')
        .replace(/Home\s+About\s+Contact/gi, '')
        .replace(/\s+/g, ' ')
        .trim();
    }
    
    return { title, content };
  } catch (error) {
    console.error('Error scraping blog content:', error);
    throw new Error('Failed to scrape blog content. Please check the URL and try again.');
  }
}
