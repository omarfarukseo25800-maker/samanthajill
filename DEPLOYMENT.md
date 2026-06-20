# Deployment Guide

Complete guide for deploying HomeScraper to your client's web server.

## Pre-Deployment Checklist

- [ ] Test all features locally
- [ ] Verify scraper works correctly
- [ ] Backup local database
- [ ] Create deployment package
- [ ] Update all configuration files
- [ ] Review security settings
- [ ] Test on staging server (if available)

## Step 1: Prepare Deployment Package

### Create Clean Package
```bash
# Remove development files
del backend\logs\*.log
del .git\*
del .env (will recreate on server)
```

### Create Backup
```bash
# Backup on your machine
Compress-Archive -Path C:\xampp\htdocs\homescraper -DestinationPath homescraper_backup.zip
```

## Step 2: Access Client's Server

### Via FTP (Most Common)
Get from client:
- FTP Host: e.g., `ftp.clientserver.com`
- FTP Username
- FTP Password
- FTP Port (usually 21)

Using FileZilla:
1. File → Site Manager → New Site
2. Enter FTP credentials
3. Protocol: FTP
4. Connect

### Via SSH (Linux/VPS)
Get from client:
- SSH Host: e.g., `192.168.1.1`
- SSH Username
- SSH Key or Password
- SSH Port (usually 22)

Using PuTTY or Terminal:
```bash
ssh user@client-server.com
```

## Step 3: Upload Files

### Via FTP
1. Navigate to public_html or www folder
2. Create folder: `homescraper`
3. Upload all files to `homescraper/` folder
4. Upload structure should match:
   ```
   /public_html/homescraper/
   ├── frontend/
   ├── backend/
   ├── README.md
   ├── .env
   └── .htaccess
   ```

### Via SSH
```bash
# Upload via SCP
scp -r C:\xampp\htdocs\homescraper/* user@client.com:/home/user/public_html/homescraper/

# Or via SFTP
sftp user@client.com
put -r C:\xampp\htdocs\homescraper homescraper
```

## Step 4: Configure on Server

### 1. Update Database Configuration
Via FTP or SSH, edit `backend/config/database.php`:
```php
define('DB_HOST', 'localhost');
define('DB_USER', 'db_username');      // From client's hosting
define('DB_PASSWORD', 'db_password');  // From client's hosting
define('DB_NAME', 'db_name');          // From client's hosting
```

Get these from client's hosting control panel (cPanel, Plesk, etc.)

### 2. Create .env File
Create new `.env` with server settings:
```env
DB_HOST=localhost
DB_USER=client_user
DB_PASSWORD=client_password
DB_NAME=client_database
SCRAPER_BASE_URL=https://affordablehousing.com
SCRAPER_HEADLESS=true
ENABLE_NOTIFICATIONS=true
```

### 3. Set Permissions (Linux/Unix only)
Via SSH:
```bash
cd /home/user/public_html/homescraper

# Set directory permissions
chmod -R 755 backend/
chmod -R 755 frontend/

# Set writable folders
chmod -R 777 backend/logs/

# Set file permissions
chmod 644 backend/config/database.php
chmod 644 .env
chmod 644 .htaccess
```

### 4. Create Database
Using cPanel:
1. Open phpMyAdmin
2. Create new database: `homescraper_db`
3. Create new user: `homescraper_user`
4. Grant ALL privileges to user on database
5. Update `database.php` with these credentials

Or via SSH:
```sql
mysql -u root -p
CREATE DATABASE homescraper_db;
CREATE USER 'homescraper_user'@'localhost' IDENTIFIED BY 'strong_password';
GRANT ALL PRIVILEGES ON homescraper_db.* TO 'homescraper_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

## Step 5: Install Python Dependencies

### Check Python Version
Via SSH:
```bash
python3 --version
```
Must be Python 3.7 or higher

### Install Requirements
```bash
cd /home/user/public_html/homescraper
pip3 install -r backend/requirements.txt
```

### Verify Installation
```bash
python3 -c "import selenium; print(selenium.__version__)"
python3 -c "import mysql.connector; print('MySQL OK')"
```

### If pip install fails:
```bash
# Install pip first
sudo apt-get install python3-pip

# Then install requirements
sudo pip3 install -r backend/requirements.txt

# Or with --user flag
pip3 install --user -r backend/requirements.txt
```

## Step 6: Configure HTTPS/SSL

### Option 1: Let's Encrypt (Free, Recommended)
Most hosting providers offer free Let's Encrypt SSL.

Via cPanel:
1. Go to AutoSSL
2. Click "Run AutoSSL"
3. Wait for certificate to install
4. Test at https://yoursite.com

### Option 2: Commercial SSL
1. Purchase SSL certificate
2. Generate CSR in cPanel
3. Submit CSR to SSL provider
4. Follow provider's installation instructions

### Update .htaccess for HTTPS
Edit `.htaccess`:
```apache
# Redirect HTTP to HTTPS
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteCond %{HTTPS} off
    RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
</IfModule>
```

### Update API URLs in JavaScript
Update `frontend/js/app.js`:
```javascript
// Change from:
this.apiUrl = '/homescraper/backend';

// To:
this.apiUrl = 'https://yourdomain.com/homescraper/backend';
```

## Step 7: Configure Scheduling

### Option 1: cPanel Cron Jobs (Easiest)
1. Open cPanel → Cron Jobs
2. Add new cron job:
   - Command: `/usr/bin/php3 /home/user/public_html/homescraper/backend/cron.php`
   - Time: Every hour `0 * * * *`
3. Or HTTP call:
   - Command: `/usr/bin/wget -q -O - https://yourdomain.com/homescraper/backend/cron.php`

