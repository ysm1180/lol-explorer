declare module 'models' {
  export type RiotSeasonLeague = {
    tier: string;
    rank: string;
    wins: number;
    losses: number;
    queueType: string;
    leagueId: string;
    leaguePoints: number;
    inactive: boolean;
  };

  export type RiotSummonerData = {
    id: string;
    accountId: string;
    name: string;
    profileIconId: number;
    puuid: string;
    summonerLevel: number;
    seasons: RiotSeasonLeague[];
    iconUrl: string;
  };

  export type RiotMatchTeamData = {
    teamId: number;
    win: string;
    firstBlood: boolean;
    firstTower: boolean;
    firstInhibitor: boolean;
    firstBaron: boolean;
    firstDragon: boolean;
    firstRiftHerald: boolean;
    towerKills: number;
    inhibitorKills: number;
    baronKills: number;
    dragonKills: number;
    vilemawKills: number;
    riftHeraldKills: number;
    dominionVictoryScore: number;
    bans: {
      championId: number;
      pickTurn: number;
    }[];
  };

  export type RiotMatchParticipantData = {
    participantId: number;
    teamId: number;
    championId: number;
    spell1Id: number;
    spell2Id: number;
    stats: {
      participantId: number;
      win: boolean;
      items: number[];
      kills: number;
      deaths: number;
      assists: number;
      largestKillingSpree: number;
      largestMultiKill: number;
      killingSprees: number;
      longestTimeSpentLiving: number;
      doubleKills: number;
      tripleKills: number;
      quadraKills: number;
      pentaKills: number;
      unrealKills: number;
      totalDamageDealt: number;
      magicDamageDealt: number;
      physicalDamageDealt: number;
      trueDamageDealt: number;
      largestCriticalStrike: number;
      totalDamageDealtToChampions: number;
      magicDamageDealtToChampions: number;
      physicalDamageDealtToChampions: number;
      trueDamageDealtToChampions: number;
      totalHeal: number;
      totalUnitsHealed: number;
      damageSelfMitigated: number;
      damageDealtToObjectives: number;
      damageDealtToTurrets: number;
      visionScore: number;
      timeCCingOthers: number;
      totalDamageTaken: number;
      magicalDamageTaken: number;
      physicalDamageTaken: number;
      trueDamageTaken: number;
      goldEarned: number;
      goldSpent: number;
      turretKills: number;
      inhibitorKills: number;
      totalMinionsKilled: number;
      neutralMinionsKilled: number;
      neutralMinionsKilledTeamJungle: number;
      neutralMinionsKilledEnemyJungle: number;
      totalTimeCrowdControlDealt: number;
      champLevel: number;
      visionWardsBoughtInGame: number;
      sightWardsBoughtInGame: number;
      wardsPlaced: number;
      wardsKilled: number;
      firstBloodKill: boolean;
      firstBloodAssist: boolean;
      firstTowerKill: boolean;
      firstTowerAssist: boolean;
      combatPlayerScore: number;
      objectivePlayerScore: number;
      totalPlayerScore: number;
      totalScoreRank: number;
      playerScore0: number;
      playerScore1: number;
      playerScore2: number;
      playerScore3: number;
      playerScore4: number;
      playerScore5: number;
      playerScore6: number;
      playerScore7: number;
      playerScore8: number;
      playerScore9: number;
      perk0: number;
      perk0Var1: number;
      perk0Var2: number;
      perk0Var3: number;
      perk1: number;
      perk1Var1: number;
      perk1Var2: number;
      perk1Var3: number;
      perk2: number;
      perk2Var1: number;
      perk2Var2: number;
      perk2Var3: number;
      perk3: number;
      perk3Var1: number;
      perk3Var2: number;
      perk3Var3: number;
      perk4: number;
      perk4Var1: number;
      perk4Var2: number;
      perk4Var3: number;
      perk5: number;
      perk5Var1: number;
      perk5Var2: number;
      perk5Var3: number;
      perkPrimaryStyle: number;
      perkSubStyle: number;
      statPerk0: number;
      statPerk1: number;
      statPerk2: number;
    };
    timeline: {
      participantId: number;
      role: 'DUO' | 'NONE' | 'SOLO' | 'DUO_CARRY' | 'DUO_SUPPORT';
      lane: 'TOP' | 'JUNGLE' | 'MIDDLE' | 'BOTTOM' | 'NONE';
    };
  };

  export type RiotMatchParticipantIdentity = {
    participantId: number;
    player: {
      platformId: string;
      accountId: string;
      summonerName: string;
      summonerId: string;
      currentPlatformId: string;
      currentAccountId: string;
      matchHistoryUri: string;
      profileIcon: number;
    };
  };

  export type RiotMatchGameInfo = {
    gameId: number;
    gameDuration: number;
    queueId: number;
    mapId: number;
    platformId: number;
    teams: RiotMatchTeamData[];
    participants: RiotMatchParticipantData[];
    participantIdentities: RiotMatchParticipantIdentity[];
  };

  export type RiotMatchData = {
    platformId: string;
    gameId: string;
    champion: number;
    queue: number;
    season: number;
    timestamp: number;
    role: string;
    lane: string;
    gameInfo: RiotMatchGameInfo;
  };
}
