# Advanced Features & Customization

## Email Notifications

### Setup SMTP for Email Alerts

Edit `backend/config/email.php`:
```php
<?php
define('SMTP_HOST', 'smtp.gmail.com');
define('SMTP_PORT', 587);
define('SMTP_USER', 'your-email@gmail.com');
define('SMTP_PASSWORD', 'your-app-password');
define('SMTP_FROM', 'homescraper@yourdomain.com');
?>
```

### Send Email on New Listing

Add to `backend/api.php`:
```php
function sendEmailAlert($property, $emailList) {
    require_once 'config/email.php';
    
    $subject = "New Property Alert: " . $property['address'];
    $body = "
        <h2>New Property Listed!</h2>
        <p><strong>Address:</strong> " . $property['address'] . "</p>
        <p><strong>Price:</strong> \$" . number_format($property['price']) . "</p>
        <p><strong>Bedrooms:</strong> " . $property['bedrooms'] . "</p>
        <p><strong>Link:</strong> <a href='" . $property['listing_url'] . "'>View Listing</a></p>
    ";
    
    // Use phpMailer or similar library
    // sendMail($emailList, $subject, $body);
}
```

## SMS Notifications (Twilio)

### Install Twilio
```bash
pip install twilio
```

### Send SMS Alert
```python
from twilio.rest import Client

account_sid = 'your_account_sid'
auth_token = 'your_auth_token'
client = Client(account_sid, auth_token)

def send_sms_alert(phone, property_info):
    message = client.messages.create(
        body=f"New property: {property_info['address']}. Price: ${property_info['price']}",
        from_='+1234567890',
        to=phone
    )
    return message.sid
```

## Google Maps Integration

### Add Map to Property Details

Edit `frontend/index.html`:
```html
<script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY"></script>

<!-- In modal body -->
<div id="propertyMap" style="width: 100%; height: 300px; border-radius: 8px; margin: 20px 0;"></div>
```

Edit `frontend/js/app.js`:
```javascript
function showPropertyMap(latitude, longitude, address) {
    const map = new google.maps.Map(document.getElementById('propertyMap'), {
        zoom: 15,
        center: {lat: parseFloat(latitude), lng: parseFloat(longitude)}
    });
    
    new google.maps.Marker({
        position: {lat: parseFloat(latitude), lng: parseFloat(longitude)},
        map: map,
        title: address
    });
}
```

## Advanced Filtering

### Filter by Radius
```javascript
function filterByRadius(centerLat, centerLng, radiusMiles) {
    // Calculate distance for each property
    const filtered = this.properties.filter(p => {
        const distance = calculateDistance(
            centerLat, centerLng,
            p.latitude, p.longitude
        );
        return distance <= radiusMiles;
    });
    return filtered;
}

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 3959; // Earth's radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}
```

### Price History & Trends
```sql
CREATE TABLE property_price_history (
    id INT PRIMARY KEY AUTO_INCREMENT,
    property_id INT,
    price DECIMAL(10, 2),
    recorded_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (property_id) REFERENCES properties(id)
);

-- Log price changes
INSERT INTO property_price_history (property_id, price)
SELECT id, price FROM properties WHERE last_updated = CURDATE();
```

## Real-Time Updates with WebSockets

### Using Socket.io
```javascript
// Install: npm install socket.io

// Server (Node.js)
const io = require('socket.io')(3000);

io.on('connection', (socket) => {
    socket.on('new_property', (property) => {
        io.emit('property_alert', property);
    });
});

// Client
const socket = io('http://yourdomain.com:3000');

socket.on('property_alert', (property) => {
    showToast(`New property: ${property.address}`, 'success');
    // Reload properties
    this.loadProperties();
});
```

## Advanced Analytics Dashboard

