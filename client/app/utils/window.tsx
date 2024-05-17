import { useState, useEffect } from 'react';

export default function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    // Function to update window dimensions
    const updateWindowDimensions = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    // Check if we're in the browser environment
    if (typeof window !== 'undefined') {
      // Update dimensions on mount
      updateWindowDimensions();

      // Add event listener to update dimensions on window resize
      window.addEventListener('resize', updateWindowDimensions);

      // Cleanup function to remove event listener
      return () => {
        window.removeEventListener('resize', updateWindowDimensions);
      };
    }
  }, []);

  return windowDimensions;
}
