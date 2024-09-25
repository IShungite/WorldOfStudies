import { QuestionType } from "./question";

type CreateUserAnswerDtoBase = {
  characterId: string;
  quizInstanceId: string;
  questionId: string;
  type: QuestionType;
};

export type CreateUserAnswerDtoQcm = CreateUserAnswerDtoBase & UserAnswerDtoQcm;

export type UserAnswerDtoQcm = {
  type: QuestionType.QCM;
  choiceId: string;
};

export type CreateUserAnswerDtoTextHole = CreateUserAnswerDtoBase & UserAnswerDtoTextHole;

export type UserAnswerDtoTextHole = {
  type: QuestionType.TEXT_HOLE;
  values: string[];
};

export type UserAnswerDto = UserAnswerDtoQcm | UserAnswerDtoTextHole;

export type CreateUserAnswerDto = CreateUserAnswerDtoQcm | CreateUserAnswerDtoTextHole;
