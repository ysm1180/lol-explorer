export interface StaticItemApiData {
  name: string;
  description: string;
  colloq: string;
  plaintext: string;
  into: string[];
  gold: {
    base: number;
    purchasable: boolean;
    total: number;
    sell: number;
  };
  key: number;
  iconUrl: string;
}

export interface StaticChampionApiData {
  id: string;
  key: number;
  name: string;
  title: string;
  skins: ChampionSkinsItem[];
  lore: string;
  blurb: string;
  allytips: string[];
  enemytips: string[];
  tags: string[];
  partype: string;
  info: ChampionInfo;
  stats: ChampionStats;
  spells: ChampionSpellsItem[];
  passive: ChampionPassive;
  iconUrl: string;
}

interface ChampionSkinsItem {
  id: string;
  num: number;
  name: string;
  chromas: boolean;
}

interface ChampionInfo {
  attack: number;
  defense: number;
  magic: number;
  difficulty: number;
}

interface ChampionStats {
  hp: number;
  hpperlevel: number;
  mp: number;
  mpperlevel: number;
  movespeed: number;
  armor: number;
  armorperlevel: number;
  spellblock: number;
  spellblockperlevel: number;
  attackrange: number;
  hpregen: number;
  hpregenperlevel: number;
  mpregen: number;
  mpregenperlevel: number;
  crit: number;
  critperlevel: number;
  attackdamage: number;
  attackdamageperlevel: number;
  attackspeedperlevel: number;
  attackspeed: number;
}

interface ChampionSpellsItem {
  id: string;
  name: string;
  tooltip: string;
  cooldownBurn: string;
  costType: string;
  maxammo: string;
  rangeBurn: string;
  resource: string;
  iconUrl: string;
  secret?: boolean;
}

interface ChampionPassive {
  name: string;
  description: string;
  iconUrl: string;
}

export interface StaticSpellApiData {
  id: string;
  name: string;
  description: string;
  tooltip: string;
  maxrank: number;
  cooldown: number[];
  cooldownBurn: string;
  cost: number[];
  costBurn: string;
  datavalues: {};
  vars: SpellVarsItem[];
  key: number;
  summonerLevel: number;
  costType: string;
  maxammo: string;
  range: number[];
  rangeBurn: string;
  resource: string;
  iconUrl: string;
}

interface SpellVarsItem {
  link: string;
  coeff: number;
  key: string;
}

export interface StaticPerkApiData {
  id: number;
  name: string;
  iconUrl: string;
  slots: Array<{
    runes: { [id: string]: StaticRuneApiData };
  }>;
}

export interface StaticRuneApiData {
  name: string;
  iconUrl: string;
  shortDesc: string;
  longDesc: string;
}
