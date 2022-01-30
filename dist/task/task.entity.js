"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const objection_1 = require("objection");
const taskExecution_entity_1 = __importDefault(require("./taskExecution.entity"));
class TaskEntity extends objection_1.Model {
    static get jsonSchema() {
        return {
            type: "object",
            required: ["repeatAfter"],
        };
    }
    static get tableName() {
        return "tasks";
    }
}
exports.default = TaskEntity;
TaskEntity.relationMappings = () => ({
    executions: {
        relation: objection_1.Model.HasManyRelation,
        modelClass: taskExecution_entity_1.default,
        join: {
            from: `${TaskEntity.tableName}.id`,
            to: `${taskExecution_entity_1.default.tableName}.taskId`,
        },
    },
});
//# sourceMappingURL=task.entity.js.map