### Track Scraper Performance
```php
<?php
function getAnalytics() {
    global $conn;
    
    $analytics = array(
        'daily_scrapes' => "SELECT DATE(scrape_date) as date, COUNT(*) as count FROM scrape_logs GROUP BY DATE(scrape_date)",
        'properties_per_day' => "SELECT DATE(scraped_date) as date, COUNT(*) as count FROM properties GROUP BY DATE(scraped_date)",
        'price_trends' => "SELECT DATE(recorded_date) as date, AVG(price) as avg_price FROM property_price_history GROUP BY DATE(recorded_date)",
        'top_neighborhoods' => "SELECT address, COUNT(*) as count FROM properties GROUP BY address LIMIT 10"
    );
    
    return $analytics;
}
?>
```

## User Accounts & Authentication

### Create Login System
```php
<?php
// Register user
function registerUser($username, $email, $password) {
    global $conn;
    
    $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
    
    $query = "INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("sss", $username, $email, $hashedPassword);
    
    return $stmt->execute();
}

// Login user
function loginUser($email, $password) {
    global $conn;
    
    $query = "SELECT id, username, email, password_hash FROM users WHERE email = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();
        if (password_verify($password, $user['password_hash'])) {
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['username'] = $user['username'];
            return true;
        }
    }
    
    return false;
}

// Check authentication
function requireLogin() {
    if (!isset($_SESSION['user_id'])) {
        header('Location: /homescraper/frontend/login.html');
        exit;
    }
}
?>
```

## Saved Favorites/Watchlist

### Database Table
```sql
CREATE TABLE saved_properties (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    property_id INT NOT NULL,
    saved_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (property_id) REFERENCES properties(id),
    UNIQUE KEY unique_save (user_id, property_id)
);
```

### API Endpoints
```php
// Save property
POST /backend/api.php/favorites/{property_id}

// Get saved properties
GET /backend/api.php/favorites

// Remove from favorites
DELETE /backend/api.php/favorites/{property_id}
```

## Bulk Actions

### Bulk Export
```php
function bulkExport($propertyIds, $format = 'csv') {
    global $conn;
    
    $placeholders = implode(',', array_fill(0, count($propertyIds), '?'));
    $query = "SELECT * FROM properties WHERE id IN ($placeholders)";
    
    $stmt = $conn->prepare($query);
    $stmt->bind_param(str_repeat('i', count($propertyIds)), ...$propertyIds);
    $stmt->execute();
    
    return $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
}
```

## Dark Mode

### CSS Variables
```css
:root {
    --bg-primary: #ffffff;
    --bg-secondary: #f9fafb;
    --text-primary: #1f2937;
    --text-secondary: #6b7280;
}

body.dark-mode {
    --bg-primary: #1f2937;
    --bg-secondary: #111827;
    --text-primary: #f9fafb;
    --text-secondary: #d1d5db;
}
```

### Toggle Dark Mode
```javascript
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

// Load preference
if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
}
```

## API Rate Limiting

### Prevent Abuse
```php
function checkRateLimit($ipAddress) {
    $cacheKey = "rate_limit_$ipAddress";
    
    if (apcu_exists($cacheKey)) {
        $count = apcu_fetch($cacheKey);
        if ($count >= 100) { // 100 requests per minute
            http_response_code(429);
            return json_encode(['error' => 'Rate limit exceeded']);
        }
        apcu_inc($cacheKey);
    } else {
        apcu_store($cacheKey, 1, 60);
    }
}
```

## Performance Monitoring

### Log Slow Queries
```php
$startTime = microtime(true);

// Your query here

$endTime = microtime(true);
$duration = ($endTime - $startTime) * 1000; // ms

if ($duration > 1000) { // Log if over 1 second
    error_log("Slow query: " . $duration . "ms");
}
```

## Changelog & Version Management

### Track Updates
```
v1.0.0 - Initial Launch
- Basic property scraping
- Dashboard with filters
- Search functionality
- Export to CSV

v1.1.0 - Coming Soon
- Email notifications
- Google Maps integration
- User accounts
- Dark mode
- Mobile app
```

---

These features can be implemented incrementally after the initial launch. Start with core functionality, then add these advanced features based on client feedback and needs.
