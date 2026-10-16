import type { Flashcard } from "./Flashcard.ts";

export interface FlashcardRepository {
  getAll(): Promise<Flashcard[]>;
  save(flashcard: Flashcard): Promise<void>;
  remove(id: string): Promise<void>;
}
