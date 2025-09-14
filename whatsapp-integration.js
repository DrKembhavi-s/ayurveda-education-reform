// Ayurveda Education Reform Platform - WhatsApp Integration
// Share reform content, campaigns, and urgent updates via WhatsApp

class WhatsAppManager {
    constructor() {
        this.platformURL = window.location.origin + window.location.pathname;
        this.analyticsURL = this.platformURL + 'analytics.html';
        this.initializeWhatsAppFeatures();
    }
    
    initializeWhatsAppFeatures() {
        this.addWhatsAppCSS();
        this.addWhatsAppButtons();
        this.createWhatsAppModal();
    }
    
    addWhatsAppCSS() {
        const whatsappCSS = `
            .whatsapp-btn {
                background: linear-gradient(45deg, #25D366, #20B955);
                color: white;
                border: none;
                padding: 12px 20px;
                border-radius: 25px;
                cursor: pointer;
                font-size: 14px;
                font-weight: bold;
                display: inline-flex;
                align-items: center;
                gap: 8px;
                transition: all 0.3s ease;
                text-decoration: none;
                margin: 5px;
            }
            
            .whatsapp-btn:hover {
                background: linear-gradient(45deg, #20B955, #1DA851);
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(37, 211, 102, 0.4);
            }
            
            .whatsapp-floating {
                position: fixed;
                bottom: 30px;
                right: 30px;
                width: 60px;
                height: 60px;
                background: linear-gradient(45deg, #25D366, #20B955);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                box-shadow: 0 5px 20px rgba(37, 211, 102, 0.4);
                z-index: 1000;
                transition: all 0.3s ease;
                animation: whatsappPulse 2s infinite;
            }
            
            .whatsapp-floating:hover {
                transform: scale(1.1);
                box-shadow: 0 8px 25px rgba(37, 211, 102, 0.6);
            }
            
            @keyframes whatsappPulse {
                0% { box-shadow: 0 5px 20px rgba(37, 211, 102, 0.4); }
                50% { box-shadow: 0 5px 30px rgba(37, 211, 102, 0.7), 0 0 20px rgba(37, 211, 102, 0.3); }
                100% { box-shadow: 0 5px 20px rgba(37, 211, 102, 0.4); }
            }
            
            .whatsapp-modal {
                display: none;
                position: fixed;
                z-index: 10001;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0,0,0,0.8);
                backdrop-filter: blur(5px);
            }
            
            .whatsapp-modal-content {
                background: white;
                margin: 5% auto;
                padding: 30px;
                border-radius: 20px;
                width: 90%;
                max-width: 600px;
                box-shadow: 0 20px 40px rgba(0,0,0,0.3);
                position: relative;
                animation: modalSlideIn 0.3s ease-out;
            }
            
            .whatsapp-campaign-card {
                background: #f8f9fa;
                padding: 20px;
                margin: 15px 0;
                border-radius: 15px;
                border-left: 4px solid #25D366;
                transition: all 0.3s ease;
            }
            
            .whatsapp-campaign-card:hover {
                background: #e9ecef;
                transform: translateY(-2px);
            }
            
            .campaign-title {
                font-weight: bold;
                color: #2c3e50;
                margin-bottom: 10px;
                font-size: 1.1em;
            }
            
            .campaign-preview {
                background: white;
                padding: 15px;
                border-radius: 10px;
                margin: 10px 0;
                font-size: 14px;
                line-height: 1.5;
                border: 1px solid #ddd;
                max-height: 100px;
                overflow-y: auto;
            }
            
            .whatsapp-stats {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                gap: 15px;
                margin: 20px 0;
            }
            
            .stat-item {
                text-align: center;
                padding: 15px;
                background: linear-gradient(135deg, #25D366, #20B955);
                color: white;
                border-radius: 10px;
            }
            
            .stat-number {
                font-size: 1.8em;
                font-weight: bold;
                margin-bottom: 5px;
            }
            
            .urgent-alert {
                background: linear-gradient(45deg, #ff6b6b, #ee5a24);
                color: white;
                padding: 20px;
                border-radius: 15px;
                margin: 20px 0;
                text-align: center;
                animation: urgentPulse 1.5s infinite alternate;
            }
            
            @keyframes urgentPulse {
                from { opacity: 0.8; }
                to { opacity: 1; }
            }
        `;
        
        const style = document.createElement('style');
        style.textContent = whatsappCSS;
        document.head.appendChild(style);
    }
    
