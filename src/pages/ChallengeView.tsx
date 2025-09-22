// src/pages/ChallengeView.tsx

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, AlertTriangle } from 'lucide-react';

// --- Real Imports ---
import apiFetch from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import ChallengeCard from '@/components/ChallengeCard'; // Import the real component
import { CyberButton } from '@/components/ui/cyber-button';
import GlitchText from '@/components/GlitchText';

// --- Type Definitions ---
interface Challenge {
  id: string;
  title: string;
  points: number;
  difficulty: string;
  description: string;
  isSolved: boolean;
  hints: string[];
  sourceFiles?: { fileName: string; filePath: string }[];
}

interface Zone {
  id: string;
  name: string;
  description: string;
  order: number;
  challenges: Challenge[];
}

// --- The Component ---
const ChallengeView: React.FC = () => {
    const { zoneId } = useParams<{ zoneId: string }>();
    const navigate = useNavigate();
    const { refetchTeam } = useAuth(); // Get refetch function from context
    const [zone, setZone] = useState<Zone | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchZoneData = async () => {
        if (!zoneId) {
            setError("No Zone ID provided.");
            setIsLoading(false);
            return;
        }
        try {
            const allZones: Zone[] = await apiFetch('/challenges/zones');
            const currentZone = allZones.find(z => z.id === zoneId);
            
            if (currentZone) {
                setZone(currentZone);
                setError(null);
            } else {
                setError(`Zone with ID '${zoneId}' could not be found.`);
            }
        } catch (err: any) {
            setError(err.message || "Failed to connect to the server.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        setIsLoading(true);
        fetchZoneData();
    }, [zoneId]);

    const handleChallengeSolved = () => {
        // This function is passed to each ChallengeCard.
        // When a challenge is solved, the card calls this function.
        fetchZoneData(); // Refetch zone data to update 'isSolved' status
        refetchTeam();   // Refetch global team data to update score, etc.
    };

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center font-cyber animate-pulse">LOADING ZONE DATA...</div>;
    }

    if (error || !zone) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
                <AlertTriangle className="w-12 h-12 text-destructive mb-4" />
                <h1 className="text-2xl font-bold text-destructive-foreground mb-4">Zone Not Found</h1>
                <p className="text-muted-foreground mb-6">{error}</p>
                <CyberButton onClick={() => navigate('/dashboard')}>Return to Dashboard</CyberButton>
            </div>
        );
    }

    const totalPoints = zone.challenges.reduce((sum, c) => sum + c.points, 0);
    const difficultySpread = `${zone.challenges.filter(c => c.difficulty === 'Easy').length}E / ${zone.challenges.filter(c => c.difficulty === 'Medium').length}M / ${zone.challenges.filter(c => c.difficulty === 'Hard').length}H`;
    
    return (
        <div className="min-h-screen p-6">
            <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                <CyberButton variant="ghost" onClick={() => navigate('/dashboard')} className="gap-2 mb-4">
                    <ArrowLeft className="w-4 h-4" />Back to Dashboard
                </CyberButton>
                <div className="flex items-center gap-3 mb-2">
                    <MapPin className="w-6 h-6 text-primary" />
                    <GlitchText className="text-3xl font-bold">{zone.name.toUpperCase()}</GlitchText>
                </div>
                <p className="text-muted-foreground font-cyber max-w-2xl">{zone.description}</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="zone-card p-6 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <div>
                        <div className="text-2xl font-bold font-mono text-primary mb-2">{zone.challenges.length}</div>
                        <div className="text-sm text-muted-foreground font-cyber">Total Anomalies</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold font-mono text-secondary mb-2">{totalPoints}</div>
                        <div className="text-sm text-muted-foreground font-cyber">Possible Points</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold font-mono text-success mb-2">{difficultySpread}</div>
                        <div className="text-sm text-muted-foreground font-cyber">Difficulty Spread</div>
                    </div>
                </div>
            </motion.div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {zone.challenges.map((challenge, index) => (
                    <ChallengeCard 
                        key={challenge.id} 
                        challenge={challenge} 
                        index={index} 
                        onChallengeSolved={handleChallengeSolved} // Pass the callback here
                    />
                ))}
            </div>
        </div>
    );
};

export default ChallengeView;