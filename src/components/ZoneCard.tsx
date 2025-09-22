import React from 'react';
import { motion } from 'framer-motion';
import { Lock, CheckCircle, Zap } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

// --- Component Types ---
// In a real app, these would be imported from a central types file.
interface Challenge {
  id: string;
  title: string;
  points: number;
  difficulty: string;
  description: string;
  isSolved: boolean;
}

interface Zone {
  id: string;
  name: string;
  description: string;
  order: number;
  challenges: Challenge[];
  isUnlocked?: boolean;
}


// --- The Corrected ZoneCard Component ---

interface ZoneCardProps {
  zone: Zone;
  challenges: Challenge[];
  onClick: () => void;
  index: number;
}

const ZoneCard: React.FC<ZoneCardProps> = ({ zone, challenges, onClick, index }) => {
  // This hook will now correctly use the REAL logged-in user from your AuthProvider
  const { currentTeam } = useAuth();
  
  // This calculation logic correctly uses the live team data.
  const solvedChallenges = challenges.filter(challenge => 
    currentTeam?.solvedChallenges.includes(challenge.id)
  ).length;
  
  const totalChallenges = challenges.length;
  const isFullySolved = totalChallenges > 0 && solvedChallenges === totalChallenges;
  const progress = totalChallenges > 0 ? (solvedChallenges / totalChallenges) * 100 : 0;

  const zoneIcons: { [key: string]: string } = {
    'boot-sector': '⚡',
    'corrupted-forest': '🌲',
    'broken-city': '🏙️',
    'kernel-core': '💎',
    'dummy-zone': '🔧'
  };

  const getIconKey = (name: string) => {
    return name.toLowerCase().replace(/\s+/g, '-');
  };

  const iconKey = getIconKey(zone.name);

  // Helper for conditional class names without a utility
  const getCardClassName = () => {
    let classes = "zone-card relative overflow-hidden rounded-lg p-6 cursor-pointer group";
    if (isFullySolved) {
      classes += " solved healing-animation";
    }
    return classes;
  };

  const getProgressBarClassName = () => {
    let classes = "h-full rounded-full transition-all duration-300";
    if (isFullySolved) {
      classes += " bg-gradient-to-r from-success to-success/80 shadow-lg shadow-success/25";
    } else {
      classes += " bg-gradient-to-r from-primary to-secondary";
    }
    return classes;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className={getCardClassName()}
      onClick={onClick}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="flex items-center justify-between mb-4">
        <div className="text-4xl">
          {zoneIcons[iconKey] || '❓'}
        </div>
        {isFullySolved ? (
          <CheckCircle className="w-6 h-6 text-success animate-pulse" />
        ) : (
          <Zap className="w-6 h-6 text-primary" />
        )}
      </div>

      <h3 className="text-xl font-bold mb-2 text-foreground group-hover:text-primary transition-colors">
        {zone.name}
      </h3>

      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
        {zone.description}
      </p>

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
            className={getProgressBarClassName()}
          />
        </div>
      </div>

      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">
          {totalChallenges} challenge{totalChallenges !== 1 ? 's' : ''}
        </span>
        {isFullySolved && (
          <span className="text-success font-medium">SECURED</span>
        )}
      </div>

      <div className="absolute inset-0 border border-primary/0 group-hover:border-primary/50 rounded-lg transition-colors duration-300" />
    </motion.div>
  );
};

export default ZoneCard;



//WORKING ZONE CARD WITH PROGRESS CARD