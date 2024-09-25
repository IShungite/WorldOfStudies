import { QuestionType } from "./question";
import { BaseQuestion } from "./question-base";

export type QuestionQcm = BaseQuestion & {
  type: QuestionType.QCM;
  text: string;
  choices: {
    id: string;
    label: string;
  }[];
};
