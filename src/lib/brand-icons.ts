import { siRaspberrypi, siCloudflare, siNixos, siEspressif, siPython, siReact, siPostgresql, siGo, siVuedotjs, siDotnet, siLanggraph, siTypescript, siTerraform } from "simple-icons";

export type BrandIcon = { path: string; hex: string };

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
};

export function getBrandIcon(name: string): BrandIcon | null {
  return map[name] ?? null;
}
