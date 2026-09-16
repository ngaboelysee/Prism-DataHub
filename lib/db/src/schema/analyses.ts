import { pgTable, serial, text, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const analysesTable = pgTable("analyses", {
  id: serial("id").primaryKey(),
  question: text("question").notNull(),
  contrarian: text("contrarian").notNull(),
  expansionist: text("expansionist").notNull(),
  executionist: text("executionist").notNull(),
  analyst: text("analyst").notNull(),
  verdict: text("verdict").notNull(),
  confidence: integer("confidence").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertAnalysisSchema = createInsertSchema(analysesTable).omit({ id: true, createdAt: true });
export type InsertAnalysis = z.infer<typeof insertAnalysisSchema>;
export type Analysis = typeof analysesTable.$inferSelect;
