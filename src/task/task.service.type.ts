export type ITASK_TYPE = 'IMMEDIATE' | 'FUTURE' | 'DAILY' | 'WEEKLY';

export const taskTypes: ITASK_TYPE[] = [
  'IMMEDIATE',
  'FUTURE',
  'DAILY',
  'WEEKLY',
];

export interface ITaskView {
  id: number;
  type: ITASK_TYPE;
  nextExecutionDate?: Date;
}

export interface ITaskService {
  getTaskById(id: number): Promise<ITaskView | null>;
  getAllTasks(): Promise<ITaskView[]>;
  addTask(type: ITASK_TYPE, date?: Date): Promise<ITaskView>;
  removeTask(id: number): Promise<boolean>;
}

export const MILLISECONDS_IN_A_DAY = 1000 * 60 * 60 * 24;
export const MILLISECONDS_IN_A_WEEK = MILLISECONDS_IN_A_DAY * 7;
