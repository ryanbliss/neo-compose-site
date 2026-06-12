import Image from "next/image";

export function Logo({ size = 36 }: { size?: number }) {
  return (
    <span
      className="relative grid place-items-center rounded-xl bg-panel-2 p-1.5"
      style={{ width: size + 12, height: size + 12 }}
    >
      <Image
        src="/logo.svg"
        alt="Neo Compose — n, e, o, c controller buttons"
        width={size}
        height={size}
        className="drop-shadow-[0_0_10px_rgb(108_92_231/0.45)]"
      />
    </span>
  );
}