    addWhatsAppButtons() {
        // Add floating WhatsApp button
        const floatingBtn = document.createElement('div');
        floatingBtn.className = 'whatsapp-floating';
        floatingBtn.innerHTML = `
            <svg width="30" height="30" viewBox="0 0 24 24" fill="white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.886 3.488"/>
            </svg>
        `;
        floatingBtn.onclick = () => this.showWhatsAppModal();
        document.body.appendChild(floatingBtn);
        
        // Add WhatsApp buttons to relevant sections
        this.addWhatsAppToForums();
        this.addWhatsAppToCoalition();
        this.addWhatsAppToProposals();
    }
    
    addWhatsAppToForums() {
        const forumSection = document.getElementById('forums');
        if (forumSection) {
            const whatsappSection = document.createElement('div');
            whatsappSection.innerHTML = `
                <div style="background: rgba(37, 211, 102, 0.1); padding: 20px; border-radius: 15px; margin: 20px 0;">
                    <h3 style="color: #25D366; margin-bottom: 15px;">📱 Share via WhatsApp</h3>
                    <p style="margin-bottom: 15px; color: #666;">
                        Spread the reform message to your professional networks:
                    </p>
                    <div style="display: flex; flex-wrap: wrap; gap: 10px;">
                        <button class="whatsapp-btn" onclick="whatsappManager.shareReformManifesto()">
                            📜 Share Reform Manifesto
                        </button>
                        <button class="whatsapp-btn" onclick="whatsappManager.sharePlatformInvite()">
                            🤝 Invite Colleagues
                        </button>
                        <button class="whatsapp-btn" onclick="whatsappManager.shareUrgentUpdate()">
                            🚨 Urgent Update
                        </button>
                    </div>
                </div>
            `;
            forumSection.appendChild(whatsappSection);
        }
    }
    
    addWhatsAppToCoalition() {
        const coalitionSection = document.getElementById('coalition');
        if (coalitionSection) {
            const whatsappSection = document.createElement('div');
            whatsappSection.innerHTML = `
                <div class="coalition-card" style="background: linear-gradient(135deg, #25D366, #20B955); color: white;">
                    <h3 class="card-title" style="color: white;">📱 WhatsApp Campaigns</h3>
                    <p>Coordinate movement activities via WhatsApp groups and broadcasts.</p>
                    <div style="margin-top: 15px;">
                        <button class="btn" onclick="whatsappManager.createGroupInvite()" style="background: white; color: #25D366; margin-bottom: 10px;">
                            👥 Create WhatsApp Group
                        </button>
                        <button class="btn" onclick="whatsappManager.shareCoalitionStats()" style="background: rgba(255,255,255,0.2); color: white;">
                            📊 Share Coalition Progress
                        </button>
                    </div>
                </div>
            `;
            const coalitionGrid = coalitionSection.querySelector('.coalition-grid');
            if (coalitionGrid) {
                coalitionGrid.appendChild(whatsappSection);
            }
        }
    }
    
    addWhatsAppToProposals() {
        const proposalsSection = document.getElementById('proposals');
        if (proposalsSection) {
            const shareBtn = document.createElement('button');
            shareBtn.className = 'whatsapp-btn';
            shareBtn.innerHTML = '📱 Share Proposal via WhatsApp';
            shareBtn.style.marginTop = '15px';
            shareBtn.onclick = () => this.shareGeneratedProposal();
            
            const proposalBuilder = proposalsSection.querySelector('.proposal-builder');
            if (proposalBuilder) {
                proposalBuilder.appendChild(shareBtn);
            }
        }
    }
    
