export function useSound() {
  const play = (name: "correct" | "wrong" | "countdown") => {
    const audio = new Audio(`${import.meta.env.BASE_URL}sounds/${name}.mp3`);
    audio.volume = 0.35;
    void audio.play().catch(() => {
      // Browsers can block audio until the user interacts. The app works without SE.
    });
  };

  return { play };
}
