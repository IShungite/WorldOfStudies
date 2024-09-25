import { Question } from "./question";
import { QuizType } from "./quiz-type";

export type Quiz = {
  id: string;
  name: string;
  questions: Question[];
  type: QuizType;
  startAt: string | null;
  endAt: string | null;
};
