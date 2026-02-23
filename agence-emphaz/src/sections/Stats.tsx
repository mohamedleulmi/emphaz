/**
 * Stats Section
 * Animated stats with falling ball effect
 */

import { useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import gsap from 'gsap';
import '../styles/Stats.css';

interface StatItem {
  value: string;
  label: string;
  suffix?: string;
}

const stats: StatItem[] = [
  { value: '20', suffix: 'K+', label: 'Clients Satisfaits' },
  { value: '150', suffix: '+', label: 'Projets Réalisés' },
  { value: '12', suffix: '', label: 'Années d\'Expérience' },
  { value: '98', suffix: '%', label: 'Taux de Satisfaction' },
];

// Animation variants for the falling balls
const ballVariants = {
  hidden: (i: number) => ({
    y: -400 - (i * 100), // Start above viewport, staggered
    opacity: 0,
    scale: 0.5,
    rotate: -180,
  }),
  visible: (i: number) => ({
    y: 0,
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: {
      type: 'spring',
      damping: 12,
      stiffness: 100,
      delay: i * 0.15,
      duration: 1.2,
    },
  }),
};

// Bounce effect after landing
const bounceVariants = {
  hidden: { scale: 1 },
  visible: (i: number) => ({
    scale: [1, 1.1, 0.95, 1.02, 1],
    transition: {
      delay: i * 0.15 + 0.8,
      duration: 0.5,
      ease: 'easeOut',
    },
  }),
};

const StatCard = ({ stat, index }: { stat: StatItem; index: number }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const valueRef = useRef<HTMLSpanElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: '-100px' });

  // Counter animation when card lands
  useEffect(() => {
    if (isInView && valueRef.current) {
      const target = parseInt(stat.value);
      const duration = 2;
      const delay = index * 0.15 + 1;

      gsap.fromTo(
        valueRef.current,
        { innerText: 0 },
        {
          innerText: target,
          duration,
          delay,
          ease: 'power2.out',
          snap: { innerText: 1 },
          onUpdate: function () {
            if (valueRef.current) {
              valueRef.current.innerText = Math.floor(
                parseFloat(valueRef.current.innerText)
              ).toString();
            }
          },
        }
      );
    }
  }, [isInView, stat.value, index]);

  return (
    <motion.div
      ref={cardRef}
      className="stat-card"
      custom={index}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={ballVariants}
    >
      <motion.div
        className="stat-card__inner"
        custom={index}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        variants={bounceVariants}
      >
        {/* Glow effect */}
        <div className="stat-card__glow" />

        {/* Value */}
        <div className="stat-card__value">
          <span ref={valueRef}>0</span>
          <span className="stat-card__suffix">{stat.suffix}</span>
        </div>

        {/* Label */}
        <p className="stat-card__label">{stat.label}</p>

        {/* Ring decoration */}
        <div className="stat-card__ring" />
      </motion.div>
    </motion.div>
  );
};

const Stats = () => {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section className="stats" ref={sectionRef} id="stats">
      {/* Background particles */}
      <div className="stats__particles" aria-hidden="true">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="stats__particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      <div className="stats__container">
        {/* Section title */}
        <motion.div
          className="stats__header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="stats__label">Nos Chiffres</span>
          <h2 className="stats__title">
            L'excellence en <span className="accent">chiffres</span>
          </h2>
        </motion.div>

        {/* Stats grid */}
        <div className="stats__grid">
          {stats.map((stat, index) => (
            <StatCard key={index} stat={stat} index={index} />
          ))}
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="stats__fade" />
    </section>
  );
};

export default Stats;

