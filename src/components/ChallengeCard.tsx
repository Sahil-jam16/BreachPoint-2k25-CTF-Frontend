// src/components/ChallengeCard.tsx

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flag, HelpCircle, CheckCircle, AlertTriangle, Skull, Download } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { CyberButton } from '@/components/ui/cyber-button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import apiFetch from '@/lib/api'; // Import apiFetch

// This should match the type in ChallengeView
interface SourceFile {
  fileName: string;
  filePath: string;
}

interface Challenge {
  id: string;
  title: string;
  points: number;
  difficulty: string;
  description: string;
  hints: string[];
  sourceFiles?: SourceFile[]; 

}

interface ChallengeCardProps {
  challenge: Challenge;
  index: number;
  onChallengeSolved: () => void; // Add this prop
}

const ChallengeCard: React.FC<ChallengeCardProps> = ({ challenge, index, onChallengeSolved }) => {
  const { currentTeam } = useAuth();
  const { toast } = useToast();
  const [flagInput, setFlagInput] = useState('');
  const [showHints, setShowHints] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isSolved = currentTeam?.solvedChallenges.includes(challenge.id) || false;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-success border-success/50 bg-success/10';
      case 'Medium': return 'text-yellow-400 border-yellow-400/50 bg-yellow-400/10';
      case 'Hard': return 'text-orange-400 border-orange-400/50 bg-orange-400/10';
      case 'Insane': return 'text-destructive border-destructive/50 bg-destructive/10';
      default: return 'text-primary border-primary/50 bg-primary/10';
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return <Flag className="w-4 h-4" />;
      case 'Medium': return <AlertTriangle className="w-4 h-4" />;
      case 'Hard': return <AlertTriangle className="w-4 h-4" />;
      case 'Insane': return <Skull className="w-4 h-4" />;
      default: return <Flag className="w-4 h-4" />;
    }
  };

  const handleFlagSubmit = async () => {
    if (!flagInput.trim()) return;
    setIsSubmitting(true);
    
    try {
      console.log(challenge);
      await apiFetch('/challenges/submit', {
        method: 'POST',
        body: { challengeId: challenge.id, flag: flagInput.trim() },
      });
      
      toast({
        title: "Challenge Solved! 🎉",
        description: `You earned ${challenge.points} points! The anomaly has been healed.`,
        duration: 5000,
      });

      setFlagInput('');
      onChallengeSolved(); // Call the parent's function to trigger a data refresh
      
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Incorrect Flag",
        description: error.message || "The anomaly persists. Try again.",
        duration: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={cn(
        "zone-card rounded-lg p-6 relative overflow-hidden",
        isSolved && "solved border-success/50"
      )}
    >
      {isSolved && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute inset-0 bg-gradient-to-br from-success/10 to-transparent"
        />
      )}

      <div className="flex items-start justify-between mb-4 relative z-10">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className={cn(
              "text-lg font-bold font-cyber",
              isSolved ? "text-success" : "text-foreground"
            )}>
              {challenge.title}
            </h3>
            {isSolved && (
              <CheckCircle className="w-5 h-5 text-success animate-pulse" />
            )}
          </div>
          
          <div className="flex items-center gap-2 mb-3">
            <Badge className={cn("font-mono text-xs gap-1", getDifficultyColor(challenge.difficulty))}>
              {getDifficultyIcon(challenge.difficulty)}
              {challenge.difficulty}
            </Badge>
            <Badge variant="outline" className="font-mono text-xs text-primary border-primary/50">
              {challenge.points} pts
            </Badge>
          </div>
        </div>
      </div>

      <p className="mb-6 relative z-10 text-muted-foreground leading-relaxed font-cyber text-sm">
        {challenge.description}
      </p>

      {/* --- 3. ADDED SECTION FOR SOURCE FILES --- */}
      {challenge.sourceFiles && challenge.sourceFiles.length > 0 && (
        <div className="mb-6 relative z-10">
          <h4 className="text-sm font-bold font-cyber text-muted-foreground mb-3">
            Source Files
          </h4>
          <div className="flex flex-col items-start gap-2">
            {challenge.sourceFiles.map((file) => (
              <a
                key={file.filePath}
                href={file.filePath}
                target="_blank" // Opens the file in a new tab
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors duration-200 font-mono text-sm group"
              >
                <Download className="w-4 h-4 text-primary/70 group-hover:animate-pulse" />
                <span>{file.fileName}</span>
              </a>
            ))}
          </div>
        </div>
      )}
      {/* --- END OF NEW SECTION --- */}

      {!isSolved ? (
        <>
          <div className="flex gap-2 mb-4">
            <Input
              placeholder="Enter flag here..."
              value={flagInput}
              onChange={(e) => setFlagInput(e.target.value)}
              className="font-mono bg-input/50 border-border/50 focus:border-primary"
              onKeyPress={(e) => e.key === 'Enter' && handleFlagSubmit()}
            />
            <CyberButton
              onClick={handleFlagSubmit}
              disabled={isSubmitting || !flagInput.trim()}
              variant="terminal"
            >
              {isSubmitting ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-success border-t-transparent rounded-full"
                />
              ) : (
                'SUBMIT'
              )}
            </CyberButton>
          </div>

          {challenge.hints.length > 0 && (
            <Collapsible open={showHints} onOpenChange={setShowHints} className="relative z-10">
              <CollapsibleTrigger asChild>
                <CyberButton variant="ghost" size="sm" className="w-full mb-2">
                  <HelpCircle className="w-4 h-4 mr-2" />
                  {showHints ? 'Hide Hints' : `Show Hints (${challenge.hints.length})`}
                </CyberButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <AnimatePresence>
                  {showHints && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-2"
                    >
                      {challenge.hints.map((hint, hintIndex) => (
                        <motion.div
                          key={hintIndex}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: hintIndex * 0.1 }}
                          className="p-3 bg-muted/20 border border-muted/30 rounded text-sm text-muted-foreground font-cyber"
                        >
                          <span className="text-primary font-bold">Hint {hintIndex + 1}:</span> {hint}
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </CollapsibleContent>
            </Collapsible>
          )}
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 relative z-10"
        >
          <div className="text-center py-3 px-4 bg-success/10 border border-success/30 rounded-lg">
            <CheckCircle className="w-6 h-6 text-success mx-auto mb-2" />
            <p className="text-success font-mono text-sm">ANOMALY RESOLVED</p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ChallengeCard;