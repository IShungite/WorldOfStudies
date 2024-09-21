export type CharacterStat = {
  subjects: SubjectStat[];
  generalAverage: number;
};

export type SubjectStat = {
  name: string;
  average: number;
  quizzes: QuizStat[];
};

export type QuizStat = {
  name: string;
  score: number;
  date: string;
};
