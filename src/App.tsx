import { AnimatePresence, motion } from "framer-motion";
import { BuzzerScreen } from "./components/screens/BuzzerScreen";
import { ChoiceScreen } from "./components/screens/ChoiceScreen";
import { ModeSelectScreen } from "./components/screens/ModeSelectScreen";
import { ResultScreen } from "./components/screens/ResultScreen";
import { SessionEndScreen } from "./components/screens/SessionEndScreen";
import { TopScreen } from "./components/screens/TopScreen";
import { useQuizStore } from "./store/quizStore";

const screenVariants = {
  initial: { opacity: 0, x: 18 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -18 },
};

export default function App() {
  const currentScreen = useQuizStore((state) => state.currentScreen);

  return (
    <main className="min-h-screen bg-ink text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col px-4 py-5 sm:px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScreen}
            variants={screenVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="flex min-h-[calc(100vh-40px)] flex-col"
          >
            {currentScreen === "top" && <TopScreen />}
            {currentScreen === "mode_select" && <ModeSelectScreen />}
            {currentScreen === "buzzer" && <BuzzerScreen />}
            {currentScreen === "choice" && <ChoiceScreen />}
            {currentScreen === "result" && <ResultScreen />}
            {currentScreen === "session_end" && <SessionEndScreen />}
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}
