// CivicConnect - Multilingual AI Help Assistant
// Handles interactive citizen queries in Telugu, English, and Hindi

const aiAssistant = {
  chatHistory: [],

  quickPrompts: {
    en: [
      "How do I report a pothole or road issue?",
      "Who handles university and college complaints?",
      "How to track my complaint status?",
      "How does AI assign my complaint to officers?"
    ],
    te: [
      "రోడ్డు గుంతను ఎలా నివేదించాలి?",
      "విశ్వవిద్యాలయ సమస్యలను ఎవరు పరిష్కరిస్తారు?",
      "నా ఫిర్యాదు స్థితిని ఎలా తెలుసుకోవాలి?",
      "AI సంబంధిత అధికారిని ఎలా ఎంపిక చేస్తుంది?"
    ],
    hi: [
      "सड़क या गड्ढे की शिकायत कैसे दर्ज करें?",
      "विश्वविद्यालय की समस्याओं का समाधान कौन करता है?",
      "अपनी शिकायत का स्टेटस कैसे चेक करें?",
      "AI सही अधिकारी को कैसे चुनता है?"
    ]
  },

  init() {
    this.renderQuickPrompts();
    this.appendWelcomeMessage();
  },

  appendWelcomeMessage() {
    const chatContainer = document.getElementById('aiChatMessages');
    if (!chatContainer) return;

    chatContainer.innerHTML = '';
    const lang = i18n.currentLang;

    const welcomeMsg = lang === 'te' ?
      "నమస్కారం! నేను సివిక్ కనెక్ట్ AI అసిస్టెంట్‌ని. మీరు సమస్యను నివేదించడం, విభాగాలు, సరైన అధికారి వివరాలు లేదా ఫిర్యాదు స్థితి గురించి నన్ను తెలుగులో అడగవచ్చు." :
      lang === 'hi' ?
      "नमस्ते! मैं सिविक कनेक्ट AI सहायक हूं। आप समस्या दर्ज करने, संबंधित विभाग या शिकायत की स्थिति के बारे में मुझसे हिंदी में कुछ भी पूछ सकते हैं।" :
      "Hello! I am your CivicConnect AI Assistant. Ask me anything about reporting issues, sector authorities, voice input, or tracking your complaint.";

    this.renderBubble('bot', welcomeMsg);
  },

  renderQuickPrompts() {
    const container = document.getElementById('aiQuickChips');
    if (!container) return;

    container.innerHTML = '';
    const lang = i18n.currentLang;
    const prompts = this.quickPrompts[lang] || this.quickPrompts.en;

    prompts.forEach(p => {
      const chip = document.createElement('button');
      chip.className = 'quick-chip';
      chip.textContent = p;
      chip.onclick = () => {
        const input = document.getElementById('aiChatInput');
        if (input) {
          input.value = p;
          this.sendMessage();
        }
      };
      container.appendChild(chip);
    });
  },

  sendMessage() {
    const input = document.getElementById('aiChatInput');
    if (!input) return;
    const text = input.value.trim();
    if (!text) return;

    this.renderBubble('user', text);
    input.value = '';

    // Typing indicator
    this.showTypingIndicator();

    setTimeout(() => {
      this.hideTypingIndicator();
      const response = this.generateResponse(text);
      this.renderBubble('bot', response);
    }, 600);
  },

  generateResponse(query) {
    const q = query.toLowerCase();
    const lang = i18n.currentLang;

    // Detect language or keywords
    const isPotholeRoad = q.includes('pothole') || q.includes('road') || q.includes('గుంత') || q.includes('రోడ్డు') || q.includes('सड़क') || q.includes('गड्ढा');
    const isUniv = q.includes('university') || q.includes('college') || q.includes('campus') || q.includes('hostel') || q.includes('విశ్వవిద్యాలయ') || q.includes('క్యాంపస్') || q.includes('హాస్టల్') || q.includes('विश्वविद्यालय') || q.includes('हॉस्टल');
    const isTrack = q.includes('track') || q.includes('status') || q.includes('స్థితి') || q.includes('ట్రాక్') || q.includes('स्टेटस') || q.includes('ट्रैक');
    const isAiRoute = q.includes('ai') || q.includes('officer') || q.includes('assign') || q.includes('అధికారి') || q.includes('ఎంపిక') || q.includes('अधिकारी');
    const isVoice = q.includes('voice') || q.includes('speak') || q.includes('మాట') || q.includes('వాయిస్') || q.includes('बोल');
    const isStartupInd = q.includes('startup') || q.includes('industry') || q.includes('pollution') || q.includes('స్టార్టప్') || q.includes('పరిశ్రమ') || q.includes('కాలుష్యం') || q.includes('उद्योग') || q.includes('प्रदूषण');

    if (isPotholeRoad) {
      if (lang === 'te') {
        return `రోడ్డు గుంతల సమస్యను నివేదించడానికి:\n1. 'సమస్యను నివేదించండి' క్లిక్ చేసి 'ప్రభుత్వం' విభాగాన్ని ఎంచుకోండి.\n2. గుంత ఫోటో అప్‌లోడ్ చేయండి.\n3. మైక్ బటన్ నొక్కి వివరాలు మాట్లాడండి.\nఇది స్వయంచాలకంగా పబ్లిక్ వర్క్స్ డిపార్ట్‌మెంట్ (PWD) ఇంజనీర్ Er. K. Venkata Rao గారికి కేటాయించబడుతుంది. పరిష్కార గడువు: 48 గంటలు.`;
      } else if (lang === 'hi') {
        return `सड़क या गड्ढे की समस्या दर्ज करने के लिए:\n1. 'समस्या रिपोर्ट करें' पर क्लिक कर 'सरकार' चुनें।\n2. गड्ढे की फोटो लगाएं।\n3. माइक दबाकर विवरण बोलें।\nयह सीधे PWD अधिशासी अभियंता Er. K. Venkata Rao को सौंपा जाएगा। लक्ष्य समाधान: 48 घंटे।`;
      } else {
        return `To report a road or pothole issue:\n1. Click 'Report a Problem' and select 'Government'.\n2. Upload a photo of the road damage.\n3. Type or click the microphone to speak.\nOur AI directly dispatches this to Er. K. Venkata Rao, Superintending Engineer (PWD). Target SLA: 48 Hours.`;
      }
    }

    if (isUniv) {
      if (lang === 'te') {
        return `విశ్వవిద్యాలయ సమస్యలు (హాస్టల్, ల్యాబ్స్, తాగునీరు, ర్యాగింగ్):\n'విశ్వవిద్యాలయాలు' విభాగాన్ని ఎంచుకోండి. ఇది క్యాంపస్ ఎస్టేట్ ఆఫీసర్ ప్రొఫెసర్ టి. రామచంద్ర మరియు డీన్ ఆఫ్ స్టూడెంట్ అఫైర్స్ గారికి నేరుగా చేరుతుంది. అత్యవసర సమస్యలు 6-12 గంటల్లో పరిష్కరించబడతాయి.`;
      } else if (lang === 'hi') {
        return `विश्वविद्यालय परिसर (हॉस्टल, मेस, क्लासरूम या रैगिंग) की समस्याओं के लिए:\n'विश्वविद्यालय' सेक्टर चुनें। यह सीधे छात्र कल्याण अधिष्ठाता (डीन) प्रो. वी. नारायण मूर्ति और मुख्य अभियंता को भेजा जाता है।`;
      } else {
        return `For University & College grievances (Hostels, Labs, Mess, Student safety):\nSelect the 'Universities' sector. Your issue is assigned directly to Prof. T. Ramachandra (Campus Chief Estate Officer) or the Dean of Student Affairs. Priority SLA is 6 to 24 Hours.`;
      }
    }

    if (isTrack) {
      if (lang === 'te') {
        return `మీ ఫిర్యాదు స్థితిని తనిఖీ చేయడానికి:\nపై మెనూలోని 'నా ఫిర్యాదులు' లేదా 'ఫిర్యాదుల ట్రాకింగ్' క్లిక్ చేయండి. అక్కడ అధికారి పేరు, చేపట్టిన చర్యలు మరియు లైవ్ పురోగతి కనిపిస్తుంది.`;
      } else if (lang === 'hi') {
        return `अपनी शिकायत का स्टेटस देखने के लिए ऊपर नेवबार में 'मेरी शिकायतें' या 'शिकायत ट्रैक करें' पर क्लिक करें। आपको अधिकारी की जानकारी और कार्रवाई की पूरी समयसीमा दिखाई देगी।`;
      } else {
        return `To track complaints:\nClick 'My Complaints' or 'Track Complaints' in the top navbar. You will see real-time timeline milestones, assigned officer details, and resolution proofs.`;
      }
    }

    if (isVoice) {
      if (lang === 'te') {
        return `వాయిస్ ఫీచర్ ఉపయోగించడం చాలా సులభం!\nఫిర్యాదు ఫారమ్‌లో నీలిరంగు మైక్రోఫోన్ బటన్ నొక్కి తెలుగులో మాట్లాడండి. మీ మాటలు స్వయంచాలకంగా అక్షరాల రూపంలో టైప్ అవుతాయి.`;
      } else if (lang === 'hi') {
        return `वॉयस इनपुट बहुत आसान है!\nशिकायत फॉर्म में माइक बटन पर क्लिक करें और हिंदी में बोलें। आपकी आवाज तुरंत टेक्स्ट में बदल जाएगी।`;
      } else {
        return `Voice reporting is powered by multilingual speech recognition. Click the microphone button and speak in English, Telugu, or Hindi. It automatically transcribes your voice into the description box!`;
      }
    }

    if (isStartupInd) {
      if (lang === 'te') {
        return `స్టార్టప్‌లు & పరిశ్రమల విభాగాలు:\n- స్టార్టప్ సమస్యలు (ఫైబర్ ఇంటర్నెట్, స్పేస్, అనుమతులు) రాష్ట్ర ఇన్నోవేషన్ డైరెక్టర్‌కు చేరతాయి.\n- పారిశ్రామిక కాలుష్యం & భద్రతా సమస్యలు కాలుష్య నియంత్రణ మండలి (SPCB) మరియు ఫ్యాక్టరీ ఇన్‌స్పెక్టర్‌కు కేటాయించబడతాయి.`;
      } else if (lang === 'hi') {
        return `स्टार्टअप एवं उद्योग क्षेत्र:\n- स्टार्टअप्स के लिए इंटरनेट, बिजली या लाइसेंस संबंधी शिकायतें राज्य नवाचार निदेशक को जाती हैं।\n- औद्योगिक प्रदूषण व सुरक्षा शिकायतें प्रदूषण नियंत्रण बोर्ड और कारखाना निरीक्षक को सौंपी जाती हैं।`;
      } else {
        return `For Startups & Industries:\n- Startup issues (fiber internet, incubation space, clearances) route to the State Innovation Director.\n- Industrial pollution, chemical hazards, and factory safety route directly to the Pollution Control Board (SPCB) & Chief Inspector of Factories.`;
      }
    }

    if (isAiRoute) {
      if (lang === 'te') {
        return `సివిక్ కనెక్ట్ AI ఎలా పనిచేస్తుంది:\nమా కృత్రిమ మేధస్సు మీరు అందించిన ఫోటో మరియు వివరణను విశ్లేషించి, అధికార పరిధిలోని సరైన శాఖను మరియు సంబంధిత అధికారిని సెకన్లలో ఎంపిక చేస్తుంది. దీనివల్ల ఫైళ్లు ఆలస్యం కాకుండా తక్షణమే స్పందన లభిస్తుంది.`;
      } else if (lang === 'hi') {
        return `सिविक कनेक्ट AI कैसे काम करता है:\nहमारा AI आपके द्वारा दी गई फोटो और विवरण का विश्लेषण कर संबंधित विभाग और सक्षम अधिकारी को तुरंत शिकायत सौंपता है। इससे सरकारी दफ्तरों के चक्कर नहीं लगाने पड़ते।`;
      } else {
        return `How CivicConnect AI Works:\nOur AI scans keywords, problem severity, and visual context to automatically route your complaint to the specific designated authority (with their official phone, email, and designated SLA) without bureaucratic delays.`;
      }
    }

    // Generic fallback in current language
    if (lang === 'te') {
      return `నేను మీకు ఎలా సహాయపడగలను? మీరు 'రోడ్డు సమస్య', 'హాస్టల్ సమస్య', 'స్టేటస్ ట్రాకింగ్' లేదా 'అధికారి వివరాలు' గురించి అడగవచ్చు.`;
    } else if (lang === 'hi') {
      return `मैं आपकी किस प्रकार सहायता कर सकता हूं? आप 'सड़क समस्या', 'हॉस्टल समस्या', 'स्टेटस चेक' या 'अधिकारी की जानकारी' पूछ सकते हैं।`;
    } else {
      return `I am here to assist you! You can ask about reporting road issues, university hostels, checking complaint status, or how AI routing assigns officers.`;
    }
  },

  renderBubble(sender, text) {
    const container = document.getElementById('aiChatMessages');
    if (!container) return;

    const bubble = document.createElement('div');
    bubble.className = `ai-chat-bubble ai-bubble-${sender}`;

    if (sender === 'bot') {
      bubble.innerHTML = `
        <div class="bot-avatar">
          <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
        </div>
        <div class="bubble-content whitespace-pre-line">${text}</div>
      `;
    } else {
      bubble.innerHTML = `
        <div class="bubble-content">${text}</div>
      `;
    }

    container.appendChild(bubble);
    container.scrollTop = container.scrollHeight;
  },

  showTypingIndicator() {
    const container = document.getElementById('aiChatMessages');
    if (!container) return;

    const ind = document.createElement('div');
    ind.id = 'aiTypingIndicator';
    ind.className = 'ai-chat-bubble ai-bubble-bot';
    ind.innerHTML = `
      <div class="bot-avatar">
        <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
      </div>
      <div class="typing-dots">
        <span></span><span></span><span></span>
      </div>
    `;
    container.appendChild(ind);
    container.scrollTop = container.scrollHeight;
  },

  hideTypingIndicator() {
    const ind = document.getElementById('aiTypingIndicator');
    if (ind) ind.remove();
  }
};

window.aiAssistant = aiAssistant;