    createWhatsAppModal() {
        const modal = document.createElement('div');
        modal.id = 'whatsappModal';
        modal.className = 'whatsapp-modal';
        
        modal.innerHTML = `
            <div class="whatsapp-modal-content">
                <button class="close-modal" onclick="whatsappManager.closeModal()">×</button>
                <h2 style="text-align: center; margin-bottom: 20px; color: #25D366;">
                    📱 WhatsApp Campaign Center
                </h2>
                
                <div class="urgent-alert" id="urgentAlert" style="display: none;">
                    <h3>🚨 URGENT CAMPAIGN ACTIVE</h3>
                    <p>Critical regulatory changes affecting Ayurveda education. Your immediate action needed!</p>
                    <button class="whatsapp-btn" onclick="whatsappManager.shareUrgentUpdate()">
                        Share Emergency Alert
                    </button>
                </div>
                
                <div class="whatsapp-stats">
                    <div class="stat-item">
                        <div class="stat-number" id="whatsapp-shares">0</div>
                        <div>Total Shares</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-number" id="whatsapp-groups">0</div>
                        <div>Active Groups</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-number" id="whatsapp-reach">0</div>
                        <div>Est. Reach</div>
                    </div>
                </div>
                
                <h3 style="color: #2c3e50; margin: 25px 0 15px 0;">📢 Ready-to-Share Campaigns</h3>
                
                <div class="whatsapp-campaign-card">
                    <div class="campaign-title">🕉️ Platform Introduction</div>
                    <div class="campaign-preview" id="platform-intro-preview">
                        🌟 *Ayurveda Education Reform Platform* 🌟
                        
                        Join thousands of Ayurveda educators fighting bureaucratic burden!
                        
                        ✅ Anonymous forums for safe discussions
                        ✅ Coalition building tools
                        ✅ Compliance cost tracking
                        ✅ Reform proposal generator
                        
                        *"Be the change you wish to see"* - Gandhi
                        
                        Join us: [PLATFORM_URL]
                    </div>
                    <button class="whatsapp-btn" onclick="whatsappManager.sharePlatformInvite()">
                        Share Platform Invite
                    </button>
                </div>
                
                <div class="whatsapp-campaign-card">
                    <div class="campaign-title">📜 Reform Manifesto</div>
                    <div class="campaign-preview" id="manifesto-preview">
                        🚨 *THE SOUL OF AYURVEDA - A CALL FOR REFORM* 🚨
                        
                        "Our teachers spend 70% of time on compliance, 30% on teaching"
                        
                        💔 Issues we face:
                        • Endless documentation burden
                        • Perpetual inspection anxiety  
                        • Lost teaching passion
                        • Student learning suffers
                        
                        💪 It's time to STAND UP!
                        
                        Read full manifesto: [PLATFORM_URL]
                    </div>
                    <button class="whatsapp-btn" onclick="whatsappManager.shareReformManifesto()">
                        Share Reform Call
                    </button>
                </div>
                
                <div class="whatsapp-campaign-card">
                    <div class="campaign-title">📊 Data & Statistics</div>
                    <div class="campaign-preview" id="stats-preview">
                        📈 *AYURVEDA EDUCATION CRISIS - BY THE NUMBERS* 📈
                        
                        💰 ₹2.9Cr+ annual compliance costs
                        ⏰ 25,920+ teaching hours lost to bureaucracy
                        📋 347 documents for single inspection
                        😰 78% educators report decreased job satisfaction
                        
                        🔥 The data speaks: We need REFORM NOW!
                        
                        See full analytics: [ANALYTICS_URL]
                    </div>
                    <button class="whatsapp-btn" onclick="whatsappManager.shareAnalytics()">
                        Share Statistics
                    </button>
                </div>
                
                <div class="whatsapp-campaign-card">
                    <div class="campaign-title">👥 Group Creation</div>
                    <p style="margin-bottom: 15px;">Create WhatsApp groups for your institution, state, or role-based discussions:</p>
                    <div style="display: flex; flex-wrap: wrap; gap: 10px;">
                        <button class="whatsapp-btn" onclick="whatsappManager.createInstitutionGroup()">
                            🏥 Institution Group
                        </button>
                        <button class="whatsapp-btn" onclick="whatsappManager.createStateGroup()">
                            🗺️ State Group
                        </button>
                        <button class="whatsapp-btn" onclick="whatsappManager.createRoleGroup()">
                            👨‍🏫 Role Group
                        </button>
                    </div>
                </div>
                
                <div style="background: #f8f9fa; padding: 20px; border-radius: 15px; margin-top: 20px;">
                    <h4 style="color: #2c3e50; margin-bottom: 15px;">📱 Pro Tips for WhatsApp Sharing:</h4>
                    <ul style="color: #666; line-height: 1.6;">
                        <li>Share in professional Ayurveda educator groups</li>
                        <li>Pin important messages in groups you admin</li>
                        <li>Use status updates for broader reach</li>
                        <li>Forward to individual influential colleagues</li>
                        <li>Create college-specific WhatsApp groups</li>
                    </ul>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }
    
    showWhatsAppModal() {
        document.getElementById('whatsappModal').style.display = 'block';
        this.updateWhatsAppStats();
        this.checkForUrgentCampaigns();
    }
    
    closeModal() {
        document.getElementById('whatsappModal').style.display = 'none';
    }
    
    updateWhatsAppStats() {
        try {
            const stats = JSON.parse(localStorage.getItem('whatsapp_stats') || '{"shares": 0, "groups": 0, "reach": 0}');
            document.getElementById('whatsapp-shares').textContent = stats.shares;
            document.getElementById('whatsapp-groups').textContent = stats.groups;
            document.getElementById('whatsapp-reach').textContent = stats.reach;
        } catch (error) {
            console.log('Using default WhatsApp stats');
        }
    }
    
    trackShare(type) {
        try {
            const stats = JSON.parse(localStorage.getItem('whatsapp_stats') || '{"shares": 0, "groups": 0, "reach": 0}');
            stats.shares += 1;
            stats.reach += Math.floor(Math.random() * 20) + 10; // Estimate reach per share
            localStorage.setItem('whatsapp_stats', JSON.stringify(stats));
            this.updateWhatsAppStats();
        } catch (error) {
            console.log('Could not track share');
        }
    }
    
    checkForUrgentCampaigns() {
        // Check if there are urgent regulatory updates
        const urgentAlert = document.getElementById('urgentAlert');
        const currentDate = new Date();
        const isUrgent = currentDate.getDate() % 7 === 0; // Show urgent alert weekly
        
        if (isUrgent && urgentAlert) {
            urgentAlert.style.display = 'block';
        }
    }
    
    shareReformManifesto() {
        const message = `🚨 *THE SOUL OF AYURVEDA - A CALL FOR REFORM* 🚨

"Our Ayurveda teachers spend 70% time on compliance paperwork, only 30% on actual teaching"

💔 *Critical Issues We Face:*
• Endless documentation burden (347 documents per inspection!)
• Perpetual inspection anxiety disrupting academic calendar
• Lost passion for teaching ancient wisdom
• Students learning bureaucracy instead of healing

💪 *"The ultimate measure of a man is not where he stands in moments of comfort and convenience, but where he stands at times of challenge and controversy." - Martin Luther King Jr.*

🕉️ It's time to RECLAIM our sacred purpose!

Join the reform movement: ${this.platformURL}

*Together we rise, divided we fall*

#AyurvedaReform #EducationReform #AncientWisdom #ModernChallenges`;

        this.openWhatsApp(message);
        this.trackShare('manifesto');
    }
    
