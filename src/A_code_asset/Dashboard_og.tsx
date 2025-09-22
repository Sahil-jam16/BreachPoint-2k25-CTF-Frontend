import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { mockZones, mockChallenges, getTeamProgress } from '@/data/mockData';
import { CyberButton } from '@/components/ui/cyber-button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import ZoneCard from '@/components/ZoneCard';
import GlitchText from '@/components/GlitchText';
import { LogOut, Trophy, Zap, Shield, Target } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { currentTeam, logout } = useAuth();
  const navigate = useNavigate();

  if (!currentTeam) {
    navigate('/login');
    return null;
  }

  const progress = getTeamProgress(currentTeam);
  const totalSolved = currentTeam.solvedChallenges.length;
  const totalChallenges = mockChallenges.length;

  const handleZoneClick = (zoneId: string) => {
    navigate(`/challenges/${zoneId}`);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8"
      >
        <div className="mb-4 lg:mb-0">
          <GlitchText className="text-3xl font-bold mb-2" intensity="low">
            COMMAND CENTER
          </GlitchText>
          <div className="flex items-center gap-4">
            <h2 className="text-xl text-muted-foreground font-cyber">
              Team: <span className="text-primary">{currentTeam.name}</span>
            </h2>
            <Badge variant="outline" className="font-mono text-primary border-primary/50">
              {currentTeam.totalPoints} points
            </Badge>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <CyberButton
            variant="outline"
            onClick={() => navigate('/leaderboard')}
            className="gap-2"
          >
            <Trophy className="w-4 h-4" />
            Leaderboard
          </CyberButton>
          <CyberButton
            variant="ghost"
            onClick={handleLogout}
            className="gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </CyberButton>
        </div>
      </motion.div>

      {/* System Status */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="zone-card p-6 mb-8"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-bold font-cyber">System Integrity Status</h3>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold font-mono text-primary">{progress}%</div>
            <div className="text-xs text-muted-foreground">RESTORED</div>
          </div>
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground font-cyber">
              Anomalies Resolved
            </span>
            <span className="text-sm font-mono text-primary">
              {totalSolved}/{totalChallenges}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-3 bg-muted/20 rounded-lg">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Target className="w-4 h-4 text-success" />
              <span className="text-sm font-cyber text-muted-foreground">Solved</span>
            </div>
            <div className="text-lg font-bold font-mono text-success">{totalSolved}</div>
          </div>
          
          <div className="text-center p-3 bg-muted/20 rounded-lg">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm font-cyber text-muted-foreground">Total Points</span>
            </div>
            <div className="text-lg font-bold font-mono text-primary">{currentTeam.totalPoints}</div>
          </div>
          
          <div className="text-center p-3 bg-muted/20 rounded-lg">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Trophy className="w-4 h-4 text-secondary" />
              <span className="text-sm font-cyber text-muted-foreground">Badges</span>
            </div>
            <div className="text-lg font-bold font-mono text-secondary">{currentTeam.badges.length}</div>
          </div>
        </div>
      </motion.div>

      {/* Zones Grid */}
      <div className="mb-8">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <h3 className="text-2xl font-bold font-cyber mb-2">Corrupted Zones</h3>
          <p className="text-muted-foreground font-cyber">
            Navigate through fractured reality. Each zone contains anomalies waiting to be resolved.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mockZones.map((zone, index) => {
            const zoneChallenges = mockChallenges.filter(c => c.zoneId === zone.id);
            return (
              <ZoneCard
                key={zone.id}
                zone={zone}
                challenges={zoneChallenges}
                onClick={() => handleZoneClick(zone.id)}
                index={index}
              />
            );
          })}
        </div>
      </div>

      {/* Badges Section */}
      {currentTeam.badges.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="zone-card p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="w-5 h-5 text-secondary" />
            <h3 className="text-lg font-bold font-cyber">Earned Badges</h3>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {currentTeam.badges.map((badge, index) => (
              <motion.div
                key={badge}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + index * 0.1 }}
              >
                <Badge className="font-cyber text-secondary border-secondary/50 bg-secondary/10">
                  {badge}
                </Badge>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Scan Line Effect */}
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: '100%' }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        className="fixed top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-primary/50 to-transparent pointer-events-none"
      />
    </div>
  );
};

export default Dashboard;