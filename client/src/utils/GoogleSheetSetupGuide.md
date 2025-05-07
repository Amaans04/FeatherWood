# FeatherWood Google Sheets Integration Guide

Follow these step-by-step instructions to set up a Google Sheet to collect form submissions from your website.

## Step 1: Create a New Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new blank spreadsheet
3. Rename it to "FeatherWood Form Submissions"

## Step 2: Set Up Google Apps Script

1. In your Google Sheet, click on **Extensions > Apps Script**
2. This will open a new tab with the Google Apps Script editor
3. Delete any existing code in the editor
4. Copy and paste the entire script from `client/src/utils/googleSheetsScript.js`
5. Click **Save** (the disk icon) and name your project "FeatherWood Form Handler"

## Step 3: Deploy as Web App

1. Click on **Deploy > New deployment**
2. Select **Web app** as the deployment type
3. Configure the following settings:
   - **Description**: FeatherWood Form Handler
   - **Execute as**: Me (your Google account)
   - **Who has access**: Anyone
4. Click **Deploy**
5. You'll be prompted to authorize the app - follow the prompts to grant access
6. After deployment, you'll receive a **Web app URL** - copy this URL

## Step 4: Update Your React Component

1. Open `client/src/pages/UserInfo.tsx`
2. Find this line in the `handleSubmit` function:
   ```javascript
   formElement.action = "YOUR_NEW_GOOGLE_SCRIPT_URL";
   ```
3. Replace `YOUR_NEW_GOOGLE_SCRIPT_URL` with the Web app URL you copied

## Step 5: Test the Integration

1. Fill out the form on your website with test data
2. Submit the form
3. Check your Google Sheet - a new row should appear with the submitted data

## Troubleshooting

If your form submissions aren't appearing in the Google Sheet:

1. Check the browser console for any JavaScript errors
2. Verify that the Web app URL is correctly copied into your code
3. Make sure your Google Apps Script is properly deployed and accessible
4. Check if your Google account has permission to edit the spreadsheet

## Security Notes

- This implementation uses GET requests which are simpler but less secure
- For handling sensitive data, consider implementing a server-side solution
- Always validate form data on both client and server sides
- Consider adding CAPTCHA to prevent spam submissions 