### Option 2: Linux Crontab (SSH)
```bash
# Edit crontab
crontab -e

# Hourly scrape
0 * * * * cd /home/user/public_html/homescraper && python3 backend/scrapers/affordable_housing_scraper.py >> backend/logs/cron.log 2>&1

# Or HTTP trigger
*/30 * * * * /usr/bin/wget -q -O - https://yourdomain.com/homescraper/backend/cron.php
```

### Option 3: Windows Server (IIS)
Use Windows Task Scheduler (see INSTALLATION.md)

## Step 8: Testing

### Test API Endpoints
```bash
# From your computer
curl https://yourdomain.com/homescraper/backend/api.php

# Get stats
curl https://yourdomain.com/homescraper/backend/api.php/stats

# Search
curl https://yourdomain.com/homescraper/backend/api.php/search?q=atlanta
```

### Test Frontend
Open in browser:
```
https://yourdomain.com/homescraper/frontend/
```

### Test Scraper
Via SSH:
```bash
cd /home/user/public_html/homescraper
python3 backend/scrapers/affordable_housing_scraper.py
```

Check logs:
```bash
tail -f backend/logs/scraper.log
```

### Test Database
```bash
mysql -u homescraper_user -p homescraper_db
SHOW TABLES;
SELECT COUNT(*) FROM properties;
```

## Step 9: Monitoring & Maintenance

### Monitor Logs
```bash
# Check scraper logs
tail -100 backend/logs/scraper.log

# Follow live logs
tail -f backend/logs/scraper.log

# PHP errors
tail backend/logs/php_errors.log
```

### Database Maintenance
```bash
# Backup database
mysqldump -u homescraper_user -p homescraper_db > backup_$(date +%Y%m%d).sql

# Check database size
SELECT SUM(data_length + index_length) / 1024 / 1024 FROM information_schema.TABLES WHERE table_schema = 'homescraper_db';

# Optimize tables
OPTIMIZE TABLE properties;
```

### Monitor Disk Usage
```bash
# Check space usage
du -sh /home/user/public_html/homescraper

# Check available space
df -h
```

## Step 10: Backup Strategy

### Weekly Backup
```bash
#!/bin/bash
BACKUP_DIR="/home/user/backups"
DATE=$(date +%Y%m%d_%H%M%S)

# Backup database
mysqldump -u homescraper_user -p homescraper_db > $BACKUP_DIR/db_$DATE.sql

# Backup files
tar -czf $BACKUP_DIR/homescraper_$DATE.tar.gz /home/user/public_html/homescraper

# Keep only last 4 weeks
find $BACKUP_DIR -name "db_*.sql" -mtime +28 -delete
find $BACKUP_DIR -name "homescraper_*.tar.gz" -mtime +28 -delete
```

Add to crontab:
```bash
0 2 * * 0 /home/user/backup_homescraper.sh
```

## Troubleshooting

### Blank Page/500 Error
1. Check PHP error logs
2. Verify database credentials
3. Check file permissions on logs folder
4. Enable PHP error reporting (temporary)

### Scraper Not Running
1. Check cron job logs
2. Verify Python is installed
3. Test scraper manually
4. Check firewall/HTTPS restrictions

### Database Connection Error
1. Verify credentials in database.php
2. Test connection: `mysql -u user -p database_name`
3. Check MySQL service is running
4. Check database user has correct permissions

### HTTPS/SSL Issues
1. Clear browser cache
2. Test at https://ssllabs.com/ssltest/
3. Check certificate expiration
4. Verify all resources load via HTTPS

### High CPU/Memory Usage
1. Check if scraper is running
2. Optimize database queries
3. Enable caching
4. Monitor with: `top` or `ps aux`

## Performance Optimization

### Enable Caching
Update `.htaccess`:
```apache
<FilesMatch "\.(?:jpg|jpeg|png|gif|ico|css|js)$">
    Header set Cache-Control "max-age=31536000, public"
</FilesMatch>
```

### Optimize Database
```sql
-- Add indexes
ALTER TABLE properties ADD INDEX idx_address (address);
ALTER TABLE properties ADD INDEX idx_price (price);
ALTER TABLE properties ADD INDEX idx_status (status);

-- Analyze tables
ANALYZE TABLE properties;
```

### Use CDN for Assets
```html
<!-- Replace with CDN URL -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/font-awesome@6.4.0/css/all.min.css">
```

## Post-Deployment Checklist

- [ ] API endpoints working
- [ ] Frontend loads correctly
- [ ] Search functionality works
- [ ] Scraper runs successfully
- [ ] Database has properties
- [ ] Cron job scheduled
- [ ] SSL/HTTPS working
- [ ] Backups configured
- [ ] Error logging working
- [ ] Client can access admin panel

## Handover to Client

Provide client with:
1. **Access credentials**
   - Dashboard URL
   - Default admin account (if any)
   - FTP/SSH access (if needed)

2. **Documentation**
   - How to view properties
   - How to export data
   - How to contact support
   - Emergency contact number

3. **Training**
   - Demo of dashboard features
   - Explanation of search/filters
   - How to export CSV
   - Where to find notifications

4. **Support contacts**
   - Your email for support
   - Escalation process
   - Emergency contact

---

**Deployment completed successfully!** 🎉

Next steps:
1. Monitor scraper logs for first week
2. Verify properties are loading correctly
3. Ensure cron job is running
4. Get client feedback
5. Make any necessary adjustments
