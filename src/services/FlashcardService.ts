import type { Flashcard } from "../domain/Flashcard.ts";
import type { FlashcardRepository } from "../domain/FlashcardRepository.ts";

export class InvalidFlashcardError extends Error {
  constructor() {
    super("A flashcard needs both a question and an answer.");
    this.name = "InvalidFlashcardError";
  }
}

export class FlashcardService {
  private readonly repository: FlashcardRepository;
  private readonly createId: () => string;

  constructor(
    repository: FlashcardRepository,
    createId: () => string = () =>
      `card-${Date.now()}-${Math.random().toString(36).slice(2)}`,
  ) {
    this.repository = repository;
    this.createId = createId;
  }

  list(): Promise<Flashcard[]> {
    return this.repository.getAll();
  }

  async add(question: string, answer: string): Promise<Flashcard> {
    const trimmedQuestion = question.trim();
    const trimmedAnswer = answer.trim();

    if (!trimmedQuestion || !trimmedAnswer) {
      throw new InvalidFlashcardError();
    }

    const flashcard: Flashcard = {
      id: this.createId(),
      question: trimmedQuestion,
      answer: trimmedAnswer,
    };

    await this.repository.save(flashcard);
    return flashcard;
  }

  remove(id: string): Promise<void> {
    return this.repository.remove(id);
  }
}
