import "dotenv/config";
import { Model } from "objection";
import Knex from "knex";
import knexfile from "../knexfile.js";

// Initialize knex.
const knex = Knex(knexfile.development);

// Give the knex instance to objection.
Model.knex(knex);

const PORT = process.env.PORT;

if (!PORT) {
  throw new Error("PORT env variable not found");
}

export { PORT };
