import { StatusBar } from "expo-status-bar";
import { SafeAreaView, StyleSheet } from "react-native";
import { InMemoryFlashcardRepository } from "./src/data/InMemoryFlashcardRepository.ts";
import { FlashcardService } from "./src/services/FlashcardService.ts";
import { FlashcardsScreen } from "./src/ui/FlashcardsScreen.tsx";

const repository = new InMemoryFlashcardRepository();
const flashcardService = new FlashcardService(repository);

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <FlashcardsScreen service={flashcardService} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
