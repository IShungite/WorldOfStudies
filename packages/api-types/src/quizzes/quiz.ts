import { Question } from "./question";
import { QuizType } from "./quiz-type";

export enum QuizType {
  EXAM = "exam",
  PRACTICE = "practice",
}

export type Quiz = {
  id: string;
  name: string;
  questions: Question[];
  type: QuizType;
  startAt: string | null;
  endAt: string | null;
};
