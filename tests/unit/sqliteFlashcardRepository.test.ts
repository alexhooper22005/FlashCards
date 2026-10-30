import assert from "node:assert/strict";
import test from "node:test";
import { SQLiteFlashcardRepository } from "../../src/data/SQLiteFlashcardRepository.ts";


test("loads flashcards from the database", async () => {
  const rows = [
    {
      id: "card-1",
      question: "What is photosynthesis?",
      answer: "How plants turn light into energy.",
    },
  ];

  const fakeDatabase = {
    getAllAsync: async () => rows,
    runAsync: async () => {},
  };

  const repository = new SQLiteFlashcardRepository(fakeDatabase);

  assert.deepEqual(await repository.getAll(), rows);
});

test("saves a flashcard to the database", async () => {
  const calls: string[][] = [];
  const fakeDatabase = {
    getAllAsync: async () => [],
    runAsync: async (...params: string[]) => {
      calls.push(params);
    },
  };
  const repository = new SQLiteFlashcardRepository(fakeDatabase);
  const card = {
    id: "card-1",
    question: "What is photosynthesis?",
    answer: "How plants turn light into energy.",
  };

  await repository.save(card);

  assert.deepEqual(calls, [
    [
      "INSERT OR REPLACE INTO flashcards (id, question, answer) VALUES (?, ?, ?)",
      "card-1",
      "What is photosynthesis?",
      "How plants turn light into energy.",
    ],
  ]);
});

test("removes a flashcard from the database by id", async () => {
  const calls: string[][] = [];
  const fakeDatabase = {
    getAllAsync: async () => [],
    runAsync: async (...params: string[]) => {
      calls.push(params);
    },
  };
  const repository = new SQLiteFlashcardRepository(fakeDatabase);

  await repository.remove("card-1");

  assert.deepEqual(calls, [
    ["DELETE FROM flashcards WHERE id = ?", "card-1"],
  ]);
});