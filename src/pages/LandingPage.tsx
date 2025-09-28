import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CyberButton } from '@/components/ui/cyber-button';
import GlitchText from '@/components/GlitchText';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary rounded-full animate-pulse" />
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-secondary rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-success rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
        
        {/* Scan line effect */}
        <motion.div
          initial={{ y: '-100vh' }}
          animate={{ y: '100vh' }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        {/* Title with Glitch Effect */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="mb-8"
        >
          <GlitchText className="text-6xl md:text-8xl font-bold mb-4 text-transparent bg-gradient-cyber bg-clip-text">
            BREACHPOINT
          </GlitchText>
          <GlitchText 
            className="text-2xl md:text-4xl font-bold text-secondary" 
            intensity="low"
          >
            The Ultimate Battle
          </GlitchText>
        </motion.div>

        {/* Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mb-12"
        >
          <div className="terminal p-6 rounded-lg mb-6 max-w-2xl mx-auto">
            <div className="flex items-center mb-4">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-destructive rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <div className="w-3 h-3 bg-success rounded-full"></div>
              </div>
              <span className="ml-4 text-xs text-muted-foreground font-mono">SYSTEM_STATUS.LOG</span>
            </div>
            <div className="font-mono text-sm text-left space-y-2">
              <p className="text-destructive">ERROR: Reality.exe has stopped responding</p>
              <p className="text-yellow-400">WARNING: Digital fragments detected</p>
              <p className="text-muted-foreground">The Rift has fractured reality into broken shards.</p>
              <p className="text-primary">Only by solving the anomalies can stability be restored.</p>
            </div>
          </div>
          
          <p className="text-xl text-muted-foreground font-cyber leading-relaxed">
            Navigate through corrupted zones, decode digital mysteries,<br />
            and restore the fractured system before it's too late.
          </p>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <CyberButton
            variant="neon"
            size="xl"
            onClick={() => navigate('/login')}
            className="group relative overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              <span>ENTER THE RIFT</span>
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                →
              </motion.span>
            </span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-primary opacity-0 group-hover:opacity-20"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
          </CyberButton>
        </motion.div>

        {/* System Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto"
        >
          <div className="text-center">
            <div className="text-2xl font-bold text-primary font-mono">04</div>
            <div className="text-sm text-muted-foreground">Corrupted Zones</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-secondary font-mono">08</div>
            <div className="text-sm text-muted-foreground">Active Anomalies</div>
          </div>
          <div className="text-center">
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-2xl font-bold text-destructive font-mono"
            >
              ???
            </motion.div>
            <div className="text-sm text-muted-foreground">System Integrity</div>
          </div>
        </motion.div>
      </div>

      {/* Corner Decorations */}
      <div className="absolute top-0 left-0 w-20 h-20 border-l-2 border-t-2 border-primary/30"></div>
      <div className="absolute top-0 right-0 w-20 h-20 border-r-2 border-t-2 border-secondary/30"></div>
      <div className="absolute bottom-0 left-0 w-20 h-20 border-l-2 border-b-2 border-success/30"></div>
      <div className="absolute bottom-0 right-0 w-20 h-20 border-r-2 border-b-2 border-primary/30"></div>
    </div>
  );
};

export default LandingPage;