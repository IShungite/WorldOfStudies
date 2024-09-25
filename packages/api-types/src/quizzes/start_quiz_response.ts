import { QuestionType } from "./question";

export type StartQuizResponse = {
  result: {
    quizInstanceId: string;
    questions: {
      isAnswered: boolean;
      question: QCMQuestionResponse | TextHoleQuestionResponse;
    }[];
  };
};

type BaseQuestion = {
  id: string;
  type: QuestionType;
  points: number;
  text: string;
};

export type QCMQuestionResponse = BaseQuestion & {
  type: QuestionType.QCM;
  choices: {
    id: string;
    label: string;
  }[];
};

export type TextHoleQuestionResponse = BaseQuestion & {
  type: QuestionType.TEXT_HOLE;
};
