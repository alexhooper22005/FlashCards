import type { Flashcard } from "../domain/Flashcard.ts";
import type { FlashcardRepository } from "../domain/FlashcardRepository.ts";

export class InMemoryFlashcardRepository implements FlashcardRepository {
  private readonly flashcards = new Map<string, Flashcard>();

  async getAll(): Promise<Flashcard[]> {
    return Array.from(this.flashcards.values(), (flashcard) => ({ ...flashcard }));
  }

  async save(flashcard: Flashcard): Promise<void> {
    this.flashcards.set(flashcard.id, { ...flashcard });
  }

  async remove(id: string): Promise<void> {
    this.flashcards.delete(id);
  }
}
