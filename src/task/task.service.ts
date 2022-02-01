import { addMilliseconds, parseISO, isBefore } from 'date-fns';
import TaskEntity from './task.entity';
import TaskExecutionEntity from './taskExecution.entity';
import { ITaskService, ITASK_TYPE, ITaskView } from './task.service.type';

export const taskTypes: ITASK_TYPE[] = [
  'IMMEDIATE',
  'FUTURE',
  'DAILY',
  'WEEKLY',
];

export const MILLISECONDS_IN_A_DAY = 1000 * 60 * 60 * 24;
export const MILLISECONDS_IN_A_WEEK = MILLISECONDS_IN_A_DAY * 7;

class TaskService implements ITaskService {
  constructor() {
    this.initializePolling();
  }

  initializePolling = () => {
    setInterval(this.executeDueTasks, 1000);
  };

  executeDueTasks = async () => {
    const executionsDue = await TaskExecutionEntity.query()
      .where('executeOn', '<', new Date().toISOString())
      .andWhere('done', false)
      .withGraphFetched('task')
      .execute();

    executionsDue.forEach(async (e) => {
      this.executeTask(e.task);
      if (e.task.repeatAfter !== null) {
        this.addRecurringTask(e);
      }
    });

    this.cleanupExecutions(executionsDue.map((e) => e.id));
  };

  getNextExecution = (id: TaskEntity['id']) => {
    return TaskExecutionEntity.query().findOne('taskId', id).where('done', false).execute();
  };

  getAllTasks = async () => {
    const tasks = await TaskEntity
      .query()
      .withGraphJoined('executions')
      .where('executions.done', false)
      .execute();
    const serializedTasks: ITaskView[] = tasks.map(t =>
      ({ id: t.id, nextExecutionDate: new Date(t.executions[0].executeOn) }));
    return serializedTasks;
  };

  getTaskById = async (id: number) => {
    const task = await TaskEntity.query().findById(id).execute();
    if (!task) return null;
    const nextExecution = await this.getNextExecution(task.id);
    return { id: task.id, nextExecutionDate: new Date(nextExecution.executeOn) };
  };

  addRecurringTask = (execution: TaskExecutionEntity) => {
    let nextExecution = addMilliseconds(
      parseISO(new Date(execution.executeOn).toISOString()),
      execution.task.repeatAfter
    );
    while (isBefore(nextExecution, new Date())) {
      nextExecution = addMilliseconds(
        nextExecution,
        execution.task.repeatAfter
      );
    }
    this.addTaskExecution(execution.taskId, nextExecution);
  };

  addTaskExecution = (taskId: TaskEntity['id'], executeOn: Date) => {
    TaskExecutionEntity.query()
      .insert({ taskId, executeOn: executeOn.toISOString() })
      .execute();
  };

  addTask = async (type: ITASK_TYPE, date?: Date) => {
    const repeatAfter =
      type === 'DAILY'
        ? MILLISECONDS_IN_A_DAY
        : type === 'WEEKLY'
          ? MILLISECONDS_IN_A_WEEK
          : null;
    const executeOn = date ? date.toISOString() : new Date().toISOString();
    const task = await TaskEntity.query().insertGraph({
      repeatAfter,
      executions: [
        {
          executeOn,
        },
      ],
    });
    return { id: task.id, nextExecutionDate: new Date(executeOn) };
  };

  executeTask = (task: TaskEntity) => {
    console.log(`Task with id #${task.id} executed`);
  };

  cleanupExecutions = (ids: TaskExecutionEntity['id'][]) => {
    TaskExecutionEntity.query()
      .whereIn('id', ids)
      .patch({ done: true })
      .execute();
  };

  removeTask = (id: number) => {
    return TaskExecutionEntity
      .query()
      .delete()
      .where('done', false)
      .andWhere('taskId', id)
      .execute()
      .then(n => n === 0 ? false : true);
  };
}

export default new TaskService();
