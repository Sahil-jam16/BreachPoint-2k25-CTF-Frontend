import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { CyberButton } from '@/components/ui/cyber-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shield, Key, Link2 } from 'lucide-react';

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

const AdminPage: React.FC = () => {
  const { toast } = useToast();
  // State for Admin API Key
  const [apiKey, setApiKey] = useState('');

  // State for Zones
  const [zones, setZones] = useState<Zone[]>([]);
  const [zoneName, setZoneName] = useState('');
  const [zoneDesc, setZoneDesc] = useState('');
  const [zoneOrder, setZoneOrder] = useState(1);

  // State for Challenges
  const [challenges, setChallenges] = useState<Challenge[]>([]);
    const [challengeTitle, setChallengeTitle] = useState('');
    const [challengeDesc, setChallengeDesc] = useState('');
    const [challengeZoneId, setChallengeZoneId] = useState('');
    const [challengeDifficulty, setChallengeDifficulty] = useState('Easy');
    const [challengePoints, setChallengePoints] = useState(50);
    const [challengeFlag, setChallengeFlag] = useState('');
    const [challengeHints, setChallengeHints] = useState('');
    // REMOVED file upload state
    // const [challengeFile, setChallengeFile] = useState<File | null>(null);

    // ADDED state for file names and links
    const [sourceFileNames, setSourceFileNames] = useState('');
    const [sourceFileLinks, setSourceFileLinks] = useState('');

    const [isLoading, setIsLoading] = useState(false);

  // Fetch initial data (zones and challenges)
  const fetchData = useCallback(async () => {
    if (!apiKey) return;
    setIsLoading(true);
    try {
      const [zonesRes, challengesRes] = await Promise.all([
        fetch("http://127.0.0.1:8000/admin/zones", { headers: { 'X-Admin-API-Key': apiKey } }),
        fetch("http://127.0.0.1:8000/admin/challenges", { headers: { 'X-Admin-API-Key': apiKey } })
      ]);
      if (!zonesRes.ok || !challengesRes.ok) throw new Error('Failed to fetch data. Check API Key.');
      
      const zonesData = await zonesRes.json();
      const challengesData = await challengesRes.json();
      setZones(zonesData);
      setChallenges(challengesData);
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } finally {
      setIsLoading(false);
    }
  }, [apiKey, toast]);

  useEffect(() => {
    // This effect will refetch data whenever the apiKey changes.
    // The user just needs to paste their key and the data will load.
    if(apiKey) {
      fetchData();
    }
  }, [apiKey, fetchData]);

  // Handler to create a new zone
  const handleCreateZone = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/admin/zones", {
        method: "POST",
        headers: { 'Content-Type': 'application/json', 'X-Admin-API-Key': apiKey },
        body: JSON.stringify({ name: zoneName, description: zoneDesc, order: Number(zoneOrder) }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail);
      
      toast({ title: "Success", description: "Zone created successfully!" });
      fetchData(); // Refresh data
      // Clear form
      setZoneName('');
      setZoneDesc('');
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error Creating Zone", description: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  // Handler to create a new challenge
  const handleCreateChallenge = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Process file names and links from the input strings
        const names = sourceFileNames.split(',').map(n => n.trim());
        const links = sourceFileLinks.split(',').map(l => l.trim());

        const sourceFiles = links
            .filter(link => link) // Ignore empty entries
            .map((link, index) => ({
                fileName: names[index] || `Download Link ${index + 1}`, // Provide a fallback name
                filePath: link,
            }));

        // Create the JSON payload
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
            // Send request as 'application/json' instead of 'FormData'
            const response = await fetch("http://127.0.0.1:8000/admin/challenges", {
                method: "POST",
                headers: { 
                    'Content-Type': 'application/json', // Set content type
                    'X-Admin-API-Key': apiKey 
                },
                body: JSON.stringify(challengeData), // Stringify the payload
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.detail);

            toast({ title: "Success", description: "Challenge created successfully!" });
            fetchData(); // Refresh data
            
            // Clear the form
            setChallengeTitle('');
            setChallengeDesc('');
            setChallengeZoneId('');
            setChallengeDifficulty('Easy');
            setChallengePoints(50);
            setChallengeFlag('');
            setChallengeHints('');
            setSourceFileNames(''); // Clear new fields
            setSourceFileLinks(''); // Clear new fields
        } catch (error: any) {
            toast({ variant: "destructive", title: "Error Creating Challenge", description: error.message });
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
        </div>
      </motion.div>
    </div>
  );
};

export default AdminPage;