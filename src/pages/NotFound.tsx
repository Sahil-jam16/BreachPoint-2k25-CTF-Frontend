import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CyberButton } from '@/components/ui/cyber-button';
import GlitchText from '@/components/GlitchText';
import { SignalZero, ArrowLeft } from 'lucide-react';

const NotFound: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // This logs the error for your own debugging purposes
    console.error(
      `[404] Anomaly Detected: User attempted to access a non-existent route: ${location.pathname}`
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen p-6 flex flex-col items-center justify-center text-center relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background/90" />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.03 }}
          className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_hsl(var(--destructive))_0px,_transparent_50%)]"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="relative z-10"
      >
        <SignalZero className="w-24 h-24 text-destructive mx-auto mb-6" />

        <GlitchText className="text-8xl font-black mb-2" intensity="high">
          404
        </GlitchText>
        
        <h2 className="text-2xl font-bold font-cyber text-destructive-foreground mb-4">
          CONNECTION TERMINATED
        </h2>

        <p className="text-muted-foreground font-cyber max-w-md mx-auto mb-8">
          The signal path to <span className="text-primary">{location.pathname}</span> does not exist in this reality. The anomaly has been logged. Return to a stable sector immediately.
        </p>

        <CyberButton
          onClick={() => navigate('/dashboard')}
          variant="secondary"
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Return to Dashboard
        </CyberButton>
      </motion.div>

      {/* Animated Scan Line Effect */}
      <motion.div
        initial={{ y: '-100vh', opacity: 0 }}
        animate={{ y: '100vh', opacity: [0, 1, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        className="absolute left-0 w-full h-1 bg-gradient-to-r from-transparent via-destructive/50 to-transparent pointer-events-none"
      />
    </div>
  );
};

export default NotFound;