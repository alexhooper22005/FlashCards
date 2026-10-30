import type { Flashcard } from "../domain/Flashcard.ts";
import type { FlashcardRepository } from "../domain/FlashcardRepository.ts";

interface FlashcardDatabase {
  getAllAsync(sql: string): Promise<Flashcard[]>;
  runAsync(sql: string, ...values: string[]): Promise<unknown>;
}

export class SQLiteFlashcardRepository implements FlashcardRepository {
  private readonly database: FlashcardDatabase;

  constructor(database: FlashcardDatabase) {
    this.database = database;
  }

  async getAll(): Promise<Flashcard[]> {
  return this.database.getAllAsync(
    "SELECT id, question, answer FROM flashcards",
  );
}

async save(flashcard: Flashcard): Promise<void> {
  await this.database.runAsync(
    "INSERT OR REPLACE INTO flashcards (id, question, answer) VALUES (?, ?, ?)",
    flashcard.id,
    flashcard.question,
    flashcard.answer,
  );
}

async remove(id: string): Promise<void> {
  await this.database.runAsync(
    "DELETE FROM flashcards WHERE id = ?",
    id,
  );
}
}