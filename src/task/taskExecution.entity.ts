import { Model } from "objection";
import TaskEntity from "./task.entity";

export default class TaskExecutionEntity extends Model {
  id!: number;
  taskId!: number;
  executeOn!: string;
  done!: boolean;

  task: TaskEntity;

  static get jsonSchema() {
    return {
      type: "object",
      required: ["taskId", "executeOn"],
    };
  }

  static get tableName() {
    return "task_executions";
  }

  static relationMappings = () => ({
    task: {
      relation: Model.BelongsToOneRelation,
      modelClass: TaskEntity,
      join: {
        from: `${TaskExecutionEntity.tableName}.taskId`,
        to: `${TaskEntity.tableName}.id`,
      },
    },
  });
}
