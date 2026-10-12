import { siRaspberrypi, siCloudflare, siNixos, siEspressif, siPython, siReact, siPostgresql, siGo, siVuedotjs, siDotnet, siLanggraph, siTypescript, siTerraform } from "simple-icons";

export type BrandIcon = { path: string; hex: string; viewBox?: string };

const zennIcon: BrandIcon = {
  path: "M2.4 83.3h17c.9 0 1.7-.5 2.2-1.2L68.4 5.2C69 4.2 68.3 3 67.1 3H51c-.8 0-1.5.4-1.9 1.1L1.6 81.9C1.3 82.5 1.7 83.3 2.4 83.3zM61 82.1l22.1-35.5c.7-1.1-.1-2.5-1.4-2.5H65.7c-.6 0-1.2.3-1.5.8L41.5 81.2c-.6.9.1 2.1 1.2 2.1h16.3C59.8 83.3 60.6 82.9 61 82.1z",
  hex: "3EA8FF",
  viewBox: "0 0 85 86",
};

const map: Record<string, BrandIcon> = {
  "raspberry-pi": { path: siRaspberrypi.path, hex: siRaspberrypi.hex },
  "cloudflare":   { path: siCloudflare.path,  hex: siCloudflare.hex  },
  "nixos":        { path: siNixos.path,        hex: siNixos.hex       },
  "espressif":    { path: siEspressif.path,    hex: siEspressif.hex   },
  "python":       { path: siPython.path,       hex: siPython.hex      },
  "react":        { path: siReact.path,        hex: siReact.hex       },
  "postgresql":   { path: siPostgresql.path,   hex: siPostgresql.hex  },
  "go":               { path: siGo.path,               hex: siGo.hex               },
  "vue":              { path: siVuedotjs.path,          hex: siVuedotjs.hex         },
  "csharp":           { path: siDotnet.path,            hex: siDotnet.hex           },
  "langgraph":        { path: siLanggraph.path,         hex: siLanggraph.hex        },
  "typescript":       { path: siTypescript.path,        hex: siTypescript.hex       },
  "terraform":        { path: siTerraform.path,         hex: siTerraform.hex        },
  "zenn":             zennIcon,
};

export function getBrandIcon(name: string): BrandIcon | null {
  return map[name] ?? null;
}
