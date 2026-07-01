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
    liveLink: "https://adhayaya-travel.vercel.app/",
    heroImage: "https://res.cloudinary.com/dtslaveid/image/upload/v1782910188/03f9965c-b113-4798-b35b-1b7ac88cfd06.png",
    galleryImages: [
      "https://res.cloudinary.com/dtslaveid/image/upload/v1782910604/fc37c924-f706-4b87-abd8-a4013827e725.png",
      "https://res.cloudinary.com/dtslaveid/image/upload/v1782910256/Screenshot_2026-07-01_182040_aq5rgq.png",
      "https://res.cloudinary.com/dtslaveid/image/upload/v1782910256/Screenshot_2026-07-01_182005_ln6oz5.png"
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
    id: "aurey",
    title: "Aurey",
    tagline: "Build Your Digital Presence with AI.",
    category: "Portfolio Platform",
    status: "live",

    year: "2026",
    timeline: "Active",
    role: "Full-Stack Developer & UI Engineer",
    client: "Personal Brand",
    industry: "Portfolio / Web Platform",

    services: "React / Node.js / AI Integration",
    techStack: {
      frontend: [
        "React",
        "Vite",
        "Tailwind CSS",
        "Framer Motion",
        "GSAP",
        "shadcn/ui"
      ],
      backend: [
        "Node.js",
        "Express.js",
        "MongoDB",
        "Cloudinary"
      ],
      ai: [
        "OpenAI",
        "Nebius AI",
        "ImageKit"
      ],
      deployment: [
        "Vercel",
        "Render",
        "GitHub"
      ],
    },

    liveLink: "https://aurey-sample.vercel.app/auth",
    caseStudy: "/work/aurey",
    githubLink: "https://github.com/Prince-verma56/Aurey-Sample",

    heroImage: "https://res.cloudinary.com/dtslaveid/image/upload/v1782911204/Screenshot_2026-07-01_183449_dvahxx.png",
    galleryImages: [
      "https://res.cloudinary.com/dtslaveid/image/upload/v1782911884/430f4d31-9be3-417c-a2ff-336c61d0659f.png",
      "https://res.cloudinary.com/dtslaveid/image/upload/v1782911919/Screenshot_2026-07-01_184800_pcgick.png",
      "https://res.cloudinary.com/dtslaveid/image/upload/v1782911200/Screenshot_2026-07-01_183610_haqqkr.png",
    ],

    description:
      "Aurey is an AI-powered portfolio platform designed to help developers, designers, freelancers, and creators showcase their work with premium visuals, smooth interactions, and intelligent features. It combines modern UI, animations, and AI tools into a fast, responsive web experience.",

    challenge:
      "Most portfolio websites look generic, lack storytelling, and fail to showcase projects in an engaging way. Building a portfolio often requires significant design knowledge, custom development, and ongoing maintenance.",

    solution:
      "Aurey provides a modern portfolio experience with reusable project showcases, AI-powered content generation, smooth GSAP and Framer Motion animations, responsive layouts, optimized performance, and scalable architecture. It allows creators to present their work professionally while keeping content management simple.",

    results: [
      { value: "100%", label: "Responsive Experience" },
      { value: "95+", label: "Lighthouse Performance" },
      { value: "AI", label: "Powered Content Features" },
      { value: "Modern", label: "Interactive UI & Animations" },
    ],

    featured: true,
    order: 1,
    accentColor: "#7C3AED",
    darkHero: true,
  },
];
