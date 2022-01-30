"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const errors_1 = require("./errors");
const _validate = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        throw new errors_1.UnprocessableEntity("Validation went wrong", errors.array());
    }
    else {
        return next();
    }
};
const validate = (validators) => {
    return [...validators, _validate];
};
exports.default = validate;
//# sourceMappingURL=validate.js.map