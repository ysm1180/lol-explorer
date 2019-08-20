export interface SummonerApiData {
  id: string;
  accountId: string;
  puuid: string;
  name: string;
  profileIconId: number;
  revisionDate: number;
  summonerLevel: number;
  updatedTs: string;
  seasons: SummonerSeasonApiData[];
  iconUrl: string;
}

interface SeasonMiniSeries {
  wins: number;
  losses: number;
  progress: string;
}

export interface SummonerSeasonApiData {
  queueType: string;
  tier: string;
  rank: string;
  summonerId: string;
  summonerName: string;
  leaguePoints: number;
  wins: number;
  losses: number;
  leagueId?: string;
  veteran?: boolean;
  inactive?: boolean;
  freshBlood?: boolean;
  hotStreak?: boolean;
  season?: number;
  miniSeries?: SeasonMiniSeries[];
}
