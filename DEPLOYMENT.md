# Deployment Guide - Vinhomes Quiz App

## 🚀 Quick Deploy to Netlify (Recommended)

### Option 1: Deploy via Netlify CLI (Fastest)

#### Step 1: Install Netlify CLI
```bash
npm install -g netlify-cli
```

#### Step 2: Login to Netlify
```bash
netlify login
```
This will open a browser window for authentication.

#### Step 3: Deploy
```bash
# From project root directory
cd /home/hoanht/Projects/quiz

# Deploy to Netlify
netlify deploy --prod
```

When prompted:
- **Create & configure a new site**: Yes
- **Team**: Choose your team
- **Site name**: `vinhomes-quiz` (or your preferred name)
- **Publish directory**: `.` (current directory)

#### Step 4: Done!
Your site will be live at: `https://vinhomes-quiz.netlify.app`

---

### Option 2: Deploy via Netlify Web UI

#### Step 1: Prepare for Deployment
```bash
# Make sure all files are committed (if using git)
git add .
git commit -m "Ready for deployment v1.1.0"
git push
```

#### Step 2: Go to Netlify
1. Visit: https://app.netlify.com/
2. Click **"Add new site"** → **"Import an existing project"**

#### Step 3: Connect Repository
- **GitHub**: Connect your GitHub account and select the repo
- **GitLab**: Connect GitLab
- **Bitbucket**: Connect Bitbucket
- **Deploy manually**: Drag and drop the project folder

#### Step 4: Configure Build Settings
- **Build command**: Leave empty (static site)
- **Publish directory**: `.` (root directory)
- **Branch**: `main` or `master`

#### Step 5: Deploy
Click **"Deploy site"**

Your site will be live in ~30 seconds!

---

### Option 3: Manual Drag & Drop (No Git Required)

#### Step 1: Create Deployment Package
```bash
cd /home/hoanht/Projects/quiz

# Create a zip file (exclude unnecessary files)
zip -r vinhomes-quiz.zip . \
  -x "*.git*" \
  -x "*node_modules*" \
  -x "*.backup*" \
  -x "*test-results.html*" \
  -x "*.md"
```

#### Step 2: Deploy to Netlify
1. Go to: https://app.netlify.com/drop
2. Drag and drop the `vinhomes-quiz.zip` file
3. Wait for deployment to complete
4. Your site is live!

---

## 🔧 Post-Deployment Configuration

### 1. Custom Domain (Optional)

#### Via Netlify Dashboard:
1. Go to **Site settings** → **Domain management**
2. Click **"Add custom domain"**
3. Enter your domain: `quiz.vinhomes.com`
4. Follow DNS configuration instructions

#### DNS Settings:
```
Type: CNAME
Name: quiz
Value: your-site-name.netlify.app
```

### 2. Environment Variables

Netlify doesn't need environment variables for this app since:
- Google Sheets URL is in `config/google-sheets.config.js`
- No sensitive API keys exposed
- All configuration is client-side

### 3. HTTPS/SSL

✅ **Automatic!** Netlify provides free SSL certificates.

Your site will be accessible at:
- `https://your-site-name.netlify.app` (HTTPS)
- ❌ HTTP is automatically redirected to HTTPS

---

## 📊 Deployment Checklist

Before deploying, verify:

- [ ] All files are present and up-to-date
- [ ] Google Apps Script URL is configured in `config/google-sheets.config.js`
- [ ] Version updated in `version.js` (currently 1.1.0)
- [ ] Tested locally and everything works
- [ ] `.env` file is gitignored (it is)
- [ ] No sensitive data in code
- [ ] All documentation is complete

---

## 🧪 Post-Deployment Testing

After deployment, test:

### 1. Basic Functionality
- [ ] Landing page loads
- [ ] Form validation works
- [ ] Quiz starts correctly
- [ ] 30 MCQ questions load
- [ ] Timer counts down
- [ ] Submit works
- [ ] Results display correctly

