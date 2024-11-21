// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { relations, sql } from "drizzle-orm";
import {
  boolean,
  integer,
  numeric,
  pgTableCreator,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `spotter_${name}`);

export const boulders = createTable("boulder", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  name: varchar("name", { length: 256 }).notNull(),
  url: varchar("url", { length: 1024 }).notNull(),
  grade: varchar("grade", {
    length: 256,
  }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
    () => new Date(),
  ),
});

export const bouldersRelations = relations(boulders, ({ many }) => ({
  ticks: many(ticks),
}));

export const ticks = createTable("tick", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  boulderId: integer("boulder_id").notNull(),
  userId: varchar("user_id", { length: 256 }).notNull(),
  rating: numeric("rating"),
  date: varchar("date", { length: 256 }).notNull(),
  ranking: integer("ranking"),
  flash: boolean("flash").default(false).notNull(),
  betaUrl: varchar("beta_url", { length: 1024 }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
    () => new Date(),
  ),
});

export const ticksRelations = relations(ticks, ({ one }) => ({
  boulder: one(boulders, {
    fields: [ticks.boulderId],
    references: [boulders.id],
  }),
}));
