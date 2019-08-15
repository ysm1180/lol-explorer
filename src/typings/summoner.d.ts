export interface ISummonerApiData {
  id: string;
  accountId: string;
  puuid: string;
  name: string;
  profileIconId: number;
  revisionDate: number;
  summonerLevel: number;
  updatedTs: string;
  seasons: ISummonerSeason[];
  iconUrl: string;
}

interface ISeasonMiniSeries {
  wins: number;
  losses: number;
  progress: string;
}

export interface ISummonerSeason {
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
  miniSeries?: ISeasonMiniSeries[];
}
