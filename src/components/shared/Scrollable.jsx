import React, { useState, useEffect, useRef } from 'react';

const Scrollable = ({ children }) => {
  const [isScrolling, setIsScrolling] = useState(false);
  const [isScrollable, setIsScrollable] = useState(false);
  const divRef = useRef(null);
  let timeout;

  // Function to check if the div is scrollable
  const checkScrollable = () => {
    if (divRef.current) {
      const { scrollHeight, clientHeight } = divRef.current;
      setIsScrollable(scrollHeight > clientHeight);
    }
  };

  // Check scrollability on mount, resize, or content change
  useEffect(() => {
    checkScrollable();
    window.addEventListener('resize', checkScrollable);

    return () => {
      window.removeEventListener('resize', checkScrollable);
    };
  }, [children]);

  // Handle mouse wheel scrolling
  useEffect(() => {
    const handleWheel = () => {
      if (isScrollable) {
        setIsScrolling(true);
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          setIsScrolling(false);
        }, 1000); // Hide scrollbar after 1 second of inactivity
      }
    };

    const div = divRef.current;
    if (div) {
      div.addEventListener('wheel', handleWheel);
    }

    return () => {
      if (div) {
        div.removeEventListener('wheel', handleWheel);
      }
    };
  }, [isScrollable]);

  return (
    <div
      ref={divRef}
      className={`overflow-y-scroll scrollbar-thin flex flex-1 py-2 pr-2 ${isScrollable ? 'scrollable' : ''} ${
        isScrolling ? 'scrolling' : ''
      }`}
    >
      {children}
    </div>
  );
};

export default Scrollable;