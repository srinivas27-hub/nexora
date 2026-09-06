// CivicConnect - Citizen Authentication & OTP Verification Module

const auth = {
  currentUser: null,
  pendingOtp: null,
  pendingUserData: null,
  otpTimer: null,
  timerSeconds: 30,

  init() {
    const saved = localStorage.getItem('civic_user');
    if (saved) {
      try {
        this.currentUser = JSON.parse(saved);
      } catch (e) {
        this.currentUser = null;
      }
    }
    this.updateUserUI();
  },

  isLoggedIn() {
    return !!this.currentUser;
  },

  getUser() {
    return this.currentUser;
  },

  sendOtp(name, phone, age) {
    if (!name || name.trim().length < 2) {
      alert(i18n.currentLang === 'te' ? "దయచేసి సరైన పేరును నమోదు చేయండి." :
            i18n.currentLang === 'hi' ? "कृपया मान्य नाम दर्ज करें।" :
            "Please enter a valid full name.");
      return false;
    }

    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      alert(i18n.currentLang === 'te' ? "దయచేసి 10 అంకెల మొబైల్ సంఖ్యను నమోదు చేయండి." :
            i18n.currentLang === 'hi' ? "कृपया 10 अंकों का मोबाइल नंबर दर्ज करें।" :
            "Please enter a valid 10-digit mobile number.");
      return false;
    }

    const numAge = parseInt(age, 10);
    if (!numAge || numAge < 12 || numAge > 110) {
      alert(i18n.currentLang === 'te' ? "దయచేసి సరైన వయస్సు నమోదు చేయండి (12+)." :
            i18n.currentLang === 'hi' ? "कृपया मान्य आयु दर्ज करें (12+)।" :
            "Please enter a valid age (12+).");
      return false;
    }

    // Generate random 6-digit OTP
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    this.pendingOtp = generatedOtp;
    this.pendingUserData = {
      name: name.trim(),
      phone: cleanPhone,
      age: numAge,
      loggedInAt: new Date().toISOString()
    };

    // Show OTP input section in modal
    const otpSection = document.getElementById('otpInputSection');
    const sendOtpBtn = document.getElementById('btnSendOtp');
    const otpPhoneDisplay = document.getElementById('otpPhoneDisplay');
    
    if (otpSection) otpSection.style.display = 'block';
    if (sendOtpBtn) sendOtpBtn.style.display = 'none';
    if (otpPhoneDisplay) otpPhoneDisplay.textContent = `+91 ${cleanPhone.slice(0, 5)} ${cleanPhone.slice(5)}`;

    // Show instant toast notification with the OTP code
    this.showOtpNotification(generatedOtp, cleanPhone);
    this.startResendTimer();
    return true;
  },

  startResendTimer() {
    this.timerSeconds = 30;
    const resendBtn = document.getElementById('btnResendOtp');
    const timerSpan = document.getElementById('otpTimerText');
    if (!resendBtn || !timerSpan) return;

    resendBtn.disabled = true;
    resendBtn.classList.add('opacity-50', 'cursor-not-allowed');

    clearInterval(this.otpTimer);
    this.otpTimer = setInterval(() => {
      this.timerSeconds--;
      timerSpan.textContent = `(${this.timerSeconds}s)`;
      if (this.timerSeconds <= 0) {
        clearInterval(this.otpTimer);
        resendBtn.disabled = false;
        resendBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        timerSpan.textContent = '';
      }
    }, 1000);
  },

  verifyOtp(enteredOtp) {
    if (!this.pendingOtp) {
      alert("Please request an OTP first.");
      return false;
    }

    if (enteredOtp.trim() !== this.pendingOtp) {
      alert(i18n.currentLang === 'te' ? "తప్పు OTP. దయచేసి మళ్లీ ప్రయత్నించండి." :
            i18n.currentLang === 'hi' ? "गलत OTP. कृपया पुनः प्रयास करें।" :
            "Incorrect OTP. Please check the simulated SMS alert and try again.");
      return false;
    }

    // Success! Save user
    this.currentUser = { ...this.pendingUserData };
    localStorage.setItem('civic_user', JSON.stringify(this.currentUser));
    this.pendingOtp = null;
    this.pendingUserData = null;
    clearInterval(this.otpTimer);

    this.updateUserUI();
    this.showLoginToast(this.currentUser.name);

    // Close login modal
    const loginModal = document.getElementById('loginModal');
    if (loginModal) loginModal.classList.remove('active');

    return true;
  },

  logout() {
    this.currentUser = null;
    localStorage.removeItem('civic_user');
    this.updateUserUI();
    
    // Show toast
    const msg = i18n.currentLang === 'te' ? "లాగ్ అవుట్ విజయవంతమైంది." :
                i18n.currentLang === 'hi' ? "सफलतापूर्वक लॉगआउट हुए।" :
                "You have been logged out.";
    alert(msg);
  },

  updateUserUI() {
    const loginBtn = document.getElementById('navLoginBtn');
    const userProfileBadge = document.getElementById('userProfileBadge');
    const citizenNameSpan = document.getElementById('citizenNameSpan');
    const citizenPhoneSpan = document.getElementById('citizenPhoneSpan');

    if (this.currentUser) {
      if (loginBtn) loginBtn.style.display = 'none';
      if (userProfileBadge) {
        userProfileBadge.style.display = 'flex';
        if (citizenNameSpan) citizenNameSpan.textContent = this.currentUser.name;
        if (citizenPhoneSpan) citizenPhoneSpan.textContent = `+91 ${this.currentUser.phone.slice(-4)}`;
      }
    } else {
      if (loginBtn) loginBtn.style.display = 'flex';
      if (userProfileBadge) userProfileBadge.style.display = 'none';
    }
  },

  showOtpNotification(otp, phone) {
    let toast = document.getElementById('smsOtpToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'smsOtpToast';
      toast.className = 'sms-toast';
      document.body.appendChild(toast);
    }

    toast.innerHTML = `
      <div class="sms-toast-inner">
        <div class="sms-toast-header">
          <div class="sms-toast-sender">
            <span class="sms-badge">GOV-CIVIC</span>
            <span>SMS Verification Service</span>
          </div>
          <button class="sms-close" onclick="document.getElementById('smsOtpToast').classList.remove('show')">✕</button>
        </div>
        <div class="sms-toast-body">
          <p>Your CivicConnect citizen verification OTP is <strong>${otp}</strong> for mobile +91-${phone}. Valid for 10 minutes. Do not share this OTP.</p>
          <div class="sms-toast-actions">
            <button class="btn-copy-otp" onclick="auth.quickFill('${otp}')">
              <span>📋 Click to Auto-Fill <strong>${otp}</strong></span>
            </button>
          </div>
        </div>
      </div>
    `;

    setTimeout(() => toast.classList.add('show'), 100);
    // Auto hide after 15 seconds
    setTimeout(() => {
      if (toast) toast.classList.remove('show');
    }, 15000);
  },

  quickFill(otp) {
    const input = document.getElementById('inputOtp');
    if (input) {
      input.value = otp;
      input.classList.add('border-green-500', 'bg-green-50');
      setTimeout(() => input.classList.remove('bg-green-50'), 1000);
    }
    const toast = document.getElementById('smsOtpToast');
    if (toast) toast.classList.remove('show');
  },

  showLoginToast(name) {
    const welcome = i18n.currentLang === 'te' ? `స్వాగతం, ${name} గారు! ధృవీకరణ పూర్తయింది.` :
                    i18n.currentLang === 'hi' ? `स्वागत है, ${name}! सत्यापन पूर्ण हुआ।` :
                    `Welcome, ${name}! Identity verified successfully.`;
    
    let toast = document.createElement('div');
    toast.className = 'login-success-toast';
    toast.innerHTML = `<span>✓ ${welcome}</span>`;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 100);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    }, 3500);
  }
};

window.auth = auth;
