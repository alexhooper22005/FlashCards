# StudyFlash

A React Native app built with Expo where students can create, study, and delete
flashcards.

## Run the app

```sh
npm install
npm start
```

Use Expo Go to open the project on a device, or run `npm run ios` or
`npm run android` with the corresponding development tools installed.

## Run from Android Studio

The native Android project is in the `android/` folder.

1. Start Metro from the project root and leave it running:

   ```sh
   npm start
   ```

2. In Android Studio, choose **File → Open** and select this project's
   `android/` folder (not the repository root). Wait for Gradle sync to finish.
3. Select the **app** run configuration and a running emulator, then click
   **Run**.

If Android Studio asks which JDK to use, choose its bundled **Embedded JDK**.

## Verify the code

```sh
npm test
npm run test:unit
npm run typecheck
```

## Project layers

- `App.tsx` is the composition root; it wires the data repository to the service.
- `src/ui/` contains the React Native presentation.
- `src/services/` contains flashcard rules and use cases.
- `src/domain/` defines flashcards and the repository interface.
- `src/data/` implements the repository.
- `tests/unit/` contains service and repository tests.

Flashcards currently live in memory, so they reset when the app restarts. The
repository interface makes it possible to add device storage later without
putting storage code in the screen or service.
