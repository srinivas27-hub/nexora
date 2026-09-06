// CivicConnect - Main Application Controller

const app = {
  selectedSectorId: 'government',
  currentUploadedImage: null,

  init() {
    // 1. Initialize language
    const savedLang = localStorage.getItem('civic_lang');
    if (savedLang) {
      i18n.setLanguage(savedLang);
    } else {
      // Prompt language modal on initial visit
      this.openModal('langPreferenceModal');
    }

    // 2. Initialize modules
    auth.init();
    complaintsStore.init();
    voiceRecognition.init();
    aiAssistant.init();

    // 3. Render Sectors Grid
    this.renderSectorsGrid();

    // 4. Setup Event Listeners
    this.setupEventListeners();

    // 5. If user is not logged in and language was already set, prompt login after brief moment
    if (savedLang && !auth.isLoggedIn()) {
      setTimeout(() => {
        this.openModal('loginModal');
      }, 800);
    }
  },

  setupEventListeners() {
    // Top 3-dots menu toggle
    const dotsBtn = document.getElementById('threeDotsBtn');
    const dotsMenu = document.getElementById('threeDotsMenuDropdown');
    if (dotsBtn && dotsMenu) {
      dotsBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        dotsMenu.classList.toggle('show');
      });
      document.addEventListener('click', () => {
        dotsMenu.classList.remove('show');
      });
    }

    // Language selector in header
    const langBtn = document.getElementById('langDropdownBtn');
    const langMenu = document.getElementById('langDropdownMenu');
    if (langBtn && langMenu) {
      langBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        langMenu.classList.toggle('show');
      });
      document.addEventListener('click', () => {
        langMenu.classList.remove('show');
      });
    }

    // Image Upload Input
    const fileInput = document.getElementById('problemImageInput');
    if (fileInput) {
      fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            this.setProblemImage(event.target.result);
          };
          reader.readAsDataURL(file);
        }
      });
    }

    // Voice button
    const voiceBtn = document.getElementById('btnVoiceInput');
    if (voiceBtn) {
      voiceBtn.addEventListener('click', () => {
        voiceRecognition.toggle('problemDescription');
      });
    }

    // AI Chat input enter key
    const aiInput = document.getElementById('aiChatInput');
    if (aiInput) {
      aiInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          aiAssistant.sendMessage();
        }
      });
    }
  },

  renderSectorsGrid() {
    const container = document.getElementById('sectorsGridContainer');
    if (!container) return;

    container.innerHTML = '';
    const sectors = Object.values(SECTORS_DATA);

    sectors.forEach(sec => {
      const card = document.createElement('div');
      card.className = `sector-card ${sec.id === this.selectedSectorId ? 'selected' : ''}`;
      card.id = `sector-card-${sec.id}`;
      card.onclick = () => this.openReportForSector(sec.id);

      const title = sec.title[i18n.currentLang] || sec.title.en;
      const tagline = sec.tagline[i18n.currentLang] || sec.tagline.en;
      const officer = sec.departments[0].officer;
      const designation = sec.departments[0].designation;

      card.innerHTML = `
        <div class="sector-logo-wrapper" style="background-color: ${sec.bgColor}; border-color: ${sec.borderColor}">
          ${sec.logoSvg}
        </div>
        <div class="sector-content">
          <h3 class="sector-title">${title}</h3>
          <p class="sector-tagline">${tagline}</p>
          <div class="sector-officer-badge">
            <span class="officer-badge-icon">🏛️</span>
            <span class="officer-badge-text">${designation}: <strong>${officer}</strong></span>
          </div>
          <button class="btn-sector-action" style="background-color: ${sec.color}">
            <span>${i18n.get('btnSelectSector')}</span>
            <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
          </button>
        </div>
      `;
      container.appendChild(card);
    });
  },

  selectLanguage(lang) {
    i18n.setLanguage(lang);
    this.renderSectorsGrid();
    complaintsStore.renderLiveIssuesDOM();
    aiAssistant.appendWelcomeMessage();
    aiAssistant.renderQuickPrompts();
    this.closeModal('langPreferenceModal');

    // If user is not logged in, proceed to login prompt
    if (!auth.isLoggedIn()) {
      setTimeout(() => {
        this.openModal('loginModal');
      }, 400);
    }
  },

  openReportForSector(sectorId) {
    // Ensure citizen is authenticated
    if (!auth.isLoggedIn()) {
      alert(i18n.currentLang === 'te' ? "ఫిర్యాదు చేయడానికి దయచేసి ముందుగా OTP ద్వారా లాగిన్ అవ్వండి." :
            i18n.currentLang === 'hi' ? "शिकायत दर्ज करने के लिए कृपया पहले OTP से लॉगिन करें।" :
            "Please verify your identity with mobile OTP before submitting a complaint.");
      this.openModal('loginModal');
      return;
    }

    this.selectedSectorId = sectorId;
    const sec = SECTORS_DATA[sectorId] || SECTORS_DATA['government'];

    // Update modal elements
    const sectorDisplay = document.getElementById('reportSectorDisplay');
    if (sectorDisplay) {
      sectorDisplay.innerHTML = `
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 flex-shrink-0">${sec.logoSvg}</div>
          <div>
            <h4 class="font-bold text-gray-900">${sec.title[i18n.currentLang] || sec.title.en}</h4>
            <p class="text-xs text-gray-500">${sec.tagline[i18n.currentLang] || sec.tagline.en}</p>
          </div>
        </div>
      `;
    }

    // Set sample images matching sector
    this.renderSampleImagesForSector(sectorId);
    this.openModal('reportProblemModal');
  },

  renderSampleImagesForSector(sectorId) {
    const container = document.getElementById('sampleImagesContainer');
    if (!container) return;

    let samples = [];
    if (sectorId === 'government') {
      samples = [
        { label: "Pothole", url: "assets/samples/pothole.jpg" },
        { label: "Garbage Overflow", url: "assets/samples/garbage.jpg" },
        { label: "Dark Streetlight", url: "assets/samples/streetlight.jpg" }
      ];
    } else if (sectorId === 'universities') {
      samples = [
        { label: "Campus Leak", url: "assets/samples/campus_water.jpg" },
        { label: "Hostel Facility", url: "assets/samples/hostel.jpg" }
      ];
    } else if (sectorId === 'startups') {
      samples = [
        { label: "Fiber Outage", url: "assets/samples/fiber.jpg" },
        { label: "Incubation Power", url: "assets/samples/server.jpg" }
      ];
    } else {
      samples = [
        { label: "Factory Smoke", url: "assets/samples/smoke.jpg" },
        { label: "Industrial Waste", url: "assets/samples/industrial.jpg" }
      ];
    }

    container.innerHTML = '';
    samples.forEach(s => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'sample-thumb-btn';
      btn.innerHTML = `
        <img src="${s.url}" alt="${s.label}">
        <span>${s.label}</span>
      `;
      btn.onclick = () => this.setProblemImage(s.url);
      container.appendChild(btn);
    });
  },

  setProblemImage(url) {
    this.currentUploadedImage = url;
    const previewContainer = document.getElementById('imageUploadPreview');
    const previewImg = document.getElementById('previewUploadedImg');
    const uploadPrompt = document.getElementById('uploadDropArea');

    if (previewContainer && previewImg && uploadPrompt) {
      previewImg.src = url;
      previewContainer.style.display = 'block';
      uploadPrompt.style.display = 'none';
    }
  },

  removeProblemImage() {
    this.currentUploadedImage = null;
    const previewContainer = document.getElementById('imageUploadPreview');
    const uploadPrompt = document.getElementById('uploadDropArea');
    const fileInput = document.getElementById('problemImageInput');

    if (previewContainer && uploadPrompt) {
      previewContainer.style.display = 'none';
      uploadPrompt.style.display = 'flex';
    }
    if (fileInput) fileInput.value = '';
  },

  submitComplaintForm() {
    const descEl = document.getElementById('problemDescription');
    const locEl = document.getElementById('problemLocation');
    const urgEl = document.getElementById('problemUrgency');

    const desc = descEl ? descEl.value.trim() : '';
    const loc = locEl ? locEl.value.trim() : '';
    const urgency = urgEl ? urgEl.value : 'Medium';

    if (!desc || desc.length < 5) {
      alert(i18n.currentLang === 'te' ? "దయచేసి సమస్య వివరణను రాయండి లేదా మాట్లాడండి." :
            i18n.currentLang === 'hi' ? "कृपया समस्या का विवरण लिखें या बोलें।" :
            "Please describe the problem (either write or use the microphone to speak).");
      return;
    }

    // Show AI Routing Processing Animation
    const formContent = document.getElementById('reportFormContent');
    const aiLoader = document.getElementById('aiRoutingLoader');
    if (formContent && aiLoader) {
      formContent.style.display = 'none';
      aiLoader.style.display = 'flex';
    }

    setTimeout(() => {
      // 1. Run AI Routing Engine
      const routingResult = aiRouter.analyzeAndRoute(this.selectedSectorId, desc, urgency, loc);

      // 2. Add to Complaints Store
      const newComplaint = complaintsStore.addComplaint({
        ticketId: routingResult.ticketId,
        sectorId: this.selectedSectorId,
        description: desc,
        location: loc || "Main Ward Area",
        priority: routingResult.priority,
        assignedOfficer: routingResult.assignedOfficer,
        officerDesignation: routingResult.officerDesignation,
        departmentName: routingResult.departmentName,
        officerContact: routingResult.officerContact,
        officerEmail: routingResult.officerEmail,
        slaHours: routingResult.slaHours,
        imageUrl: this.currentUploadedImage || "assets/samples/generic_issue.jpg"
      });

      // Reset form & loader
      if (formContent && aiLoader) {
        formContent.style.display = 'block';
        aiLoader.style.display = 'none';
      }
      this.closeModal('reportProblemModal');
      if (descEl) descEl.value = '';
      if (locEl) locEl.value = '';
      this.removeProblemImage();

      // Show Success Modal with AI routing outcome
      this.showSuccessModal(newComplaint, routingResult);
    }, 1200);
  },

  showSuccessModal(complaint, routing) {
    const ticketIdSpan = document.getElementById('successTicketId');
    const assignedOfficerSpan = document.getElementById('successAssignedOfficer');
    const designationSpan = document.getElementById('successDesignation');
    const contactSpan = document.getElementById('successContact');
    const slaSpan = document.getElementById('successSla');
    const aiReasonSpan = document.getElementById('successAiReason');
    const trackBtn = document.getElementById('btnSuccessTrackNow');

    if (ticketIdSpan) ticketIdSpan.textContent = complaint.id;
    if (assignedOfficerSpan) assignedOfficerSpan.textContent = complaint.assignedOfficer;
    if (designationSpan) designationSpan.textContent = complaint.officerDesignation;
    if (contactSpan) contactSpan.textContent = `${complaint.phone} • ${complaint.email || ''}`;
    if (slaSpan) slaSpan.textContent = `${complaint.sla} (${routing.targetResolutionDate})`;
    if (aiReasonSpan) aiReasonSpan.textContent = routing.routingReason;

    if (trackBtn) {
      trackBtn.onclick = () => {
        this.closeModal('reportSuccessModal');
        this.showTrackModal(complaint.id);
      };
    }

    this.openModal('reportSuccessModal');
  },

  showTrackModal(complaintId) {
    const item = complaintsStore.getById(complaintId);
    if (!item) return;

    const modal = document.getElementById('trackComplaintModal');
    const titleEl = document.getElementById('trackTitle');
    const ticketEl = document.getElementById('trackTicketId');
    const statusBadge = document.getElementById('trackStatusBadge');
    const officerEl = document.getElementById('trackOfficer');
    const designationEl = document.getElementById('trackDesignation');
    const deptEl = document.getElementById('trackDept');
    const contactEl = document.getElementById('trackContact');
    const locationEl = document.getElementById('trackLocation');
    const descEl = document.getElementById('trackDescription');
    const imgEl = document.getElementById('trackImage');
    const timelineEl = document.getElementById('trackTimelineList');
    const advanceBtn = document.getElementById('btnAdvanceStatus');

    if (titleEl) titleEl.textContent = item.title;
    if (ticketEl) ticketEl.textContent = item.id;
    if (statusBadge) {
      statusBadge.textContent = item.status;
      statusBadge.className = `status-pill status-${item.status.toLowerCase().replace(/\s+/g, '-')}`;
    }
    if (officerEl) officerEl.textContent = item.assignedOfficer;
    if (designationEl) designationEl.textContent = item.officerDesignation;
    if (deptEl) deptEl.textContent = item.department;
    if (contactEl) contactEl.textContent = `${item.phone} | SLA: ${item.sla}`;
    if (locationEl) locationEl.textContent = item.location;
    if (descEl) descEl.textContent = item.description;
    if (imgEl) imgEl.src = item.imageUrl;

    if (timelineEl) {
      timelineEl.innerHTML = '';
      item.timeline.forEach((t, idx) => {
        const isLatest = idx === item.timeline.length - 1;
        const li = document.createElement('li');
        li.className = `timeline-item ${isLatest ? 'current' : 'completed'}`;
        li.innerHTML = `
          <div class="timeline-dot"></div>
          <div class="timeline-content">
            <div class="timeline-heading">
              <span class="timeline-status">${t.status}</span>
              <span class="timeline-time">${t.time}</span>
            </div>
            <p class="timeline-note">${t.note}</p>
          </div>
        `;
        timelineEl.appendChild(li);
      });
    }

    if (advanceBtn) {
      if (item.status === 'Resolved') {
        advanceBtn.style.display = 'none';
      } else {
        advanceBtn.style.display = 'block';
        advanceBtn.onclick = () => {
          complaintsStore.advanceStatus(item.id);
          this.showTrackModal(item.id);
        };
      }
    }

    this.openModal('trackComplaintModal');
  },

  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  },

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = 'auto';
    }
    // Stop voice if listening
    if (voiceRecognition.isListening) {
      voiceRecognition.stop();
    }
  },

  scrollToSection(sectionId) {
    const sec = document.getElementById(sectionId);
    if (sec) {
      sec.scrollIntoView({ behavior: 'smooth' });
    }
  },

  showMyComplaints() {
    if (!auth.isLoggedIn()) {
      alert("Please log in with OTP to view your complaints.");
      this.openModal('loginModal');
      return;
    }

    const all = complaintsStore.getAll();
    if (all.length > 0) {
      this.showTrackModal(all[0].id);
    } else {
      alert("No complaints submitted yet. Click 'Report a Problem' to file your first civic grievance.");
    }
  }
};

window.app = app;

document.addEventListener('DOMContentLoaded', () => {
  app.init();
});