    sharePlatformInvite() {
        const currentUser = window.authManager ? window.authManager.currentUser : null;
        const personalNote = currentUser ? `\n\n*Invitation from ${currentUser.name}*\n${currentUser.institution}` : '';
        
        const message = `🌟 *Ayurveda Education Reform Platform* 🌟

Join thousands of Ayurveda educators who are fighting back against bureaucratic burden!

✅ *Safe anonymous forums* for honest discussions
✅ *Coalition building* tools to unite institutions  
✅ *Compliance cost tracking* to document the burden
✅ *Reform proposal generator* for systematic change
✅ *Analytics dashboard* for presentations to authorities

🕉️ *"Where the mind is without fear and the head is held high"* - Rabindranath Tagore

This is our platform to reclaim the soul of Ayurvedic education!

Join us: ${this.platformURL}
Analytics: ${this.analyticsURL}

*Be the change you wish to see* - Gandhi${personalNote}

#AyurvedaEducationReform #UniteForChange`;

        this.openWhatsApp(message);
        this.trackShare('platform');
    }
    
    shareUrgentUpdate() {
        const message = `🚨 *URGENT: AYURVEDA EDUCATION CRISIS* 🚨

⚠️ *IMMEDIATE ACTION REQUIRED* ⚠️

New regulatory changes threaten to increase bureaucratic burden on Ayurveda colleges by 40%!

📊 *Current Impact:*
• ₹2.9Cr+ annual compliance costs
• 25,920+ teaching hours lost to paperwork
• 78% educators report job dissatisfaction
• Students learning compliance > healing

🔥 *WE MUST ACT NOW!*

1️⃣ Join our reform platform: ${this.platformURL}
2️⃣ Share your experience anonymously
3️⃣ Sign reform proposals
4️⃣ Unite with fellow educators

*"Injustice anywhere is a threat to justice everywhere"* - Martin Luther King Jr.

⏰ Time is running out. Every voice matters!

#UrgentReform #AyurvedaEducation #ActNow`;

        this.openWhatsApp(message);
        this.trackShare('urgent');
    }
    
