import { QuestionType } from "./question";
import { BaseQuestion } from "./question-base";

export type QuestionTextHole = BaseQuestion & {
  type: typeof QuestionType.TEXT_HOLE;
  text: string;
  answers: string[];
};
