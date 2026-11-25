/**
 * Portfolio Configuration & Content
 * ---------------------------------
 * Edit this file in VS Code (or any text editor) to update your portfolio.
 * Visitors viewing your website cannot modify anything on the page.
 *
 * Photos:
 * 1. Put your images inside the `assets/` folder (e.g. `assets/profile.jpg`, `assets/cv-resume.jpg`).
 * 2. Update the photo paths below (`avatarPhoto`, `coverPhoto`, `galleryPhotos`,
 *    `photo` inside `projectsAndResearch`, and `contacts.cvResume.photo`).
 */

window.PORTFOLIO_DATA = {
  profile: {
    name: "Marc LJ B. Juance",
    // Examples: "Student", "Instructor", "Junior IT", "IT Support Specialist", "Software Developer"
    status: "Student",
    headline: "Aspiring Systems & Web Specialist | Problem Solver",
    location: "Negros Occidental, Bacolod City, Philippines",
    availability: "Open to opportunities & collaborations",
    summary:
      "Detail-oriented technology enthusiast passionate about building reliable web applications, supporting IT infrastructure, and continuously learning through hands-on projects and research.",
    avatarPhoto: "assets/me.jpg", // Example: "assets/me.jpg" (leave "" to show initials)
    coverPhoto: "",  // Optional banner image, e.g. "assets/cover.jpg"
    galleryPhotos: [
      // Optional extra photos displayed inside About Me:
      // { caption: "Presenting capstone research", url: "assets/presentation.jpg" }
    ]
  },

  about: {
    bioParagraphs: [
      "Hello! I am a dedicated tech learner and practitioner who enjoys bridging technical troubleshooting with clean, user-friendly software solutions.",
      "I am currently a student pursuing a degree in Information Systems. While I am still in school, I am actively seeking opportunities to apply my knowledge and gain real-world experience."
    ],
    highlights: [
      { label: "Current Focus", value: "IT Operations, Networking & Full-Stack Web" },
      { label: "Languages", value: "English, Filipino" },
      { label: "Core Strengths", value: "Troubleshooting, Documentation, Collaboration" }
    ]
  },

  education: [
    {
      institution: "University of Negros Occidental – Recoletos",
      degree: "Bachelor of Science in Information Systems",
      period: "2024 – 2028",
      location: "Bacolod City",
      details: "Relevant coursework: Networking, Troubleshooting, Web development, and System Administration "
    },
    {
      institution: "La Consolacion College Bacolod",
      degree: "Senior High School — STEM",
      period: "2019 – 2021",
      location: "Bacolod City",
    }
  ],

  skills: [
    {
      category: "IT & Systems Support",
      items: [
        "Programming & Software Development",
        "Database Management & SQL",
        "Web Development (HTML/CSS/JS)",
        "Computer Networking & Troubleshooting",
        "System Analysis & Design",
        "Data Analytics & Automation",
      ]
    },
    {
      category: "Development & Data",
      items: [
        "HTML / CSS / JavaScript",
        "Python",
        "SQL & Database Design",
        "Git & GitHub",
        "Data Analysis & Visualization"
      ]
    },
  ],

  projectsAndResearch: [
    {
      type: "Project", // "Project" or "Research"
      title: "Campus Helpdesk & Asset Tracker",
      year: "2026",
      role: "Lead Developer",
      description:
        "A lightweight web application for logging IT support tickets, tracking lab equipment inventory, and monitoring resolution turnaround times.",
      tags: ["HTML/CSS/JS", "SQL", "IT Operations"],
      link: "",  // Optional URL, e.g. "https://github.com/..."
      photo: ""  // Optional image path, e.g. "assets/helpdesk.jpg"
    },
    {
      type: "Research",
      title: "Evaluating Network Latency & Reliability in Hybrid Classrooms",
      year: "2025",
      role: "Co-Researcher",
      description:
        "Undergraduate research study analyzing Wi-Fi access point load distribution and proposing low-cost QoS optimizations for academic computer laboratories.",
      tags: ["Networking", "QoS", "Data Analysis"],
      link: "",
      photo: ""
    }
  ],

  trainingsAndCertificates: [
    {
      title: "Google IT Support Professional Certificate",
      issuer: "Coursera / Google",
      date: "2026",
      credentialId: "CERT-SAMPLE-001",
      link: ""
    },
    {
      title: "Cisco Introduction to Networks (CCNAv7)",
      issuer: "Cisco Networking Academy",
      date: "2026",
      credentialId: "CISCO-SAMPLE-204",
      link: ""
    },
  ],

  contacts: {
    email: "marcjuance4@gmail.com",
    phone: "+63 947 773 4025",
    locationNote: "Available for onsite, hybrid, or remote roles.",
    cvResume: {
      title: "CV / Resume",
      photo: "", // Insert your CV/Resume photo path here, e.g. "assets/cv-resume.jpg"
      caption: "Click to view full-size CV / Resume"
    },
    socials: [
      { platform: "Instagram", handle: "instagram.com/0nyourm_arc", url: "https://instagram.com" },
      { platform: "GitHub", handle: "github.com/marcjuance", url: "https://github.com" },
      { platform: "Facebook", handle: "www.facebook.com/Marcoco0n/", url: "https://facebook.com" }
    ]
  }
};
