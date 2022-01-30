"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PORT = void 0;
require("dotenv/config");
const objection_1 = require("objection");
const knex_1 = __importDefault(require("knex"));
const knexfile_js_1 = __importDefault(require("../knexfile.js"));
// Initialize knex.
const knex = (0, knex_1.default)(knexfile_js_1.default.development);
// Give the knex instance to objection.
objection_1.Model.knex(knex);
const PORT = process.env.PORT;
exports.PORT = PORT;
if (!PORT) {
    throw new Error("PORT env variable not found");
}
//# sourceMappingURL=config.js.map