declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export const trackPageView = (path: string) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "page_view", { page_path: path });
  }
};

export const trackAddToCart = (productName: string, price: number, category: string) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "add_to_cart", {
      currency: "INR",
      value: price,
      items: [{ item_name: productName, item_category: category, price }],
    });
  }
};

export const trackFormSubmit = (formName: string) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "form_submit", { form_name: formName });
  }
};

export const trackCalculatorUse = (calculatorType: string, estimatedValue: number) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "calculator_used", {
      calculator_type: calculatorType,
      estimated_value: estimatedValue,
    });
  }
};
