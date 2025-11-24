export interface LessonParams {
  subject: string;
  topic: string;
  grade: string;
  integration?: string;
  author?: string;
  school?: string;
  duration?: string;
}

export const LoadingState = {
  IDLE: 'IDLE',
  LOADING: 'LOADING',
  SUCCESS: 'SUCCESS',
  ERROR: 'ERROR'
} as const;

export type LoadingState = typeof LoadingState[keyof typeof LoadingState];

export interface GeneratedContent {
  rawText: string;
}