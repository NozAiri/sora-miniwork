export type Mode = "home" | "breath" | "cbt" | "review";

export type Emotion = {
  key: string;
  emoji: string;
  label: string;
};

export type TriggerTag =
  | "出来事"
  | "友だち"
  | "家族"
  | "部活"
  | "クラス"
  | "勉強"
  | "体調"
  | "SNS"
  | "その他";
