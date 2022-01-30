/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("task_executions", (table) => {
    table.increments("id").primary();
    table.integer("taskId").references("id").inTable("tasks").notNullable();
    table.dateTime("executeOn").notNullable();
    table.boolean("done").defaultTo(false);

    table.timestamp("createdAt").defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("task_executions");
};
