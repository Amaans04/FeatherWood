# Google Sheets Integration for User Form Data

This guide explains how to connect your FeatherWood form submissions to Google Sheets, allowing you to collect and organize customer data efficiently.

## Option 1: Using Google Apps Script (Recommended)

1. **Create a Google Sheet**
   - Go to [Google Sheets](https://sheets.google.com) and create a new spreadsheet
   - Name the first sheet "Form Submissions"
   - Add the following column headers in row 1:
     - Timestamp
     - Name
     - Email
     - Phone
     - Property
     - WhatsApp Updates
     - Source URL

2. **Create a Google Apps Script**
   - In your Google Sheet, click on "Extensions" > "Apps Script"
   - Replace the default code with:

```javascript
function doGet(e) {
  // Handle GET requests - extract data from URL parameters
  return handleRequest(e.parameter);
}

function doPost(e) {
  // Handle POST requests - extract data from POST body
  var data;
  try {
    data = JSON.parse(e.postData.contents);
  } catch (error) {
    // If parsing fails, try to use form data directly
    data = e.parameter;
  }
  return handleRequest(data);
}

function handleRequest(data) {
  try {
    // Log the received data for debugging
    Logger.log("Received data: " + JSON.stringify(data));
    
    // Get the active sheet
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Form Submissions");
    
    if (!sheet) {
      // Sheet doesn't exist - create it with headers
      const newSheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet("Form Submissions");
      newSheet.appendRow([
        "Timestamp", "Name", "Email", "Phone", "Property", "WhatsApp Updates", "Source URL"
      ]);
      sheet = newSheet;
    }
    
    // Add a new row with the form data
    sheet.appendRow([
      new Date(),             // Timestamp
      data.name || "",        // Name
      data.email || "",       // Email
      data.phone || "",       // Phone
      data.property || "",    // Property
      data.whatsappUpdates || "", // WhatsApp Updates
      data.sourceUrl || ""    // Source URL
    ]);
    
    // Return success response
    return ContentService.createTextOutput(JSON.stringify({
      'result': 'success',
      'message': 'Data added to Google Sheet'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    // Log the error
    Logger.log("Error: " + error.toString());
    
    // Return error response
    return ContentService.createTextOutput(JSON.stringify({
      'result': 'error',
      'message': error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
```

3. **Deploy the Web App**
   - Click on "Deploy" > "New deployment"
   - Select "Web app" as the deployment type
   - Set "Who has access" to "Anyone"
   - Click "Deploy"
   - Copy the web app URL that is generated

4. **Update Your Form Handler**
   - Modify your form submission handler in `UserInfo.tsx` to send data to the Google Apps Script:

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  // Validate form
  if (!formData.name || !formData.email || !formData.phone) {
    toast({
      title: "Error",
      description: "Please fill in all required fields",
      variant: "destructive"
    });
    return;
  }
  
  setIsSubmitting(true);
  
  try {
    // The URL from your Google Apps Script deployment
    const googleScriptUrl = "YOUR_GOOGLE_SCRIPT_URL_HERE"; 
    
    // Send data to Google Sheets
    const response = await fetch(googleScriptUrl, {
      method: "POST",
      body: JSON.stringify({
        ...formData,
        sourceUrl: window.location.href
      })
    });
    
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    
    // Form is valid, show success message
    toast({
      title: "Quote Requested",
      description: "We'll contact you shortly with your free quote!",
    });
    
    // Reset form after submission
    setFormData({
      name: "",
      email: "",
      phone: "",
      property: "",
      whatsappUpdates: false
    });
  } catch (error) {
    console.error("Error submitting form:", error);
    toast({
      title: "Submission Error",
      description: "There was a problem submitting your form. Please try again.",
      variant: "destructive"
    });
  } finally {
    setIsSubmitting(false);
  }
};
```

## Option 2: Using Zapier or Make.com (Integromat)

If you prefer a no-code solution:

1. **Create a Zap in Zapier or a Scenario in Make.com**
   - Trigger: Webhook (to receive form submissions)
   - Action: Add a row to Google Sheets

2. **Configure the Webhook**
   - Create a new webhook in Zapier/Make
   - Copy the webhook URL

3. **Update Your Form Handler**
   - Use the webhook URL in your form submission code:

```typescript
const webhookUrl = "YOUR_WEBHOOK_URL_HERE";

// Send data to the webhook
await fetch(webhookUrl, {
  method: "POST",
  body: JSON.stringify(formData),
  headers: {
    "Content-Type": "application/json"
  }
});
```

## Option 3: Using FormSubmit.co (Simplest)

If you want a quick solution without writing any code:

1. **Sign up for FormSubmit.co**
   - Go to [FormSubmit.co](https://formsubmit.co/)
   - Follow their instructions to set up email forwarding

2. **Configure your form**
   - Update the form action to point to FormSubmit:

```html
<form action="https://formsubmit.co/your-email@example.com" method="POST">
  <!-- Form fields here -->
</form>
```

3. **Add a Google Sheets integration**
   - In FormSubmit dashboard, connect to Google Sheets

## Security Considerations

- Always validate form inputs on both client and server sides
- Consider adding reCAPTCHA to prevent spam submissions
- If handling sensitive data, ensure GDPR compliance and proper data encryption
- Test the integration thoroughly before using in production

For additional support, refer to:
- [Google Apps Script Documentation](https://developers.google.com/apps-script)
- [Zapier Google Sheets Integration](https://zapier.com/apps/google-sheets/integrations)
- [Make.com Google Sheets Integration](https://www.make.com/en/integrations/google-sheets) 