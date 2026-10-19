import Image from "next/image";

export function Header() {
  return (
    <header className="section-shell flex justify-center py-5 sm:py-7">
      <Image
        src="/logo.png"
        alt="Digital Ganesh"
        width={1254}
        height={1254}
        priority
        className="h-auto w-28 object-contain sm:w-36"
      />
    </header>
  );
}
