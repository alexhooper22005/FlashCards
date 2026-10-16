import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import { InMemoryFlashcardRepository } from "../data/InMemoryFlashcardRepository";
import { FlashcardService } from "../services/FlashcardService";
import { FlashcardsScreen } from "./FlashcardsScreen";

describe("FlashcardsScreen", () => {
  it("shows an empty state when there are no flashcards", async () => {
    const service = new FlashcardService(new InMemoryFlashcardRepository());

    await render(<FlashcardsScreen service={service} />);

    await screen.findByText("No flashcards yet. Add one to get started.");
  });

  it("adds and flips a flashcard", async () => {
    const service = new FlashcardService(new InMemoryFlashcardRepository());
    const { getByPlaceholderText, getByRole, getByText, queryByText } =
      await render(<FlashcardsScreen service={service} />);

    await fireEvent.changeText(
      getByPlaceholderText("Question"),
      "What is a noun?",
    );
    await fireEvent.changeText(
      getByPlaceholderText("Answer"),
      "A person, place, or thing.",
    );
    await fireEvent.press(getByRole("button", { name: "Add flashcard" }));

    await waitFor(() => getByText("What is a noun?"));
    await fireEvent.press(getByRole("button", { name: "Show answer" }));

    expect(getByText("A person, place, or thing.")).toBeTruthy();
    expect(queryByText("What is a noun?")).toBeNull();
  });

  it("deletes a flashcard", async () => {
    const service = new FlashcardService(new InMemoryFlashcardRepository());
    const { getByPlaceholderText, getByRole, getByText, queryByText } =
      await render(<FlashcardsScreen service={service} />);

    await fireEvent.changeText(
      getByPlaceholderText("Question"),
      "What is a noun?",
    );
    await fireEvent.changeText(
      getByPlaceholderText("Answer"),
      "A person, place, or thing.",
    );
    await fireEvent.press(getByRole("button", { name: "Add flashcard" }));
    await waitFor(() => getByText("What is a noun?"));

    await fireEvent.press(getByRole("button", { name: "Delete flashcard" }));

    await waitFor(() => {
      expect(queryByText("What is a noun?")).toBeNull();
    });
  });
});
