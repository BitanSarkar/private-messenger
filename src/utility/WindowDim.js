import { useState, useEffect } from 'react';

function getWindowDimensionsRatio() {
  const { innerWidth: width, innerHeight: height } = window;
  return [height, width];
}

export default function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensionsRatio());

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensionsRatio());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowDimensions;
}
