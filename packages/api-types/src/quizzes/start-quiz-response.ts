export type StartQuizResponse = {
  result: {
    id: string; // This is the quizInstanceId we want to capture
    quizId: string;
    characterId: string;
  };
};
