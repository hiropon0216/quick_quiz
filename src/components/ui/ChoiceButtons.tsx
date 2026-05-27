interface ChoiceButtonsProps {
  choices: readonly string[];
  onSelect: (choice: string) => void;
}

export function ChoiceButtons({ choices, onSelect }: ChoiceButtonsProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {choices.map((choice) => (
        <button
          key={choice}
          type="button"
          onClick={() => onSelect(choice)}
          className="min-h-20 rounded-lg border border-white/15 bg-white/[0.07] px-3 py-4 text-base font-bold shadow-[0_0_24px_rgba(25,230,255,0.08)] transition hover:border-cyanGlow/70 hover:bg-cyanGlow/10 active:scale-[0.98]"
        >
          {choice}
        </button>
      ))}
    </div>
  );
}
