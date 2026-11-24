import Image from "next/image";

type GalaxyLogoProps = {
  width?: number;
};

/**
 * Brand component in src/components/brand.
 * Renders The Galaxy Space mark everywhere the product shows a logo,
 * so login, sign-up, and later admin screens stay on one asset.
 */
export function GalaxyLogo({ width = 260 }: GalaxyLogoProps) {
  return (
    <Image
      src="/brand/galaxy-space-logo.png"
      alt="The Galaxy Space"
      width={1024}
      height={525}
      priority
      className="galaxy-logo"
      style={{ width, height: "auto" }}
    />
  );
}
