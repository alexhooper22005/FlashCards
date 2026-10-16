import { useEffect, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import type { Flashcard } from "../domain/Flashcard.ts";
import type { FlashcardService } from "../services/FlashcardService.ts";

interface FlashcardsScreenProps {
  service: FlashcardService;
}

function errorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

export function FlashcardsScreen({ service }: FlashcardsScreenProps) {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [visibleAnswers, setVisibleAnswers] = useState<Record<string, boolean>>(
    {},
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    service
      .list()
      .then((cards) => {
        if (isMounted) {
          setFlashcards(cards);
        }
      })
      .catch((loadError: unknown) => {
        if (isMounted) {
          setError(errorMessage(loadError, "Could not load flashcards."));
        }
      });

    return () => {
      isMounted = false;
    };
  }, [service]);

  async function addFlashcard() {
    try {
      const flashcard = await service.add(question, answer);
      setFlashcards((current) => [...current, flashcard]);
      setQuestion("");
      setAnswer("");
      setError(null);
    } catch (addError: unknown) {
      setError(errorMessage(addError, "Could not add flashcard."));
    }
  }

  async function deleteFlashcard(id: string) {
    try {
      await service.remove(id);
      setFlashcards((current) => current.filter((card) => card.id !== id));
      setError(null);
    } catch (deleteError: unknown) {
      setError(errorMessage(deleteError, "Could not delete flashcard."));
    }
  }

  const canAdd = question.trim().length > 0 && answer.trim().length > 0;

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>StudyFlash</Text>
      <Text style={styles.subtitle}>Create a card, then tap it to study.</Text>

      <View style={styles.form}>
        <TextInput
          accessibilityLabel="Question"
          onChangeText={setQuestion}
          placeholder="Question"
          style={styles.input}
          value={question}
        />
        <TextInput
          accessibilityLabel="Answer"
          onChangeText={setAnswer}
          placeholder="Answer"
          style={styles.input}
          value={answer}
        />
        <Pressable
          accessibilityRole="button"
          disabled={!canAdd}
          onPress={addFlashcard}
          style={[styles.addButton, !canAdd && styles.disabledButton]}
        >
          <Text style={styles.addButtonText}>Add flashcard</Text>
        </Pressable>
      </View>

      {error !== null && (
        <Text accessibilityRole="alert" style={styles.error}>
          {error}
        </Text>
      )}

      <ScrollView contentContainerStyle={styles.list}>
        {flashcards.length === 0 ? (
          <Text style={styles.emptyState}>
            No flashcards yet. Add one to get started.
          </Text>
        ) : (
          flashcards.map((flashcard) => {
            const showingAnswer = visibleAnswers[flashcard.id] ?? false;

            return (
              <View key={flashcard.id} style={styles.card}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={
                    showingAnswer ? "Show question" : "Show answer"
                  }
                  onPress={() =>
                    setVisibleAnswers((current) => ({
                      ...current,
                      [flashcard.id]: !showingAnswer,
                    }))
                  }
                  style={styles.cardFace}
                >
                  <Text style={styles.cardText}>
                    {showingAnswer ? flashcard.answer : flashcard.question}
                  </Text>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Delete flashcard"
                  onPress={() => deleteFlashcard(flashcard.id)}
                  style={styles.deleteButton}
                >
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </Pressable>
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 28,
    backgroundColor: "#f5f7fb",
  },
  title: {
    color: "#172554",
    fontSize: 32,
    fontWeight: "700",
  },
  subtitle: {
    color: "#526079",
    fontSize: 16,
    marginTop: 6,
    marginBottom: 24,
  },
  form: {
    gap: 12,
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#ffffff",
    borderColor: "#d7deea",
    borderRadius: 10,
    borderWidth: 1,
    fontSize: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  addButton: {
    alignItems: "center",
    backgroundColor: "#3157c8",
    borderRadius: 10,
    padding: 14,
  },
  disabledButton: {
    opacity: 0.5,
  },
  addButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  error: {
    color: "#b42318",
    marginBottom: 12,
  },
  list: {
    gap: 12,
    paddingBottom: 24,
  },
  emptyState: {
    color: "#526079",
    fontSize: 16,
    paddingVertical: 20,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#ffffff",
    borderColor: "#d7deea",
    borderRadius: 12,
    borderWidth: 1,
    overflow: "hidden",
  },
  cardFace: {
    minHeight: 100,
    justifyContent: "center",
    padding: 18,
  },
  cardText: {
    color: "#172554",
    fontSize: 20,
    fontWeight: "600",
  },
  deleteButton: {
    alignSelf: "flex-end",
    paddingHorizontal: 18,
    paddingBottom: 14,
  },
  deleteButtonText: {
    color: "#b42318",
    fontSize: 14,
    fontWeight: "600",
  },
});
