import { QuestionType } from "./question";
import { BaseQuestion } from "./question-base";

export type QuestionTextHole = BaseQuestion & {
  type: QuestionType.TEXT_HOLE;
  text: string;
};
