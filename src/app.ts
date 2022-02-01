import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import cors from 'cors';
import { PORT } from './config';
import taskRouter from './task/task.router';

const app = express();

app
  .use(morgan())
  .use(cors())
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: false }))
  .use('/tasks', taskRouter)
  .use((err, req, res, _next) => {
    console.log(err);
    const status = err.status || 500;
    const reason = err.msg || 'Something went wrong';
    const errors = err.errors;
    const name = err.name;
    res.status(status).json({ error: true, reason, errors, name });
  })
  .listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
