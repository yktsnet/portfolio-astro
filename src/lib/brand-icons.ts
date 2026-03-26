import { siRaspberrypi, siCloudflare, siNixos, siEspressif } from "simple-icons";

type BrandIcon = { path: string; hex: string };

const map: Record<string, BrandIcon> = {
  "raspberry-pi": { path: siRaspberrypi.path, hex: siRaspberrypi.hex },
  "cloudflare":   { path: siCloudflare.path,  hex: siCloudflare.hex  },
  "nixos":        { path: siNixos.path,        hex: siNixos.hex       },
  "espressif":    { path: siEspressif.path,    hex: siEspressif.hex   },
};

export function getBrandIcon(name: string): BrandIcon | null {
  return map[name] ?? null;
}
