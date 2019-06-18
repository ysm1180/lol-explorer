declare module 'models' {
    export type ILCUData = {
        address: string;
        port: number;
        username: string;
        password: string;
        protocol: string;
    };

    export type LcuSummonerData = {
        accountId: number;
        displayName: string;
        internalName: string;
        percentCompleteForNextLevel: number;
        profileIconId: number;
        puuid: string;
        rerollPoints: {
            currentPoints: number;
            maxRolls: number;
            numberOfRolls: number;
            pointsCostToRoll: number;
            pointsToReroll: number;
        };
        summonerId: number;
        summonerLevel: number;
        xpSinceLastLevel: number;
        xpUntilNextLevel: number;
    };
}
