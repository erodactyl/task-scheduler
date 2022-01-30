"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const morgan_1 = __importDefault(require("morgan"));
const config_1 = require("./config");
const task_router_1 = __importDefault(require("./task/task.router"));
const app = (0, express_1.default)();
app
    .use((0, morgan_1.default)())
    .use(body_parser_1.default.json())
    .use(body_parser_1.default.urlencoded({ extended: false }))
    .use("/tasks", task_router_1.default)
    .use((err, req, res, _next) => {
    console.log(err);
    const status = err.status || 500;
    const reason = err.msg || "Something went wrong";
    const errors = err.errors;
    const name = err.name;
    res.status(status).json({ error: true, reason, errors, name });
})
    .listen(config_1.PORT, () => {
    console.log(`Listening on port ${config_1.PORT}`);
});
//# sourceMappingURL=app.js.map