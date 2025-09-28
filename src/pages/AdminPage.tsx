import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { CyberButton } from '@/components/ui/cyber-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserPlus, Shield, Key, Link2, BarChart2, History } from 'lucide-react';
import { cn } from '@/lib/utils';
import apiFetch from '@/lib/api'; 

interface Zone {
  id: string;
  name: string;
  description: string;
  order: number;
}

interface Challenge {
  id: string;
  title: string;
  zoneId: string;
}

interface Submission {
  submissionId: string;
  teamId: string;
  teamName: string;
  challengeId: string;
  challengeTitle: string;
  isCorrect: boolean;
  timestamp: string;
}

interface LeaderboardEntry {
  teamId: string;
  teamName: string;
  score: number;
  solvedChallenges: number;
  lastSubmission: string | null;
}

const AdminPage: React.FC = () => {
    const { toast } = useToast();
    const [apiKey, setApiKey] = useState('');

    // State for Zones
    const [zones, setZones] = useState<Zone[]>([]);
    
    const [zoneName, setZoneName] = useState('');
    const [zoneDesc, setZoneDesc] = useState('');
    const [zoneOrder, setZoneOrder] = useState(1);

  // State for Challenges
    const [challenges, setChallenges] = useState<Challenge[]>([]);
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [challengeTitle, setChallengeTitle] = useState('');
    const [challengeDesc, setChallengeDesc] = useState('');
    const [challengeZoneId, setChallengeZoneId] = useState('');
    const [challengeDifficulty, setChallengeDifficulty] = useState('Easy');
    const [challengePoints, setChallengePoints] = useState(50);
    const [challengeFlag, setChallengeFlag] = useState('');
    const [challengeHints, setChallengeHints] = useState('');
    // REMOVED file upload state
    // const [challengeFile, setChallengeFile] = useState<File | null>(null);

    const [regTeamName, setRegTeamName] = useState('');
    const [regPassword, setRegPassword] = useState('');

    // ADDED state for file names and links
    const [sourceFileNames, setSourceFileNames] = useState('');
    const [sourceFileLinks, setSourceFileLinks] = useState('');

    const [isLoading, setIsLoading] = useState(false);

 // --- REFACTORED: Data Fetching using apiFetch ---
    const fetchData = useCallback(async () => {
        if (!apiKey) return;
        setIsLoading(true);
        try {
            const adminHeaders = { 'X-Admin-API-Key': apiKey };
            const [zonesData, challengesData, leaderboardData, submissionsData] = await Promise.all([
                apiFetch("/admin/zones", { headers: adminHeaders }),
                apiFetch("/admin/challenges", { headers: adminHeaders }),
                apiFetch("/admin/leaderboard", { headers: adminHeaders }),
                apiFetch("/admin/submissions", { headers: adminHeaders })
            ]);

            setZones(zonesData);
            setChallenges(challengesData);
            setLeaderboard(leaderboardData);
            setSubmissions(submissionsData);
            //console.log("Fetched Data:", submissionsData );
        } catch (error: any) {
            toast({ variant: "destructive", title: "Error", description: error.message });
        } finally {
            setIsLoading(false);
        }
    }, [apiKey, toast]);


  useEffect(() => {
    if(apiKey) { fetchData(); }
  }, [apiKey, fetchData]);

  // --- REFACTORED: Create Zone using apiFetch ---
    const handleCreateZone = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await apiFetch("/admin/zones", {
                method: "POST",
                headers: { 'X-Admin-API-Key': apiKey },
                body: { name: zoneName, description: zoneDesc, order: Number(zoneOrder) },
            });
            
            toast({ title: "Success", description: "Zone created successfully!" });
            fetchData();
            setZoneName('');
            setZoneDesc('');
        } catch (error: any) {
            toast({ variant: "destructive", title: "Error Creating Zone", description: error.message });
        } finally {
            setIsLoading(false);
        }
    };

  // --- REFACTORED: Create Challenge using apiFetch ---
    const handleCreateChallenge = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const names = sourceFileNames.split(',').map(n => n.trim());
        const links = sourceFileLinks.split(',').map(l => l.trim());
        const sourceFiles = links.filter(link => link).map((link, index) => ({
            fileName: names[index] || `Download Link ${index + 1}`,
            filePath: link,
        }));

        const challengeData = {
            title: challengeTitle,
            description: challengeDesc,
            zoneId: challengeZoneId,
            difficulty: challengeDifficulty,
            points: Number(challengePoints),
            flag: challengeFlag,
            hints: challengeHints.split(',').map(h => h.trim()).filter(h => h),
            sourceFiles: sourceFiles.length > 0 ? sourceFiles : null,
        };
        
        try {
            await apiFetch("/admin/challenges", {
                method: "POST",
                headers: { 'X-Admin-API-Key': apiKey },
                body: challengeData,
            });

            toast({ title: "Success", description: "Challenge created successfully!" });
            fetchData();
            // Clear form fields...
        } catch (error: any) {
            toast({ variant: "destructive", title: "Error Creating Challenge", description: error.message });
        } finally {
            setIsLoading(false);
        }
    };

