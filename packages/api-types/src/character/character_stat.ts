export type CharacterStat = {
  subjects: SubjectStat[];
  generalAverage: number;
};

export type SubjectStat = {
  name: string;
  average: number | null;
  quizzes: QuizStat[];
};

export type QuizStat = {
  name: string;
  date: string;
  score: number;
  maxScore: number;
};
