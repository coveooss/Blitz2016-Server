interface Config {
    mongodb: string;
    sessionSecret: string;
    adminPassword: string;
    platform: {
        url: string;
        port: number;
        path: string;
    }
    port: number;
}

interface Achievement {
    _id?: string;
    name: string;
    image: string;
    description?: string;
    hidden: boolean;
    unlocked?: boolean;
    teams?: Team[];
}

interface UnlockedAchievement {
    achievementId: string;
    achievement?: Achievement;
    unlockedTime: string;
}

interface Member {
    name: string;
    email: string;
}

interface Team {
    _id?: string;
    name: string;
    unlockedAchievements?: UnlockedAchievement[];
    members?: Member[];
    password?: string;
    ready?: boolean;
    number?: number;
    botId?: string;
}

interface Request extends Express.Request {
    session?: Session;
}

interface Session extends Express.Session {
    user: {
        role: string;
        team: string;
        apiKey?: string;
        slackToken?: string;
    }
}