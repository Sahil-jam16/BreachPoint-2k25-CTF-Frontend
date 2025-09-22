import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CyberButton } from '@/components/ui/cyber-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Users, Lock } from 'lucide-react';
import GlitchText from '@/components/GlitchText';

const RegisterPage: React.FC = () => {
  const [teamName, setTeamName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName.trim() || !password.trim() || password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Registration Error",
        description: "Please fill all fields and ensure passwords match.",
        duration: 3000,
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/teams/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamName, password }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Registration Successful",
          description: "Your team has been registered. You can now log in.",
          duration: 3000,
        });
        navigate('/login');
      } else {
        throw new Error(data.detail || "An unknown error occurred.");
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: error.message,
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-background">
        {/* Background Effects (similar to LoginPage) */}
        <div className="absolute inset-0 bg-gradient-void opacity-10" />

        {/* Back Button */}
        <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} className="absolute top-6 left-6">
            <CyberButton variant="ghost" onClick={() => navigate('/login')} className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Login
            </CyberButton>
        </motion.div>

        {/* Main Content */}
        <div className="relative z-10 w-full max-w-md">
            <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                <Card className="bg-card/90 backdrop-blur-sm border border-border/50">
                    <CardHeader className="text-center pb-4">
                        <GlitchText className="text-2xl font-bold mb-2" intensity="low">
                            <CardTitle>Team Registration</CardTitle>
                        </GlitchText>
                        <CardDescription className="font-cyber text-muted-foreground">
                            Assemble your team and create your access credentials
                        </CardDescription>
                    </CardHeader>
                    
                    <CardContent>
                        <form onSubmit={handleRegister} className="space-y-6">
                            {/* Team Name Input */}
                            <div className="space-y-2">
                                <Label htmlFor="teamName" className="text-sm font-medium font-cyber flex items-center gap-2">
                                    <Users className="w-4 h-4 text-primary" />
                                    Team Name
                                </Label>
                                <Input id="teamName" type="text" placeholder="Choose a team name" value={teamName} onChange={(e) => setTeamName(e.target.value)} required />
                            </div>

                            {/* Password Input */}
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-sm font-medium font-cyber flex items-center gap-2">
                                    <Lock className="w-4 h-4 text-primary" />
                                    Password
                                </Label>
                                <Input id="password" type="password" placeholder="Create a team password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                            </div>

                            {/* Confirm Password Input */}
                             <div className="space-y-2">
                                <Label htmlFor="confirmPassword" className="text-sm font-medium font-cyber flex items-center gap-2">
                                    <Lock className="w-4 h-4 text-primary" />
                                    Confirm Password
                                </Label>
                                <Input id="confirmPassword" type="password" placeholder="Confirm your password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                            </div>

                            <CyberButton type="submit" variant="neon" size="lg" className="w-full" disabled={isLoading}>
                                {isLoading ? 'REGISTERING...' : 'REGISTER TEAM'}
                            </CyberButton>
                        </form>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    </div>
  );
};

export default RegisterPage;

