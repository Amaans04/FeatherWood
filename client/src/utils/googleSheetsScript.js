/**
 * Google Apps Script for FeatherWood form submissions
 * Use this code in your Google Apps Script editor
 */

function doGet(e) {
  // Process the GET request and return a success message
  try {
    // Make sure e and e.parameter exist to prevent errors
    e = e || {};
    e.parameter = e.parameter || {};
    
    // Enhanced logging - log all incoming parameters
    Logger.log("FORM SUBMISSION RECEIVED");
    Logger.log("Full e object: " + JSON.stringify(e));
    Logger.log("Parameters received: " + JSON.stringify(e.parameter));
    
    // Get the active spreadsheet
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    Logger.log("Spreadsheet ID: " + ss.getId());
    
    // Determine which sheet to use based on the formType parameter
    if (e.parameter.formType === "calculator") {
      saveCalculatorData(ss, e.parameter);
    } else if (e.parameter.formType === "contact") {
      saveContactPageData(ss, e.parameter);
    } else {
      saveContactFormData(ss, e.parameter);
    }
    
    // Return a success response with debug info
    return ContentService.createTextOutput(
      "Success! Data has been recorded. Check your Google Sheets document. " +
      "Sheet ID: " + ss.getId()
    ).setMimeType(ContentService.MimeType.TEXT);
      
  } catch (error) {
    // Enhanced error logging
    Logger.log("ERROR OCCURRED: " + error.toString());
    Logger.log("Error stack: " + error.stack);
    
    // Return an error response with more details
    return ContentService.createTextOutput(
      "Error: " + error.toString() + 
      "\n\nPlease check the Apps Script execution logs for more details."
    ).setMimeType(ContentService.MimeType.TEXT);
  }
}

/**
 * Saves contact form data to the Form Submissions sheet
 */
function saveContactFormData(ss, params) {
  let sheet = ss.getSheetByName("Form Submissions");
  
  // If the sheet doesn't exist, create it with headers
  if (!sheet) {
    Logger.log("Creating new sheet 'Form Submissions'");
    sheet = ss.insertSheet("Form Submissions");
    sheet.appendRow([
      "Timestamp", 
      "Form Type",
      "Name", 
      "Email", 
      "Phone", 
      "Property", 
      "WhatsApp Updates", 
      "Service",
      "Message",
      "Source URL"
    ]);
    Logger.log("Headers added to new sheet");
  } else {
    Logger.log("Found existing sheet 'Form Submissions'");
  }
  
  // Identify form type
  const formType = params.formType || "quote"; // Default to quote form
  
  // Debug what data we're trying to add
  const dataToAdd = [
    new Date(),                 // Timestamp
    formType,                   // Form Type (quote or contact)
    params.name || "",          // Name
    params.email || "",         // Email
    params.phone || "",         // Phone
    params.property || "",      // Property (may be empty for contact form)
    params.whatsappUpdates || "", // WhatsApp Updates (may be empty for contact form)
    params.service || "",       // Service (from contact form)
    params.message || "",       // Message (from contact form)
    params.sourceUrl || ""      // Source URL
  ];
  
  Logger.log("Attempting to add row with data: " + JSON.stringify(dataToAdd));
  
  // Add the form data to the sheet
  const result = sheet.appendRow(dataToAdd);
  Logger.log("Row added successfully to Form Submissions sheet");
  
  // Force the spreadsheet to save changes immediately
  SpreadsheetApp.flush();
  Logger.log("Spreadsheet flushed");
}

/**
 * Saves calculator form data to the Calculator Submissions sheet
 */
function saveCalculatorData(ss, params) {
  let sheet = ss.getSheetByName("Calculator Submissions");
  
  // If the sheet doesn't exist, create it with headers
  if (!sheet) {
    Logger.log("Creating new sheet 'Calculator Submissions'");
    sheet = ss.insertSheet("Calculator Submissions");
    sheet.appendRow([
      "Timestamp",
      "Calculator Type",
      "Name",
      "Email",
      "Phone",
      "City",
      "Selected Type",
      "Dimensions",
      "Material Grade",
      "Options",
      "Total Estimate",
      "Source URL"
    ]);
    Logger.log("Headers added to Calculator Submissions sheet");
  } else {
    Logger.log("Found existing Calculator Submissions sheet");
  }
  
  // Prepare data to add
  const dataToAdd = [
    new Date(),                      // Timestamp
    params.calculatorType || "",     // Calculator Type (wardrobe, kitchen, full home)
    params.name || "",               // Name
    params.email || "",              // Email
    params.phone || "",              // Phone
    params.city || "",               // City
    params.selectedType || "",       // Selected Type
    params.dimensions || "",         // Dimensions
    params.materialGrade || "",      // Material Grade
    params.options || "",            // Options/Accessories
    params.totalEstimate || "",      // Total Estimate
    params.sourceUrl || ""           // Source URL
  ];
  
  Logger.log("Attempting to add row to Calculator Submissions with data: " + JSON.stringify(dataToAdd));
  
  // Add the data to the sheet
  sheet.appendRow(dataToAdd);
  Logger.log("Row added successfully to Calculator Submissions sheet");
  
  // Force the spreadsheet to save changes immediately
  SpreadsheetApp.flush();
  Logger.log("Spreadsheet flushed");
}

