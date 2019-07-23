export interface IStaticItem {
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

export interface IStaticChampion {
  id: string;
  key: number;
  name: string;
  title: string;
  skins: IChampionSkinsItem[];
  lore: string;
  blurb: string;
  allytips: string[];
  enemytips: string[];
  tags: string[];
  partype: string;
  info: IChampionInfo;
  stats: IChampionStats;
  spells: IChampionSpellsItem[];
  passive: IChampionPassive;
  iconUrl: string;
}

interface IChampionSkinsItem {
  id: string;
  num: number;
  name: string;
  chromas: boolean;
}

interface IChampionInfo {
  attack: number;
  defense: number;
  magic: number;
  difficulty: number;
}

interface IChampionStats {
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

interface IChampionSpellsItem {
  id: string;
  name: string;
  description: string;
  tooltip: string;
  leveltip: IChampionLeveltip;
  maxrank: number;
  cooldown: number[];
  cooldownBurn: string;
  cost: number[];
  costBurn: string;
  datavalues: {};
  vars: IChampionVarsItem[];
  costType: string;
  maxammo: string;
  range: number[];
  rangeBurn: string;
  resource: string;
  iconUrl: string;
}

interface IChampionLeveltip {
  label: string[];
  effect: string[];
}

interface IChampionVarsItem {
  link: string;
  coeff: number;
  key: string;
}

interface IChampionPassive {
  name: string;
  description: string;
  iconUrl: string;
}

export interface IStaticSpell {
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
  vars: ISpellVarsItem[];
  key: number;
  summonerLevel: number;
  costType: string;
  maxammo: string;
  range: number[];
  rangeBurn: string;
  resource: string;
  iconUrl: string;
}

interface ISpellVarsItem {
  link: string;
  coeff: number;
  key: string;
}
