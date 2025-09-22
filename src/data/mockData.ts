// Mock data for Pixel Rift: Anomaly Echo CTF Platform

export interface Team {
  id: string;
  name: string;
  password: string;
  totalPoints: number;
  solvedChallenges: string[];
  badges: string[];
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Insane';
  points: number;
  flag: string;
  hints: string[];
  zoneId: string;
}



export interface Zone {
  id: string;
  name: string;
  description: string;
  challenges: string[];
  isUnlocked: boolean;
}

export const mockTeams: Team[] = [
  {
    id: '1',
    name: 'Neural Hackers',
    password: 'hack123',
    totalPoints: 2500,
    solvedChallenges: ['1', '2', '5', '7'],
    badges: ['Bug Whisperer', 'Noise Decoder']
  },
  {
    id: '2',
    name: 'Void Runners',
    password: 'void456',
    totalPoints: 1800,
    solvedChallenges: ['1', '3', '6'],
    badges: ['Bug Whisperer']
  },
  {
    id: '3',
    name: 'Echo Division',
    password: 'echo789',
    totalPoints: 3200,
    solvedChallenges: ['1', '2', '3', '4', '5', '8'],
    badges: ['Bug Whisperer', 'Noise Decoder', 'Echo Master']
  },
  {
    id: '4',
    name: 'Glitch Lords',
    password: 'glitch000',
    totalPoints: 1500,
    solvedChallenges: ['1', '4'],
    badges: ['Bug Whisperer']
  }
];

export const mockZones: Zone[] = [
  {
    id: 'boot-sector',
    name: 'Boot Sector',
    description: 'The foundation where reality began to fracture. Basic anomalies plague the system startup.',
    challenges: ['1', '2'],
    isUnlocked: true
  },
  {
    id: 'corrupted-forest',
    name: 'Corrupted Forest',
    description: 'Once green algorithms now twisted into malformed data structures.',
    challenges: ['3', '4'],
    isUnlocked: true
  },
  {
    id: 'broken-city',
    name: 'Broken City',
    description: 'Digital metropolis where network protocols have gone rogue.',
    challenges: ['5', '6'],
    isUnlocked: true
  },
  {
    id: 'kernel-core',
    name: 'Kernel Core',
    description: 'The heart of the system where the deepest anomalies hide.',
    challenges: ['7', '8'],
    isUnlocked: true
  }
];

export const mockChallenges: Challenge[] = [
  {
    id: '1',
    title: 'Memory Leak Detection',
    description: 'The boot sector is experiencing memory corruption. Find the pattern in the leaked data to restore stability.',
    difficulty: 'Easy',
    points: 100,
    flag: 'PIXEL{mem0ry_l34k_d3t3ct3d}',
    hints: [
      'Look for repeating patterns in the hex dump',
      'Memory addresses might hold clues'
    ],
    zoneId: 'boot-sector'
  },
  {
    id: '2',
    title: 'Boot Sequence Anomaly',
    description: 'The system boot sequence has been tampered with. Decode the corrupted initialization vectors.',
    difficulty: 'Easy',
    points: 150,
    flag: 'PIXEL{b00t_s3qu3nc3_r3st0r3d}',
    hints: [
      'XOR operations might reveal hidden data',
      'Check the first few bytes of each sector'
    ],
    zoneId: 'boot-sector'
  },
  {
    id: '3',
    title: 'Tree Structure Corruption',
    description: 'The forest\'s binary trees have been infected with malicious nodes. Traverse carefully to find the antidote.',
    difficulty: 'Medium',
    points: 300,
    flag: 'PIXEL{tr33_h34l3d_by_tr4v3rs4l}',
    hints: [
      'In-order traversal might reveal the pattern',
      'Look for nodes with unusual values'
    ],
    zoneId: 'corrupted-forest'
  },
  {
    id: '4',
    title: 'Algorithm Mutation',
    description: 'A sorting algorithm has mutated and produces incorrect results. Find what went wrong in the code.',
    difficulty: 'Medium',
    points: 350,
    flag: 'PIXEL{4lg0r1thm_mut4t10n_f1x3d}',
    hints: [
      'Compare with standard sorting implementations',
      'Off-by-one errors are common mutations'
    ],
    zoneId: 'corrupted-forest'
  },
  {
    id: '5',
    title: 'Network Protocol Hijack',
    description: 'City communications are compromised. Intercept the malicious packets and decode their payload.',
    difficulty: 'Hard',
    points: 500,
    flag: 'PIXEL{n3tw0rk_pr0t0c0l_s3cur3d}',
    hints: [
      'Wireshark captures might contain the answer',
      'Look for unusual packet sizes or timing'
    ],
    zoneId: 'broken-city'
  },
  {
    id: '6',
    title: 'Firewall Breach',
    description: 'The city\'s digital defenses have been breached. Analyze the attack vector and patch the vulnerability.',
    difficulty: 'Hard',
    points: 450,
    flag: 'PIXEL{f1r3w4ll_br34ch_p4tch3d}',
    hints: [
      'Buffer overflows often lead to breaches',
      'Check the input validation routines'
    ],
    zoneId: 'broken-city'
  },
  {
    id: '7',
    title: 'Kernel Panic Recovery',
    description: 'The core system has crashed with a kernel panic. Decode the crash dump to understand what happened.',
    difficulty: 'Insane',
    points: 800,
    flag: 'PIXEL{k3rn3l_p4n1c_r3c0v3r3d}',
    hints: [
      'Stack traces contain valuable information',
      'Memory protection violations are often the cause'
    ],
    zoneId: 'kernel-core'
  },
  {
    id: '8',
    title: 'System Call Injection',
    description: 'Malicious code is injecting system calls to gain unauthorized access. Find and neutralize the injection point.',
    difficulty: 'Insane',
    points: 900,
    flag: 'PIXEL{syst3m_c4ll_1nj3ct10n_n3utr4l1z3d}',
    hints: [
      'Look for unusual system call patterns',
      'Return-oriented programming might be involved'
    ],
    zoneId: 'kernel-core'
  }
];

export const badges = [
  { id: 'bug-whisperer', name: 'Bug Whisperer', description: 'Solved your first challenge', requirement: 1 },
  { id: 'noise-decoder', name: 'Noise Decoder', description: 'Solved 3 challenges', requirement: 3 },
  { id: 'echo-master', name: 'Echo Master', description: 'Solved 5 challenges', requirement: 5 },
  { id: 'anomaly-hunter', name: 'Anomaly Hunter', description: 'Solved all challenges in a zone', requirement: 'zone-complete' },
  { id: 'rift-closer', name: 'Rift Closer', description: 'Solved all challenges', requirement: 'all-complete' }
];

// Calculate total possible points
export const getTotalPossiblePoints = (): number => {
  return mockChallenges.reduce((total, challenge) => total + challenge.points, 0);
};

// Get team progress percentage
export const getTeamProgress = (team: Team): number => {
  const totalPossible = getTotalPossiblePoints();
  return Math.round((team.totalPoints / totalPossible) * 100);
};