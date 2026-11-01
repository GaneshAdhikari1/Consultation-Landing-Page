import Image from "next/image";

type HeaderProps = {
  variant?: "light" | "dark";
};

export function Header({ variant = "light" }: HeaderProps) {
  const isDark = variant === "dark";

  return (
    <header className={`section-shell flex items-center py-5 sm:py-7 ${isDark ? "justify-between" : "justify-center"}`}>
      <Image
        src="/logo.png"
        alt="Digital Ganesh"
        width={1254}
        height={1254}
        priority
        className={`h-auto object-contain ${isDark ? "w-20 rounded-2xl bg-white p-1.5 shadow-[0_14px_36px_rgb(0_0_0/30%)] sm:w-24" : "w-28 sm:w-36"}`}
      />
      {isDark ? (
        <a
          href="#book"
          className="rounded-full border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-extrabold text-white transition hover:border-[#ffc400]/60 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ffc400] sm:px-5"
        >
          Book free call
        </a>
      ) : null}
    </header>
  );
}
