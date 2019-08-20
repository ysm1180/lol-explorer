export interface CustomRuneData {
  primary: {
    id: string;
    slots: string[];
  };
  secondary: {
    id: string;
    slots: {
      slot: string;
      line: number;
    }[];
  };
  stat: string[];
}
