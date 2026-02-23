/**
 * Team Section
 * Company info + Team member selection (video game character select style)
 */

import { useState, useRef, Suspense, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment } from '@react-three/drei';
import * as THREE from 'three';
import '../styles/Team.css';

// Types
interface TeamMember {
  id: number;
  name: string;
  role: string;
  description: string;
  modelPath: string; // Path to the 3D head model
  stats: {
    creativity: number;
    technical: number;
    leadership: number;
  };
}

// Team data - vous pouvez modifier les chemins des modèles 3D
const teamMembers: TeamMember[] = [
  {
    id: 1,
    name: 'Alexandre Martin',
    role: 'Directeur Créatif',
    description: 'Visionnaire créatif avec plus de 10 ans d\'expérience dans la direction artistique et le branding cinématographique.',
    modelPath: '/models/head1.glb',
    stats: { creativity: 95, technical: 75, leadership: 90 },
  },
  {
    id: 2,
    name: 'Sophie Laurent',
    role: 'Lead Developer',
    description: 'Experte en développement web et 3D, elle transforme les visions créatives en expériences interactives immersives.',
    modelPath: '/models/head2.glb',
    stats: { creativity: 80, technical: 98, leadership: 85 },
  },
  {
    id: 2,
    name: 'Sophie Laurent',
    role: 'Lead Developer',
    description: 'Experte en développement web et 3D, elle transforme les visions créatives en expériences interactives immersives.',
    modelPath: '/models/head3.glb',
    stats: { creativity: 80, technical: 98, leadership: 85 },
  },
];

// Company info data
const companyInfo = {
  phone: '+33 1 23 45 67 89',
  email: 'contact@emphaz.com',
  address: '42 Avenue des Champs-Élysées, 75008 Paris',
  hours: 'Lun - Ven: 9h00 - 18h00',
};

// 3D Head Model Component
const HeadModel = ({ modelPath }: { modelPath: string }) => {
  const { scene } = useGLTF(modelPath);

  // Clone the scene to avoid conflicts
  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);

    // Center the model
    const box = new THREE.Box3().setFromObject(clone);
    const center = box.getCenter(new THREE.Vector3());
    clone.position.sub(center);

    clone.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    return clone;
  }, [scene]);

  return (
    <primitive object={clonedScene} scale={5} position={[0, 0, 0]} />
  );
};

// Fallback 3D placeholder (sphere) when model not found
const PlaceholderHead = () => {
  return (
    <mesh>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial
        color="#1a1a1a"
        metalness={0.8}
        roughness={0.2}
        emissive="#F5C518"
        emissiveIntensity={0.1}
      />
    </mesh>
  );
};

// Error Boundary for 3D model loading
const ModelWithFallback = ({ modelPath }: { modelPath: string }) => {
  try {
    return <HeadModel modelPath={modelPath} />;
  } catch {
    return <PlaceholderHead />;
  }
};

// Stat Bar Component
const StatBar = ({ label, value, delay }: { label: string; value: number; delay: number }) => (
  <div className="stat-bar">
    <div className="stat-bar__header">
      <span className="stat-bar__label">{label}</span>
      <span className="stat-bar__value">{value}</span>
    </div>
    <div className="stat-bar__track">
      <motion.div
        className="stat-bar__fill"
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 1, delay, ease: 'easeOut' }}
      />
    </div>
  </div>
);

// Info Item Component with 3D effect
const InfoItem = ({ icon, label, value, index }: { icon: string; label: string; value: string; index: number }) => (
  <motion.div
    className="info-item"
    initial={{ opacity: 0, x: -50, rotateY: -15 }}
    whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay: index * 0.1 }}
    whileHover={{ scale: 1.02, x: 10 }}
  >
    <div className="info-item__icon">{icon}</div>
    <div className="info-item__content">
      <span className="info-item__label">{label}</span>
      <span className="info-item__value">{value}</span>
    </div>
    <div className="info-item__glow" />
  </motion.div>
);