### 2. Google Sheets Integration
- [ ] Results submit to Google Sheets
- [ ] Success notification appears
- [ ] Data appears in sheet correctly

### 3. Cross-Browser Testing
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge

### 4. Mobile Testing
- [ ] iPhone/iOS
- [ ] Android
- [ ] Tablet

### 5. Performance
- [ ] Page loads quickly (<3 seconds)
- [ ] No console errors
- [ ] All assets load correctly

---

## 🔄 Continuous Deployment

### Auto-Deploy on Git Push

If you connected via GitHub/GitLab:

1. **Make changes** to your code
2. **Commit and push**:
   ```bash
   git add .
   git commit -m "Update quiz questions"
   git push
   ```
3. **Netlify auto-deploys** in ~30 seconds

### Deploy Previews

Netlify creates preview URLs for:
- Pull requests
- Branch deployments
- Manual deploys

---

## 🌐 Alternative Hosting Options

### Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

Configuration: `vercel.json`
```json
{
  "version": 2,
  "builds": [
    {
      "src": "**/*",
      "use": "@vercel/static"
    }
  ]
}
```

### GitHub Pages

```bash
# Enable GitHub Pages in repo settings
# Set source to main branch, root directory

# Your site will be at:
# https://username.github.io/quiz
```

### Firebase Hosting

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Initialize
firebase init hosting

# Deploy
firebase deploy
```

---

## 📈 Monitoring & Analytics

### Add Google Analytics (Optional)

Add to `index.html`, `quiz.html`, `results.html` before `</head>`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Netlify Analytics

- Built-in analytics available
- Go to **Site settings** → **Analytics**
- View traffic, page views, bandwidth

---

## 🔒 Security Best Practices

### Already Implemented:
- ✅ HTTPS enforced
- ✅ Security headers configured
- ✅ No sensitive data in client code
- ✅ Google Sheets uses Apps Script (secure)
- ✅ `.env` file gitignored

### Additional Recommendations:
1. **Restrict Google Apps Script**:
   - Only allow specific domains
   - Add rate limiting if needed

2. **Monitor Usage**:
   - Check Google Sheets for spam submissions
   - Monitor Netlify bandwidth

3. **Backup Data**:
   - Regularly export Google Sheets data
   - Keep backups of quiz questions

---

## 🐛 Troubleshooting

### Issue: Site not loading
- Check Netlify deploy logs
- Verify all files uploaded correctly
- Check browser console for errors

### Issue: Google Sheets not working
- Verify Apps Script URL is correct
- Check Apps Script is deployed as "Anyone"
- Test with browser console

### Issue: Old version showing
- Clear Netlify cache: **Site settings** → **Build & deploy** → **Clear cache**
- Update `version.js` to force browser refresh
- Hard refresh browser: `Ctrl+Shift+R`

### Issue: 404 errors
- Check `netlify.toml` redirect rules
- Verify file paths are correct
- Check case sensitivity (Linux is case-sensitive)

---

## 📞 Support

### Netlify Support
- Docs: https://docs.netlify.com/
- Community: https://answers.netlify.com/
- Status: https://www.netlifystatus.com/

### Project Issues
- Check `CHANGELOG.md` for recent changes
- Review `TESTING-CHECKLIST.md`
- Check browser console for errors

---

## 🎯 Quick Commands Reference

```bash
# Deploy to Netlify
netlify deploy --prod

# View deploy logs
netlify logs

# Open site in browser
netlify open:site

# Open Netlify dashboard
netlify open:admin

# Check site status
netlify status

# Link to existing site
netlify link
```

---

## ✅ Deployment Complete!

After successful deployment:

1. **Test the live site** thoroughly
2. **Share the URL** with users
3. **Monitor** Google Sheets for submissions
4. **Update** `version.js` for future changes
5. **Document** any custom configurations

---

**Your quiz app is now live! 🎉**

**Live URL**: `https://your-site-name.netlify.app`  
**Version**: 1.1.0  
**Last Updated**: 2025-11-12
