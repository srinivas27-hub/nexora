// CivicConnect - Multilingual Voice Speech-to-Text Module
// Supports Telugu ('te-IN'), Hindi ('hi-IN'), and English ('en-IN'/'en-US')

const voiceRecognition = {
  recognition: null,
  isListening: false,
  targetTextareaId: 'problemDescription',
  transcript: '',

  init() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.maxAlternatives = 1;

      this.recognition.onstart = () => {
        this.isListening = true;
        this.updateMicUI(true);
      };

      this.recognition.onresult = (event) => {
        let currentInterim = '';
        let finalChunk = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalChunk += event.results[i][0].transcript + ' ';
          } else {
            currentInterim += event.results[i][0].transcript;
          }
        }

        const textarea = document.getElementById(this.targetTextareaId);
        if (textarea) {
          if (finalChunk) {
            textarea.value = (textarea.value + ' ' + finalChunk).trim();
          } else if (currentInterim) {
            const preview = document.getElementById('voiceInterimPreview');
            if (preview) preview.textContent = `"${currentInterim}"`;
          }
        }
      };

      this.recognition.onerror = (event) => {
        console.warn("Speech recognition error:", event.error);
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          this.showVoicePermissionFallback();
        }
        this.stop();
      };

      this.recognition.onend = () => {
        if (this.isListening) {
          // If stopped unintentionally, restart if still flagged as listening
          try {
            this.recognition.start();
          } catch (e) {
            this.isListening = false;
            this.updateMicUI(false);
          }
        } else {
          this.updateMicUI(false);
        }
      };
    } else {
      console.log("Speech recognition not natively supported by this browser. Simulation fallback active.");
    }
  },

  toggle(targetId = 'problemDescription') {
    this.targetTextareaId = targetId;
    if (this.isListening) {
      this.stop();
    } else {
      this.start();
    }
  },

  start() {
    const langCode = i18n.currentLang === 'te' ? 'te-IN' :
                     i18n.currentLang === 'hi' ? 'hi-IN' : 'en-IN';

    if (this.recognition) {
      this.recognition.lang = langCode;
      try {
        this.recognition.start();
        this.isListening = true;
        this.updateMicUI(true);
      } catch (e) {
        console.log("Speech start exception:", e);
        this.simulateVoiceDictation(langCode);
      }
    } else {
      this.simulateVoiceDictation(langCode);
    }
  },

  stop() {
    this.isListening = false;
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) {}
    }
    this.updateMicUI(false);
  },

  updateMicUI(active) {
    const micBtn = document.getElementById('btnVoiceInput');
    const statusText = document.getElementById('voiceStatusText');
    const waveContainer = document.getElementById('voiceWaveVisualizer');
    const interimPreview = document.getElementById('voiceInterimPreview');

    if (micBtn) {
      if (active) {
        micBtn.classList.add('mic-active');
        micBtn.innerHTML = `
          <span class="mic-pulse"></span>
          <svg class="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/><path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/></svg>
          <span data-i18n="stopListening">${i18n.get('stopListening')}</span>
        `;
        if (statusText) {
          statusText.style.display = 'flex';
          statusText.textContent = i18n.get('listeningState');
        }
        if (waveContainer) waveContainer.style.display = 'flex';
      } else {
        micBtn.classList.remove('mic-active');
        micBtn.innerHTML = `
          <svg class="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/><path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/></svg>
          <span data-i18n="btnSpeak">${i18n.get('btnSpeak')}</span>
        `;
        if (statusText) statusText.style.display = 'none';
        if (waveContainer) waveContainer.style.display = 'none';
        if (interimPreview) interimPreview.textContent = '';
      }
    }
  },

  simulateVoiceDictation(langCode) {
    this.isListening = true;
    this.updateMicUI(true);

    const samples = {
      'te-IN': [
        "మా వీధిలో ప్రధాన రోడ్డుపై పెద్ద గుంత ఏర్పడింది. రాత్రి వేళ ప్రమాదాలు జరుగుతున్నాయి.",
        "క్యాంపస్ హాస్టల్ బ్లాక్ 3 వద్ద నీటి సరఫరా పైపు లీక్ అవుతోంది. వెంటనే రిపేర్ చేయగలరు.",
        "గ్రామంలో గత రెండు రోజులుగా వీధి దీపాలు పనిచేయడం లేదు. చాలా చీకటిగా ఉంది."
      ],
      'hi-IN': [
        "मुख्य सड़क पर गहरा गड्ढा हो गया है, जिससे आने-जाने में भारी परेशानी हो रही है।",
        "विश्वविद्यालय हॉस्टल में पानी की पाइपलाइन में रिसाव हो रहा है। कृपया जल्द मरम्मत करें।",
        "हमारे सेक्टर 4 में कचरे का ढेर लगा है, तुरंत सफाई की आवश्यकता है।"
      ],
      'en-IN': [
        "There is a severe pothole near the main market junction causing severe traffic jams.",
        "Street lights in Sector 4 are not functioning for the last 3 days, causing safety concerns.",
        "Water pipeline burst near the university library campus, clean water is overflowing on the road."
      ]
    };

    const phrases = samples[langCode] || samples['en-IN'];
    const chosenPhrase = phrases[Math.floor(Math.random() * phrases.length)];

    let currentWordIndex = 0;
    const words = chosenPhrase.split(' ');
    const textarea = document.getElementById(this.targetTextareaId);

    const typingInterval = setInterval(() => {
      if (!this.isListening || currentWordIndex >= words.length) {
        clearInterval(typingInterval);
        this.stop();
        return;
      }
      if (textarea) {
        textarea.value = (textarea.value + ' ' + words[currentWordIndex]).trim();
      }
      currentWordIndex++;
    }, 450);
  },

  showVoicePermissionFallback() {
    alert(i18n.currentLang === 'te' ? 
      "మైక్రోఫోన్ అనుమతి అవసరం. దయచేసి బ్రౌజర్ సెట్టింగ్స్‌లో మైక్ పర్మిషన్ ఆన్ చేయండి." :
      i18n.currentLang === 'hi' ?
      "माइक्रोफोन अनुमति आवश्यक है। कृपया ब्राउज़र में माइक चालू करें।" :
      "Microphone access denied. You can still type your description or test with sample audio dictation.");
  }
};

window.voiceRecognition = voiceRecognition;
