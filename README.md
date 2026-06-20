# HomeScraper - Atlanta Affordable Housing Property Scraper

A modern web application for scraping and monitoring affordable housing listings in Atlanta, Georgia from affordablehousing.com.

## Features

✨ **Core Features**
- Real-time property scraping from affordablehousing.com
- Automatic filtering for Atlanta, Georgia area properties
- Phone number extraction from detailed listings
- Price, bedrooms, bathrooms, and square footage tracking
- Continuous monitoring with scheduled updates

🎨 **Modern UI/UX**
- Beautiful, responsive dashboard with animations
- Real-time statistics and metrics
- Advanced filtering and search capabilities
- Grid/List view toggle
- Property detail modal with contact information
- Export to CSV functionality

📊 **Data Management**
- MySQL database with relational schema
- RESTful API for data access
- Pagination support
- Advanced search capabilities
- Historical data tracking

🔔 **Notifications**
- Email alerts for new listings
- Real-time update notifications
- Customizable alert settings
- Auto-refresh every 5-10 minutes

## Project Structure

```
homescraper/
├── frontend/
│   ├── index.html                 # Main dashboard
│   ├── css/
│   │   └── styles.css             # Modern styling with animations
│   ├── js/
│   │   └── app.js                 # JavaScript application logic
│   └── assets/                    # Images and resources
├── backend/
│   ├── api.php                    # RESTful API endpoints
│   ├── cron.php                   # Cron job scheduler
│   ├── config/
│   │   ├── database.php           # Database configuration
│   │   └── areas.json             # Target areas configuration
│   ├── scrapers/
│   │   └── affordable_housing_scraper.py  # Main scraper script
│   └── logs/                      # Scraper logs
├── .htaccess                      # Apache configuration
├── .env                           # Environment variables
├── requirements.txt               # Python dependencies
└── README.md                      # This file
```

## Installation

### Prerequisites
- XAMPP with Apache and MySQL enabled
- Python 3.7+ installed
- Chrome/Chromium browser (for Selenium)

### Setup Instructions

1. **Clone/Download Files**
   ```
   Place all files in: C:\xampp\htdocs\homescraper
   ```

2. **Create Database**
   ```bash
   # The database and tables will be created automatically on first API call
   # Or manually import the schema
   ```

3. **Install Python Dependencies**
   ```bash
   pip install -r backend/requirements.txt
   ```

4. **Configure Database**
   Edit `backend/config/database.php`:
   ```php
   define('DB_HOST', 'localhost');
   define('DB_USER', 'root');
   define('DB_PASSWORD', '');
   define('DB_NAME', 'homescraper_db');
   ```

5. **Configure Environment**
   Edit `.env` with your settings

6. **Set Permissions**
   ```bash
   chmod -R 755 backend/logs
   chmod -R 644 backend/config
   ```

## Usage

### Access the Dashboard
```
http://localhost/homescraper/frontend
```

### Run Scraper Manually
```bash
python backend/scrapers/affordable_housing_scraper.py
```

### Schedule Scraper (Cron Job)

**On Linux/Mac:**
```bash
# Edit crontab
crontab -e

# Add this line to run scraper every hour
0 * * * * /usr/bin/python3 /var/www/html/homescraper/backend/scrapers/affordable_housing_scraper.py

# Or trigger via HTTP (every 10 minutes)
*/10 * * * * curl http://yourdomain.com/homescraper/backend/cron.php
```

**On Windows (Task Scheduler):**
1. Create a new Basic Task
2. Set trigger to repeat every 60 minutes
3. Set action: Start a program
4. Program: `C:\Python39\python.exe`
5. Arguments: `C:\xampp\htdocs\homescraper\backend\scrapers\affordable_housing_scraper.py`

## API Endpoints

### Get Properties
```bash
GET /backend/api.php?page=1&limit=20&status=active
```

### Search Properties
```bash
GET /backend/api.php/search?q=Atlanta&radius=5
```

### Get Statistics
```bash
GET /backend/api.php/stats
```

### Export Data
```bash
GET /backend/api.php/export?format=csv&status=active
GET /backend/api.php/export?format=json&status=active
```

### Get Property Details
```bash
GET /backend/api.php/{id}
```

## Database Schema

### Properties Table
- id: Primary key
- listing_id: Unique listing identifier
- address: Property address
- phone: Contact phone number
- price: Property price
- bedrooms: Number of bedrooms
- bathrooms: Number of bathrooms
- square_feet: Property size
- property_type: Type of property
- description: Property description
- image_url: Featured image URL
- listing_url: Original listing URL
- status: Active/Sold/Inactive
- scraped_date: When property was first scraped
- last_updated: Last update timestamp

### Additional Tables
- users: User accounts for notifications
- notifications: User notifications
- scrape_logs: Scraper execution logs

## Features in Detail

