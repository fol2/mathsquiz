import React, { useEffect } from 'react';

interface MobileKeyboardHandlerProps {
  children: React.ReactNode;
}

const MobileKeyboardHandler: React.FC<MobileKeyboardHandlerProps> = ({ children }) => {
  useEffect(() => {
    const handleViewportChange = () => {
      // Force a reflow to handle iOS Safari keyboard issues
      document.body.style.height = '100vh';
      document.body.style.height = window.innerHeight + 'px';
      
      // Add safe area handling
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    const handleOrientationChange = () => {
      // Delay the viewport fix for orientation changes
      setTimeout(handleViewportChange, 100);
    };

    // Set initial viewport height
    handleViewportChange();

    // Add event listeners
    window.addEventListener('resize', handleViewportChange);
    window.addEventListener('orientationchange', handleOrientationChange);
    
    // Visual Viewport API support for better keyboard handling
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleViewportChange);
    }

    return () => {
      window.removeEventListener('resize', handleViewportChange);
      window.removeEventListener('orientationchange', handleOrientationChange);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleViewportChange);
      }
    };
  }, []);

  return (
    <div className="mobile-viewport-handler">
      {children}
    </div>
  );
};

export default MobileKeyboardHandler; 