import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlitchTextProps {
  children: React.ReactNode;
  className?: string;
  intensity?: 'low' | 'medium' | 'high';
  animate?: boolean;
}

const GlitchText: React.FC<GlitchTextProps> = ({ 
  children, 
  className, 
  intensity = 'medium',
  animate = true 
}) => {
  const glitchIntensity = {
    low: 'animate-pulse',
    medium: 'animate-glitch',
    high: 'animate-glitch animate-flicker'
  };

  return (
    <motion.div
      className={cn(
        "relative inline-block font-cyber",
        animate && glitchIntensity[intensity],
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <span 
        className="glitch-text" 
        data-text={typeof children === 'string' ? children : ''}
      >
        {children}
      </span>
    </motion.div>
  );
};

export default GlitchText;