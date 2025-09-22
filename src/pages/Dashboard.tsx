import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { CyberButton } from '@/components/ui/cyber-button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import ZoneCard from '@/components/ZoneCard';
import GlitchText from '@/components/GlitchText';
import { LogOut, Trophy, Zap, Shield, Target, AlertTriangle } from 'lucide-react';
import apiFetch from '@/lib/api'; // Assuming your API helper is here

// Define TypeScript interfaces to match the backend response structure
interface Challenge {
  id: string;
  title: string;
  points: number;
  difficulty: string;
  description: string;
  isSolved: boolean;
  // Add any other challenge properties you need from the API response
}

interface Zone {
  id: string;
  name: string;
  description: string;
  order: number;
  challenges: Challenge[];
  // Add any other zone properties you need from the API response
}

const Dashboard: React.FC = () => {
  const { currentTeam, logout } = useAuth();
  const navigate = useNavigate();

  // State to hold data fetched from the backend
  const [zonesData, setZonesData] = useState<Zone[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // useEffect to fetch data as soon as the component mounts
  useEffect(() => {
    // We don't want to fetch if the user isn't authenticated yet
    if (!currentTeam) {
      setIsLoading(false);
      return;
    }

    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const data: Zone[] = await apiFetch('/challenges/zones');
        // Sort zones by the 'order' field provided by the backend
        const sortedData = data.sort((a, b) => a.order - b.order);
        setZonesData(sortedData);
        setError(null);
      } catch (err: any) {
        console.error("Failed to fetch dashboard data:", err);
        setError(err.message || "A connection error occurred. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [currentTeam]); // Dependency array ensures this runs when currentTeam is available

  // Redirect to login if there's no team after the initial check.
  // This check is important and should remain.
  if (!currentTeam) {
    navigate('/login');
    return null;
  }

  // --- Dynamic Calculations based on LIVE data ---
  // Calculate total challenges by summing up the challenges in each fetched zone
  const totalChallenges = zonesData.reduce((acc, zone) => acc + zone.challenges.length, 0);
  // Get total solved from the auth context, which is the source of truth
  const totalSolved = currentTeam.solvedChallenges.length;
  // Calculate progress percentage, preventing division by zero
  const progress = totalChallenges > 0 ? Math.round((totalSolved / totalChallenges) * 100) : 0;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // --- UI States ---

  // Display a loading indicator while fetching data
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-primary font-cyber text-xl animate-pulse">
        ACCESSING COMMAND CENTER...
      </div>
    );
  }
  console.log(currentTeam);
  console.log(zonesData);

  // Display an error message if the API call fails
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
        <AlertTriangle className="w-12 h-12 text-destructive mb-4" />
        <h2 className="text-2xl font-bold font-cyber text-destructive-foreground mb-2">System Error</h2>
        <p className="text-muted-foreground mb-6">{error}</p>
        <CyberButton variant="outline" onClick={() => window.location.reload()}>
          Retry Connection
        </CyberButton>
      </div>
    );
  }

  // --- Main Dashboard UI ---
  return (
    <div className="min-h-screen p-6">
      {/* Header - Unchanged */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8"
      >
        <div className="mb-4 lg:mb-0">
          <GlitchText className="text-3xl font-bold mb-2" intensity="medium">
            COMMAND CENTER
          </GlitchText>
          <div className="flex items-center gap-4">
            <h2 className="text-xl text-muted-foreground font-cyber">
              Team: <span className="text-primary font-bold bg-primary/10 px-1 rounded">{currentTeam.teamName}</span>
            </h2>
            <Badge variant="outline" className="font-mono text-primary border-primary/50">
              {/* Use 'score' from your team object in auth context */}
              {currentTeam.score} points
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

      {/* System Status - Now uses dynamic data */}
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
            <div className="text-lg font-bold font-mono text-primary">{currentTeam.score}</div>
          </div>
          
          <div className="text-center p-3 bg-muted/20 rounded-lg">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Trophy className="w-4 h-4 text-secondary" />
              <span className="text-sm font-cyber text-muted-foreground">Badges</span>
            </div>
            {/* Make sure 'badges' is a property on your Team type */}
            <div className="text-lg font-bold font-mono text-secondary">{currentTeam.badges?.length || 0}</div>
          </div>
        </div>
      </motion.div>

      {/* Zones Grid - Now maps over fetched API data */}
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
          {zonesData.map((zone, index) => (
            <ZoneCard
              key={zone.id}
              zone={zone}
              challenges={zone.challenges}
              onClick={() => navigate(`/challenges/${zone.id}`)}
              index={index}
            />
          ))}
        </div>
      </div>

      {/* Badges Section - Unchanged */}
      {currentTeam.badges && currentTeam.badges.length > 0 && (
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

      {/* Scan Line Effect - Unchanged */}
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