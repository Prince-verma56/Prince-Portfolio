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
}

export const projectsData: ProjectData[] = [
  {
    id: "adhayaya",
    title: "Adhayaya",
    description: "A cultural exploration platform bringing Indian heritage, monuments, and dynamic travel itineraries to life using interactive 3D elements and immersive storytelling.",
    year: "2024",
    timeline: "3 Months",
    services: "Next.js / WebGL / Strategic Branding",
    liveLink: "https://adhayaya.dev",
    heroImage: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1800&q=90",
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
    id: "dhritam",
    title: "Dhritam",
    description: "An AI-powered real-time health monitoring and prediction platform combining IoT wearable streams with complex event processing engines to alert medical professionals.",
    year: "2024",
    timeline: "4 Months",
    services: "Python / TensorFlow / IoT Dashboard",
    liveLink: "https://dhritam.health",
    heroImage: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=1800&q=90",
    galleryImages: [
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&q=80",
      "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=1200&q=80",
      "https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?w=1800&q=90"
    ],
    challenge: "Medical alert devices are often prone to high false-alarm rates, causing alarm fatigue among hospital staff. We needed to develop a system that could aggregate noisy multi-parameter sensor streams (heart rate, blood oxygen, posture) and accurately flag anomalies in under 200 milliseconds.",
    solution: "We trained lightweight 1D convolutional neural networks (1D-CNN) that run locally on Edge gateways and sync with a central cloud system. The dashboard uses highly optimized custom canvas graphing to render thousands of data streams dynamically at 60fps without choking browser processes.",
    results: [
      { value: "98.7%", label: "Anomaly Prediction Accuracy" },
      { value: "92%", label: "Reduction in Alarm Fatigue" },
      { value: "15ms", label: "Stream Latency to Cloud" },
      { value: "5k+", label: "Active Connected Patients" }
    ]
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
