import { addMilliseconds } from 'date-fns';
import {
  MILLISECONDS_IN_A_DAY,
  MILLISECONDS_IN_A_WEEK,
} from './task.service';
import { ITASK_TYPE, ITaskService } from './task.service.type';

interface FutureTask {
  id: number;
  nextExecutionDate: Date;
  timeout: ReturnType<typeof setTimeout>;
  type: 'FUTURE';
}

class EphemeralTaskService implements ITaskService {
  tasks: Record<FutureTask['id'], FutureTask> = {};

  serializeTask = (task: FutureTask) => {
    return { id: task.id, nextExecutionDate: task.nextExecutionDate };
  };

  getAllTasks = () => {
    return Promise.resolve(
      Object.values(this.tasks).map(this.serializeTask)
    );
  };

  getTaskById = (id: number) => {
    const task = this.tasks[id];
    if (!task) return Promise.resolve(null);
    return Promise.resolve(this.serializeTask(this.tasks[id]));
  };

  removeTask = (id: number) => {
    const task = this.tasks[id];
    if (!task) return Promise.resolve(false);
    clearTimeout(task.timeout);
    delete this.tasks[id];
    return Promise.resolve(true);
  };

  addTask = (type: ITASK_TYPE, date?: Date) => {
    const id = Math.floor(Math.random() * 1000000);
    const repeatAfter =
      type === 'DAILY'
        ? MILLISECONDS_IN_A_DAY
        : type === 'WEEKLY'
          ? MILLISECONDS_IN_A_WEEK
          : null;
    if (type === 'IMMEDIATE') {
      this.executeTask(id);
      return Promise.resolve({ id });
    } else {
      const timeout = this.queueFutureTask(id, date, repeatAfter);
      const task: FutureTask = { id, type: 'FUTURE', timeout, nextExecutionDate: date };
      this.tasks[task.id] = task;
      return Promise.resolve({ id: task.id, nextExecutionDate: task.nextExecutionDate });
    }
  };

  queueFutureTask = (id: number, date: Date, repeatAfter?: number) => {
    return setTimeout(() => {
      this.executeTask(id);
      // Used for recurring tasks
      if (repeatAfter) {
        const date = addMilliseconds(new Date(), repeatAfter);
        this.tasks[id].nextExecutionDate = date;
        this.tasks[id].timeout = this.queueFutureTask(
          id,
          date,
          repeatAfter
        );
      } else {
        delete this.tasks[id];
      }
    }, this.milisecondsUntilDate(date));
  };

  executeTask = (id: number) => {
    console.log(`Task with id #${id} executed`);
  };

  milisecondsUntilDate = (date: Date) => {
    const until = date.valueOf() - Date.now();
    return Math.max(until, 0);
  };
}

export default new EphemeralTaskService();
