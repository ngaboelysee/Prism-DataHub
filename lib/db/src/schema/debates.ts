import { pgTable, serial, text, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const debatesTable = pgTable("debates", {
  id: serial("id").primaryKey(),
  sideA: text("side_a").notNull(),
  sideB: text("side_b").notNull(),
  topic: text("topic"),
  winner: text("winner").notNull(),
  confidence: integer("confidence").notNull(),
  reasoning: text("reasoning").notNull(),
  sideAData: jsonb("side_a_data").notNull(),
  sideBData: jsonb("side_b_data").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertDebateSchema = createInsertSchema(debatesTable).omit({ id: true, createdAt: true });
export type InsertDebate = z.infer<typeof insertDebateSchema>;
export type Debate = typeof debatesTable.$inferSelect;
