import { siRaspberrypi, siCloudflare, siNixos, siEspressif, siPython } from "simple-icons";

type BrandIcon = { path: string; hex: string };

const map: Record<string, BrandIcon> = {
  "raspberry-pi": { path: siRaspberrypi.path, hex: siRaspberrypi.hex },
  "cloudflare":   { path: siCloudflare.path,  hex: siCloudflare.hex  },
  "nixos":        { path: siNixos.path,        hex: siNixos.hex       },
  "espressif":    { path: siEspressif.path,    hex: siEspressif.hex   },
  "python":       { path: siPython.path,       hex: siPython.hex      },
};

export function getBrandIcon(name: string): BrandIcon | null {
  return map[name] ?? null;
}
