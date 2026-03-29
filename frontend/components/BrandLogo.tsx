import Image from "next/image";
import Link from "next/link";

type BrandLogoProps = {
  href?: string;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  width?: number;
  height?: number;
  showText?: boolean;
};

export default function BrandLogo({
  href = "/",
  className = "flex items-center gap-2",
  imageClassName = "h-12 w-12 shrink-0",
  priority = false,
  width = 45,
  height = 45,
  showText = true
}: BrandLogoProps) {
  const content = (
    <>
      <Image
        src="/icon.svg"
        alt="CGC University Campus Body"
        width={width}
        height={height}
        priority={priority}
        unoptimized
        className={imageClassName}
      />
      {showText ? (
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-300">
            Community
          </p>
          <p className="text-xs text-slate-400">CGCU Campus Hub</p>
        </div>
      ) : null}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={className}>
        {content}
      </Link>
    );
  }

  return <div className={className}>{content}</div>;
}