// --- REFACTORED: Register Team using apiFetch ---
    const handleRegisterTeam = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!regTeamName || !regPassword) {
            toast({ variant: "destructive", title: "Error", description: "Team Name and Password are required." });
            return;
        }
        setIsLoading(true);
        try {
            await apiFetch("/teams/register", {
                method: "POST",
                body: { teamName: regTeamName, password: regPassword },
            });
            
            toast({ title: "Success", description: `Team '${regTeamName}' registered successfully!` });
            fetchData();
            setRegTeamName('');
            setRegPassword('');
        } catch (error: any) {
            toast({ variant: "destructive", title: "Error Registering Team", description: error.message });
        } finally {
            setIsLoading(false);
        }
    };

  return (
    <div className="min-h-screen p-6 bg-background text-foreground">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold font-cyber mb-2 text-primary flex items-center gap-3">
            <Shield /> Admin Control Panel
        </h1>
        <p className="text-muted-foreground mb-8">Create and manage CTF zones and challenges.</p>

        {/* API Key Input */}
        <Card className="mb-8">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Key /> Admin Authentication</CardTitle>
                <CardDescription>Enter your secret Admin API Key to load and manage content.</CardDescription>
            </CardHeader>
            <CardContent>
                <Input type="password" placeholder="Enter Admin API Key..." value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
            </CardContent>
        </Card>
        
        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Zone Management */}
            <Card>
                <CardHeader>
                    <CardTitle>Manage Zones</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleCreateZone} className="space-y-4 mb-6">
                        <h3 className="font-bold text-lg">Create New Zone</h3>
                        <Input placeholder="Zone Name (e.g., Web Exploits)" value={zoneName} onChange={e => setZoneName(e.target.value)} required />
                        <Textarea placeholder="Zone Description" value={zoneDesc} onChange={e => setZoneDesc(e.target.value)} required />
                        <Input type="number" placeholder="Display Order" value={zoneOrder} onChange={e => setZoneOrder(Number(e.target.value))} required />
                        <CyberButton type="submit" disabled={isLoading || !apiKey}>Create Zone</CyberButton>
                    </form>
                    <div>
                        <h3 className="font-bold text-lg mb-2">Existing Zones</h3>
                        <ul className="space-y-2">
                           {zones.map(zone => (
                             <li key={zone.id} className="p-2 bg-muted/50 rounded text-sm font-mono">{zone.name} (Order: {zone.order})</li>
                           ))}
                        </ul>
                    </div>
                </CardContent>
            </Card>

            {/* Challenge Management */}
            <Card>
                <CardHeader>
                    <CardTitle>Manage Challenges</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleCreateChallenge} className="space-y-4 mb-6">
                        <h3 className="font-bold text-lg">Create New Challenge</h3>
                        {/* ... (all other inputs like title, desc, zone, etc. are unchanged) ... */}
                        <Input placeholder="Challenge Title" value={challengeTitle} onChange={e => setChallengeTitle(e.target.value)} required />
                        <Textarea placeholder="Challenge Description" value={challengeDesc} onChange={e => setChallengeDesc(e.target.value)} required />
                        <Select onValueChange={setChallengeZoneId} value={challengeZoneId} required>
                            <SelectTrigger><SelectValue placeholder="Select a Zone" /></SelectTrigger>
                            <SelectContent>
                                {zones.map(zone => <SelectItem key={zone.id} value={zone.id}>{zone.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <Select onValueChange={setChallengeDifficulty} defaultValue="Easy">
                            <SelectTrigger><SelectValue placeholder="Select Difficulty" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Easy">Easy</SelectItem>
                                <SelectItem value="Medium">Medium</SelectItem>
                                <SelectItem value="Hard">Hard</SelectItem>
                                <SelectItem value="Insane">Insane</SelectItem>
                            </SelectContent>
                        </Select>
                        <Input type="number" placeholder="Points" value={challengePoints} onChange={e => setChallengePoints(Number(e.target.value))} required />
                        <Input placeholder="Flag (e.g., PIXEL{...})" value={challengeFlag} onChange={e => setChallengeFlag(e.target.value)} required />
                        <Textarea placeholder="Hints (comma-separated)" value={challengeHints} onChange={e => setChallengeHints(e.target.value)} />
                        
                        {/* --- REPLACED File Input with Link Inputs --- */}
                        <div className="p-4 border rounded-md space-y-3 bg-muted/20">
                            <Label className="flex items-center gap-2 font-semibold">
                                <Link2 className="w-4 h-4" />
                                Source File Links (Optional)
                            </Label>
                            <Textarea 
                                placeholder="File Names (e.g., file1.zip, notes.txt)" 
                                value={sourceFileNames} 
                                onChange={e => setSourceFileNames(e.target.value)}
                                className="font-mono text-sm" 
                            />
                            <Textarea 
                                placeholder="Google Drive Links (e.g., https://..., https://...)" 
                                value={sourceFileLinks} 
                                onChange={e => setSourceFileLinks(e.target.value)}
                                className="font-mono text-sm" 
                            />
                            <p className="text-xs text-muted-foreground">
                                Separate multiple file names and links with a comma. Ensure they are in the same order.
                            </p>
                        </div>
                        
                        <CyberButton type="submit" disabled={isLoading || !apiKey}>Create Challenge</CyberButton>
                    </form>
                    <div>
                        <h3 className="font-bold text-lg mb-2">Existing Challenges ({challenges.length})</h3>
                    </div>
                </CardContent>
            </Card>
            
            {/* --- NEW TEAM REGISTRATION CARD --- */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><UserPlus /> Register Team</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleRegisterTeam} className="space-y-4 mb-6">
                        <h3 className="font-bold text-lg">Create New Team</h3>
                        <Input 
                            placeholder="Team Name" 
                            value={regTeamName} 
                            onChange={e => setRegTeamName(e.target.value)} 
                            required 
                        />
                        <Input 
                            type="password" 
                            placeholder="Team Password" 
                            value={regPassword} 
                            onChange={e => setRegPassword(e.target.value)} 
                            required 
                        />
                        <CyberButton type="submit" disabled={isLoading || !apiKey}>Register Team</CyberButton>
                    </form>
                    <div className="border-t border-border/20 pt-4">
                        <h3 className="font-bold text-lg mb-2">Registered Teams ({leaderboard.length})</h3>
                        <div className="h-40 overflow-y-auto space-y-2">
                           {leaderboard.map(team => (
                             <div key={team.teamId} className="p-2 bg-muted/50 rounded text-sm font-mono flex justify-between">
                               <span>{team.teamName}</span>
                               <span className="text-muted-foreground">{team.score} pts</span>
                             </div>
                           ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
        {/* --- NEW LEADERBOARD CARD --- */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><BarChart2 /> Live Leaderboard</CardTitle>
                    <CardDescription>Real-time scores and rankings of all teams.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {leaderboard.map((team, index) => (
                            <div key={team.teamId} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                                <div className="flex items-center gap-4">
                                    <span className="font-mono text-lg font-bold w-6 text-center">{index + 1}</span>
                                    <div className="font-mono text-sm">
                                        <p className="text-primary">{team.teamName}</p>
                                        <p className="text-primary">{team.teamId}</p>
                                        <p className="text-xs text-muted-foreground">{team.solvedChallenges} challenges solved</p>
                                    </div>
                                </div>
                                <div className="font-mono font-bold text-lg">{team.score.toLocaleString()} pts</div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </motion.div>


        {/* --- NEW SUBMISSIONS CARD --- */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><History /> Submission Log</CardTitle>
                    <CardDescription>A live feed of all flag submissions from all teams.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-64 overflow-y-auto bg-muted/20 p-3 rounded-lg font-mono text-xs space-y-1">
                        {submissions.map((sub) => (
                            <p key={sub.submissionId} className="whitespace-pre-wrap">
                                <span className="text-muted-foreground">{new Date(sub.timestamp).toLocaleTimeString()}: </span>
                                <span className={cn(sub.isCorrect ? 'text-success' : 'text-destructive')}>
                                    {sub.isCorrect ? '[CORRECT] ' : '[WRONG]   '}
                                </span>
                                {/* --- CHANGE THIS LINE --- */}
                                <span className="text-primary/80">Team '{sub.teamName}' </span>
                                <span className="text-muted-foreground">submitted for Challenge {sub.challengeTitle}</span>
                            </p>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </motion.div>

      </motion.div>
    </div>
  );
};

export default AdminPage;