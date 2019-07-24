export interface IChampionInfoApiData {
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

export interface IChampionDetail {
  rank: number;
  championKey: number;
  championName: string;
  wins: number;
  losses: number;
  winRate: number;
  averageKills: number;
  averageDeaths: number;
  averageAssists: number;
  kda: number;
  averageCS: number;
  averageEarnedGold: number;
  doubleKills: number;
  tripleKills: number;
  quadraKills: number;
  pentaKills: number;
}

interface IParticipantPlayer {
  accountId: string;
  summonerId: string;
  summonerName: string;
  platformId: string;
  profileIcon: number;
}

interface IPerMinDeltas {
  [id: string]: number;
}

interface IGameParticipantStats {
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

interface IGameParicipantTimeline {
  participantId: number;
  creepsPerMinDeltas: IPerMinDeltas;
  xpPerMinDeltas: IPerMinDeltas;
  goldPerMinDeltas: IPerMinDeltas;
  csDiffPerMinDeltas: IPerMinDeltas;
  xpDiffPerMinDeltas: IPerMinDeltas;
  damageTakenPerMinDeltas: IPerMinDeltas;
  damageTakenDiffPerMinDeltas: IPerMinDeltas;
  role: string;
  lane: string;
}

export interface IGameParticipant {
  player: IParticipantPlayer;
  teamId: number;
  championId: number;
  items: number[];
  spells: number[];
  stats: IGameParticipantStats;
  timeline: IGameParicipantTimeline;
}

export interface IGameTeam {
  isWin: boolean;
  teamId: number;
  towerKills: number;
  dragonKills: number;
  baronKills: number;
  firstBlood: number;
  totalKills: number;
  totalDeaths: number;
  totalAssists: number;
  participants: { [id: string]: IGameParticipant };
}

export interface IGameRequester {
  isWin: boolean;
  teamId: number;
  participantId: number;
}

export interface IGameInfoData {
  gameDuration: number;
  mapId: number;
  requester: IGameRequester;
  teams: { [id: string]: IGameTeam };
}

export interface IMatchApiData {
  platformId: string;
  gameId: number;
  champion: number;
  queue: number;
  season: number;
  timestamp: number;
  role: string;
  lane: string;
  summonerAccountId: string;
  gameInfo: IGameInfoData;
}
