import { addMilliseconds, parseISO, isBefore } from "date-fns";
import TaskEntity from "./task.entity";
import TaskExecutionEntity from "./taskExecution.entity";

type TASK_TYPE = "IMMEDIATE" | "FUTURE" | "DAILY" | "WEEKLY";

export const taskTypes: TASK_TYPE[] = [
  "IMMEDIATE",
  "FUTURE",
  "DAILY",
  "WEEKLY",
];

const MILLISECONDS_IN_A_DAY = 1000 * 60 * 60 * 24;
const MILLISECONDS_IN_A_WEEK = MILLISECONDS_IN_A_DAY * 7;

class TaskService {
  constructor() {
    this.initializePolling();
  }

  initializePolling = () => {
    setInterval(this.executeDueTasks, 1000);
  };

  executeDueTasks = async () => {
    const executionsDue = await TaskExecutionEntity.query()
      .where("executeOn", "<", new Date().toISOString())
      .andWhere("done", false)
      .withGraphFetched("task")
      .execute();

    executionsDue.forEach(async (e) => {
      this.executeTask(e.task);
      if (e.task.repeatAfter !== null) {
        this.addRecurringTask(e);
      }
    });

    this.cleanupExecutions(executionsDue.map((e) => e.id));
  };

  getAllTasks = () => {
    return TaskEntity.query().execute();
  };

  getTaskById = (id: number) => {
    return TaskEntity.query().findById(id).execute();
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

  addTaskExecution = (taskId: TaskEntity["id"], executeOn: Date) => {
    TaskExecutionEntity.query()
      .insert({ taskId, executeOn: executeOn.toISOString() })
      .execute();
  };

  addTask = (type: TASK_TYPE, date?: Date) => {
    const repeatAfter =
      type === "DAILY"
        ? MILLISECONDS_IN_A_DAY
        : type === "WEEKLY"
        ? MILLISECONDS_IN_A_WEEK
        : null;
    const executeOn = date ? date.toISOString() : new Date().toISOString();
    return TaskEntity.query().insertGraph({
      repeatAfter,
      executions: [
        {
          executeOn,
        },
      ],
    });
  };

  executeTask = (task: TaskEntity) => {
    console.log(`Task with id #${task.id} executed`);
  };

  cleanupExecutions = (ids: TaskExecutionEntity["id"][]) => {
    TaskExecutionEntity.query()
      .whereIn("id", ids)
      .patch({ done: true })
      .execute();
  };

  removeTask = (id: number) => {
    return TaskExecutionEntity.query().delete().where("done", false).execute();
  };
}

export default new TaskService();
