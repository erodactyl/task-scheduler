export type ITASK_TYPE = 'IMMEDIATE' | 'FUTURE' | 'DAILY' | 'WEEKLY';

export interface ITaskView {
  id: number;
  nextExecutionDate?: Date;
}

export interface ITaskService {
  getTaskById(id: number): Promise<ITaskView | null>;
  getAllTasks(): Promise<ITaskView[]>;
  addTask(type: ITASK_TYPE, date?: Date): Promise<ITaskView>;
  removeTask(id: number): Promise<boolean>;
}
