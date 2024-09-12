import { QuestionType } from "./question";
import { BaseQuestion } from "./question-base";

export type QuestionQcm = BaseQuestion & {
  type: typeof QuestionType.QCM;
  choices: {
    id: string;
    label: string;
    isCorrect: boolean;
  }[];
};
