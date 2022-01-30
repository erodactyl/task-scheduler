import { Model } from "objection";
import TaskExecutionEntity from "./taskExecution.entity";

export default class TaskEntity extends Model {
  id!: number;
  repeatAfter!: number;

  executions: TaskExecutionEntity[];

  static get jsonSchema() {
    return {
      type: "object",
      required: ["repeatAfter"],
    };
  }

  static get tableName() {
    return "tasks";
  }

  static relationMappings = () => ({
    executions: {
      relation: Model.HasManyRelation,
      modelClass: TaskExecutionEntity,
      join: {
        from: `${TaskEntity.tableName}.id`,
        to: `${TaskExecutionEntity.tableName}.taskId`,
      },
    },
  });
}
