import { useMemo } from "react";
import { StatusBar } from "expo-status-bar";
import { SQLiteProvider, useSQLiteContext } from "expo-sqlite";
import { SafeAreaView, StyleSheet } from "react-native";
import { SQLiteFlashcardRepository } from "./src/data/SQLiteFlashcardRepository.ts";
import { initializeFlashcardDatabase } from "./src/data/initializeFlashcardDatabase.ts";
import { FlashcardService } from "./src/services/FlashcardService.ts";
import { FlashcardsScreen } from "./src/ui/FlashcardsScreen.tsx";

function AppContent() {
  const database = useSQLiteContext();

  // Keep the service stable so the screen doesn't reload cards on every render.
  const flashcardService = useMemo(
    () => new FlashcardService(new SQLiteFlashcardRepository(database)),
    [database],
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <FlashcardsScreen service={flashcardService} />
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SQLiteProvider
      databaseName="studyflash.db"
      onInit={initializeFlashcardDatabase}
    >
      <AppContent />
    </SQLiteProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});