### Modern UI Design
- Gradient backgrounds and smooth transitions
- Responsive grid layout (mobile-first)
- Hover animations and visual feedback
- Loading spinners and toast notifications
- Dark mode support (easily added)

### Search & Filters
- Real-time search by address
- Price range slider
- Bedroom filter
- Status filter (Active/Sold/All)
- Instant results with pagination

### Export Options
- CSV export with all property data
- JSON export for integration
- Download ready for spreadsheet
- Complete contact information included

### Notifications (Ready to Implement)
- Email alerts for new listings
- Price drop notifications
- New property in area notifications
- Customizable frequency
- User subscription management

## Deployment to Client's Server

### Step 1: Prepare Files
```bash
# Create backup
zip -r homescraper_backup.zip homescraper/

# Optimize images
# Remove large unnecessary files
# Update database credentials
```

### Step 2: Upload to Server
```bash
# Via FTP
ftp user@clientserver.com
put -r homescraper/ /public_html/

# Or via SSH
scp -r homescraper/ user@clientserver.com:/home/user/public_html/
```

### Step 3: Configure on Server
1. Update `backend/config/database.php` with server credentials
2. Update `.env` with server settings
3. Set file permissions: `chmod -R 755 backend/logs`
4. Create database and run schema
5. Install Python packages: `pip install -r requirements.txt`
6. Set up cron job for scraper

### Step 4: Test
```bash
# Test API
curl https://yourdomain.com/homescraper/backend/api.php

# Test scraper
python3 /home/user/public_html/homescraper/backend/scrapers/affordable_housing_scraper.py
```

### Step 5: Configure HTTPS
1. Install SSL certificate (Let's Encrypt)
2. Update `.htaccess` with HTTPS redirect
3. Update API URLs to use HTTPS

### Step 6: Monitor
1. Check `backend/logs/scraper.log` regularly
2. Monitor database size
3. Set up email alerts for scraper failures
4. Monitor server resources

## Customization

### Change Target Area
Edit `backend/config/areas.json`:
```json
{
    "city": "Your City",
    "state": "Your State",
    "neighborhoods": ["neighborhood1", "neighborhood2"]
}
```

### Adjust Scraper Settings
Edit `backend/scrapers/affordable_housing_scraper.py`:
- Change `base_url` for different websites
- Modify CSS selectors for different layouts
- Adjust filters and parsing logic

### Styling
Edit `frontend/css/styles.css`:
- Change color scheme (--primary-color, etc.)
- Adjust animations and transitions
- Modify responsive breakpoints

## Troubleshooting

### Scraper Not Finding Properties
1. Check if affordablehousing.com layout changed
2. Verify CSS selectors in scraper
3. Check scraper logs: `backend/logs/scraper.log`
4. Test in browser developer tools

### Database Connection Error
1. Verify MySQL is running
2. Check credentials in `database.php`
3. Ensure database exists: `CREATE DATABASE homescraper_db`
4. Check user permissions

### No Images Loading
1. Update image URL handling in scraper
2. Add fallback image service
3. Verify image URLs are accessible

## Performance Optimization

- Database indexes on address, listing_id, status, price
- Pagination to limit data transfer
- API response caching (headers)
- Frontend lazy loading (images)
- Minify CSS/JS for production

## Security

- Prepared statements to prevent SQL injection
- Input validation and sanitization
- CORS configuration
- File upload restrictions
- Sensitive file protection (.env, .git)

## Support & Maintenance

### Regular Tasks
- Monitor scraper logs weekly
- Check for website layout changes
- Update Python packages monthly: `pip install --upgrade -r requirements.txt`
- Backup database weekly: `mysqldump -u root homescraper_db > backup.sql`
- Monitor server disk space

### Scaling
- Add caching layer (Redis)
- Implement database replication
- Use CDN for images
- Separate API and frontend servers
- Add load balancing

## Technologies Used

**Frontend:**
- HTML5
- CSS3 (with animations)
- Vanilla JavaScript
- Responsive Design

**Backend:**
- PHP 7.4+
- Python 3.7+
- MySQL 5.7+
- RESTful API

**Libraries:**
- Selenium (web scraping)
- BeautifulSoup (HTML parsing)
- MySQL Connector (database)
- Font Awesome (icons)

## Future Enhancements

- [ ] User authentication and accounts
- [ ] Saved property lists/favorites
- [ ] Email notification system
- [ ] SMS alerts
- [ ] Property comparison tool
- [ ] Map view integration (Google Maps)
- [ ] Price history graphs
- [ ] Mobile app
- [ ] Dark mode
- [ ] Advanced analytics dashboard

## License

This project is proprietary software created for [Client Name]. All rights reserved.

## Contact

For support and updates, contact: [Your Contact Information]

---

**Last Updated:** February 28, 2026
**Version:** 1.0.0
