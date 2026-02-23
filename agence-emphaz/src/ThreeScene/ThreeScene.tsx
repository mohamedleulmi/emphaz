/**
 * ThreeScene Component
 * Main 3D scene with elegant lighting setup
 */

import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { Environment } from '@react-three/drei';
import CinemaObject from './CinemaObject';

interface ThreeSceneProps {
  /** Normalized mouse X position (-1 to 1) */
  mouseX?: number;
  /** Normalized mouse Y position (-1 to 1) */
  mouseY?: number;
}

/**
 * Lighting setup component
 * Creates dramatic cinematic lighting with soft shadows
 */
const Lighting = () => {
  return (
    <>
      {/* Ambient light for base illumination */}
      <ambientLight intensity={0.4} />

      {/* Main key light - top */}
      <spotLight
        position={[3, 5, 3]}
        angle={0.6}
        penumbra={1}
        intensity={2}
        color="#FFFFFF"
        castShadow
      />

      {/* Gold accent light */}
      <pointLight
        position={[-3, 2, 2]}
        intensity={0.8}
        color="#F5C518"
      />

      {/* Fill light - blue tint for contrast */}
      <pointLight
        position={[3, -2, -3]}
        intensity={0.3}
        color="#4169E1"
      />

      {/* Rim light from below */}
      <pointLight
        position={[0, -4, 0]}
        intensity={0.4}
        color="#FFFFFF"
      />
    </>
  );
};

const ThreeScene = ({ mouseX = 0, mouseY = 0 }: ThreeSceneProps) => {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 0, 6], fov: 50 }}
      gl={{
        antialias: true,
        alpha: true,
      }}
      style={{ background: 'transparent' }}
    >
      {/* Lighting setup */}
      <Lighting />

      {/* Main 3D object with suspense fallback */}
      <Suspense fallback={null}>
        <CinemaObject mouseX={mouseX} mouseY={mouseY} />

        {/* Environment map for reflections */}
        <Environment preset="city" />
      </Suspense>

      {/* Fog for depth */}
      <fog attach="fog" args={['#0A0A0A', 4, 12]} />
    </Canvas>
  );
};

export default ThreeScene;

