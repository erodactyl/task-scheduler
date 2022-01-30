"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const objection_1 = require("objection");
const task_entity_1 = __importDefault(require("./task.entity"));
class TaskExecutionEntity extends objection_1.Model {
    static get jsonSchema() {
        return {
            type: "object",
            required: ["taskId", "executeOn"],
        };
    }
    static get tableName() {
        return "task_executions";
    }
}
exports.default = TaskExecutionEntity;
TaskExecutionEntity.relationMappings = () => ({
    task: {
        relation: objection_1.Model.BelongsToOneRelation,
        modelClass: task_entity_1.default,
        join: {
            from: `${TaskExecutionEntity.tableName}.taskId`,
            to: `${task_entity_1.default.tableName}.id`,
        },
    },
});
//# sourceMappingURL=taskExecution.entity.js.map