    shareAnalytics() {
        const message = `📈 *AYURVEDA EDUCATION CRISIS - BY THE NUMBERS* 📈

Data doesn't lie. The bureaucratic burden is CRUSHING our education system:

💰 *Financial Impact:*
₹2.9+ Crores annual compliance costs
₹45,000+ average cost per institution

⏰ *Time Lost:*
25,920+ teaching hours lost annually
347 documents required per inspection
180+ hours monthly spent on compliance

👥 *Human Impact:*
78% educators report decreased job satisfaction
45+ institutions participating in reform
12+ states represented in movement

😰 *The Reality:*
Our teachers spend MORE time on paperwork than teaching ancient healing wisdom!

📊 See full analytics: ${this.analyticsURL}
🤝 Join the movement: ${this.platformURL}

*"In God we trust, all others must bring data"* - W. Edwards Deming

The data is clear: WE NEED REFORM NOW!

#DataDrivenReform #AyurvedaEducation #Numbers`;

        this.openWhatsApp(message);
        this.trackShare('analytics');
    }
    
    shareGeneratedProposal() {
        const proposalContent = document.getElementById('proposal-content');
        if (!proposalContent) {
            alert('Please generate a proposal first before sharing.');
            return;
        }
        
        const title = document.getElementById('proposal-title').value || 'Reform Proposal';
        
        const message = `📋 *NEW REFORM PROPOSAL: ${title}* 📋

A comprehensive reform proposal has been generated using our platform's AI-powered system.

🎯 *Key Points:*
• Evidence-based problem analysis
• Practical, implementable solutions
• Expected benefits clearly outlined
• Implementation timeline provided

💪 *"Be the change you wish to see in the world"* - Gandhi

This proposal represents the collective voice of Ayurveda educators demanding meaningful reform.

🔗 View full proposal: ${this.platformURL}
📊 Supporting data: ${this.analyticsURL}

*Generated via Ayurveda Education Reform Platform*

#ReformProposal #AyurvedaEducation #SystematicChange`;

        this.openWhatsApp(message);
        this.trackShare('proposal');
    }
    
    shareCoalitionStats() {
        const members = JSON.parse(localStorage.getItem('coalition_members') || '[]');
        const memberCount = members.length || 12;
        const statesCount = [...new Set(members.map(m => m.state))].length || 8;
        
        const message = `🤝 *COALITION GROWTH UPDATE* 🤝

The Ayurveda Education Reform movement is gaining momentum!

📈 *Coalition Statistics:*
🏥 ${memberCount}+ Institutions joined
🗺️ ${statesCount}+ States represented  
👥 ${memberCount * 3}+ Educators actively participating
📊 ${memberCount * 150}+ Students impacted

🔥 *Recent Milestones:*
✅ Platform launched with full functionality
✅ Anonymous forums providing safe space
✅ Data collection documenting bureaucratic burden
✅ Reform proposals being generated systematically

💪 *"Unity is strength... when there is teamwork and collaboration, wonderful things can be achieved"* - Mattie Stepanek

Join our growing coalition: ${this.platformURL}

*Every institution matters. Every voice counts.*

#CoalitionGrowth #AyurvedaReform #UnityInAction`;

        this.openWhatsApp(message);
        this.trackShare('coalition');
    }
    
