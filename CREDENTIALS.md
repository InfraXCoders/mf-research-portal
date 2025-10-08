# 🔐 API Monitor - Login Credentials

## Password Protected Dashboard

The API Monitor dashboard is now **password protected** to prevent unauthorized access.

---

## 🔑 **Default Credentials**

### **Admin Account:**
- **Username:** `admin`
- **Password:** `admin123`

### **Additional Accounts:**
- **Username:** `gagandeep`
- **Password:** `secure@2025`

- **Username:** `infraxcoders`
- **Password:** `InfraX@123`

---

## 🔒 **Security Features**

### **1. Session-Based Authentication**
- Uses browser `sessionStorage`
- Credentials valid until browser tab is closed
- Each tab requires separate login

### **2. Auto-Logout**
- Automatic logout after **30 minutes** of inactivity
- Protects against unauthorized access if you leave browser open

### **3. Activity Tracking**
- Monitors: mouse clicks, keyboard input, scrolling, touch events
- Resets timeout on any activity

### **4. Failed Login Protection**
- Shows error message on wrong credentials
- Clears password field
- Logs failed attempts to console

### **5. Secure Logout**
- Confirmation prompt before logout
- Clears all session data
- Clears sensitive logs
- Redirects to login screen

---

## 🎯 **How to Change Passwords**

### **Option 1: Edit api-monitor.html (Simple)**

Open `api-monitor.html` and find this section:

```javascript
// User credentials (Change these to your desired username/password)
const VALID_USERS = [
    { username: 'admin', password: 'admin123' },
    { username: 'gagandeep', password: 'secure@2025' },
    { username: 'infraxcoders', password: 'InfraX@123' }
];
```

**Change to your credentials:**
```javascript
const VALID_USERS = [
    { username: 'YOUR_USERNAME', password: 'YOUR_STRONG_PASSWORD' },
    { username: 'user2', password: 'another_password' }
];
```

### **Option 2: Add More Users**

Add as many users as you need:
```javascript
const VALID_USERS = [
    { username: 'admin', password: 'admin123' },
    { username: 'developer', password: 'dev@2025' },
    { username: 'manager', password: 'mgr@2025' },
    { username: 'analyst', password: 'analyst@2025' }
];
```

### **Option 3: Remove Default Credentials (Recommended for Production)**

For production, remove the demo footer in the login screen:

Find and remove this section in `api-monitor.html`:
```html
<div class="login-footer">
    <p>🔐 Protected Dashboard</p>
    <p style="margin-top: 10px;">Default credentials for demo:</p>
    <p><strong>Username:</strong> admin | <strong>Password:</strong> admin123</p>
</div>
```

---

## 🚀 **Accessing the Dashboard**

### **Local Access:**
```bash
open api-monitor.html
```

### **After GitHub Pages Deployment:**
```
https://infraxcoders.github.io/mf-research-portal/api-monitor.html
```

### **Login Process:**
1. Visit the monitor page
2. You'll see a login screen
3. Enter username and password
4. Click "Login"
5. Access granted!

---

## 🔐 **Password Best Practices**

### **For Development:**
✅ Use simple passwords like `admin123`  
✅ Keep default credentials for testing  
✅ Show credentials in login footer  

### **For Production:**
✅ Use **strong passwords** (12+ characters)  
✅ Include: uppercase, lowercase, numbers, symbols  
✅ Change default passwords immediately  
✅ Remove credentials hint from login screen  
✅ Don't commit real passwords to Git  

### **Example Strong Passwords:**
- `InfraX@2025!Secure`
- `MF-Portal#2025$`
- `API_Monitor@Prod2025!`

---

## 🛡️ **Security Limitations**

### **⚠️ Important Notes:**

**This is CLIENT-SIDE authentication:**
- Passwords are stored in JavaScript (visible in source code)
- Anyone can view the source and see passwords
- **Not suitable for highly sensitive data**
- Good for: Demo, internal tools, basic protection

### **Why Use It Then?**
- ✅ Prevents casual unauthorized access
- ✅ Stops accidental public viewing
- ✅ Good for internal team dashboards
- ✅ Free and easy to implement
- ✅ No backend server required

