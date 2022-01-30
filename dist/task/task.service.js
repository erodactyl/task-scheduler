"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskTypes = void 0;
const date_fns_1 = require("date-fns");
const task_entity_1 = __importDefault(require("./task.entity"));
const taskExecution_entity_1 = __importDefault(require("./taskExecution.entity"));
exports.taskTypes = [
    "IMMEDIATE",
    "FUTURE",
    "DAILY",
    "WEEKLY",
];
const MILLISECONDS_IN_A_DAY = 1000 * 60 * 60 * 24;
const MILLISECONDS_IN_A_WEEK = MILLISECONDS_IN_A_DAY * 7;
class TaskService {
    constructor() {
        this.initializePolling = () => {
            setInterval(this.executeDueTasks, 1000);
        };
        this.executeDueTasks = () => __awaiter(this, void 0, void 0, function* () {
            const executionsDue = yield taskExecution_entity_1.default.query()
                .where("executeOn", "<", new Date().toISOString())
                .andWhere("done", false)
                .withGraphFetched("task")
                .execute();
            executionsDue.forEach((e) => __awaiter(this, void 0, void 0, function* () {
                this.executeTask(e.task);
                if (e.task.repeatAfter !== null) {
                    this.addRecurringTask(e);
                }
            }));
            this.cleanupExecutions(executionsDue.map((e) => e.id));
        });
        this.getAllTasks = () => {
            return task_entity_1.default.query().execute();
        };
        this.getTaskById = (id) => {
            return task_entity_1.default.query().findById(id).execute();
        };
        this.addRecurringTask = (execution) => {
            let nextExecution = (0, date_fns_1.addMilliseconds)((0, date_fns_1.parseISO)(new Date(execution.executeOn).toISOString()), execution.task.repeatAfter);
            while ((0, date_fns_1.isBefore)(nextExecution, new Date())) {
                nextExecution = (0, date_fns_1.addMilliseconds)(nextExecution, execution.task.repeatAfter);
            }
            this.addTaskExecution(execution.taskId, nextExecution);
        };
        this.addTaskExecution = (taskId, executeOn) => {
            taskExecution_entity_1.default.query()
                .insert({ taskId, executeOn: executeOn.toISOString() })
                .execute();
        };
        this.addTask = (type, date) => {
            const repeatAfter = type === "DAILY"
                ? MILLISECONDS_IN_A_DAY
                : type === "WEEKLY"
                    ? MILLISECONDS_IN_A_WEEK
                    : null;
            const executeOn = date ? date.toISOString() : new Date().toISOString();
            return task_entity_1.default.query().insertGraph({
                repeatAfter,
                executions: [
                    {
                        executeOn,
                    },
                ],
            });
        };
        this.executeTask = (task) => {
            console.log(`Task with id #${task.id} executed`);
        };
        this.cleanupExecutions = (ids) => {
            taskExecution_entity_1.default.query()
                .whereIn("id", ids)
                .patch({ done: true })
                .execute();
        };
        this.removeTask = (id) => {
            return taskExecution_entity_1.default.query().delete().where("done", false).execute();
        };
        this.initializePolling();
    }
}
exports.default = new TaskService();
//# sourceMappingURL=task.service.js.map