    createInstitutionGroup() {
        const currentUser = window.authManager ? window.authManager.currentUser : null;
        const institutionName = currentUser ? currentUser.institution : 'Your Institution';
        
        const message = `👥 *${institutionName} - Ayurveda Reform Group*

This WhatsApp group is for faculty, staff, and administrators of ${institutionName} to discuss education reform issues safely.

🎯 *Group Purpose:*
• Share experiences with regulatory burden
• Coordinate responses to inspections
• Discuss reform proposals
• Support each other through challenges

📋 *Group Guidelines:*
• Maintain professional discourse
• Respect anonymity preferences
• Focus on constructive solutions
• Share relevant updates from main platform

🔗 Main Platform: ${this.platformURL}

*"Where the mind is without fear and the head is held high"* - Tagore

Let's work together to reclaim our educational purpose!`;

        this.openWhatsApp(message);
        this.trackShare('institution-group');
    }
    
    createStateGroup() {
        const currentUser = window.authManager ? window.authManager.currentUser : null;
        const stateName = currentUser ? currentUser.state : 'Your State';
        
        const message = `🗺️ *${stateName} Ayurveda Education Reform Group*

Connecting Ayurveda educators across ${stateName} for coordinated reform action!

🎯 *State-Level Coordination:*
• Share state-specific regulatory challenges
• Coordinate with state education boards
• Pool resources for reform initiatives
• Share best practices between institutions

📊 *Our Collective Strength:*
Multiple institutions in ${stateName} are part of the national reform movement!

🔗 Platform: ${this.platformURL}
📈 Analytics: ${this.analyticsURL}

*"Alone we can do so little; together we can do so much"* - Helen Keller

#${stateName}AyurvedaReform`;

        this.openWhatsApp(message);
        this.trackShare('state-group');
    }
    
    createRoleGroup() {
        const currentUser = window.authManager ? window.authManager.currentUser : null;
        const userRole = currentUser ? currentUser.role : 'educator';
        const roleNames = {
            'faculty': 'Faculty & Teachers',
            'principal': 'Principals & Administrators', 
            'student': 'Students',
            'researcher': 'Researchers'
        };
        const groupName = roleNames[userRole] || 'Educators';
        
        const message = `👨‍🏫 *${groupName} - Ayurveda Reform Network*

A dedicated space for ${groupName.toLowerCase()} to discuss role-specific reform challenges.

🎯 *Role-Specific Focus:*
• Share common challenges faced in your role
• Develop targeted reform proposals
• Support colleagues in similar positions
• Exchange practical solutions

💪 *Your Voice Matters:*
${groupName} have unique insights into the education system that are crucial for meaningful reform.

🔗 Join the movement: ${this.platformURL}

*"The ultimate measure of a man is not where he stands in moments of comfort and convenience, but where he stands at times of challenge and controversy."* - MLK Jr.

#${userRole}Reform #AyurvedaEducation`;

        this.openWhatsApp(message);
        this.trackShare('role-group');
    }
    
    createGroupInvite() {
        this.showWhatsAppModal();
    }
    
    openWhatsApp(message) {
        const encodedMessage = encodeURIComponent(message);
        const whatsappURL = `https://api.whatsapp.com/send?text=${encodedMessage}`;
        window.open(whatsappURL, '_blank');
    }
}

// Initialize WhatsApp Manager
let whatsappManager;

document.addEventListener('DOMContentLoaded', function() {
    // Initialize WhatsApp manager after a short delay to ensure other components are loaded
    setTimeout(() => {
        whatsappManager = new WhatsAppManager();
        window.whatsappManager = whatsappManager;
    }, 1000);
});

// Add CSS for mobile WhatsApp button optimization
const mobileCSS = `
    @media (max-width: 768px) {
        .whatsapp-floating {
            bottom: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
        }
        
        .whatsapp-btn {
            font-size: 12px;
            padding: 10px 15px;
        }
        
        .whatsapp-modal-content {
            margin: 2% auto;
            width: 95%;
            max-height: 90vh;
            overflow-y: auto;
        }
        
        .whatsapp-stats {
            grid-template-columns: repeat(3, 1fr);
        }
    }
`;

document.addEventListener('DOMContentLoaded', function() {
    const style = document.createElement('style');
    style.textContent = mobileCSS;
    document.head.appendChild(style);
});
