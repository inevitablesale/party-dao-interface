
import { useEffect, useRef } from "react";

export const ReclaimControl = () => {
  const boxRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const calculateTiltAndEnergy = () => {
      const blackHoleCenter = {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2
      };

      boxRefs.current.forEach((box, index) => {
        if (!box) return;

        const rect = box.getBoundingClientRect();
        const boxCenter = {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2
        };

        // Calculate angle to black hole
        const angleRad = Math.atan2(
          blackHoleCenter.y - boxCenter.y,
          blackHoleCenter.x - boxCenter.x
        );
        const angleDeg = (angleRad * 180) / Math.PI;

        // Calculate distance for energy intensity
        const distance = Math.sqrt(
          Math.pow(blackHoleCenter.x - boxCenter.x, 2) +
          Math.pow(blackHoleCenter.y - boxCenter.y, 2)
        );
        const normalizedDistance = Math.min(1, distance / 1000);
        
        // Calculate tilt based on position relative to black hole
        const tiltX = (boxCenter.x - blackHoleCenter.x) / 30;
        const tiltY = (boxCenter.y - blackHoleCenter.y) / 30;

        // Apply transformations
        box.style.setProperty('--tilt-x', `${tiltX}deg`);
        box.style.setProperty('--tilt-y', `${tiltY}deg`);
        box.style.setProperty('--angle', `${angleDeg}deg`);
        box.style.setProperty('--flow-distance', `${distance / 5}px`);
        box.style.setProperty('--flow-x', `${Math.cos(angleRad) * 100}px`);
        box.style.setProperty('--flow-y', `${Math.sin(angleRad) * 100}px`);
        box.style.setProperty('--energy-opacity', `${1 - normalizedDistance}`);

        // Add active class for energy effects
        box.classList.add('active');
      });
    };

    window.addEventListener('scroll', calculateTiltAndEnergy);
    window.addEventListener('resize', calculateTiltAndEnergy);
    calculateTiltAndEnergy(); // Initial calculation

    return () => {
      window.removeEventListener('scroll', calculateTiltAndEnergy);
      window.removeEventListener('resize', calculateTiltAndEnergy);
    };
  }, []);

  return null;
};
