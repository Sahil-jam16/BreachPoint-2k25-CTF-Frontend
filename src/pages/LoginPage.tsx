import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { CyberButton } from '@/components/ui/cyber-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Users, Lock } from 'lucide-react';
import GlitchText from '@/components/GlitchText';

const LoginPage: React.FC = () => {
  const [teamName, setTeamName] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName.trim() || !password.trim()) return;

    setIsLoading(true);
    
    try {
      // This now calls the async login function from your AuthContext
      await login(teamName, password);
      
      // This block runs only if the login was successful
      toast({
        title: "Access Granted",
        description: "Welcome to the Rift. Prepare for anomaly detection.",
        duration: 3000,
      });
      navigate('/dashboard');

    } catch (error: any) {
      // This block runs if the login function throws an error
      toast({
        variant: "destructive",
        title: "Access Denied",
        // Display the actual error message from the backend
        description: error.message || "Invalid team credentials. The Rift remains sealed.",
        duration: 3000,
      });
    } finally {
      // This runs regardless of success or failure
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 2 }}
          className="absolute inset-0 bg-gradient-void"
        />
        <div className="absolute top-1/3 left-1/4 w-1 h-1 bg-primary animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-secondary animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute top-6 left-6"
      >
        <CyberButton
          variant="ghost"
          onClick={() => navigate('/')}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Rift
        </CyberButton>
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <Card className="bg-card/90 backdrop-blur-sm border border-border/50">
            <CardHeader className="text-center pb-4">
              <GlitchText className="text-2xl font-bold mb-2" intensity="low">
                <CardTitle>Access Control</CardTitle>
              </GlitchText>
              <CardDescription className="font-cyber text-muted-foreground">
                Team authentication required to enter the Rift
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="teamName" className="text-sm font-medium font-cyber flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary" />
                    Team Name
                  </Label>
                  <Input
                    id="teamName"
                    type="text"
                    placeholder="Enter your team name"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    className="font-cyber bg-input/50 border-border/50 focus:border-primary"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium font-cyber flex items-center gap-2">
                    <Lock className="w-4 h-4 text-primary" />
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter team password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="font-cyber bg-input/50 border-border/50 focus:border-primary"
                    required
                  />
                </div>

                <CyberButton
                  type="submit"
                  variant="neon"
                  size="lg"
                  className="w-full"
                  disabled={isLoading || !teamName.trim() || !password.trim()}
                >
                  {isLoading ? (
                    <motion.div className="flex items-center gap-2">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 border-2 border-background border-t-transparent rounded-full"
                      />
                      ACCESSING...
                    </motion.div>
                  ) : (
                    'ENTER THE RIFT'
                  )}
                </CyberButton>
              </form>

              {/* Demo Credentials */}
              {/* <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="mt-6 p-4 bg-muted/20 border border-muted/30 rounded-lg"
              >
                <h4 className="text-xs font-bold text-muted-foreground mb-2 font-cyber">
                  DEMO TEAMS:
                </h4>
                <div className="space-y-1 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-primary">Neural Hackers</span>
                    <span className="text-muted-foreground">hack123</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary">Void Runners</span>
                    <span className="text-muted-foreground">void456</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-success">Echo Division</span>
                    <span className="text-muted-foreground">echo789</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-yellow-400">Glitch Lords</span>
                    <span className="text-muted-foreground">glitch000</span>
                  </div>
                </div>
              </motion.div> */}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Corner Effects */}
      <div className="absolute top-0 left-0 w-16 h-16 border-l border-t border-primary/20"></div>
      <div className="absolute top-0 right-0 w-16 h-16 border-r border-t border-secondary/20"></div>
      <div className="absolute bottom-0 left-0 w-16 h-16 border-l border-b border-success/20"></div>
      <div className="absolute bottom-0 right-0 w-16 h-16 border-r border-b border-primary/20"></div>
    </div>
  );
};

export default LoginPage;

