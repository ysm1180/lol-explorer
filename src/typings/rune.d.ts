export interface ICustomRune {
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
