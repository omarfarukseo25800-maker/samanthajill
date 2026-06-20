/**
 * Affordable Housing Scraper - Google Apps Script
 * Scrapes pages 1-8 every 6 hours with 20-minute breaks between pages
 * Tracks new properties and last update time
 */

// Configuration
const SHEET_NAME = "Affordable Housing";
const SPREADSHEET_ID = "YOUR_SPREADSHEET_ID"; // Replace with your Sheet ID
const SCRAPE_URLS = [
    "https://www.affordablehousing.com/atlanta-ga/house/",
    "https://www.affordablehousing.com/atlanta-ga/house/page-2/",
    "https://www.affordablehousing.com/atlanta-ga/house/page-3/",
    "https://www.affordablehousing.com/atlanta-ga/house/page-4/",
    "https://www.affordablehousing.com/atlanta-ga/house/page-5/",
    "https://www.affordablehousing.com/atlanta-ga/house/page-6/",
    "https://www.affordablehousing.com/atlanta-ga/house/page-7/",
    "https://www.affordablehousing.com/atlanta-ga/house/page-8/"
];

const BREAK_BETWEEN_PAGES = 20 * 60 * 1000; // 20 minutes in milliseconds
const NEW_PROPERTY_COLOR = "#90EE90"; // Light green for new properties

/**
 * Main function - starts the scraping process
 * Due to Google Apps Script execution limits:
 * - Each page scrapes independently (no long waits)
 * - Use time-based triggers to run every hour instead of 20-min waits
 */
function startAutoScrape() {
    Logger.log("Starting automated scrape at " + new Date());
    
    try {
        // Initialize sheet if needed
        initializeSheet();
        
        // Scrape ONE page per execution (due to timeout limits)
        // The page number is determined by a stored property
        scrapeNextPage();
        
        Logger.log("Scrape execution completed at " + new Date());
    } catch (error) {
        Logger.log("Scrape failed: " + error);
        logError(error);
    }
}

/**
 * Scrape the next page in sequence
 */
function scrapeNextPage() {
    const scriptProperties = PropertiesService.getScriptProperties();
    let currentPage = parseInt(scriptProperties.getProperty("currentPage") || "0");
    
    // Cycle through pages 0-7 (pages 1-8 in UI)
    currentPage = currentPage % SCRAPE_URLS.length;
    
    const url = SCRAPE_URLS[currentPage];
    Logger.log(`Scraping page ${currentPage + 1} of ${SCRAPE_URLS.length}: ${url}`);
    
    try {
        scrapeAndStorePage(url, currentPage + 1);
    } catch (error) {
        Logger.log(`Error scraping page ${currentPage + 1}: ${error}`);
        logError(`Page ${currentPage + 1} error: ${error}`);
    }
    
    // Move to next page for next execution
    scriptProperties.setProperty("currentPage", String(currentPage + 1));
}

/**
 * Initialize the Google Sheet with headers
 */
function initializeSheet() {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = ss.getSheetByName(SHEET_NAME);
    
    // Create sheet if it doesn't exist
    if (!sheet) {
        sheet = ss.insertSheet(SHEET_NAME);
    }
    
    // Get the first row to check if headers exist
    // Use at least 13 columns (or max available) to avoid range errors
    const lastCol = Math.max(sheet.getLastColumn(), 1);
    const firstRow = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
    
    // If headers don't exist, create them
    if (!firstRow || !firstRow[0] || firstRow[0] !== "Address") {
        const headers = [
            "Address",           // Column A
            "Price",             // Column B
            "Bedrooms",          // Column C
            "Bathrooms",         // Column D
            "Square Feet",       // Column E
            "Property Type",     // Column F
            "Phone",             // Column G
            "Listing URL",       // Column H
            "Image URL",         // Column I
            "Description",       // Column J
            "Last Updated",      // Column K
            "Is New",            // Column L
            "Listing ID"         // Column M (hidden, for duplicate detection)
        ];
        
        sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
        
        // Format header row
        const headerRange = sheet.getRange(1, 1, 1, headers.length);
        headerRange.setBackground("#4472C4");
        headerRange.setFontColor("#FFFFFF");
        headerRange.setFontWeight("bold");
    }
}

