import { QuestionQcm } from "./qcm-question";
import { QuestionTextHole } from "./text-hole-question";

export type Question = QuestionQcm | QuestionTextHole;

export enum QuestionType {
  QCM = "qcm",
  TEXT_HOLE = "text-hole",
}