### **For Enterprise-Level Security:**

If you need true security, consider:

1. **Backend Authentication:**
   - Use Node.js/Python backend
   - Store passwords in database (hashed)
   - Use JWT tokens

2. **OAuth Integration:**
   - Google Sign-In
   - GitHub OAuth
   - Azure AD

3. **Serverless Functions:**
   - Vercel serverless functions
   - Netlify functions
   - AWS Lambda

---

## 📊 **Access Logs**

The dashboard logs all authentication events:

```javascript
✓ User "admin" logged in successfully
✓ User "gagandeep" logged in successfully
✓ User "admin" logged out
⚠️ Failed login attempt
```

Check browser console (F12) for detailed logs.

---

## 🎯 **Use Cases**

### **Perfect For:**
✅ Internal team monitoring  
✅ Development dashboards  
✅ Demo/presentation protection  
✅ Basic access control  
✅ GitHub Pages static sites  

### **Not Suitable For:**
❌ Production banking apps  
❌ Healthcare data  
❌ Legal documents  
❌ Personal sensitive information  
❌ Payment systems  

---

## 🔧 **Customization Options**

### **1. Change Session Duration**

Default: 30 minutes of inactivity

```javascript
// Change from 1800000 ms (30 min) to desired time
inactivityTimeout = setTimeout(() => {
    // ...
}, 1800000);  // Change this number

// Examples:
// 15 minutes: 900000
// 1 hour: 3600000
// 2 hours: 7200000
```

### **2. Add "Remember Me" Feature**

Use `localStorage` instead of `sessionStorage`:

```javascript
// In handleLogin function
localStorage.setItem('apiMonitorAuth', 'true');  // Persists across sessions
```

### **3. Add Password Strength Indicator**

Show password strength when creating accounts:
```javascript
function checkPasswordStrength(password) {
    if (password.length < 8) return 'Weak';
    if (password.length < 12) return 'Medium';
    return 'Strong';
}
```

---

## 📱 **Mobile Access**

The login screen is fully responsive:
- Touch-friendly inputs
- Mobile keyboard optimization
- Responsive layout
- Works on all devices

---

## 🎓 **Testing**

### **Test Login:**
```
Username: admin
Password: admin123
```

### **Test Failed Login:**
```
Username: wrong
Password: wrong
```
Should show error message and clear password field.

### **Test Auto-Logout:**
1. Login successfully
2. Wait 30 minutes without activity
3. Should auto-logout with alert

### **Test Logout:**
1. Click "Logout" button (top-right)
2. Confirm logout
3. Should redirect to login screen

---

## 🔄 **Resetting Credentials**

If you forget credentials:

1. **Option 1:** Check `api-monitor.html` source code
2. **Option 2:** Edit the file and change passwords
3. **Option 3:** Remove authentication (temporary):
   - Comment out `checkAuth()` call
   - Comment out `showLogin()` in init

---

## 📝 **Summary**

### **Default Setup:**
- ✅ 3 user accounts configured
- ✅ 30-minute auto-logout
- ✅ Session-based authentication
- ✅ Failed login tracking
- ✅ Logout confirmation
- ✅ Mobile responsive

### **Current Credentials:**
| Username | Password | Access Level |
|----------|----------|-------------|
| admin | admin123 | Full Access |
| gagandeep | secure@2025 | Full Access |
| infraxcoders | InfraX@123 | Full Access |

### **Security Status:**
⚠️ **Client-side protection** - Basic security for internal use  
✅ **Good for:** Internal dashboards, demos, testing  
❌ **Not for:** Sensitive data, production banking  

---

## ⚠️ **IMPORTANT REMINDERS**

1. **Change default passwords** before deploying
2. **Don't commit real passwords** to public Git repos
3. **Remove credentials hint** for production
4. **Use HTTPS** for any password transmission
5. **This is not enterprise-grade security**

---

**For questions or issues with authentication, check:**
- Browser console (F12) for error logs
- `api-monitor.html` source code
- This documentation file

**Happy Monitoring! 🔒**
