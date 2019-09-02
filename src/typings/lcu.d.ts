interface LcuGameSessionData {
  gameData: GameData;
  phase: string;
}

interface GameData {
  gameId: number;
  queue: Queue;
}

interface Queue {
  id: number;
}
