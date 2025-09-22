import React from 'react';
import { motion } from 'framer-motion';
import { Lock, CheckCircle, Zap } from 'lucide-react';
import { Zone, Challenge } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface ZoneCardProps {
  zone: Zone;
  challenges: Challenge[];
  onClick: () => void;
  index: number;
}

const ZoneCard: React.FC<ZoneCardProps> = ({ zone, challenges, onClick, index }) => {
  const { currentTeam } = useAuth();
  
  const solvedChallenges = challenges.filter(challenge => 
    currentTeam?.solvedChallenges.includes(challenge.id)
  ).length;
  
  const totalChallenges = challenges.length;
  const isFullySolved = solvedChallenges === totalChallenges;
  const progress = (solvedChallenges / totalChallenges) * 100;

  const zoneIcons = {
    'boot-sector': '⚡',
    'corrupted-forest': '🌲',
    'broken-city': '🏙️',
    'kernel-core': '💎'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className={cn(
        "zone-card relative overflow-hidden rounded-lg p-6 cursor-pointer group",
        isFullySolved && "solved healing-animation"
      )}
      onClick={onClick}
    >
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Zone Icon */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-4xl">
          {zoneIcons[zone.id as keyof typeof zoneIcons] || '❓'}
        </div>
        {!zone.isUnlocked ? (
          <Lock className="w-6 h-6 text-muted-foreground" />
        ) : isFullySolved ? (
          <CheckCircle className="w-6 h-6 text-success animate-pulse" />
        ) : (
          <Zap className="w-6 h-6 text-primary" />
        )}
      </div>

      {/* Zone Name */}
      <h3 className="text-xl font-bold mb-2 text-foreground group-hover:text-primary transition-colors">
        {zone.name}
      </h3>

      {/* Zone Description */}
      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
        {zone.description}
      </p>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-muted-foreground">Progress</span>
          <span className="text-xs font-mono text-primary">
            {solvedChallenges}/{totalChallenges}
          </span>
        </div>
        <div className="w-full bg-muted/30 rounded-full h-2 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, delay: index * 0.2 }}
            className={cn(
              "h-full rounded-full transition-all duration-300",
              isFullySolved 
                ? "bg-gradient-to-r from-success to-success/80 shadow-lg shadow-success/25" 
                : "bg-gradient-to-r from-primary to-secondary"
            )}
          />
        </div>
      </div>

      {/* Challenge Count */}
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">
          {totalChallenges} challenge{totalChallenges !== 1 ? 's' : ''}
        </span>
        {isFullySolved && (
          <span className="text-success font-medium">SECURED</span>
        )}
      </div>

      {/* Hover Effect Overlay */}
      <div className="absolute inset-0 border border-primary/0 group-hover:border-primary/50 rounded-lg transition-colors duration-300" />
    </motion.div>
  );
};

export default ZoneCard;