/**
 * Saves contact page form data to the ContactPage sheet
 */
function saveContactPageData(ss, params) {
  let sheet = ss.getSheetByName("ContactPage");
  
  // If the sheet doesn't exist, create it with headers
  if (!sheet) {
    Logger.log("Creating new sheet 'ContactPage'");
    sheet = ss.insertSheet("ContactPage");
    sheet.appendRow([
      "Timestamp", 
      "Name", 
      "Email", 
      "Phone", 
      "City", 
      "Subject",
      "Message",
      "Source URL"
    ]);
    Logger.log("Headers added to new ContactPage sheet");
  } else {
    Logger.log("Found existing sheet 'ContactPage'");
  }
  
  // Debug what data we're trying to add
  const dataToAdd = [
    new Date(),                 // Timestamp
    params.name || "",          // Name
    params.email || "",         // Email
    params.phone || "",         // Phone
    params.city || "",          // City
    params.subject || "",       // Subject
    params.message || "",       // Message
    params.sourceUrl || ""      // Source URL
  ];
  
  Logger.log("Attempting to add row with data: " + JSON.stringify(dataToAdd));
  
  // Add the form data to the sheet
  const result = sheet.appendRow(dataToAdd);
  Logger.log("Row added successfully to ContactPage sheet");
  
  // Force the spreadsheet to save changes immediately
  SpreadsheetApp.flush();
  Logger.log("Spreadsheet flushed");
}

/**
 * Run this function to test the sheet connection
 * This can be safely run directly from the Apps Script editor
 */
function testAddRow() {
  try {
    Logger.log("Running test function");
    
    // Get the active spreadsheet and sheet
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    Logger.log("Connected to spreadsheet: " + ss.getName() + " (ID: " + ss.getId() + ")");
    
    // Test contact form submission
    saveContactFormData(ss, {
      formType: "test",
      name: "Test Name",
      email: "test@example.com",
      phone: "1234567890",
      property: "Test Property",
      whatsappUpdates: "Yes",
      service: "interior-design",
      message: "This is a test message for testing form submission",
      sourceUrl: "https://test-source-url.com"
    });
    
    // Test calculator submission
    saveCalculatorData(ss, {
      calculatorType: "wardrobe",
      name: "Test Calculator User",
      email: "test@example.com",
      phone: "9876543210",
      city: "Bangalore",
      selectedType: "sliding",
      dimensions: "6ft × 7ft × 2ft",
      materialGrade: "Premium",
      options: "Enhanced organization, LED Lighting package",
      totalEstimate: "75000",
      sourceUrl: "https://test-calculator-url.com"
    });
    
    Logger.log("TEST SUCCESSFUL: Test rows added to both sheets");
    return "Test successful: Rows added to both sheets";
  } catch (error) {
    Logger.log("TEST FAILED: " + error.toString());
    Logger.log("Error stack: " + error.stack);
    return "Test failed: " + error.toString();
  }
}

/**
 * Setup Instructions:
 * 
 * 1. Create a new Google Sheet
 * 2. Go to Extensions > Apps Script
 * 3. Copy and paste this entire script
 * 4. Save the project with a name like "FeatherWood Form Handler"
 * 5. Click on Run > Run function > testAddRow to verify the script is connected to your sheet
 * 6. Click Deploy > New deployment
 * 7. Select "Web app" as the deployment type
 * 8. Set "Execute as" to "Me"
 * 9. Set "Who has access" to "Anyone"
 * 10. Click "Deploy"
 * 11. Copy the Web app URL that is generated
 * 12. Use this URL in your form submission code
 * 
 * TROUBLESHOOTING:
 * - Never run doGet directly from the editor - use testAddRow to test instead
 * - If data isn't appearing in your sheet, go to Apps Script and check View > Logs
 * - Make sure you're looking at the correct Google Sheet (the script runs on the sheet it's attached to)
 * - Try redeploying the web app with a new version
 * - Check that your Google account has permission to modify the spreadsheet
 */ 