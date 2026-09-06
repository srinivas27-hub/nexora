// CivicConnect - Grievance Store, Status Tracking & Statistics Engine

const complaintsStore = {
  // Base numbers matching screenshot
  baseReported: 2540,
  baseResolved: 1860,
  activeAreas: 18,

  // Initial seed complaints matching screenshot
  complaints: [
    {
      id: "CC-2025-0104",
      sectorId: "government",
      title: "Pothole",
      priority: "High",
      location: "MG Road, Sector 4",
      timestamp: "2 mins ago",
      createdAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
      status: "In Progress", // High Priority
      description: "Severe pothole near MG Road intersection causing bike skid hazard.",
      assignedOfficer: "Er. K. Venkata Rao",
      officerDesignation: "Superintending Engineer (PWD)",
      department: "Public Works Department (Roads & Bridges)",
      phone: "+91 8816 234101",
      sla: "48 Hours",
      imageUrl: "assets/samples/pothole.jpg",
      timeline: [
        { status: "Submitted", time: "2 mins ago", note: "Complaint filed by citizen with photo." },
        { status: "AI Classified", time: "2 mins ago", note: "AI categorized as High Priority PWD Road Hazard." },
        { status: "Assigned to Officer", time: "1 min ago", note: "Dispatched to Er. K. Venkata Rao, Superintending Engineer." },
        { status: "In Progress", time: "Just now", note: "Road maintenance crew dispatched with asphalt mixer." }
      ]
    },
    {
      id: "CC-2025-0103",
      sectorId: "government",
      title: "Garbage Overflow",
      priority: "Medium",
      location: "Park Street, Sector 2",
      timestamp: "10 mins ago",
      createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
      status: "Assigned to Officer",
      description: "Community waste bin overflowing for 3 days, foul odor and health hazard.",
      assignedOfficer: "Smt. P. Lakshmi Devi",
      officerDesignation: "Municipal Health & Sanitation Officer",
      department: "Municipal Sanitation & Waste Management",
      phone: "+91 8816 234102",
      sla: "24 Hours",
      imageUrl: "assets/samples/garbage.jpg",
      timeline: [
        { status: "Submitted", time: "10 mins ago", note: "Complaint received with GPS geotag." },
        { status: "AI Classified", time: "9 mins ago", note: "AI flagged priority: Medium Sanitation Task." },
        { status: "Assigned to Officer", time: "8 mins ago", note: "Assigned to Smt. P. Lakshmi Devi, Sanitation Inspector." }
      ]
    },
    {
      id: "CC-2025-0102",
      sectorId: "government",
      title: "Street Light Not Working",
      priority: "Resolved",
      location: "Lake Road, Sector 7",
      timestamp: "30 mins ago",
      createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      status: "Resolved",
      description: "3 consecutive street lights dark from pole #14 to #16.",
      assignedOfficer: "Er. M. Suresh Babu",
      officerDesignation: "Divisional Electrical Engineer",
      department: "Urban Electrical & Street Lighting Wing",
      phone: "+91 8816 234104",
      sla: "24 Hours",
      imageUrl: "assets/samples/streetlight.jpg",
      resolvedImageUrl: "assets/samples/streetlight_fixed.jpg",
      timeline: [
        { status: "Submitted", time: "30 mins ago", note: "Reported by resident." },
        { status: "AI Classified", time: "28 mins ago", note: "Classified under Electrical Works." },
        { status: "Assigned to Officer", time: "25 mins ago", note: "Work order sent to Er. M. Suresh Babu." },
        { status: "In Progress", time: "15 mins ago", note: "Linesman replaced burned LED driver." },
        { status: "Resolved", time: "Just now", note: "Verified restored and illuminated. Citizen rated 5/5." }
      ]
    },
    {
      id: "CC-2025-0098",
      sectorId: "universities",
      title: "Campus Water Pipeline Leak",
      priority: "High",
      location: "Hostel Block 3, North Lawn",
      timestamp: "1 hour ago",
      createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
      status: "In Progress",
      description: "Main overhead supply pipe leaking heavily near hostel dining hall.",
      assignedOfficer: "Prof. T. Ramachandra",
      officerDesignation: "Chief Campus Estate Officer",
      department: "Campus Infrastructure & Estate Maintenance",
      phone: "+91 8816 250201",
      sla: "24 Hours",
      imageUrl: "assets/samples/campus_water.jpg",
      timeline: [
        { status: "Submitted", time: "1 hour ago", note: "Submitted by student council rep." },
        { status: "AI Classified", time: "55 mins ago", note: "AI identified campus plumbing outage." },
        { status: "Assigned to Officer", time: "50 mins ago", note: "Assigned to Prof. T. Ramachandra." },
        { status: "In Progress", time: "20 mins ago", note: "Plumbing maintenance team isolating valve." }
      ]
    }
  ],

  init() {
    const saved = localStorage.getItem('civic_user_complaints');
    if (saved) {
      try {
        const userComplaints = JSON.parse(saved);
        this.complaints = [...userComplaints, ...this.complaints];
      } catch (e) {
        console.error("Error loading user complaints:", e);
      }
    }
    this.updateStatsDOM();
    this.renderLiveIssuesDOM();
  },

  addComplaint(data) {
    const newComplaint = {
      id: data.ticketId,
      sectorId: data.sectorId,
      title: data.title || (data.description.length > 30 ? data.description.substring(0, 30) + "..." : data.description),
      priority: data.priority,
      location: data.location || "City Jurisdiction",
      timestamp: "Just now",
      createdAt: new Date().toISOString(),
      status: "Assigned to Officer",
      description: data.description,
      assignedOfficer: data.assignedOfficer,
      officerDesignation: data.officerDesignation,
      department: data.departmentName,
      phone: data.officerContact,
      email: data.officerEmail,
      sla: data.slaHours,
      imageUrl: data.imageUrl || "assets/samples/generic_issue.jpg",
      citizenName: auth.getUser() ? auth.getUser().name : "Citizen",
      citizenPhone: auth.getUser() ? auth.getUser().phone : "",
      timeline: [
        { status: "Submitted", time: "Just now", note: "Grievance received via CivicConnect portal." },
        { status: "AI Classified", time: "Just now", note: `AI categorized urgency as ${data.priority} & determined department jurisdiction.` },
        { status: "Assigned to Officer", time: "Just now", note: `Directly assigned to ${data.assignedOfficer} (${data.officerDesignation}). Target SLA: ${data.slaHours}.` }
      ]
    };

    this.complaints.unshift(newComplaint);

    // Save to user storage
    const userComplaints = JSON.parse(localStorage.getItem('civic_user_complaints') || '[]');
    userComplaints.unshift(newComplaint);
    localStorage.setItem('civic_user_complaints', JSON.stringify(userComplaints));

    // Update stats counter
    this.updateStatsDOM();
    this.renderLiveIssuesDOM();
    return newComplaint;
  },

  advanceStatus(complaintId) {
    const item = this.complaints.find(c => c.id === complaintId);
    if (!item) return null;

    if (item.status === 'Submitted') {
      item.status = 'Assigned to Officer';
      item.timeline.push({
        status: 'Assigned to Officer',
        time: 'Just now',
        note: `Dispatched to ${item.assignedOfficer}`
      });
    } else if (item.status === 'Assigned to Officer') {
      item.status = 'In Progress';
      item.timeline.push({
        status: 'In Progress',
        time: 'Just now',
        note: `Field team deployed on-site by ${item.assignedOfficer}`
      });
    } else if (item.status === 'In Progress') {
      item.status = 'Resolved';
      item.priority = 'Resolved';
      item.timeline.push({
        status: 'Resolved',
        time: 'Just now',
        note: 'Rectification complete, verified by field officer and citizen sign-off.'
      });
    }

    // Persist changes
    const userComplaints = this.complaints.filter(c => c.id.startsWith('CC-2025-'));
    localStorage.setItem('civic_user_complaints', JSON.stringify(userComplaints));
    
    this.updateStatsDOM();
    this.renderLiveIssuesDOM();
    return item;
  },

  getAll() {
    return this.complaints;
  },

  getById(id) {
    return this.complaints.find(c => c.id === id);
  },

  getStats() {
    const totalReported = this.baseReported + this.complaints.length - 4; // adjusted for seed items
    const userResolved = this.complaints.filter(c => c.status === 'Resolved').length;
    const totalResolved = this.baseResolved + (userResolved > 1 ? userResolved - 1 : 0);
    const rate = Math.round((totalResolved / totalReported) * 100);

    return {
      reported: totalReported.toLocaleString(),
      resolved: totalResolved.toLocaleString(),
      rate: `${rate}%`,
      areas: this.activeAreas
    };
  },

  updateStatsDOM() {
    const stats = this.getStats();
    const repEl = document.getElementById('statProblemsReported');
    const resEl = document.getElementById('statIssuesResolved');
    const rateEl = document.getElementById('statResolutionRate');
    const areaEl = document.getElementById('statActiveAreas');

    if (repEl) repEl.textContent = stats.reported;
    if (resEl) resEl.textContent = stats.resolved;
    if (rateEl) rateEl.textContent = stats.rate;
    if (areaEl) areaEl.textContent = stats.areas;
  },

  renderLiveIssuesDOM() {
    const container = document.getElementById('liveIssuesList');
    if (!container) return;

    container.innerHTML = '';
    const recent = this.complaints.slice(0, 3);

    recent.forEach(c => {
      const priorityClass = c.priority === 'High' ? 'badge-high' :
                            c.priority === 'Resolved' ? 'badge-resolved' : 'badge-med';

      const localizedStatus = c.status === 'Resolved' ? i18n.get('statusResolved') :
                             c.priority === 'High' ? (i18n.currentLang === 'te' ? 'అత్యవసరం' : i18n.currentLang === 'hi' ? 'उच्च प्राथमिकता' : 'High Priority') :
                             (i18n.currentLang === 'te' ? 'మధ్యస్థం' : i18n.currentLang === 'hi' ? 'मध्यम प्राथमिकता' : 'Medium Priority');

      const el = document.createElement('div');
      el.className = 'live-issue-card cursor-pointer';
      el.onclick = () => window.app.showTrackModal(c.id);

      el.innerHTML = `
        <div class="live-issue-thumb">
          <img src="${c.imageUrl}" alt="${c.title}" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'56\\' height=\\'56\\' fill=\\'%23cbd5e1\\'><rect width=\\'100%\\' height=\\'100%\\'/></svg>'">
        </div>
        <div class="live-issue-info">
          <div class="live-issue-header">
            <span class="live-issue-title">${c.title}</span>
            <span class="live-issue-bullet">•</span>
            <span class="live-issue-tag ${priorityClass}">${localizedStatus}</span>
          </div>
          <div class="live-issue-sub">
            <span class="live-issue-location">${c.location}</span>
            <span class="live-issue-time">${c.timestamp}</span>
          </div>
        </div>
      `;
      container.appendChild(el);
    });
  }
};

window.complaintsStore = complaintsStore;
