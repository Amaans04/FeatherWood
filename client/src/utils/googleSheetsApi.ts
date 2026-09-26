/**
 * Utility functions for submitting form data to Google Sheets
 */

// Google Apps Script Web App URL
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbw_CsG5qUH22QoyuPhMUZQ2bGX0GeEz35wHDhNkz8Pyrzajb49AVdEn0i5fA_pTmgEyAA/exec";

/**
 * Submits contact form data to Google Sheets using a hidden form
 * @param formData The form data to submit
 * @returns Promise that resolves when the submission is complete
 */
export const submitContactFormToGoogleSheets = async (formData: {
  name: string;
  email: string;
  phone: string;
  city: string;
  subject: string;
  message: string;
}): Promise<{ success: boolean; message: string }> => {
  return new Promise((resolve) => {
    try {
      // Create a hidden form element
      const form = document.createElement('form');
      form.method = 'GET';
      form.action = GOOGLE_SCRIPT_URL;
      form.target = '_blank'; // Open in a new tab/window
      form.style.display = 'none';
      
      // Add form type parameter
      const formTypeInput = document.createElement('input');
      formTypeInput.type = 'hidden';
      formTypeInput.name = 'formType';
      formTypeInput.value = 'contact';
      form.appendChild(formTypeInput);
      
      // Add all form fields
      Object.entries(formData).forEach(([key, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = value;
        form.appendChild(input);
      });
      
      // Add source URL
      const sourceUrlInput = document.createElement('input');
      sourceUrlInput.type = 'hidden';
      sourceUrlInput.name = 'sourceUrl';
      sourceUrlInput.value = window.location.href;
      form.appendChild(sourceUrlInput);
      
      // Add the form to the document
      document.body.appendChild(form);
      
      // Submit the form
      form.submit();
      
      // Remove the form from the document
      document.body.removeChild(form);
      
      // Since we can't get a response from the form submission,
      // we'll assume success if no error was thrown
      resolve({ success: true, message: "Form submitted successfully!" });
    } catch (error) {
      console.error("Error submitting form to Google Sheets:", error);
      resolve({ 
        success: false, 
        message: `Error submitting form: ${error instanceof Error ? error.message : "Unknown error"}` 
      });
    }
  });
}; 