/**
 * Scrape a single page and store results
 */
function scrapeAndStorePage(url, pageNumber) {
    Logger.log(`Fetching page ${pageNumber}: ${url}`);
    
    try {
        // Fetch the page with better headers to mimic a real browser
        const options = {
            muteHttpExceptions: true,
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
                "Accept-Language": "en-US,en;q=0.5",
                "Accept-Encoding": "gzip, deflate",
                "Connection": "keep-alive",
                "Upgrade-Insecure-Requests": "1"
            },
            followRedirects: true
        };
        
        const response = UrlFetchApp.fetch(url, options);
        const code = response.getResponseCode();
        
        Logger.log(`Response code: ${code}`);
        
        if (code !== 200) {
            throw new Error(`HTTP ${code}`);
        }
        
        const html = response.getContentText();
        
        // Debug: log first 2000 chars to see what we're getting
        Logger.log(`HTML length: ${html.length}`);
        if (html.length < 1000) {
            Logger.log(`WARNING: Very short HTML response. First 500 chars: ${html.substring(0, 500)}`);
        }
        
        // Check if we're getting the right page structure
        if (html.includes("premiumcard")) {
            Logger.log("✓ Found premiumcard elements in HTML");
        } else {
            Logger.log("✗ No premiumcard elements found - website structure may have changed");
        }
        
        if (html.includes("tnresult--propertyaddress")) {
            Logger.log("✓ Found tnresult--propertyaddress elements in HTML");
        } else {
            Logger.log("✗ No tnresult--propertyaddress elements found");
        }
        
        const properties = parsePropertiesFromHTML(html);
        
        Logger.log(`Found ${properties.length} properties on page ${pageNumber}`);
        
        // For each property, fetch its detail page and extract complete information
        const completeProperties = [];
        for (const property of properties) {
            if (property.listing_url) {
                Logger.log(`Fetching detail page for: ${property.address}`);
                const detailedProperty = fetchPropertyDetails(property);
                if (detailedProperty) {
                    completeProperties.push(detailedProperty);
                }
                // Add small delay between requests to avoid rate limiting
                Utilities.sleep(500);
            } else {
                Logger.log(`Skipping ${property.address} - no valid listing URL`);
            }
        }
        
        // Store properties in sheet
        if (completeProperties.length > 0) {
            storePropertiesInSheet(completeProperties);
        } else {
            Logger.log(`No complete properties scraped from page ${pageNumber}`);
        }
        
    } catch (error) {
        Logger.log(`Error fetching page ${pageNumber}: ${error}`);
        logError(`Page ${pageNumber}: ${error}`);
    }
}

/**
 * Parse properties from HTML content - Extract listing URLs first
 */
function parsePropertiesFromHTML(html) {
    const properties = [];
    const propertiesWithoutUrls = [];
    
    try {
        if (!html || html.length === 0) {
            Logger.log("Empty HTML content");
            return properties;
        }
        
        // Extract listing cards with their URLs
        const cardPattern = /<div[^>]*class='premiumcard[^>]*>([\s\S]*?)(?=<div[^>]*class='premiumcard|$)/g;
        let match;
        let cardCount = 0;
        
        while ((match = cardPattern.exec(html)) !== null) {
            cardCount++;
            const cardHtml = match[1];
            const property = parsePropertyCard(cardHtml);
            
            if (property && property.address) {
                if (property.listing_url) {
                    properties.push(property);
                } else {
                    propertiesWithoutUrls.push(property.address);
                }
            }
        }
        
        Logger.log(`Parsed ${cardCount} cards, found ${properties.length} with valid URLs, ${propertiesWithoutUrls.length} without URLs`);
        
        // Log first few addresses without URLs for debugging
        if (propertiesWithoutUrls.length > 0) {
            Logger.log(`⚠ Sample addresses without URLs (first 5): ${propertiesWithoutUrls.slice(0, 5).join(', ')}`);
        }
        
        return properties;
    } catch (error) {
        Logger.log("Error parsing HTML: " + error);
        return [];
    }
}

