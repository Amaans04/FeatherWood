const PERKS = [
  "No Cost EMI Available",
  "Exchange Offer",
  "2 Years Warranty",
  "Free Installation",
];

function PerkItems({ ariaHidden }: { ariaHidden?: boolean }) {
  return (
    <ul
      className="flex shrink-0 items-center gap-0"
      aria-hidden={ariaHidden || undefined}
    >
      {PERKS.map((perk) => (
        <li
          key={perk}
          className="flex items-center gap-8 md:gap-12 px-4 md:px-6"
        >
          <span className="whitespace-nowrap text-[10px] md:text-[11px] uppercase tracking-[0.22em] text-[#FAFAF8] font-normal">
            {perk}
          </span>
          <span
            className="block h-[3px] w-[3px] rounded-full bg-[#8B7355] shrink-0"
            aria-hidden="true"
          />
        </li>
      ))}
    </ul>
  );
}

export default function PerksRibbon() {
  return (
    <aside
      className="relative w-full overflow-hidden bg-[#1A1A1A] border-y border-[#2A2A2A]"
      aria-label="Brand perks"
    >
      <div className="flex w-max items-center py-3 md:py-3.5 perks-marquee">
        <PerkItems />
        <PerkItems ariaHidden />
        <PerkItems ariaHidden />
      </div>
    </aside>
  );
}
