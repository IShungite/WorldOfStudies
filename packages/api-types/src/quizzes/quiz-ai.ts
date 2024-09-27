import { QuestionType } from "./question";
import { QuizType } from "./quiz-type";

export type QuizAi = {
  name: string;
  id: string;
  type: QuizType.PRACTICE;
  startAt: string | null;
  endAt: string | null;
  questions: {
    id: string;
    points: number;
    text: string;
    type: QuestionType.QCM | QuestionType.TEXT_HOLE;
    choices?: {
      id: string;
      isCorrect: boolean;
      label: string;
    }[];
    answers?: string[];
  }[];
};

export type QuizFromGpt = {
  name: string;
  id: string;
  type: QuizType.PRACTICE;
  startAt: string | null;
  endAt: string | null;
  questions: (QuestionQcm | QuestionTextHole)[];
};

type QuestionQcm = {
  points: number;
  question: string;
  type: QuestionType.QCM;
  choices: {
    id: string;
    isCorrect: boolean;
    label: string;
  }[];
};

type QuestionTextHole = {
  points: number;
  text: string;
  type: QuestionType.TEXT_HOLE;
  answers: string[];
};