/**
 * Parse a single property card - Extract basic info and listing URL
 */
function parsePropertyCard(cardHtml) {
    try {
        const property = {};
        
        // Extract address - using single quotes
        const addressMatch = cardHtml.match(/class='tnresult--propertyaddress'[^>]*>([^<]+)/);
        if (!addressMatch || !addressMatch[1]) {
            return null;
        }
        property.address = addressMatch[1].trim();
        
        // Generate listing ID from address (for duplicate detection)
        property.listing_id = generateHash(property.address);
        
        // Extract listing URL - try multiple approaches
        let urlMatch = null;
        
        // Try data-href attribute first
        urlMatch = cardHtml.match(/data-href=['"]([^'"]+)['"]/);
        
        // Try onclick handler (common in dynamic sites)
        if (!urlMatch) {
            urlMatch = cardHtml.match(/onclick=['"](?:window\.)?location[.\s]*=\s*['"]([^'"]+)['"]/);
        }
        
        // Try direct href in anchor tag
        if (!urlMatch) {
            urlMatch = cardHtml.match(/<a[^>]*href=['"]([^'"]+)['"]/);
        }
        
        // Try data attribute with property URL
        if (!urlMatch) {
            urlMatch = cardHtml.match(/data-property-url=['"]([^'"]+)['"]/);
        }
        
        // Try data-link
        if (!urlMatch) {
            urlMatch = cardHtml.match(/data-link=['"]([^'"]+)['"]/);
        }
        
        // Try any href= pattern more broadly
        if (!urlMatch) {
            urlMatch = cardHtml.match(/href\s*=\s*['"]([^'"]+)['"]/);
        }
        
        // Try to find URL in onclick with different syntax
        if (!urlMatch) {
            urlMatch = cardHtml.match(/(?:go|navigate|goto)To\(['"]([^'"]+)['"]/i);
        }
        
        // Last resort: find any valid-looking URL
        if (!urlMatch) {
            const urlPatternMatch = cardHtml.match(/(?:https?:\/\/|\/)[^\s'"<>]+(?:\.html|\/)/);
            if (urlPatternMatch) {
                urlMatch = [null, urlPatternMatch[0]];
            }
        }
        
        if (urlMatch && urlMatch[1]) {
            let listingUrl = urlMatch[1];
            // Ensure it's a proper URL and not javascript
            if (listingUrl && !listingUrl.includes('javascript:') && listingUrl.length > 10) {
                if (!listingUrl.startsWith("http")) {
                    // Make sure the relative URL doesn't already have domain
                    if (listingUrl.startsWith("/")) {
                        listingUrl = "https://www.affordablehousing.com" + listingUrl;
                    } else {
                        listingUrl = "https://www.affordablehousing.com/" + listingUrl;
                    }
                }
                property.listing_url = listingUrl;
            } else {
                property.listing_url = null;
            }
        } else {
            property.listing_url = null;
        }
        
        // Other fields will be populated when we fetch the detail page
        property.price = null;
        property.bedrooms = null;
        property.bathrooms = null;
        property.square_feet = null;
        property.property_type = null;
        property.phone = null;
        property.image_url = null;
        property.description = null;
        property.city = "Atlanta";
        property.state = "GA";
        property.last_updated = new Date().toLocaleString();
        property.is_new = true;
        
        return property;
    } catch (error) {
        Logger.log("Error parsing property card: " + error);
        return null;
    }
}

/**
 * Fetch and parse a property's detail page
 */
function fetchPropertyDetails(property) {
    try {
        if (!property.listing_url) {
            Logger.log(`No listing URL for: ${property.address}`);
            return property;
        }
        
        const options = {
            muteHttpExceptions: true,
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
                "Accept-Language": "en-US,en;q=0.5",
                "Accept-Encoding": "gzip, deflate",
                "Connection": "keep-alive",
                "Upgrade-Insecure-Requests": "1"
            },
            followRedirects: true
        };
        
        const response = UrlFetchApp.fetch(property.listing_url, options);
        const code = response.getResponseCode();
        
        if (code !== 200) {
            Logger.log(`   ⚠ Failed to fetch detail page: HTTP ${code}`);
            return property;
        }
        
        const html = response.getContentText();
        
        // Parse price - look for common price patterns
        let priceMatch = html.match(/\$\s*([\d,]+(?:\.\d{2})?)/);
        if (priceMatch) {
            property.price = priceMatch[1];
        }
        
        // Parse bedrooms
        let bedsMatch = html.match(/(\d+)\s*(?:bed|bedroom|bd)/i);
        if (bedsMatch) {
            property.bedrooms = parseInt(bedsMatch[1]);
        }
        
        // Parse bathrooms
        let bathsMatch = html.match(/(\d+\.?\d*)\s*(?:bath|bathroom|ba)/i);
        if (bathsMatch) {
            property.bathrooms = parseFloat(bathsMatch[1]);
        }
        
        // Parse square feet
        let sqftMatch = html.match(/([\d,]+)\s*(?:sqft|sq\.?\s*ft\.?|square\s*feet)/i);
        if (sqftMatch) {
            property.square_feet = parseInt(sqftMatch[1].replace(/,/g, ""));
        }
        
        // Parse property type
        if (html.includes("Single Family") || html.match(/single\s*family/i)) {
            property.property_type = "Single Family Home";
        } else if (html.includes("Apartment") || html.match(/apartment/i)) {
            property.property_type = "Apartment";
        } else if (html.includes("Condo") || html.match(/condo/i)) {
            property.property_type = "Condo";
        } else if (html.includes("Townhouse") || html.match(/townhouse|town\s*house/i)) {
            property.property_type = "Townhouse";
        } else if (html.match(/house/i)) {
            property.property_type = "House";
        }
        
        // Parse phone number - look for various phone patterns
        let phoneMatch = html.match(/\(?(\d{3})\)?[\s.-]?(\d{3})[\s.-]?(\d{4})/);
        if (phoneMatch) {
            property.phone = `${phoneMatch[1]}-${phoneMatch[2]}-${phoneMatch[3]}`;
        }
        
        // Parse image URL - look for img tags
        let imgMatch = html.match(/<img[^>]*src=['"]([^'"]+)['"]/);
        if (imgMatch) {
            let imgUrl = imgMatch[1];
            if (!imgUrl.startsWith("http")) {
                imgUrl = "https://www.affordablehousing.com" + imgUrl;
            }
            property.image_url = imgUrl;
        }
        
        // Parse description - look for meta description or property description elements
        let descMatch = html.match(/<meta\s+name=['"]description['"]\s+content=['"]([^'"]+)['"]/i);
        if (!descMatch) {
            descMatch = html.match(/<p[^>]*>([^<]{20,200})<\/p>/);
        }
        if (descMatch) {
            property.description = descMatch[1].substring(0, 500);
        }
        
        property.last_updated = new Date().toLocaleString();
        
        Logger.log(`   ✓ Extracted details: ${property.price ? property.price : 'no price'}, ${property.bedrooms ? property.bedrooms + 'bd' : ''} ${property.bathrooms ? property.bathrooms + 'ba' : ''}`);
        
        return property;
        
    } catch (error) {
        Logger.log(`   ✗ Error fetching details for ${property.address}: ${error}`);
        return property;
    }
}

/**
 * Generate a simple hash for duplicate detection
 */
function generateHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(16);
}

/**
 * Store properties in the Google Sheet
 */
function storePropertiesInSheet(properties) {
    try {
        const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
        const sheet = ss.getSheetByName(SHEET_NAME);
        
        if (!sheet) {
            Logger.log("Sheet not found!");
            return;
        }
        
        if (!properties || properties.length === 0) {
            Logger.log("No properties to store");
            return;
        }
        
        // Get all existing properties with their listing IDs
        const existingIds = new Set();
        const existingRows = {};
        const lastRow = sheet.getLastRow();
        
        // Only get data if there are rows beyond the header
        if (lastRow > 1) {
            const lastColumn = sheet.getLastColumn();
            if (lastColumn > 0 && lastRow - 1 > 0) {
                try {
                    const existingData = sheet.getRange(2, 1, lastRow - 1, lastColumn).getValues();
                    
                    for (let i = 0; i < existingData.length; i++) {
                        const listingId = existingData[i][12]; // Column M = Listing ID
                        if (listingId) {
                            existingIds.add(listingId);
                            existingRows[listingId] = i + 2; // Row number in sheet (accounting for header)
                        }
                    }
                } catch (error) {
                    Logger.log("Error reading existing data: " + error);
                }
            }
        }
        
        // Process new and existing properties
        const newDataToAdd = [];
        const rowsToUpdateFormatting = [];
        
        for (const property of properties) {
            const isNew = !existingIds.has(property.listing_id);
            
            const row = [
                property.address,
                property.price,
                property.bedrooms,
                property.bathrooms,
                property.square_feet,
                property.property_type,
                property.phone,
                property.listing_url,
                property.image_url,
                property.description,
                property.last_updated,
                isNew ? "NEW" : "",  // Is New column
                property.listing_id   // Hidden listing ID for duplicate detection
            ];
            
            if (isNew) {
                // New property - add to sheet
                newDataToAdd.push(row);
                Logger.log(`New property: ${property.address}`);
            } else {
                // Existing property - update last_updated
                const rowNum = existingRows[property.listing_id];
                if (rowNum) {
                    try {
                        sheet.getRange(rowNum, 11).setValue(property.last_updated);
                        rowsToUpdateFormatting.push({ row: rowNum, isNew: false });
                        Logger.log(`Updated existing property: ${property.address}`);
                    } catch (error) {
                        Logger.log(`Error updating row ${rowNum}: ${error}`);
                    }
                }
            }
        }
        
        // Add new properties to sheet
        if (newDataToAdd.length > 0) {
            try {
                const insertRow = sheet.getLastRow() + 1;
                sheet.getRange(insertRow, 1, newDataToAdd.length, 13).setValues(newDataToAdd);
                
                // Mark new properties as green
                for (let i = 0; i < newDataToAdd.length; i++) {
                    const rowNum = insertRow + i;
                    const range = sheet.getRange(rowNum, 1, 1, 13);
                    range.setBackground(NEW_PROPERTY_COLOR);
                }
                
                Logger.log(`Added ${newDataToAdd.length} new properties`);
            } catch (error) {
                Logger.log(`Error adding new properties: ${error}`);
                logError(`Error adding properties: ${error}`);
            }
        }
        
        // Update formatting for existing properties (remove green if still exists)
        for (const item of rowsToUpdateFormatting) {
            try {
                const range = sheet.getRange(item.row, 1, 1, 13);
                range.setBackground("#FFFFFF"); // White background for existing properties
            } catch (error) {
                Logger.log(`Error updating formatting for row ${item.row}: ${error}`);
            }
        }
    } catch (error) {
        Logger.log("Critical error in storePropertiesInSheet: " + error);
        logError(`Critical error storing properties: ${error}`);
    }
}

/**
 * Set up automatic triggers
 * NEW APPROACH: Runs hourly, scraping ONE page per execution
 * - With 8 pages, all pages scraped every 8 hours (instead of trying to wait 20 min which causes timeout)
 * 
 * Run this function ONCE to set up the triggers
 */
function setupTriggers() {
    // Remove existing triggers
    const triggers = ScriptApp.getProjectTriggers();
    for (const trigger of triggers) {
        if (trigger.getHandlerFunction() === "startAutoScrape") {
            ScriptApp.deleteTrigger(trigger);
        }
    }
    
    // Create new trigger - runs every hour (scrapes 1 page per hour, cycles through all 8 pages)
    ScriptApp.newTrigger("startAutoScrape")
        .timeBased()
        .everyHours(1)
        .create();
    
    // Initialize the page counter
    const scriptProperties = PropertiesService.getScriptProperties();
    scriptProperties.setProperty("currentPage", "0");
    
    Logger.log("✓ Trigger set up to run startAutoScrape every 1 hour");
    Logger.log("✓ This will scrape 1 page per hour, cycling through all 8 pages");
    Logger.log("✓ Full cycle completes every 8 hours");
}

/**
 * Remove triggers
 */
function removeTriggers() {
    const triggers = ScriptApp.getProjectTriggers();
    for (const trigger of triggers) {
        if (trigger.getHandlerFunction() === "startAutoScrape") {
            ScriptApp.deleteTrigger(trigger);
        }
    }
    Logger.log("✓ Triggers removed");
}

/**
 * Manually scrape a specific page (for testing)
 * Usage: scrapePageManual() or scrapePageManual(1) to scrape page 1
 */
function scrapePageManual(pageNum) {
    // Default to page 1 if no parameter provided
    pageNum = pageNum || 1;
    
    if (pageNum < 1 || pageNum > SCRAPE_URLS.length) {
        Logger.log(`Invalid page number. Must be 1-${SCRAPE_URLS.length}`);
        return;
    }
    
    initializeSheet();
    const url = SCRAPE_URLS[pageNum - 1];
    Logger.log(`Manually scraping page ${pageNum}: ${url}`);
    scrapeAndStorePage(url, pageNum);
    Logger.log(`✓ Page ${pageNum} scraped`);
}

/**
 * Test the page fetch WITHOUT parsing to debug HTML issues
 * Usage: testPageFetch() or testPageFetch(1) to test page 1
 */
function testPageFetch(pageNum) {
    // Default to page 1 if no parameter provided
    pageNum = pageNum || 1;
    
    if (pageNum < 1 || pageNum > SCRAPE_URLS.length) {
        Logger.log(`Invalid page number. Must be 1-${SCRAPE_URLS.length}`);
        return;
    }
    
    const url = SCRAPE_URLS[pageNum - 1];
    Logger.log(`Testing fetch for page ${pageNum}: ${url}`);
    
    try {
        const options = {
            muteHttpExceptions: true,
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
                "Accept-Language": "en-US,en;q=0.5",
                "Accept-Encoding": "gzip, deflate",
                "Connection": "keep-alive",
                "Upgrade-Insecure-Requests": "1"
            },
            followRedirects: true
        };
        
        const response = UrlFetchApp.fetch(url, options);
        const code = response.getResponseCode();
        const html = response.getContentText();
        
        Logger.log(`✓ Response Code: ${code}`);
        Logger.log(`✓ HTML Length: ${html.length} bytes`);
        Logger.log(`✓ First 1000 chars: ${html.substring(0, 1000)}`);
        Logger.log(`✓ Contains "premiumcard": ${html.includes("premiumcard")}`);
        Logger.log(`✓ Contains "tnresult--propertyaddress": ${html.includes("tnresult--propertyaddress")}`);
        Logger.log(`✓ Contains "owl-carousel": ${html.includes("owl-carousel")}`);
        
    } catch (error) {
        Logger.log(`✗ Fetch failed: ${error}`);
    }
}

/**
 * Debug: Capture HTML snippets of property cards to analyze structure
 * Usage: debugCardStructure() or debugCardStructure(1) to debug page 1
 */
function debugCardStructure(pageNum) {
    pageNum = pageNum || 2;
    
    if (pageNum < 1 || pageNum > SCRAPE_URLS.length) {
        Logger.log(`Invalid page number. Must be 1-${SCRAPE_URLS.length}`);
        return;
    }
    
    const url = SCRAPE_URLS[pageNum - 1];
    Logger.log(`\n========== DEBUGGING CARD STRUCTURE PAGE ${pageNum} ==========`);
    Logger.log(`URL: ${url}`);
    
    try {
        const options = {
            muteHttpExceptions: true,
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
                "Accept-Language": "en-US,en;q=0.5",
                "Accept-Encoding": "gzip, deflate",
                "Connection": "keep-alive",
                "Upgrade-Insecure-Requests": "1"
            },
            followRedirects: true
        };
        
        const response = UrlFetchApp.fetch(url, options);
        const html = response.getContentText();
        
        Logger.log(`✓ Fetched successfully. HTML size: ${html.length} bytes`);
        
        // Check for key elements
        const hasPremiumcard = html.includes("premiumcard");
        const hasAddress = html.includes("tnresult--propertyaddress");
        Logger.log(`✓ Contains premiumcard: ${hasPremiumcard}`);
        Logger.log(`✓ Contains tnresult--propertyaddress: ${hasAddress}`);
        
        if (!hasPremiumcard) {
            Logger.log("✗ ERROR: No premiumcard found in HTML!");
            return;
        }
        
        // Try to extract first property card
        const cardPattern = /<div[^>]*class='premiumcard[^>]*>([\s\S]*?)(?=<div[^>]*class='premiumcard|$)/g;
        let match = cardPattern.exec(html);
        
        if (!match) {
            Logger.log("✗ ERROR: Could not extract first card with pattern!");
            Logger.log("Trying alternative patterns...");
            
            // Try with double quotes
            const altPattern1 = /<div[^>]*class="premiumcard[^>]*>([\s\S]*?)(?=<div[^>]*class="premiumcard|$)/g;
            match = altPattern1.exec(html);
            if (match) {
                Logger.log("✓ Pattern found with double quotes!");
            }
        }
        
        if (!match) {
            Logger.log("✗ Could not extract any cards. Showing premiumcard context:");
            const idx = html.indexOf("premiumcard");
            Logger.log(html.substring(idx, idx + 500));
            return;
        }
        
        Logger.log(`✓ Successfully extracted first card`);
        const cardHtml = match[1];
        Logger.log(`Card HTML size: ${cardHtml.length} bytes`);
        
        // Extract address
        const addressMatch = cardHtml.match(/class='tnresult--propertyaddress'[^>]*>([^<]+)/);
        const address = addressMatch ? addressMatch[1].trim() : "NO ADDRESS FOUND";
        Logger.log(`\n=== CARD 1 ADDRESS ===\n${address}\n`);
        
        // Log relevant sections of the card
        Logger.log(`\n=== FIRST 2000 CHARS OF CARD HTML ===`);
        Logger.log(cardHtml.substring(0, 2000));
        
        Logger.log(`\n=== SEARCHING FOR URL PATTERNS IN THIS CARD ===`);
        
        const patterns = [
            { name: 'data-href', pattern: /data-href=['"]([^'"]{10,100})['"]/ },
            { name: 'href in <a>', pattern: /<a[^>]*href=['"]([^'"]{10,100})['"]/ },
            { name: 'onclick.*location', pattern: /onclick=['"][^'"]*location[^'"]*['"]/ },
            { name: 'onclick full', pattern: /onclick=['"]([^'"]{20,200})['"]/ },
            { name: 'data-link', pattern: /data-link=['"]([^'"]{10,100})['"]/ },
            { name: 'data-property', pattern: /data-property[^=]*=['"]([^'"]{10,100})['"]/ },
            { name: 'href=', pattern: /href\s*=\s*['"]([^'"]{10,100})['"]/ }
        ];
        
        let foundUrls = [];
        for (const p of patterns) {
            const m = cardHtml.match(p.pattern);
            if (m) {
                Logger.log(`✓ ${p.name}: ${m[1]}`);
                foundUrls.push({ pattern: p.name, value: m[1] });
            }
        }
        
        if (foundUrls.length === 0) {
            Logger.log("✗ NO URL PATTERNS FOUND");
            Logger.log("\n=== SHOWING ALL ATTRIBUTES IN CARD ===");
            const attrMatches = cardHtml.match(/(\w+[-\w]*)\s*=\s*['"][^'"]+['"]/g);
            if (attrMatches) {
                Logger.log(attrMatches.join('\n'));
            }
        }
        
        Logger.log(`\n========== END DEBUG ==========\n`);
        
    } catch (error) {
        Logger.log(`✗ Error: ${error}`);
    }
}

/**
 * Debug: Save HTML snippet to see actual structure
 */
function debugHtmlStructure(pageNum) {
    pageNum = pageNum || 1;
    
    const url = SCRAPE_URLS[pageNum - 1];
    Logger.log(`Debugging HTML structure for page ${pageNum}`);
    
    try {
        const options = {
            muteHttpExceptions: true,
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
                "Accept-Language": "en-US,en;q=0.5",
                "Accept-Encoding": "gzip, deflate",
                "Connection": "keep-alive",
                "Upgrade-Insecure-Requests": "1"
            },
            followRedirects: true
        };
        
        const response = UrlFetchApp.fetch(url, options);
        const html = response.getContentText();
        
        Logger.log("=== SEARCHING FOR PREMIUMCARD VARIATIONS ===");
        
        // Try various search patterns
        const patterns = [
            'class="premiumcard"',
            "class='premiumcard'",
            'class = "premiumcard"',
            'class="premiumcard',
            'premiumcard',
            'tnresult--propertyaddress'
        ];
        
        for (const pattern of patterns) {
            const index = html.indexOf(pattern);
            Logger.log(`Pattern "${pattern}": ${index >= 0 ? `FOUND at position ${index}` : 'NOT FOUND'}`);
            
            if (index >= 0) {
                // Log the surrounding context (500 chars before and after)
                const start = Math.max(0, index - 200);
                const end = Math.min(html.length, index + 500);
                const snippet = html.substring(start, end);
                Logger.log(`Context: ${snippet}`);
            }
        }
        
        // Find all unique tag structures around property content
        Logger.log("\n=== CHECKING HTML STRUCTURE ===");
        
        // Look for address patterns
        const addressIndex = html.indexOf('tnresult--propertyaddress');
        if (addressIndex >= 0) {
            const start = Math.max(0, addressIndex - 500);
            const end = Math.min(html.length, addressIndex + 1000);
            const snippet = html.substring(start, end);
            Logger.log("=== CONTEXT AROUND FIRST tnresult--propertyaddress ===");
            Logger.log(snippet);
            Logger.log("=== END ===");
        }
        
        // Count different potential container classes
        const containerPatterns = [
            /class="[^"]*premiumcard[^"]*"/g,
            /class='[^']*premiumcard[^']*'/g,
            /class="[^"]*property[^"]*"/g,
            /id="[^"]*card[^"]*"/g
        ];
        
        Logger.log("\n=== CONTAINER COUNTS ===");
        for (const pattern of containerPatterns) {
            const matches = html.match(pattern);
            Logger.log(`Pattern ${pattern}: ${matches ? matches.length : 0} matches`);
            if (matches && matches.length > 0) {
                Logger.log(`  Examples: ${matches.slice(0, 3).join(', ')}`);
            }
        }
        
    } catch (error) {
        Logger.log(`✗ Error: ${error}`);
    }
}

/**
 * Reset the page counter to start from page 1
 */
function resetPageCounter() {
    const scriptProperties = PropertiesService.getScriptProperties();
    scriptProperties.setProperty("currentPage", "0");
    Logger.log("✓ Page counter reset to 0 (will start with page 1 next execution)");
}

/**
 * Log errors to a separate sheet
 */
function logError(error) {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    let errorSheet = ss.getSheetByName("Errors");
    
    if (!errorSheet) {
        errorSheet = ss.insertSheet("Errors");
        errorSheet.getRange(1, 1, 1, 2).setValues([["Timestamp", "Error Message"]]);
    }
    
    const lastRow = errorSheet.getLastRow();
    errorSheet.getRange(lastRow + 1, 1, 1, 2).setValues([[new Date(), error.toString()]]);
}

/**
 * Get statistics about the data
 */
function getScraperStats() {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
        return "No data found";
    }
    
    const lastRow = sheet.getLastRow();
    
    // Only get data if there are rows beyond the header
    if (lastRow <= 1) {
        const stats = `
    Total Properties: 0
    New Properties: 0
    Last Update: ${new Date().toLocaleString()}
    `;
        Logger.log(stats);
        return stats;
    }
    
    const data = sheet.getRange(2, 1, lastRow - 1, 13).getValues();
    const newCount = data.filter(row => row[11] === "NEW").length;
    const totalCount = data.filter(row => row[0]).length;
    
    const stats = `
    Total Properties: ${totalCount}
    New Properties: ${newCount}
    Last Update: ${new Date().toLocaleString()}
    `;
    
    Logger.log(stats);
    return stats;
}
