"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const errors_js_1 = require("../utils/errors.js");
const task_service_js_1 = __importStar(require("./task.service.js"));
const validate_1 = __importDefault(require("../utils/validate"));
const taskRouter = (0, express_1.Router)();
taskRouter
    .get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(200).json(yield task_service_js_1.default.getAllTasks());
}))
    .get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const task = yield task_service_js_1.default.getTaskById(Number(req.params.id));
    if (!task) {
        throw new errors_js_1.NotFound(`Task with id ${req.params.id} was not found`);
    }
    res.status(200).json(task);
}))
    .post("/", (0, validate_1.default)([
    (0, express_validator_1.body)("type", "Type should be one of IMMEDIATE or FUTURE or DAILY or WEEKLY").isIn(task_service_js_1.taskTypes),
    (0, express_validator_1.body)("timestamp").isInt().optional().toInt(),
]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const type = req.body.type;
    const timestamp = req.body.timestamp;
    const task = yield task_service_js_1.default.addTask(type, timestamp ? new Date(timestamp) : null);
    res.status(201).json(task);
}))
    .delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tasksRemoved = yield task_service_js_1.default.removeTask(Number(req.params.id));
    if (tasksRemoved === 0) {
        throw new errors_js_1.NotFound(`No future executions for task ${req.params.id} exist`);
    }
    res.status(204).send();
}));
exports.default = taskRouter;
//# sourceMappingURL=task.router.js.map