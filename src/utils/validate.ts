import { validationResult } from "express-validator";
import { UnprocessableEntity } from "./errors";

const _validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new UnprocessableEntity("Validation went wrong", errors.array());
  } else {
    return next();
  }
};

const validate = (validators) => {
  return [...validators, _validate];
};

export default validate;
