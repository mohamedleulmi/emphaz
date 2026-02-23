/**
 * CinemaObject Component
 * 3D GLB Model loader with mouse interaction
 */

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

interface CinemaObjectProps {
  mouseX?: number;
  mouseY?: number;
}

// Chemin vers votre fichier GLB dans le dossier public
const MODEL_PATH = '/model.glb';

const CinemaObject = ({ mouseX = 0, mouseY = 0 }: CinemaObjectProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const targetRotation = useRef({ x: 0, y: 0 });

  // Charger le modèle GLB
  const { scene } = useGLTF(MODEL_PATH);

  useFrame((state) => {
    if (!groupRef.current) return;

    // Mouse-based rotation
    targetRotation.current.x = mouseY * 0.3;
    targetRotation.current.y = mouseX * 0.5;

    // Smooth lerp + continuous rotation
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      targetRotation.current.x,
      0.03
    );
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      targetRotation.current.y + state.clock.elapsedTime * 0.15,
      0.03
    );

    // Subtle floating
    groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.1;
  });

  return (
    <group ref={groupRef}>
      {/* Modèle GLB */}
      <primitive object={scene} scale={4} castShadow receiveShadow />
    </group>
  );
};

// Précharger le modèle pour de meilleures performances
useGLTF.preload(MODEL_PATH);

export default CinemaObject;
