interface FlashcardDatabaseSetup {
  execAsync(sql: string): Promise<void>;
}

export async function initializeFlashcardDatabase(
  database: FlashcardDatabaseSetup,
): Promise<void> {
  await database.execAsync(`CREATE TABLE IF NOT EXISTS flashcards (
      id TEXT PRIMARY KEY NOT NULL,
      question TEXT NOT NULL,
      answer TEXT NOT NULL
    );`);
}