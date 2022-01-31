import { Router } from "express";
import { body } from "express-validator";
import { NotFound } from "../utils/errors.js";
import { taskTypes } from "./task.service.js";
import validate from "../utils/validate";
import TaskService from "./epheremeralTask.service";

const taskRouter = Router();

taskRouter
  .get("/", async (req, res) => {
    res.status(200).json(await TaskService.getAllTasks());
  })
  .get("/:id", async (req, res) => {
    const task = await TaskService.getTaskById(Number(req.params.id));
    if (!task) {
      throw new NotFound(`Task with id ${req.params.id} was not found`);
    }
    res.status(200).json(task);
  })
  .post(
    "/",
    validate([
      body(
        "type",
        "Type should be one of IMMEDIATE or FUTURE or DAILY or WEEKLY"
      ).isIn(taskTypes),
      body("timestamp").isInt().optional().toInt(),
    ]),
    async (req, res) => {
      const type = req.body.type;
      const timestamp = req.body.timestamp;
      const task = await TaskService.addTask(
        type,
        timestamp ? new Date(timestamp) : null
      );
      res.status(201).json(task);
    }
  )
  .delete("/:id", async (req, res) => {
    const tasksRemoved = await TaskService.removeTask(Number(req.params.id));
    if (tasksRemoved === 0) {
      throw new NotFound(
        `No future executions for task ${req.params.id} exist`
      );
    }
    res.status(204).send();
  });

export default taskRouter;
