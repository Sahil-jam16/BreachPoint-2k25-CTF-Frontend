import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { CyberButton } from '@/components/ui/cyber-button';
import { Badge } from '@/components/ui/badge';
import GlitchText from '@/components/GlitchText';
import { ArrowLeft, Trophy, Medal, Award, Crown, Zap, AlertTriangle, Loader } from 'lucide-react';
import { cn } from '@/lib/utils';
import apiFetch from '@/lib/api';

// Interface to match your API response for a single team
interface Team {
  id: string;
  teamName: string;
  score: number;
  solvedChallenges: string[];
  badges: string[];
}

const Leaderboard: React.FC = () => {
  const { currentTeam } = useAuth();
  const navigate = useNavigate();

  // State for teams, loading, and errors
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data when the component mounts
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setIsLoading(true);
        const data: Team[] = await apiFetch('/teams/leaderboard');
        setTeams(data); // Data from the backend is already sorted
        setError(null);
      } catch (err: any) {
        setError(err.message || "Failed to fetch leaderboard data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, []); // Empty dependency array means this runs once on mount

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="w-5 h-5 text-yellow-400" />;
      case 2: return <Medal className="w-5 h-5 text-gray-400" />;
      case 3: return <Award className="w-5 h-5 text-amber-600" />;
      default: return <Trophy className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return 'text-yellow-400 border-yellow-400/50 bg-yellow-400/10';
      case 2: return 'text-gray-400 border-gray-400/50 bg-gray-400/10';
      case 3: return 'text-amber-600 border-amber-600/50 bg-amber-600/10';
      default: return 'text-muted-foreground border-muted/50 bg-muted/10';
    }
  };
  
  // Handle loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-primary font-cyber text-xl">
        <Loader className="w-8 h-8 mr-4 animate-spin" />
        SYNCHRONIZING SYSTEM RANKINGS...
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
        <AlertTriangle className="w-12 h-12 text-destructive mb-4" />
        <h2 className="text-2xl font-bold font-cyber text-destructive-foreground mb-2">Connection Error</h2>
        <p className="text-muted-foreground mb-6">{error}</p>
        <CyberButton variant="outline" onClick={() => window.location.reload()}>
          Retry Connection
        </CyberButton>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background/90" />
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.05 }} className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_hsl(var(--success))_0px,_transparent_50%)]" />
      </div>

      <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 relative z-10">
        <div className="mb-4 lg:mb-0">
          <CyberButton variant="ghost" onClick={() => navigate('/dashboard')} className="gap-2 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </CyberButton>
          <GlitchText className="text-3xl font-bold mb-2" intensity="low">SYSTEM RANKINGS</GlitchText>
          <p className="text-muted-foreground font-cyber">Real-time team performance across all corrupted zones</p>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="terminal p-6 mb-6 relative z-10">
        <div className="flex items-center mb-4">
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-success rounded-full animate-pulse"></div>
            <div className="w-3 h-3 bg-success rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            <div className="w-3 h-3 bg-success rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>
          <span className="ml-4 text-xs text-muted-foreground font-mono">RANKING_SYSTEM.LOG</span>
        </div>
        <div className="font-mono text-sm space-y-1">
          <p className="text-success">STATUS: Live rankings synchronized</p>
          <p className="text-primary">UPDATED: Real-time anomaly resolution tracking</p>
          <p className="text-muted-foreground">TEAMS: {teams.length} active in the Rift</p>
        </div>
      </motion.div>

      <div className="space-y-4 relative z-10">
        {teams.map((team, index) => {
          const rank = index + 1;
          const isCurrentTeam = currentTeam?.id === team.id;
          
          return (
            <motion.div
              key={team.id}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={cn("zone-card p-6 relative overflow-hidden transition-all duration-300", isCurrentTeam && "ring-2 ring-primary/50 bg-primary/5")}
            >
              {isCurrentTeam && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-secondary/10 pointer-events-none"
                />
              )}

              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-4">
                  <div className={cn("flex items-center justify-center w-12 h-12 rounded-lg border font-mono font-bold", getRankColor(rank))}>
                    {rank <= 3 ? getRankIcon(rank) : rank}
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className={cn("text-lg font-bold font-cyber", isCurrentTeam ? "text-primary" : "text-foreground")}>
                        {team.teamName}
                      </h3>
                      {isCurrentTeam && <Badge className="text-xs bg-primary/20 text-primary border-primary/50">YOU</Badge>}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><Zap className="w-4 h-4" />{team.solvedChallenges.length} solved</span>
                      <span className="flex items-center gap-1"><Trophy className="w-4 h-4" />{team.badges.length} badges</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={cn("text-2xl font-bold font-mono mb-1", rank === 1 ? "text-yellow-400" : rank === 2 ? "text-gray-400" : rank === 3 ? "text-amber-600" : "text-primary")}>
                    {team.score.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground font-cyber">POINTS</div>
                </div>
              </div>

              {team.badges.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2 relative z-10">
                  {team.badges.map((badge, badgeIndex) => (
                    <motion.div key={badge} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.1 + badgeIndex * 0.05 }}>
                      <Badge variant="outline" className="text-xs font-cyber bg-muted/20 border-muted/30">{badge}</Badge>
                    </motion.div>
                  ))}
                </div>
              )}

              <div className={cn("absolute left-0 top-0 bottom-0 w-1", rank === 1 ? "bg-yellow-400" : rank === 2 ? "bg-gray-400" : rank === 3 ? "bg-amber-600" : "bg-primary/30")} />
            </motion.div>
          );
        })}
      </div>

      {teams.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="mt-8 zone-card p-6 relative z-10">
          <h3 className="text-lg font-bold font-cyber mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-primary" />
            Competition Statistics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary font-mono">{teams[0].score.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground font-cyber">Highest Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary font-mono">{Math.round(teams.reduce((sum, t) => sum + t.score, 0) / teams.length).toLocaleString()}</div>
              <div className="text-xs text-muted-foreground font-cyber">Average Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-success font-mono">{Math.max(...teams.map(t => t.solvedChallenges.length))}</div>
              <div className="text-xs text-muted-foreground font-cyber">Most Solved</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400 font-mono">{teams.reduce((sum, t) => sum + t.solvedChallenges.length, 0)}</div>
              <div className="text-xs text-muted-foreground font-cyber">Total Solutions</div>
            </div>
          </div>
        </motion.div>
      )}
      
      <motion.div
        initial={{ y: '-100vh' }}
        animate={{ y: '100vh' }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        className="fixed left-0 w-full h-px bg-gradient-to-r from-transparent via-success/30 to-transparent pointer-events-none"
      />
    </div>
  );
};

export default Leaderboard;