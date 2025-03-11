
import React, { useRef, useEffect, useState } from 'react';
import { Loader2, RotateCcw } from 'lucide-react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RadiationOverlay } from '@/components/radiation/RadiationOverlay';
import { ToxicButton } from '@/components/ui/toxic-button';

interface ModelPreviewProps {
  modelUrl: string;
  className?: string;
  height?: string;
  width?: string;
  autoRotate?: boolean;
  radiationLevel?: number;
  animateRadiation?: boolean;
  useRadiationCloud?: boolean;
  radiationCloudUrl?: string;
  revealValue?: number; // Controls the transition between radiation cloud and character model (0-100)
  showControls?: boolean; // Whether to show fullscreen controls
}

export const ModelPreview: React.FC<ModelPreviewProps> = ({ 
  modelUrl, 
  className = "", 
  height = "200px", 
  width = "100%",
  autoRotate = true,
  radiationLevel = 0,
  animateRadiation = true,
  useRadiationCloud = false,
  radiationCloudUrl = "bafybeiayvmbutisgus45sujbr65sqnpeqcd3vtu6tjxwbmwadf35frszp4",
  revealValue = 20, // Default to 20 (mostly obscured)
  showControls = true
}) => {
  // Transform revealValue to use the correct logic:
  // High revealValue = less radiation
  // Low revealValue = more radiation
  // We use 100 - revealValue for actual radiation level in the 3D scene
  const actualRadiationLevel = 100 - revealValue;
  
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [characterModel, setCharacterModel] = useState<THREE.Group | null>(null);
  const [radiationModel, setRadiationModel] = useState<THREE.Group | null>(null);
  const [scene, setScene] = useState<THREE.Scene | null>(null);
  const [mixer, setMixer] = useState<THREE.AnimationMixer | null>(null);
  const [clock] = useState(new THREE.Clock());
  const [processedCloudUrl, setProcessedCloudUrl] = useState<string | null>(null);
  const [processedModelUrl, setProcessedModelUrl] = useState<string | null>(null);
  const [transitionEffect, setTransitionEffect] = useState<THREE.ShaderMaterial | null>(null);
  const [transitionMesh, setTransitionMesh] = useState<THREE.Mesh | null>(null);
  const [lastRevealValue, setLastRevealValue] = useState(revealValue);
  const [transitionDirection, setTransitionDirection] = useState<'increasing' | 'decreasing' | null>(null);
  const [particleSystem, setParticleSystem] = useState<THREE.Points | null>(null);
  const [isAutoRotating, setIsAutoRotating] = useState(autoRotate);
  
  // Create a buffer to smooth the transition
  const smoothedRevealValue = useRef(revealValue);

  // Process the IPFS URLs
  useEffect(() => {
    const processUrls = () => {
      try {
        // Process radiation cloud URL
        if (radiationCloudUrl) {
          // Check if radiationCloudUrl is already a full URL or just a hash
          if (radiationCloudUrl.startsWith('http')) {
            setProcessedCloudUrl(radiationCloudUrl);
          } else {
            // Use a direct gateway URL (avoid dynamic fetch)
            const cloudHash = radiationCloudUrl.replace('ipfs://', '');
            setProcessedCloudUrl(`https://gateway.pinata.cloud/ipfs/${cloudHash}`);
          }
        }
        
        // Process character model URL
        if (modelUrl) {
          // Check if modelUrl is already a full URL or just a hash
          if (modelUrl.startsWith('http')) {
            setProcessedModelUrl(modelUrl);
          } else {
            // Use a direct gateway URL (avoid dynamic fetch)
            const modelHash = modelUrl.replace('ipfs://', '');
            setProcessedModelUrl(`https://gateway.pinata.cloud/ipfs/${modelHash}`);
          }
        }
      } catch (error) {
        console.error('Error processing URLs:', error);
        setError('Failed to process model URLs');
      }
    };
    
    processUrls();
  }, [radiationCloudUrl, modelUrl]);
  
  // Check for transition direction
  useEffect(() => {
    if (revealValue !== lastRevealValue) {
      setTransitionDirection(revealValue > lastRevealValue ? 'increasing' : 'decreasing');
      setLastRevealValue(revealValue);
    }
  }, [revealValue, lastRevealValue]);
  
  // Setup the scene, camera, and renderer when URLs are processed
  useEffect(() => {
    if (!containerRef.current || !processedCloudUrl || !processedModelUrl) return;
    
    console.log('Loading radiation cloud from:', processedCloudUrl);
    console.log('Loading character model from:', processedModelUrl);
    
    setLoading(true);
    setError(null);
    
    // Scene setup
    const newScene = new THREE.Scene();
    newScene.background = new THREE.Color(0x111111); // Dark gray background
    setScene(newScene);
    
    // Add ambient light with increased intensity
    const ambientLight = new THREE.AmbientLight(0xcccccc, 0.7);
    newScene.add(ambientLight);
    
    // Add directional light with increased intensity and adjusted position for better all-around lighting
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
    directionalLight.position.set(1, 1, 1);
    newScene.add(directionalLight);
    
    // Add a second directional light from opposite direction for balanced lighting
    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight2.position.set(-1, 0.5, -1);
    newScene.add(directionalLight2);
    
    // Add point lights for better 3D definition from multiple angles
    const pointLight1 = new THREE.PointLight(0xffffff, 0.8);
    pointLight1.position.set(2, 1, 3);
    newScene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0xffffff, 0.5);
    pointLight2.position.set(-2, 2, -1);
    newScene.add(pointLight2);
    
    // Add a point light below to ensure visibility from bottom angles
    const pointLight3 = new THREE.PointLight(0xffffff, 0.4);
    pointLight3.position.set(0, -2, 0);
    newScene.add(pointLight3);
    
    // Add a subtle radiation-colored point light - using vibrant green color
    const radiationLight = new THREE.PointLight(0x4DFF4D, 0.4); // Bright green
    radiationLight.position.set(0, 0, 2);
    newScene.add(radiationLight);
    
    // Camera setup with more optimal initial position
    const camera = new THREE.PerspectiveCamera(
      40, // FOV
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    // Position camera at an angle that provides a better view from all sides
    camera.position.set(3, 1, 4); // Adjusted for better initial view
    
    // Renderer setup with improved settings
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio for performance
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.5;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    containerRef.current.appendChild(renderer.domElement);
    
    // Controls with optimized settings
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = isAutoRotating;
    controls.autoRotateSpeed = 1.5;
    controls.enableZoom = true;
    controls.enablePan = false;
    controls.minDistance = 3;
    controls.maxDistance = 10;
    
    // Set target for orbit controls to focus on the center,
    // but slightly adjusted to improve visibility of all sides
    controls.target.set(0, 0.2, 0);
    controls.update();
    
    // Animation mixer
    const newMixer = new THREE.AnimationMixer(newScene);
    setMixer(newMixer);
    
    // Create particle system for radiation effects
    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = 5000;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleSizes = new Float32Array(particleCount);
    
    // Create particles in a spherical distribution
    for (let i = 0; i < particleCount; i++) {
      // Random spherical coordinates
      const radius = 2.5 * Math.cbrt(Math.random()); // cube root for uniform distribution
      const theta = Math.random() * Math.PI * 2; // horizontal angle
      const phi = Math.acos(2 * Math.random() - 1); // vertical angle
      
      // Convert to Cartesian coordinates
      particlePositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      particlePositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      particlePositions[i * 3 + 2] = radius * Math.cos(phi);
      
      // Random size
      particleSizes[i] = Math.random() * 0.03 + 0.01;
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeometry.setAttribute('size', new THREE.BufferAttribute(particleSizes, 1));
    
    // Create particle material with vibrant green glow effect
    const particleMaterial = new THREE.ShaderMaterial({
      uniforms: {
        color: { value: new THREE.Color(0x4DFF4D) }, // Vibrant green color
        pointTexture: { value: new THREE.TextureLoader().load('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAFFmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDAgNzkuMTYwNDUxLCAyMDE3LzA1LzA2LTAxOjA4OjIxICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgKE1hY2ludG9zaCkiIHhtcDpDcmVhdGVEYXRlPSIyMDE4LTEyLTAzVDE5OjMgOToyOC0wODowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAxOC0xMi0wM1QxOTozOToyOC0wODowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpmMzIwOGU0YS01OTVmLTRiNGItYmFkMy1lZWZiMzkxOTIzMDEiIHhtcE1NOkRvY3VtZW50SUQ9Inht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') },
        opacity: { value: 0.8 },
        reveal: { value: actualRadiationLevel / 100 } // Use the inverse of revealValue
      },
      vertexShader: `
        attribute float size;
        varying vec3 vColor;
        uniform float reveal;
        void main() {
          vColor = vec3(0.3, 1.0, 0.3); // Vibrant green glow
          
          // Scale size based on reveal value - particles grow larger as radiation increases
          float dynamicSize = size * reveal;
          
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = dynamicSize * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 color;
        uniform sampler2D pointTexture;
        uniform float opacity;
        uniform float reveal;
        varying vec3 vColor;
        void main() {
          // Sample the texture
          gl_FragColor = vec4(vColor, opacity * reveal);
          gl_FragColor = gl_FragColor * texture2D(pointTexture, gl_PointCoord);
          // Apply reveal opacity
          if (gl_FragColor.a < 0.1) discard;
        }
      `,
      blending: THREE.AdditiveBlending,
      depthTest: false,
      transparent: true
    });
    
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    newScene.add(particles);
    setParticleSystem(particles);
    
    // Create a fullscreen quad for transition effects
    const transitionGeometry = new THREE.PlaneGeometry(5, 5);
    const transitionMat = new THREE.ShaderMaterial({
      uniforms: {
        baseTexture: { value: null },
        revealTexture: { value: null },
        mixRatio: { value: 0.0 },
        threshold: { value: 0.1 },
        useTexture: { value: 0.0 },
        revealValue: { value: revealValue / 100 },
        transitionDirection: { value: transitionDirection === 'increasing' ? 1.0 : 0.0 }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float revealValue;
        uniform float transitionDirection;
        varying vec2 vUv;
        
        void main() {
          // This shader doesn't render anything directly
          // It's just a placeholder for more complex transition effects
          gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
        }
      `,
      transparent: true,
      opacity: 0
    });
    
    const transitionPlane = new THREE.Mesh(transitionGeometry, transitionMat);
    transitionPlane.visible = false; // Hidden by default
    newScene.add(transitionPlane);
    setTransitionMesh(transitionPlane);
    setTransitionEffect(transitionMat);
    
    // Loader for both models
    const loader = new GLTFLoader();
    let loadedCount = 0;
    
    // Load radiation cloud model
    console.log('Loading radiation cloud from:', processedCloudUrl);
    loader.load(
      processedCloudUrl,
      (gltf) => {
        // Center the model
        const box = new THREE.Box3().setFromObject(gltf.scene);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        
        // Normalize and center with slightly increased scale for the cloud
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 3.0 / maxDim; // Increased scale for the radiation cloud
        gltf.scene.scale.set(scale, scale, scale);
        gltf.scene.position.set(-center.x * scale, -center.y * scale, -center.z * scale);
        
        // Apply enhanced material for the radiation cloud
        gltf.scene.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            // Create new glow material for radiation cloud - using vibrant green color
            const radiationMaterial = new THREE.MeshPhongMaterial({
              color: new THREE.Color(0x4DFF4D), // Vibrant green
              emissive: new THREE.Color(0x115511), // Subtle green glow
              emissiveIntensity: 0.4,
              transparent: true,
              opacity: actualRadiationLevel / 100, // Use the actual radiation level
              shininess: 30
            });
            
            // Store original material for reference
            if (!child.userData.originalMaterial) {
              child.userData.originalMaterial = child.material;
            }
            
            // Apply the new material
            if (Array.isArray(child.material)) {
              child.material = Array(child.material.length).fill(radiationMaterial);
            } else {
              child.material = radiationMaterial;
            }
          }
        });
        
        // Store the radiation model reference
        setRadiationModel(gltf.scene);
        
        // Position the cloud to be slightly offset to not completely block the character
        gltf.scene.position.x += 0.3; // Offset to the right a bit
        
        // Add to scene
        newScene.add(gltf.scene);
        
        // Add glow effect for radiation cloud - in vibrant green
        const radiationGlowMaterial = new THREE.ShaderMaterial({
          uniforms: {
            color: { value: new THREE.Color(0x4DFF4D) }, // Vibrant green
            viewVector: { value: new THREE.Vector3(0, 0, 1) },
            c: { value: 0.2 },
            p: { value: 4.5 },
            opacity: { value: actualRadiationLevel / 100 } // Use the actual radiation level
          },
          vertexShader: `
            uniform vec3 viewVector;
            uniform float c;
            uniform float p;
            varying float intensity;
            void main() {
              vec3 vNormal = normalize(normalMatrix * normal);
              vec3 vNormel = normalize(normalMatrix * viewVector);
              intensity = pow(c - dot(vNormal, vNormel), p);
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `,
          fragmentShader: `
            uniform vec3 color;
            uniform float opacity;
            varying float intensity;
            void main() {
              vec3 glow = color * intensity;
              gl_FragColor = vec4(glow, opacity);
            }
          `,
          side: THREE.BackSide,
          blending: THREE.AdditiveBlending,
          transparent: true
        });
        
        // Increment loaded count
        loadedCount++;
        if (loadedCount === 2) {
          setLoading(false);
        }
      },
      (xhr) => {
        // Progress callback for radiation cloud
        console.log(`${(xhr.loaded / xhr.total) * 100}% loaded - Radiation cloud`);
      },
      (error) => {
        console.error('Error loading radiation cloud model:', error);
        setError('Failed to load radiation cloud. Please check the URL and try again.');
        setLoading(false);
      }
    );
    
    // Load character model
    console.log('Loading character model from:', processedModelUrl);
    loader.load(
      processedModelUrl,
      (gltf) => {
        // Center the model
        const box = new THREE.Box3().setFromObject(gltf.scene);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        
        // Normalize and center with optimized positioning
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 2.8 / maxDim; // Set appropriate scale
        gltf.scene.scale.set(scale, scale, scale);
        gltf.scene.position.set(-center.x * scale, -center.y * scale, -center.z * scale);
        
        // Rotate the character model slightly to show better silhouette
        gltf.scene.rotation.y = -Math.PI * 0.15; // Rotate left slightly
        
        // Apply material to character model with reveal-based effects
        gltf.scene.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            // Store original material for reference
            if (!child.userData.originalMaterial) {
              child.userData.originalMaterial = child.material.clone();
            }
            
            // For character model, create a material that becomes more visible as radiation decreases
            if (Array.isArray(child.material)) {
              child.material.forEach(mat => {
                mat.transparent = true;
                mat.opacity = (100 - actualRadiationLevel) / 100; // Inverse of radiation level
                mat.emissiveIntensity = 0.2 * ((100 - actualRadiationLevel) / 100); // Increase glow as revealed
              });
            } else {
              child.material.transparent = true;
              child.material.opacity = (100 - actualRadiationLevel) / 100; // Inverse of radiation level
              child.material.emissiveIntensity = 0.2 * ((100 - actualRadiationLevel) / 100); // Increase glow as revealed
            }
          }
        });
        
        // Store the character model reference
        setCharacterModel(gltf.scene);
        
        // Add to scene
        newScene.add(gltf.scene);
        
        // Increment loaded count
        loadedCount++;
        if (loadedCount === 2) {
          setLoading(false);
        }
      },
      (xhr) => {
        // Progress callback for character model
        console.log(`${(xhr.loaded / xhr.total) * 100}% loaded - Character model`);
      },
      (error) => {
        console.error('Error loading character model:', error);
        setError('Failed to load character model. Please check the URL and try again.');
        setLoading(false);
      }
    );
    
    // Create a smooth transition effect using LERP
    const smoothTransition = (current, target, factor = 0.05) => {
      return current + (target - current) * factor;
    };
    
    // Animation loop
    const animate = () => {
      const animationId = requestAnimationFrame(animate);
      
      // Update mixer for animations
      if (mixer) {
        const delta = clock.getDelta();
        mixer.update(delta);
      }
      
      // LERP the smoothedRevealValue
      smoothedRevealValue.current = smoothTransition(smoothedRevealValue.current, revealValue);
      const smoothedRadiationLevel = 100 - smoothedRevealValue.current; // Convert to radiation level
      
      // Update particle system
      if (particleSystem && particleSystem.material instanceof THREE.ShaderMaterial) {
        particleSystem.material.uniforms.reveal.value = smoothedRadiationLevel / 100;
        
        // Scale and position particles based on radiation level
        particleSystem.scale.set(
          1 + (0.5 * smoothedRadiationLevel / 100),
          1 + (0.5 * smoothedRadiationLevel / 100),
          1 + (0.5 * smoothedRadiationLevel / 100)
        );
        
        // Rotate particles slowly
        particleSystem.rotation.y += 0.001;
        particleSystem.rotation.x += 0.0005;
      }
      
      // Update radiation model opacity
      if (radiationModel) {
        radiationModel.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            // Calculate opacity with smooth transition
            const targetOpacity = smoothedRadiationLevel / 100;
            
            if (Array.isArray(child.material)) {
              child.material.forEach(mat => {
                // Smoothly transition opacity
                mat.opacity = targetOpacity;
                // Adjust emissive intensity for glow effect
                mat.emissiveIntensity = 0.4 * targetOpacity;
              });
            } else {
              // Smoothly transition opacity
              child.material.opacity = targetOpacity;
              // Adjust emissive intensity for glow effect
              child.material.emissiveIntensity = 0.4 * targetOpacity;
            }
          }
        });
      }
      
      // Update character model opacity and effects
      if (characterModel) {
        characterModel.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            // Calculate opacity with smooth transition - character is visible when radiation is low
            const targetOpacity = (100 - smoothedRadiationLevel) / 100;
            
            if (Array.isArray(child.material)) {
              child.material.forEach(mat => {
                // Smoothly transition opacity
                mat.opacity = targetOpacity;
                // Enhance material properties as character is revealed
                mat.emissiveIntensity = 0.2 * targetOpacity;
                mat.shininess = 10 + (20 * targetOpacity);
              });
            } else {
              // Smoothly transition opacity
              child.material.opacity = targetOpacity;
              // Enhance material properties as character is revealed
              child.material.emissiveIntensity = 0.2 * targetOpacity;
              if (child.material.shininess !== undefined) {
                child.material.shininess = 10 + (20 * targetOpacity);
              }
            }
          }
        });
      }
      
      // Update transition effect if available
      if (transitionEffect) {
        transitionEffect.uniforms.revealValue.value = (100 - smoothedRadiationLevel) / 100;
        transitionEffect.uniforms.transitionDirection.value = 
          transitionDirection === 'increasing' ? 1.0 : 0.0;
      }
      
      // Update controls and render
      controls.update();
      renderer.render(newScene, camera);
      
      return animationId;
    };
    
    const animationId = animate();
    
    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current) return;
      
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      cancelAnimationFrame(animationId);
      
      if (containerRef.current && containerRef.current.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
      }
      window.removeEventListener('resize', handleResize);
      
      // Dispose resources
      if (scene) {
        scene.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            object.geometry.dispose();
            
            if (Array.isArray(object.material)) {
              // Handle array of materials
              object.material.forEach(material => {
                if (material && typeof material.dispose === 'function') {
                  material.dispose();
                }
              });
            } else if (object.material) {
              // Handle single material
              if (typeof object.material.dispose === 'function') {
                object.material.dispose();
              }
            }
          }
        });
      }
      
      if (particleSystem) {
        if (particleSystem.geometry) particleSystem.geometry.dispose();
        if (particleSystem.material) {
          if (Array.isArray(particleSystem.material)) {
            particleSystem.material.forEach(material => {
              if (material && typeof material.dispose === 'function') {
                material.dispose();
              }
            });
          } else if (particleSystem.material && typeof particleSystem.material.dispose === 'function') {
            particleSystem.material.dispose();
          }
        }
      }
      
      if (transitionMesh) {
        if (transitionMesh.geometry) transitionMesh.geometry.dispose();
        if (transitionMesh.material) {
          if (Array.isArray(transitionMesh.material)) {
            transitionMesh.material.forEach(material => {
              if (material && typeof material.dispose === 'function') {
                material.dispose();
              }
            });
          } else if (transitionMesh.material && typeof transitionMesh.material.dispose === 'function') {
            transitionMesh.material.dispose();
          }
        }
      }
      
      renderer.dispose();
      controls.dispose();
      if (mixer) mixer.stopAllAction();
    };
  }, [processedCloudUrl, processedModelUrl, autoRotate, revealValue, transitionDirection, isAutoRotating]);
  
  // Directly render the container for the 3D model
  return (
    <div className={`${className}`}>
      <div 
        ref={containerRef} 
        className="w-full h-full rounded-lg overflow-hidden" 
        style={{ height, width }}
      >
        {loading && !error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <Loader2 className="h-8 w-8 text-white animate-spin" />
          </div>
        )}
        
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70">
            <div className="text-red-500 text-center p-4">
              <p>{error}</p>
              <p className="text-xs mt-2">Try refreshing or check the model URLs</p>
            </div>
          </div>
        )}
        
        <div className="absolute top-2 right-2 flex space-x-2">
          <ToxicButton 
            variant="outline" 
            size="sm" 
            className="bg-black/50 border-toxic-neon/40 text-toxic-neon"
            onClick={() => setIsAutoRotating(!isAutoRotating)}
          >
            <RotateCcw className={`h-4 w-4 mr-1 ${isAutoRotating ? 'animate-spin' : ''}`} />
            {isAutoRotating ? 'Stop' : 'Rotate'}
          </ToxicButton>
        </div>
      </div>
    </div>
  );
};
