import { Zap } from "lucide-react";

interface BuzzerButtonProps {
  onPress: () => void;
}

export function BuzzerButton({ onPress }: BuzzerButtonProps) {
  return (
    <button
      type="button"
      onClick={onPress}
      className="flex min-h-32 w-full items-center justify-center gap-3 rounded-lg border border-cyanGlow/50 bg-gradient-to-br from-cyanGlow to-magentaGlow px-6 py-8 text-2xl font-black text-ink shadow-[0_0_42px_rgba(25,230,255,0.35)] transition active:scale-[0.96]"
    >
      <Zap size={30} aria-hidden />
      押す
    </button>
  );
}
