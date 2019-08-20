export interface ChampionInfoApiData {
  key: number;
  wins: number;
  losses: number;
  averageKills: number;
  averageDeaths: number;
  averageAssists: number;
  averageCS: number;
  averageEarnedGold: number;
  averageGameDuration: number;
  doubleKills: number;
  tripleKills: number;
  quadraKills: number;
  pentaKills: number;
}

interface ParticipantPlayer {
  accountId: string;
  summonerId: string;
  summonerName: string;
  platformId: string;
  profileIcon: number;
}

interface PerMinDeltas {
  [id: string]: number;
}

interface GameParticipantStats {
  kills: number;
  deaths: number;
  assists: number;
  doubleKills: number;
  tripleKills: number;
  quadraKills: number;
  pentaKills: number;
  totalDamageDealt: number;
  trueDamageDealt: number;
  totalDamageDealtToChampions: number;
  trueDamageDealtToChampions: number;
  totalHeal: number;
  visionScore: number;
  totalDamageTaken: number;
  trueDamageTaken: number;
  goldEarned: number;
  turretKills: number;
  totalMinionsKilled: number;
  neutralMinionsKilled: number;
  neutralMinionsKilledTeamJungle: number;
  neutralMinionsKilledEnemyJungle: number;
  champLevel: number;
  firstBloodKill: boolean;
  firstTowerKill: boolean;
  perkPrimaryStyle: number;
  perkSubStyle: number;
  perks: number[];
  statPerks: number[];
}

interface GameParicipantTimeline {
  participantId: number;
  creepsPerMinDeltas: PerMinDeltas;
  xpPerMinDeltas: PerMinDeltas;
  goldPerMinDeltas: PerMinDeltas;
  csDiffPerMinDeltas: PerMinDeltas;
  xpDiffPerMinDeltas: PerMinDeltas;
  damageTakenPerMinDeltas: PerMinDeltas;
  damageTakenDiffPerMinDeltas: PerMinDeltas;
  role: string;
  lane: string;
}

export interface GameParticipantData {
  player: ParticipantPlayer;
  teamId: number;
  championId: number;
  items: number[];
  spells: number[];
  stats: GameParticipantStats;
  timeline: GameParicipantTimeline;
}

export interface GameTeamApiData {
  isWin: boolean;
  teamId: number;
  towerKills: number;
  dragonKills: number;
  baronKills: number;
  firstBlood: number;
  totalKills: number;
  totalDeaths: number;
  totalAssists: number;
  participants: { [id: string]: GameParticipantData };
}

export interface GameRequesterData {
  isWin: boolean;
  teamId: number;
  participantId: number;
}

export interface GameInfoApiData {
  gameDuration: number;
  mapId: number;
  requester: GameRequesterData;
  teams: { [id: string]: GameTeamApiData };
}

export interface MatchApiData {
  platformId: string;
  gameId: number;
  champion: number;
  queue: number;
  season: number;
  timestamp: number;
  role: string;
  lane: string;
  summonerAccountId: string;
  gameInfo: GameInfoApiData;
}
