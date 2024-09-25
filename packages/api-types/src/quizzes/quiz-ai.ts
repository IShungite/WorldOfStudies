import { QuestionType } from "./question";
import { QuizType } from "./quiz-type";

export type QuizFromGPT = {
  name: string;
  id: string;
  type: QuizType.PRACTICE;
  startAt: string | null;
  endAt: string | null;
  questions: (QuestionQCM | QuestionTextHole)[];
};

export type QuizAi = {
  name: string;
  id: string;
  type: QuizType.PRACTICE;
  startAt: string | null;
  endAt: string | null;
  questions: {
    isAnswered: boolean;
    question: QuestionQCM | QuestionTextHole;
  }[];
};

type QuestionBase = {
  id: string;
  points: number;
  text: string;
};

type QuestionQCM = QuestionBase & {
  type: QuestionType.QCM;
  choices: {
    id: string;
    isCorrect: boolean;
    label: string;
  }[];
};

type QuestionTextHole = QuestionBase & {
  type: QuestionType.TEXT_HOLE;
  answers: string[];
};
