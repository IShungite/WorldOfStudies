import { QuestionType } from "./question";

type CreateUserAnswerDtoBase = {
  characterId: string;
  quizInstanceId: string;
  questionId: string;
  type: QuestionType;
};

export type CreateUserAnswerDtoQcm = CreateUserAnswerDtoBase & {
  type: QuestionType.QCM;
  choiceId: string;
};

export type CreateUserAnswerDtoTextHole = CreateUserAnswerDtoBase & {
  type: QuestionType.TEXT_HOLE;
  values: string[];
};

export type CreateUserAnswerDto = CreateUserAnswerDtoQcm | CreateUserAnswerDtoTextHole;
