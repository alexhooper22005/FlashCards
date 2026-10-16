import assert from "node:assert/strict";
import test from "node:test";
import { InMemoryFlashcardRepository } from "../../src/data/InMemoryFlashcardRepository.ts";
import { FlashcardService } from "../../src/services/FlashcardService.ts";

test("adds a flashcard with trimmed question and answer text", async () => {
  const repository = new InMemoryFlashcardRepository();
  const service = new FlashcardService(repository, () => "card-1");

  const card = await service.add("  What is a noun?  ", "  A person, place, or thing.  ");

  assert.deepEqual(card, {
    id: "card-1",
    question: "What is a noun?",
    answer: "A person, place, or thing.",
  });
});

test("rejects a flashcard with a blank question", async () => {
  const service = new FlashcardService(
    new InMemoryFlashcardRepository(),
    () => "card-1",
  );

  await assert.rejects(service.add("   ", "An answer"), {
    name: "InvalidFlashcardError",
  });
});

test("rejects a flashcard with a blank answer", async () => {
  const service = new FlashcardService(
    new InMemoryFlashcardRepository(),
    () => "card-1",
  );

  await assert.rejects(service.add("A question", "   "), {
    name: "InvalidFlashcardError",
  });
});

test("lists saved flashcards", async () => {
  const repository = new InMemoryFlashcardRepository();
  const service = new FlashcardService(repository, () => "card-1");
  const card = await service.add("Question", "Answer");

  assert.deepEqual(await service.list(), [card]);
});

test("deletes a flashcard by id", async () => {
  const repository = new InMemoryFlashcardRepository();
  const service = new FlashcardService(repository, () => "card-1");
  const card = await service.add("Question", "Answer");

  await service.remove(card.id);

  assert.deepEqual(await service.list(), []);
});
