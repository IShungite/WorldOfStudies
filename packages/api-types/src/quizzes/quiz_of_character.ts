import { Quiz } from "./quiz";

export type QuizOfCharacter = Quiz & {
  last_quiz_instance_status: string;
};
