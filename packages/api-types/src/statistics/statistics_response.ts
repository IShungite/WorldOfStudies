type QuizStat = {
  name: string;
  score: number;
  date: string;
};

type SubjectStat = {
  name: string;
  quizzes: QuizStat[];
  average: number;
};

export type StatsResponse = {
  result: {
    subjects: SubjectStat[];
    generalAverage: number;
  };
};
