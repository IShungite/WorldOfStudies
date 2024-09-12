import { QuestionType } from "./question";

export type BaseQuestion = {
  id: string;
  type: QuestionType;
  points: number;
};
