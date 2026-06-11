export interface ProjectData {
  id: string;
  title: string;
  description: string;
  year: string;
  timeline: string;
  services: string;
  liveLink: string;
  heroImage: string;
  galleryImages: string[];
  challenge: string;
  solution: string;
  results: { value: string; label: string }[];
  tagline?: string;
  category?: string;
  status?: string;
  role?: string;
  client?: string;
  industry?: string;
  techStack?: {
    frontend?: string[];
    backend?: string[];
    shell?: string[];
    infra?: string[];
    [key: string]: string[] | undefined;
  };
  caseStudy?: string;
  githubLink?: string;
  thumbnailImage?: string;
  featured?: boolean;
  order?: number;
  accentColor?: string;
  darkHero?: boolean;
}

export const projectsData: ProjectData[] = [
  {
    id: "adhayaya",
    title: "Adhayaya",
    description: "A cultural exploration platform bringing Indian heritage, monuments, and dynamic travel itineraries to life using interactive 3D elements and immersive storytelling.",
    year: "2026",
    timeline: "3 Months",
    services: "Next.js / WebGL / Strategic Branding",
    liveLink: "https://adhayaya.dev",
    heroImage: "https://res.cloudinary.com/dtslaveid/image/upload/v1781108027/Screenshot_2026-06-09_202735_ixq9ul.png",
    galleryImages: [
      "https://images.unsplash.com/photo-1473163928189-364b2c4e1135?w=1200&q=80",
      "https://images.unsplash.com/photo-1548013146-72479768bada?w=1200&q=80",
      "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1800&q=90"
    ],
    challenge: "Traditional travel guides struggle to captivate younger audiences, making ancient history feel dry and distant. The challenge was to bridge historical archives with modern interactive web technology, creating a friction-free spatial visualization interface that loads instantly on mobile.",
    solution: "We engineered a lightweight WebGL architecture nested within a high-performance Next.js application. Dynamic SVG maps, custom monument layouts, and structured micro-interactions translate historical data into responsive visual narratives that reward visitor curiosity.",
    results: [
      { value: "45%", label: "Increase in User Session Length" },
      { value: "100k+", label: "Monthly Active Explorers" },
      { value: "<1.2s", label: "Interactive Core Web Vitals Paint" },
      { value: "24", label: "Monuments Fully Mapped" }
    ]
  },
  {
    id: "neonscript",
    title: "NeonScript",
    tagline: "Code. Run. Ship. Natively.",
    category: "Developer Tooling",
    status: "live",

    year: "2025",
    timeline: "Active",
    role: "Full-Stack + Desktop Engineer",
    client: "Personal / Open Source",
    industry: "IDE / Dev Tools",

    services: "Next.js / Tauri / TypeScript",
    techStack: {
      frontend: ["Next.js 15", "React 18", "TypeScript", "Monaco Editor", "TailwindCSS"],
      backend: ["Tauri 2.x", "Rust", "Axum"],
      shell: ["xterm.js", "tauri-plugin-shell", "Real OS PTY"],
      infra: ["tauri-plugin-fs", "tauri-plugin-dialog", "Sentry"],
    },

    liveLink: "https://github.com/Prince-verma56/neonscript",
    caseStudy: "/work/neonscript",
    githubLink: "https://github.com/Prince-verma56/neonscript",

    heroImage: "https://res.cloudinary.com/dtslaveid/image/upload/v1781211370/Screenshot_2026-06-12_022516_z8c2db.png",
    galleryImages: [
      "https://res.cloudinary.com/dtslaveid/image/upload/v1781211370/Screenshot_2026-06-12_022204_ldmof4.png",
      "https://res.cloudinary.com/dtslaveid/image/upload/v1781211370/Screenshot_2026-06-12_022543_tlcw6f.png",
      "https://res.cloudinary.com/dtslaveid/image/upload/v1781211370/Screenshot_2026-06-12_022516_z8c2db.png",
    ],

    description: "A Tauri-powered desktop IDE with real native OS access — Monaco editor, true PTY terminal, multi-language runner, and local HTTP HTML preview. VS Code parity without the Electron weight.",

    challenge: "Existing browser-based IDEs simulate file systems and terminals using WebContainer and WASM — giving developers a fake environment that breaks on real projects, real dependencies, and real OS tooling.",

    solution: "Rebuilt from scratch on Tauri 2.x. Real shell (PowerShell/zsh/bash) spawned via plugin-shell. File operations via plugin-fs with absolute OS paths. HTML preview served through a Rust axum HTTP server so linked CSS/JS loads correctly. Multi-language runner checks PATH at runtime — no hardcoded binary locations.",

    results: [
      { value: "11", label: "Languages Supported" },
      { value: "100%", label: "Real OS File Access" },
      { value: "0", label: "WebContainer Dependencies" },
      { value: "~40MB", label: "App Bundle Size" },
    ],

    featured: true,
    order: 1,
    accentColor: "#2563EB",
    darkHero: true,
  },
  {
    id: "hazu",
    title: "Hazu",
    description: "A business predictive analytics intelligence dashboard designed to streamline internal logistics pipelines, supply chain predictions, and global cargo tracking.",
    year: "2023",
    timeline: "6 Months",
    services: "React / D3.js / Machine Learning",
    liveLink: "https://hazu.io",
    heroImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1800&q=90",
    galleryImages: [
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80",
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1200&q=80",
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1800&q=90"
    ],
    challenge: "Enterprise managers are frequently overwhelmed by complex spreadsheets, making it difficult to detect supply chain blockages before they occur. The goal was to build a dashboard that transforms million-row datasets into clear, actionable predictive flows.",
    solution: "Using advanced D3.js layout algorithms and Web Workers, we built custom interactive Sankey and network graphs that update in real-time. A background machine learning service continuously processes inventory reports, highlighting potential bottlenecks up to 72 hours in advance.",
    results: [
      { value: "3.2x", label: "Speedup in Management Audits" },
      { value: "22%", label: "Decrease in Inventory Costs" },
      { value: "94%", label: "Bottleneck Warning Success Rate" },
      { value: "8", label: "Global Warehouses Synced" }
    ]
  }
];
