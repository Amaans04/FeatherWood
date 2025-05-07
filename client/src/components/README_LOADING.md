# Loading System Documentation

## Overview

The loading system provides a way to show a loading spinner only when necessary, such as during API calls or intensive data processing.

## Key Components

1. **LoadingContext**: Manages the global loading state
2. **LoadingSpinner**: The visual loading indicator
3. **useApiLoading**: Hook for API calls
4. **DevTools**: Developer tools for debugging loading issues (Press Ctrl+Shift+D to open)

## Important: When to Use Loading

The loading spinner should be shown **ONLY** when necessary, such as:
- When making API calls
- When loading large amounts of data
- During complex calculations or processing

**DO NOT** show the loading spinner:
- During normal page navigation
- For minor UI updates
- By default on page load

## How to Use Loading for API Calls

```jsx
import { useApiLoading } from '@/hooks/useApiLoading';

function MyComponent() {
  const { withLoading } = useApiLoading();
  
  const fetchData = async () => {
    // This will automatically show the loading spinner
    const data = await withLoading(async () => {
      const response = await fetch('/api/data');
      return response.json();
    });
    
    // Process the data...
  };
  
  return (
    <button onClick={fetchData}>Load Data</button>
  );
}
```

## If Loading Gets Stuck

1. Press Ctrl+Shift+D to open DevTools
2. Click "Force Stop Loading"
3. The loading spinner will auto-cancel after 10 seconds
4. You can click the "Cancel Loading" button that appears after 2 seconds

## Best Practices

1. **Be Selective**: Only show loading for operations that take significant time
2. **Use the Appropriate Hook**: Use `useApiLoading` for API calls
3. **Clean Up**: Always handle cleanup when components unmount
4. **Handle Errors**: Make sure loading stops even if errors occur (use try/finally)

## Debugging Loading Issues

If the loading spinner is showing when it shouldn't:

1. Check that you're not calling `startLoading` without a matching `stopLoading`
2. Make sure async operations always call `stopLoading` in a `finally` block
3. Check if components are unmounting before their loading operations complete

## Need Help?

If you encounter any issues with the loading system:
1. Check the console for loading logs
2. Use the DevTools (Ctrl+Shift+D) to see the current loading state
3. Add console logs to track loading state changes in your components 