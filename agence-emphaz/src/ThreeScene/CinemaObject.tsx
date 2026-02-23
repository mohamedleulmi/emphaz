/**
 * CinemaObject Component
 * 3D Spiral/Vortex inspired by Emphaz logo
 */

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CinemaObjectProps {
  mouseX?: number;
  mouseY?: number;
}

// Custom spiral geometry generator
const createSpiralGeometry = () => {
  const points: THREE.Vector3[] = [];
  const turns = 3; // Number of spiral turns
  const height = 2.5;
  const segments = 200;

  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const angle = t * Math.PI * 2 * turns;
    const radius = 0.3 + t * 1.2; // Expanding radius
    const y = (t - 0.5) * height;

    points.push(new THREE.Vector3(
      Math.cos(angle) * radius,
      y,
      Math.sin(angle) * radius
    ));
  }

  return new THREE.TubeGeometry(
    new THREE.CatmullRomCurve3(points),
    150,
    0.08,
    12,
    false
  );
};

const CinemaObject = ({ mouseX = 0, mouseY = 0 }: CinemaObjectProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const targetRotation = useRef({ x: 0, y: 0 });

  // Create spiral geometry once
  const spiralGeometry = useMemo(() => createSpiralGeometry(), []);

  // Create inner spiral (smaller, offset)
  const innerSpiralGeometry = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const turns = 2.5;
    const height = 1.8;
    const segments = 150;

    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const angle = t * Math.PI * 2 * turns + Math.PI; // Offset by PI
      const radius = 0.2 + t * 0.7;
      const y = (t - 0.5) * height;

      points.push(new THREE.Vector3(
        Math.cos(angle) * radius,
        y,
        Math.sin(angle) * radius
      ));
    }

    return new THREE.TubeGeometry(
      new THREE.CatmullRomCurve3(points),
      100,
      0.06,
      10,
      false
    );
  }, []);

  // Core sphere at center
  const coreGeometry = useMemo(() => new THREE.SphereGeometry(0.25, 32, 32), []);

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
      {/* Outer spiral - white/light */}
      <mesh geometry={spiralGeometry} castShadow>
        <meshStandardMaterial
          color="#FFFFFF"
          emissive="#FFFFFF"
          emissiveIntensity={0.1}
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>

      {/* Inner spiral - gold accent */}
      <mesh geometry={innerSpiralGeometry} castShadow>
        <meshStandardMaterial
          color="#F5C518"
          emissive="#8B6508"
          emissiveIntensity={0.2}
          roughness={0.25}
          metalness={0.9}
        />
      </mesh>

      {/* Core sphere - dark with gold rim light effect */}
      <mesh geometry={coreGeometry}>
        <meshStandardMaterial
          color="#1a1a1a"
          emissive="#F5C518"
          emissiveIntensity={0.05}
          roughness={0.2}
          metalness={0.95}
        />
      </mesh>
    </group>
  );
};

export default CinemaObject;
