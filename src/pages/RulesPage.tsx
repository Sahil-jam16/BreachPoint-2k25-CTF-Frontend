// src/pages/RulesPage.tsx

import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CyberButton } from '@/components/ui/cyber-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import GlitchText from '@/components/GlitchText';
import { ArrowLeft, ShieldCheck, Gavel, Flag, Bug } from 'lucide-react';

// Updated data with Discord Link and Easter Egg
const rulesData = [
  {
    icon: <ShieldCheck className="w-6 h-6 text-primary" />,
    title: 'General Conduct',
    points: [
      'Be respectful to all participants and organizers.',
      'This is a team-based competition. Collaboration should be kept within your registered team.',
      'Do not share flags, hints, or solutions with other teams.',
      <>
        The official communication channel is our{' '}
        <a
          href="https://discord.gg/YOUR_SERVER_INVITE" // <-- REPLACE WITH YOUR DISCORD LINK
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold text-primary underline hover:text-primary/80"
        >
          Discord server
        </a>
        . All announcements will be made there.
      </>,
    ],
  },
  {
    icon: <Bug className="w-6 h-6 text-destructive" />,
    title: 'Technical Rules',
    points: [
      'Attacking the competition infrastructure (scoreboard, submission system, etc.) is strictly forbidden.',
      'Do not perform any Denial of Service (DoS/DDoS) attacks against any platform component.',
      'All challenges are designed to be solved without requiring noisy automated scanning. Excessive scanning may result in a temporary ban.',
      'Sabotaging or impeding the progress of other teams is against the rules.',
    ],
  },
  {
    icon: <Flag className="w-6 h-6 text-success" />,
    title: 'Flags & Submissions',
    points: [
      'Flags are the secret strings you find by solving challenges.',
      'The flag format is `BreachPoint{some_secret_text_here}` unless specified otherwise.',
      'Flags are case-sensitive. Submit them exactly as you find them.',
      'There is no penalty for incorrect flag submissions.',
    ],
  },
  {
    icon: <Gavel className="w-6 h-6 text-yellow-400" />,
    title: 'Scoring & Disputes',
    points: [
      'Each challenge has a static point value.',
      'The team with the most points at the end of the competition wins.',
      'In the event of a tie in score, the team that reached that score earliest will be ranked higher.',
      <>
        The decisions of the CTF organizers are final.
        <span className="block mt-2 text-xs font-mono opacity-50 hover:opacity-100 transition-opacity">
          Keep digging. There's always another layer.
        </span>
      </>,
    ],
  },
];

const RulesPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen p-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 relative z-10"
            >
                <CyberButton
                    variant="ghost"
                    onClick={() => navigate('/dashboard')}
                    className="gap-2 mb-4"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Dashboard
                </CyberButton>
                
                <GlitchText className="text-3xl font-bold mb-2" intensity="low">
                    RULES OF ENGAGEMENT
                </GlitchText>
                <p className="text-muted-foreground font-cyber">
                    Adherence to these protocols is mandatory for all participants.
                </p>
            </motion.div>

            {/* Rules Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                {rulesData.map((rule, index) => (
                    <motion.div
                        key={rule.title}
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                        <Card className="h-full zone-card">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3 font-cyber">
                                    {rule.icon}
                                    {rule.title}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="list-disc list-inside space-y-2 text-muted-foreground text-sm">
                                    {rule.points.map((point, pointIndex) => (
                                        <li key={pointIndex}>{point}</li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default RulesPage;