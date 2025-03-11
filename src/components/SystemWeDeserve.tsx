
import { Eye, Users, HandshakeIcon } from "lucide-react";
import { useEffect, useRef } from "react";

export const SystemWeDeserve = () => {
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

  return (
    <section className="py-16 bg-black/30">
      <div className="container px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 via-teal-200 to-yellow-300 mb-8">
            The DAO We're Building
          </h2>
          
          <div className="space-y-4 mb-12 text-xl text-gray-300">
            <p 
              ref={el => boxRefs.current[0] = el}
              className="cosmic-box yellow-energy right-drain p-4 rounded-lg bg-black/30 backdrop-blur border border-yellow-500/20"
            >
              A DAO built to empower accountants with direct ownership in the firms they serve.
            </p>
            <p 
              ref={el => boxRefs.current[1] = el}
              className="cosmic-box teal-energy right-drain p-4 rounded-lg bg-black/30 backdrop-blur border border-teal-500/20"
            >
              A solution to the scarcity of quality firms by combining resources to access premium practices typically out of reach.
            </p>
            <p 
              ref={el => boxRefs.current[2] = el}
              className="cosmic-box yellow-energy right-drain p-4 rounded-lg bg-black/30 backdrop-blur border border-yellow-500/20"
            >
              A non-custodial system where investors maintain direct control of their assets without intermediaries.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
