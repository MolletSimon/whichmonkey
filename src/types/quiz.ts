export type MonkeyType = 'chimpanzee' | 'bonobo' | 'gorilla' | 'orangutan' | 'gibbon' | 'capuchin' | 'macaque' | 'baboon' | 'tamarin' | 'mandrill';

export interface Question {
  id: number;
  text: string;
  category: string;
  scores: Record<MonkeyType, number>;
}

export interface MonkeyProfile {
  name: string;
  emoji: string;
  description: string;
  traits: string[];
}

export interface QuizData {
  questions: Question[];
  monkeyTypes: Record<MonkeyType, MonkeyProfile>;
}

export type AnswerValue = -2 | -1 | 0 | 1 | 2;

export interface Answer {
  questionId: number;
  value: AnswerValue;
}

export const ANSWER_OPTIONS: { value: AnswerValue; label: string }[] = [
  { value: -2, label: "Absolument pas d'accord" },
  { value: -1, label: "Pas d'accord" },
  { value: 0, label: "Neutre" },
  { value: 1, label: "D'accord" },
  { value: 2, label: "Absolument d'accord" },
];
