import assert from "node:assert/strict";
import test from "node:test";
import { initializeFlashcardDatabase } from "../../src/data/initializeFlashcardDatabase.ts";

test("creates the flashcards table if it does not exist", async () => {
  const statements: string[] = [];
  const fakeDatabase = {
    execAsync: async (sql: string) => {
      statements.push(sql);
    },
  };

  await initializeFlashcardDatabase(fakeDatabase);

  assert.deepEqual(statements, [
    `CREATE TABLE IF NOT EXISTS flashcards (
      id TEXT PRIMARY KEY NOT NULL,
      question TEXT NOT NULL,
      answer TEXT NOT NULL
    );`,
  ]);
});