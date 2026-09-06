// CivicConnect - Sectors & Authorized Designated Persons Data

const SECTORS_DATA = {
  government: {
    id: "government",
    key: "sectorGov",
    iconName: "landmark",
    color: "#2563eb",
    bgColor: "#eff6ff",
    borderColor: "#bfdbfe",
    logoSvg: `<svg viewBox="0 0 100 100" class="sector-logo-svg" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="46" fill="#eff6ff" stroke="#2563eb" stroke-width="3"/>
      <path d="M50 18L24 32V38H76V32L50 18Z" fill="#1d4ed8"/>
      <rect x="28" y="42" width="6" height="28" rx="2" fill="#2563eb"/>
      <rect x="42" y="42" width="6" height="28" rx="2" fill="#2563eb"/>
      <rect x="52" y="42" width="6" height="28" rx="2" fill="#2563eb"/>
      <rect x="66" y="42" width="6" height="28" rx="2" fill="#2563eb"/>
      <rect x="20" y="72" width="60" height="8" rx="2" fill="#1d4ed8"/>
      <circle cx="50" cy="30" r="3" fill="#fbbf24"/>
    </svg>`,
    title: {
      en: "Government & Municipal",
      te: "ప్రభుత్వం & మున్సిపల్",
      hi: "सरकार एवं नगर निगम"
    },
    tagline: {
      en: "Roads, Potholes, Streetlights, Water Pipelines & Sanitation",
      te: "రోడ్లు, గుంతలు, వీధి దీపాలు, నీటి పైపులైన్లు & పారిశుధ్యం",
      hi: "सड़कें, गड्ढे, स्ट्रीट लाइट, पानी की पाइपलाइन एवं सफाई"
    },
    departments: [
      {
        id: "pwd_roads",
        name: "Public Works Department (Roads & Bridges)",
        officer: "Er. K. Venkata Rao",
        designation: "Superintending Engineer (PWD)",
        phone: "+91 8816 234101",
        email: "se.roads@gov.civicconnect.in",
        keywords: ["pothole", "road", "bridge", "divider", "traffic", "గుంత", "రోడ్డు", "सड़क", "गड्ढा"],
        sla: "48 Hours"
      },
      {
        id: "municipal_sanitation",
        name: "Municipal Sanitation & Waste Management",
        officer: "Smt. P. Lakshmi Devi",
        designation: "Municipal Health & Sanitation Officer",
        phone: "+91 8816 234102",
        email: "sanitation.commissioner@civicconnect.in",
        keywords: ["garbage", "waste", "trash", "drainage", "sewage", "dump", "చెత్త", "డ్రైనేజ్", "कचरा", "नाली"],
        sla: "24 Hours"
      },
      {
        id: "water_supply",
        name: "Water Works & Public Health Engineering",
        officer: "Sri R. Satyanarayana",
        designation: "Executive Engineer (Water Supply)",
        phone: "+91 8816 234103",
        email: "water.ee@civicconnect.in",
        keywords: ["water", "leak", "pipeline", "drinking", "contamination", "నీరు", "పైప్", "पानी", "लीक"],
        sla: "12 Hours"
      },
      {
        id: "electricity_lighting",
        name: "Urban Electrical & Street Lighting Wing",
        officer: "Er. M. Suresh Babu",
        designation: "Divisional Electrical Engineer",
        phone: "+91 8816 234104",
        email: "streetlights@civicconnect.in",
        keywords: ["light", "streetlight", "dark", "pole", "wire", "bulb", "కరెంట్", "దీపం", "लाइट", "तार"],
        sla: "24 Hours"
      }
    ]
  },

  universities: {
    id: "universities",
    key: "sectorUni",
    iconName: "graduation-cap",
    color: "#7c3aed",
    bgColor: "#f5f3ff",
    borderColor: "#ddd6fe",
    logoSvg: `<svg viewBox="0 0 100 100" class="sector-logo-svg" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="46" fill="#f5f3ff" stroke="#7c3aed" stroke-width="3"/>
      <path d="M50 20L18 36L50 52L82 36L50 20Z" fill="#7c3aed"/>
      <path d="M30 43V60C30 68 39 74 50 74C61 74 70 68 70 60V43" stroke="#6d28d9" stroke-width="4" stroke-linecap="round"/>
      <path d="M82 36V62" stroke="#fbbf24" stroke-width="3" stroke-linecap="round"/>
      <circle cx="82" cy="65" r="4" fill="#fbbf24"/>
    </svg>`,
    title: {
      en: "Universities & Colleges",
      te: "విశ్వవిద్యాలయాలు & కళాశాలలు",
      hi: "विश्वविद्यालय एवं महाविद्यालय"
    },
    tagline: {
      en: "Campus Infrastructure, Hostels, Labs, Mess & Student Welfare",
      te: "క్యాంపస్ మౌలిక వసతులు, హాస్టల్స్, ల్యాబ్స్, మెస్ & విద్యార్థి సంక్షేమం",
      hi: "परिसर सुविधाएं, हॉस्टल, प्रयोगशालाएं, मेस एवं छात्र कल्याण"
    },
    departments: [
      {
        id: "campus_estate",
        name: "Campus Infrastructure & Estate Maintenance",
        officer: "Prof. T. Ramachandra",
        designation: "Chief Campus Estate Officer",
        phone: "+91 8816 250201",
        email: "estate.officer@univ.edu.in",
        keywords: ["campus", "classroom", "ac", "bench", "fan", "building", "క్యాంపస్", "తరగతి", "परिसर", "कक्षा"],
        sla: "24 Hours"
      },
      {
        id: "hostel_amenities",
        name: "Hostel Administration & Student Dining (Mess)",
        officer: "Dr. B. Sailaja",
        designation: "Chief Warden & Dean of Hostels",
        phone: "+91 8816 250202",
        email: "warden.hostels@univ.edu.in",
        keywords: ["hostel", "mess", "food", "hygiene", "room", "water", "హాస్టల్", "భోజనం", "हॉस्टल", "मेस"],
        sla: "12 Hours"
      },
      {
        id: "student_welfare",
        name: "Student Welfare & Anti-Ragging Grievance Cell",
        officer: "Prof. V. Narayana Murthy",
        designation: "Dean of Student Affairs",
        phone: "+91 8816 250203",
        email: "dean.welfare@univ.edu.in",
        keywords: ["ragging", "harassment", "exam", "marks", "fee", "dispute", "సంక్షేమం", "పరీక్ష", "कल्याण", "परीक्षा"],
        sla: "6 Hours (Priority)"
      }
    ]
  },

  startups: {
    id: "startups",
    key: "sectorStartups",
    iconName: "rocket",
    color: "#059669",
    bgColor: "#ecfdf5",
    borderColor: "#a7f3d0",
    logoSvg: `<svg viewBox="0 0 100 100" class="sector-logo-svg" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="46" fill="#ecfdf5" stroke="#059669" stroke-width="3"/>
      <path d="M50 18C44 26 38 40 38 56L44 64H56L62 56C62 40 56 26 50 18Z" fill="#059669"/>
      <circle cx="50" cy="40" r="6" fill="#ffffff"/>
      <path d="M38 56L26 66V74L38 68V56Z" fill="#047857"/>
      <path d="M62 56L74 66V74L62 68V56Z" fill="#047857"/>
      <path d="M46 68L50 82L54 68H46Z" fill="#f59e0b"/>
    </svg>`,
    title: {
      en: "Startups & Tech Parks",
      te: "స్టార్టప్‌లు & టెక్ పార్కులు",
      hi: "स्टार्टअप्स एवं टेक पार्क्स"
    },
    tagline: {
      en: "Incubation Facilities, High-speed Fiber, Clearances & Grants",
      te: "ఇన్క్యుబేషన్ సౌకర్యాలు, హైస్పీడ్ ఫైబర్, అనుమతులు & నిధులు",
      hi: "इनक्यूबेशन सुविधाएं, हाई-स्पीड फाइबर, स्वीकृतियां एवं अनुदान"
    },
    departments: [
      {
        id: "incubator_facilities",
        name: "State Innovation & Incubation Mission",
        officer: "Sri Arvind Srinivas, IAS",
        designation: "Director of Startup Ecosystem",
        phone: "+91 8816 290101",
        email: "director.startups@stateit.in",
        keywords: ["incubator", "space", "desk", "coworking", "rent", "grant", "ఇన్క్యుబేటర్", "గ్రాంట్", "इनक्यूबेटर", "अनुदान"],
        sla: "48 Hours"
      },
      {
        id: "tech_infrastructure",
        name: "Fiber Grid & Power Reliability Authority",
        officer: "Er. K. Anand",
        designation: "Chief Technology Infrastructure Officer",
        phone: "+91 8816 290102",
        email: "fiber.infrastructure@techpark.in",
        keywords: ["internet", "fiber", "power", "server", "outage", "ups", "ఇంటర్నెట్", "కరెంట్", "इंटरनेट", "बिजली"],
        sla: "6 Hours"
      },
      {
        id: "regulatory_clearances",
        name: "Single Window Clearance & Regulatory Cell",
        officer: "Smt. G. Swetha",
        designation: "Nodal Officer (Ease of Doing Business)",
        phone: "+91 8816 290103",
        email: "singlewindow@investstate.in",
        keywords: ["license", "gst", "permit", "noc", "compliance", "లైసెన్స్", "అనుమతి", "लाइसेंस", "अनुमति"],
        sla: "36 Hours"
      }
    ]
  },

  industries: {
    id: "industries",
    key: "sectorInd",
    iconName: "factory",
    color: "#d97706",
    bgColor: "#fffbeb",
    borderColor: "#fde68a",
    logoSvg: `<svg viewBox="0 0 100 100" class="sector-logo-svg" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="46" fill="#fffbeb" stroke="#d97706" stroke-width="3"/>
      <path d="M22 74V48L40 58V44L60 54V30H78V74H22Z" fill="#d97706"/>
      <rect x="66" y="20" width="6" height="10" fill="#b45309"/>
      <path d="M69 16C68 12 72 10 70 6" stroke="#9ca3af" stroke-width="2" stroke-linecap="round"/>
      <rect x="30" y="62" width="6" height="8" fill="#ffffff"/>
      <rect x="46" y="62" width="6" height="8" fill="#ffffff"/>
      <rect x="62" y="62" width="6" height="8" fill="#ffffff"/>
      <line x1="16" y1="74" x2="84" y2="74" stroke="#78350f" stroke-width="4" stroke-linecap="round"/>
    </svg>`,
    title: {
      en: "Industries & Manufacturing",
      te: "పరిశ్రమలు & తయారీ రంగం",
      hi: "उद्योग एवं विनिर्माण"
    },
    tagline: {
      en: "Industrial Roads, Pollution Control, Effluent Treatment & Safety",
      te: "పారిశ్రామిక రోడ్లు, కాలుష్య నియంత్రణ, వ్యర్థ జలాలు & భద్రత",
      hi: "औद्योगिक सड़कें, प्रदूषण नियंत्रण, अपशिष्ट शोधन एवं सुरक्षा"
    },
    departments: [
      {
        id: "pollution_control",
        name: "State Pollution Control Board (Regional Office)",
        officer: "Dr. C. H. Madhava Rao",
        designation: "Senior Environmental Engineer (SPCB)",
        phone: "+91 8816 277301",
        email: "ro.spcb@env.gov.in",
        keywords: ["pollution", "smoke", "chemical", "effluent", "air", "water", "కాలుష్యం", "పొగ", "రసాయనం", "प्रदूषण", "धुआं"],
        sla: "12 Hours (Emergency)"
      },
      {
        id: "industrial_safety",
        name: "Directorate of Factories & Industrial Safety",
        officer: "Er. Y. Srinivasa Reddy",
        designation: "Chief Inspector of Factories",
        phone: "+91 8816 277302",
        email: "inspector.factories@safety.gov.in",
        keywords: ["safety", "fire", "hazard", "boiler", "accident", "worker", "భద్రత", "ప్రమాదం", "అగ్ని", "सुरक्षा", "दुर्घटना"],
        sla: "8 Hours"
      },
      {
        id: "corridor_infra",
        name: "Industrial Infrastructure Development Corp (IIDC)",
        officer: "Sri P. Mohan Babu",
        designation: "Zonal Manager (Industrial Parks)",
        phone: "+91 8816 277303",
        email: "zm.iidc@indparks.in",
        keywords: ["road", "drain", "truck", "corridor", "loading", "heavy", "రోడ్డు", "పారిశ్రామిక", "सड़क", "लोडिंग"],
        sla: "48 Hours"
      }
    ]
  }
};

window.SECTORS_DATA = SECTORS_DATA;
