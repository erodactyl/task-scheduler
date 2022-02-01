import { addMilliseconds } from 'date-fns';
import {
  MILLISECONDS_IN_A_DAY,
  MILLISECONDS_IN_A_WEEK,
} from './task.service';
import {ITASK_TYPE} from './task.service.type';

interface FutureTask {
  id: number;
  timeout: ReturnType<typeof setTimeout>;
  type: 'FUTURE';
}

class EphemeralTaskService {
  tasks: Record<FutureTask['id'], FutureTask> = {};

  getAllTasks = () => {
    return this.tasks;
  };

  getTaskById = (id: number) => {
    return this.tasks[id];
  };

  removeTask = (id: number) => {
    const task = this.tasks[id];
    if (!task) return 0;
    clearTimeout(task.timeout);
    delete this.tasks[id];
    return 1;
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
      return { id };
    } else {
      const timeout = this.queueFutureTask(id, date, repeatAfter);
      const task: FutureTask = { id, type: 'FUTURE', timeout };
      this.tasks[task.id] = task;
      return { id: task.id };
    }
  };

  queueFutureTask = (id: number, date: Date, repeatAfter?: number) => {
    return setTimeout(() => {
      this.executeTask(id);
      // Used for recurring tasks
      if (repeatAfter) {
        this.tasks[id].timeout = this.queueFutureTask(
          id,
          addMilliseconds(new Date(), repeatAfter),
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