const Team = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedMember = teamMembers[selectedIndex];
  const sectionRef = useRef<HTMLElement>(null);

  // Carousel navigation
  const nextMember = () => {
    setSelectedIndex((prev) => (prev + 1) % teamMembers.length);
  };

  const prevMember = () => {
    setSelectedIndex((prev) => (prev - 1 + teamMembers.length) % teamMembers.length);
  };

  return (
    <section className="team" ref={sectionRef} id="team">
      {/* Background effects */}
      <div className="team__bg-grid" aria-hidden="true" />
      <div className="team__bg-glow" aria-hidden="true" />

      <div className="team__container">
        {/* Left side - Company Info */}
        <div className="team__info">
          <motion.div
            className="team__info-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="team__label">Contact</span>
            <h2 className="team__title">
              Nos <span className="accent">Coordonnées</span>
            </h2>
          </motion.div>

          <div className="team__info-list">
            <InfoItem
              icon="📞"
              label="Téléphone"
              value={companyInfo.phone}
              index={0}
            />
            <InfoItem
              icon="✉️"
              label="Email"
              value={companyInfo.email}
              index={1}
            />
            <InfoItem
              icon="📍"
              label="Adresse"
              value={companyInfo.address}
              index={2}
            />
            <InfoItem
              icon="🕐"
              label="Horaires"
              value={companyInfo.hours}
              index={3}
            />
          </div>

          {/* Decorative element */}
          <motion.div
            className="team__info-decoration"
            initial={{ scale: 0, rotate: -180 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </div>

        {/* Right side - Team Selection */}
        <div className="team__selection">
          <motion.div
            className="team__selection-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="team__label">L'Équipe</span>
            <h2 className="team__title">
              Choisissez votre <span className="accent">Expert</span>
            </h2>
          </motion.div>

          {/* Character display area */}
          <div className="team__character">
            {/* 3D Model Display with Carousel */}
            <div className="team__character-model">
              {/* Left Arrow */}
              <motion.button
                className="team__carousel-btn team__carousel-btn--left"
                onClick={prevMember}
                whileHover={{ scale: 1.1, x: -5 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </motion.button>

              {/* 3D Canvas */}
              <Canvas
                camera={{ position: [0, 0, 4], fov: 50 }}
                gl={{ antialias: true, alpha: true }}
                style={{ background: 'transparent' }}
              >
                <ambientLight intensity={0.6} />
                <spotLight position={[5, 5, 5]} intensity={1.5} color="#F5C518" castShadow />
                <pointLight position={[-5, 2, 2]} intensity={0.8} color="#FFFFFF" />
                <pointLight position={[0, -3, 2]} intensity={0.4} color="#F5C518" />

                <Suspense fallback={<PlaceholderHead />}>
                  <ModelWithFallback key={selectedMember.id} modelPath={selectedMember.modelPath} />
                  <Environment preset="city" />
                </Suspense>

                <OrbitControls
                  enableZoom={false}
                  enablePan={false}
                  autoRotate
                  autoRotateSpeed={2}
                  minPolarAngle={Math.PI / 3}
                  maxPolarAngle={Math.PI / 1.5}
                />
              </Canvas>

              {/* Right Arrow */}
              <motion.button
                className="team__carousel-btn team__carousel-btn--right"
                onClick={nextMember}
                whileHover={{ scale: 1.1, x: 5 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </motion.button>

              {/* Glow effect behind model */}
              <div className="team__character-glow" />

              {/* Carousel indicators */}
              <div className="team__carousel-dots">
                {teamMembers.map((_, index) => (
                  <button
                    key={index}
                    className={`team__carousel-dot ${index === selectedIndex ? 'active' : ''}`}
                    onClick={() => setSelectedIndex(index)}
                    aria-label={`Sélectionner ${teamMembers[index].name}`}
                  />
                ))}
              </div>
            </div>

            {/* Character Info Panel */}
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedMember.id}
                className="team__character-info"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.4 }}
              >
                {/* Member number indicator */}
                <div className="team__character-number">
                  <span className="team__character-current">0{selectedIndex + 1}</span>
                  <span className="team__character-separator">/</span>
                  <span className="team__character-total">0{teamMembers.length}</span>
                </div>

                {/* Name and role */}
                <div className="team__character-header">
                  <motion.h3
                    className="team__character-name"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                  >
                    {selectedMember.name}
                  </motion.h3>
                  <motion.span
                    className="team__character-role"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                  >
                    {selectedMember.role}
                  </motion.span>
                </div>

                {/* Description */}
                <motion.p
                  className="team__character-desc"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                >
                  {selectedMember.description}
                </motion.p>

                {/* Stats */}
                <div className="team__character-stats">
                  <StatBar label="Créativité" value={selectedMember.stats.creativity} delay={0.4} />
                  <StatBar label="Technique" value={selectedMember.stats.technical} delay={0.5} />
                  <StatBar label="Leadership" value={selectedMember.stats.leadership} delay={0.6} />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Bottom scanline effect */}
      <div className="team__scanline" aria-hidden="true" />
    </section>
  );
};

export default Team;

