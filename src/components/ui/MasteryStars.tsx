interface MasteryStarsProps {
  count: number;
}

export function MasteryStars({ count }: MasteryStarsProps) {
  return (
    <div className="font-display text-sm tracking-normal text-yellow-300">
      {"★".repeat(count)}
      <span className="text-white/25">{"★".repeat(3 - count)}</span>
    </div>
  );
}
