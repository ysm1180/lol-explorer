declare module 'models' {
  export type RiotStaticChampionClientData = {
    id: string;
    key: number;
    name: string;
    iconUrl: string;
    skins: {
      id: string;
      num: number;
      name: string;
      chromas: boolean;
    }[];
    lore: string;
    blurb: string;
    allytips: string[];
    enemytips: string[];
    tags: string[];
    parttype: string;
    info: {
      attack: number;
      defense: number;
      magic: number;
      difficulty: number;
    };
    stats: {
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
      attacksppedperlevel: number;
      attackspeed: number;
    };
    spells: {
      id: string;
      name: string;
      description: string;
      tooltip: string;
      leveltip: {
        label: string[];
        effect: string[];
      };
      maxrank: number;
      cooldown: number[];
      cooldownBurn: string;
      cost: number[];
      iconUrl: string;
    }[];
    passive: {
      name: string;
      description: string;
      iconUrl: string;
    };
  };

  export type RiotStaticSpellClientData = {
    id: string;
    name: string;
    description: string;
    tooltip: string;
    maxrank: number;
    cooldown: number[];
    cooldownBurn: string;
    cost: number[];
    costBurn: string;
    datavalues: any;
    vars: any[];
    key: number;
    summonerLevel: number;
    costType: string;
    maxammo: string;
    range: number[];
    rangeBurn: string;
    resource: string;
    iconUrl: string;
  };

  export type RiotStaticItemClientData = {
    key: number;
    name: string;
    description: string;
    colloq: string;
    plaintext: string;
    from?: string[];
    into?: string[];
    gold: {
      base: number;
      purchasable: boolean;
      total: number;
      sell: number;
    };
    iconUrl: string;
  };

  export type RiotStaticRuneClientData = {
    id: number;
    key: string;
    icon: string;
    name: string;
    shortDesc: string;
    longDesc: string;
  };

  export type RiotStaticPerkClientData = {
    id: number;
    key: string;
    icon: string;
    name: string;
    slots: {
      runes: RiotStaticRuneClientData[];
    }[];
    baseIconUrl: string;
  };
}
