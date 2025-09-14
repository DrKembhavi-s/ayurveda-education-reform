// Ayurveda Education Reform Platform - Advanced Features
// This file adds enhanced functionality to the platform

// Data storage using browser's local storage (persists data between sessions)
class PlatformStorage {
    static saveData(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (error) {
            console.log('Storage not available, using session data only');
        }
    }
    
    static loadData(key, defaultValue = []) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : defaultValue;
        } catch (error) {
            console.log('Storage not available, using default data');
            return defaultValue;
        }
    }
}

// Enhanced Forum Management
class ForumManager {
    constructor() {
        this.posts = PlatformStorage.loadData('forum_posts', this.getDefaultPosts());
        this.reactions = PlatformStorage.loadData('post_reactions', {});
    }
    
    getDefaultPosts() {
        return [
            {
                id: 1,
                author: "Anonymous Principal",
                date: "2025-01-15",
                category: "regulatory",
                subject: "NCISM Documentation Burden - A Principal's Perspective",
                content: "In 20 years of running an Ayurveda college, I've never seen such administrative burden. Last inspection required 347 documents. Our teachers spent 3 months preparing instead of teaching. Students are suffering.",
                reactions: { support: 12, helpful: 8, concerned: 15 },
                replies: []
            },
            {
                id: 2,
                author: "Anonymous Faculty",
                date: "2025-01-14",
                category: "teaching",
                subject: "Lost the Joy of Teaching Ayurveda",
                content: "I became an Ayurveda teacher to share ancient wisdom and heal. Now I spend 70% of my time on compliance paperwork. My students see my stress and lose respect for this beautiful system. We need change NOW.",
                reactions: { support: 28, helpful: 5, concerned: 22 },
                replies: []
            },
            {
                id: 3,
                author: "Anonymous Student",
                date: "2025-01-13",
                category: "support",
                subject: "Student Perspective: We're Not Learning, We're Just Passing Exams",
                content: "Our professors are always stressed about inspections. We get photocopied notes instead of passionate teaching. I chose Ayurveda to learn healing, but I'm learning bureaucracy instead.",
                reactions: { support: 31, helpful: 12, concerned: 18 },
                replies: []
            }
        ];
    }
    
    addPost(postData) {
        const newPost = {
            id: Date.now(),
            ...postData,
            date: new Date().toISOString().split('T')[0],
            reactions: { support: 0, helpful: 0, concerned: 0 },
            replies: []
        };
        
        this.posts.unshift(newPost);
        PlatformStorage.saveData('forum_posts', this.posts);
        return newPost;
    }
    
    addReaction(postId, reactionType) {
        const post = this.posts.find(p => p.id == postId);
        if (post) {
            post.reactions[reactionType] = (post.reactions[reactionType] || 0) + 1;
            PlatformStorage.saveData('forum_posts', this.posts);
        }
    }
    
    searchPosts(searchTerm) {
        return this.posts.filter(post => 
            post.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.category.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }
}

// Coalition Management
class CoalitionManager {
    constructor() {
        this.members = PlatformStorage.loadData('coalition_members', []);
        this.campaigns = PlatformStorage.loadData('campaigns', []);
        this.meetings = PlatformStorage.loadData('meetings', []);
    }
    
    addMember(memberData) {
        const newMember = {
            id: Date.now(),
            ...memberData,
            joinDate: new Date().toISOString().split('T')[0],
            verified: false
        };
        
        this.members.push(newMember);
        PlatformStorage.saveData('coalition_members', this.members);
        this.updateStats();
        return newMember;
    }
    
    createCampaign(campaignData) {
        const newCampaign = {
            id: Date.now(),
            ...campaignData,
            startDate: new Date().toISOString().split('T')[0],
            supporters: 1,
            status: 'active'
        };
        
        this.campaigns.push(newCampaign);
        PlatformStorage.saveData('campaigns', this.campaigns);
        this.updateStats();
        return newCampaign;
    }
    
    updateStats() {
        const states = [...new Set(this.members.map(m => m.state))];
        
        document.getElementById('member-count').textContent = this.members.length;
        document.getElementById('states-count').textContent = states.length;
        document.getElementById('campaigns-count').textContent = this.campaigns.filter(c => c.status === 'active').length;
    }
}

// Compliance Tracker
class ComplianceTracker {
    constructor() {
        this.inspections = PlatformStorage.loadData('inspections', this.getDefaultInspections());
        this.costs = PlatformStorage.loadData('compliance_costs', {});
    }
    
    getDefaultInspections() {
        return [
            {
                id: 1,
                type: 'NCISM Annual Inspection',
                date: '2025-01-15',
                status: 'completed',
                documentsRequired: 47,
                hoursSpent: 240,
                outcome: 'Approved with observations'
            },
            {
                id: 2,
                type: 'QCI Quality Assessment',
                date: '2025-03-15',
                status: 'upcoming',
                documentsRequired: 32,
                preparationDays: 45
            },
            {
                id: 3,
                type: 'NAAC Accreditation Review',
                date: '2025-06-20',
                status: 'scheduled',
                documentsRequired: 89,
                preparationDays: 90
            }
        ];
    }
    
    calculateTotalComplianceCost(hours, staff, costPerHour) {
        const monthly = hours * staff * costPerHour;
        const annual = monthly * 12;
        
        // Calculate opportunity cost (what could have been done instead)
        const teachingHoursLost = hours * staff;
        const studentsAffected = teachingHoursLost / 4; // Assuming 4 hours per student per month
        
        return {
            monthly: monthly,
            annual: annual,
            teachingHoursLost: teachingHoursLost * 12,
            studentsAffected: Math.floor(studentsAffected * 12)
        };
    }
    
    addInspectionExperience(inspectionData) {
        const experience = {
            id: Date.now(),
            ...inspectionData,
            submittedDate: new Date().toISOString().split('T')[0]
        };
        
        this.inspections.push(experience);
        PlatformStorage.saveData('inspections', this.inspections);
        return experience;
    }
}

// Reform Proposal Generator with Templates
class ProposalGenerator {
    constructor() {
        this.proposals = PlatformStorage.loadData('proposals', []);
        this.templates = this.getProposalTemplates();
    }
    
    getProposalTemplates() {
        return {
            documentation: {
                title: "Streamlining Documentation Requirements",
                problem: "Current documentation requirements are excessive and repetitive, taking valuable time away from actual teaching and learning.",
                solution: "Implement a unified digital documentation system with automated reporting features to reduce manual paperwork by 60%."
            },
            inspection: {
                title: "Reforming Inspection Frequency and Process",
                problem: "Multiple overlapping inspections throughout the year create a perpetual state of preparation mode, disrupting academic calendar.",
                solution: "Coordinate all regulatory inspections into a single comprehensive annual review with standardized criteria."
            },
            teaching: {
                title: "Protecting Teaching Time and Academic Freedom",
                problem: "Excessive compliance requirements are reducing actual teaching hours and constraining pedagogical innovation.",
                solution: "Establish protected teaching time blocks where compliance activities are prohibited, ensuring minimum contact hours with students."
            }
        };
    }
    
    generateFromTemplate(templateKey, customizations = {}) {
        const template = this.templates[templateKey];
        if (!template) return null;
        
        return {
            ...template,
            ...customizations,
            id: Date.now(),
            createdDate: new Date().toISOString().split('T')[0],
            status: 'draft'
        };
    }
    
    saveProposal(proposalData) {
        const proposal = {
            id: Date.now(),
            ...proposalData,
            createdDate: new Date().toISOString().split('T')[0],
            status: 'draft',
            supporters: 1
        };
        
        this.proposals.push(proposal);
        PlatformStorage.saveData('proposals', this.proposals);
        return proposal;
    }
}

// Advanced Search and Filter System
class SearchManager {
    static searchAll(term) {
        const forumManager = new ForumManager();
        const coalitionManager = new CoalitionManager();
        
        const forumResults = forumManager.searchPosts(term);
        const memberResults = coalitionManager.members.filter(m => 
            m.institutionName?.toLowerCase().includes(term.toLowerCase()) ||
            m.state?.toLowerCase().includes(term.toLowerCase())
        );
        
        return {
            posts: forumResults,
            members: memberResults,
            total: forumResults.length + memberResults.length
        };
    }
}

// Notification System
class NotificationManager {
    constructor() {
        this.notifications = PlatformStorage.loadData('notifications', []);
    }
    
    addNotification(type, message, importance = 'normal') {
        const notification = {
            id: Date.now(),
            type: type,
            message: message,
            importance: importance,
            timestamp: new Date().toISOString(),
            read: false
        };
        
        this.notifications.unshift(notification);
        PlatformStorage.saveData('notifications', this.notifications);
        this.showNotification(notification);
    }
    
    showNotification(notification) {
        // Create a floating notification
        const notificationDiv = document.createElement('div');
        notificationDiv.className = `notification ${notification.importance}`;
        notificationDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${notification.importance === 'urgent' ? '#dc3545' : '#28a745'};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 1000;
            max-width: 300px;
            animation: slideIn 0.3s ease-out;
        `;
        
        notificationDiv.innerHTML = `
            <strong>${notification.type}</strong><br>
            ${notification.message}
            <button onclick="this.parentElement.remove()" style="
                background: none;
                border: none;
                color: white;
                float: right;
                font-size: 16px;
                cursor: pointer;
                margin-top: -5px;
            ">×</button>
        `;
        
        document.body.appendChild(notificationDiv);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notificationDiv.parentElement) {
                notificationDiv.remove();
            }
        }, 5000);
    }
}

// Initialize all managers
let forumManager, coalitionManager, complianceTracker, proposalGenerator, notificationManager;

document.addEventListener('DOMContentLoaded', function() {
    // Initialize managers
    forumManager = new ForumManager();
    coalitionManager = new CoalitionManager();
    complianceTracker = new ComplianceTracker();
    proposalGenerator = new ProposalGenerator();
    notificationManager = new NotificationManager();
    
    // Load initial data
    displayPosts();
    coalitionManager.updateStats();
    
    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        .post-reactions {
            margin-top: 15px;
            display: flex;
            gap: 10px;
        }
        
        .reaction-btn {
            background: #f8f9fa;
            border: 1px solid #ddd;
            padding: 5px 12px;
            border-radius: 15px;
            cursor: pointer;
            font-size: 12px;
            transition: all 0.2s ease;
        }
        
        .reaction-btn:hover {
            background: #e9ecef;
            transform: scale(1.05);
        }
        
        .search-bar {
            background: white;
            padding: 20px;
            border-radius: 10px;
            margin-bottom: 20px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        .proposal-templates {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 15px;
            margin-bottom: 30px;
        }
        
        .template-card {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        
        .template-card:hover {
            background: #e9ecef;
            transform: translateY(-2px);
        }
    `;
    document.head.appendChild(style);
    
    // Welcome notification
    notificationManager.addNotification(
        'Welcome!', 
        'Welcome to the Ayurveda Education Reform Platform. Your voice matters in reclaiming our sacred purpose.',
        'normal'
    );
});

// Enhanced functions to replace the basic ones in HTML

function submitPost() {
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;
    const category = document.getElementById('category').value;
    const anonymity = document.getElementById('anonymity').value;
    
    if (!subject || !message) {
        alert('Please fill in both subject and message fields.');
        return;
    }
    
    const newPost = forumManager.addPost({
        author: anonymity === 'anonymous' ? 'Anonymous Educator' : 'Registered User',
        category: category,
        subject: subject,
        content: message
    });
    
    displayPosts();
    
    // Clear form
    document.getElementById('subject').value = '';
    document.getElementById('message').value = '';
    
    notificationManager.addNotification(
        'Post Submitted', 
        'Your voice has been added to the forum. Together we can create change.',
        'normal'
    );
}

function displayPosts() {
    const container = document.getElementById('posts-container');
    container.innerHTML = '';
    
    // Add search bar
    const searchBar = document.createElement('div');
    searchBar.className = 'search-bar';
    searchBar.innerHTML = `
        <input type="text" id="forum-search" placeholder="Search posts by keyword, category, or content..." 
               style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
    `;
    container.appendChild(searchBar);
    
    // Add search functionality
    document.getElementById('forum-search').addEventListener('input', function(e) {
        const searchTerm = e.target.value;
        const filteredPosts = searchTerm ? forumManager.searchPosts(searchTerm) : forumManager.posts;
        displayFilteredPosts(filteredPosts);
    });
    
    displayFilteredPosts(forumManager.posts);
}

function displayFilteredPosts(posts) {
    const existingPosts = document.querySelectorAll('.post-item');
    existingPosts.forEach(post => post.remove());
    
    const container = document.getElementById('posts-container');
    
    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'post-item';
        postElement.innerHTML = `
            <div class="post-header">
                <span class="post-author">${post.author}</span>
                <span class="post-date">${post.date}</span>
            </div>
            <h4>${post.subject}</h4>
            <div class="post-content">${post.content}</div>
            <div class="post-reactions">
                <button class="reaction-btn" onclick="reactToPost(${post.id}, 'support')">
                    💪 Support (${post.reactions.support})
                </button>
                <button class="reaction-btn" onclick="reactToPost(${post.id}, 'helpful')">
                    👍 Helpful (${post.reactions.helpful})
                </button>
                <button class="reaction-btn" onclick="reactToPost(${post.id}, 'concerned')">
                    😟 Concerned (${post.reactions.concerned})
                </button>
            </div>
            <span class="post-category">${post.category}</span>
        `;
        container.appendChild(postElement);
    });
}

function reactToPost(postId, reactionType) {
    forumManager.addReaction(postId, reactionType);
    displayPosts();
}

function calculateComplianceCost() {
    const hours = parseFloat(document.getElementById('hours').value) || 0;
    const staff = parseFloat(document.getElementById('staff').value) || 0;
    const cost = parseFloat(document.getElementById('cost').value) || 0;
    
    const result = complianceTracker.calculateTotalComplianceCost(hours, staff, cost);
    
    const resultDiv = document.getElementById('cost-result');
    resultDiv.innerHTML = `
        <div style="background: #fff3cd; padding: 20px; border-radius: 8px; border-left: 4px solid #ffc107;">
            <h4 style="margin-bottom: 15px; color: #856404;">Compliance Cost Analysis</h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
                <div>
                    <strong>Monthly Cost:</strong> ₹${result.monthly.toLocaleString()}
                </div>
                <div>
                    <strong>Annual Cost:</strong> ₹${result.annual.toLocaleString()}
                </div>
                <div>
                    <strong>Teaching Hours Lost:</strong> ${result.teachingHoursLost.toLocaleString()} hours/year
                </div>
                <div>
                    <strong>Students Affected:</strong> ${result.studentsAffected.toLocaleString()} student-interactions lost
                </div>
            </div>
            <div style="margin-top: 15px; padding: 10px; background: rgba(255,255,255,0.7); border-radius: 5px;">
                <small style="color: #856404;">
                    <strong>Impact:</strong> This represents ${(result.teachingHoursLost/8).toFixed(0)} full working days per year 
                    spent on compliance instead of education. Imagine the ancient wisdom that could be shared in that time!
                </small>
            </div>
        </div>
    `;
}

// Global functions for enhanced features
window.reactToPost = reactToPost;
window.submitPost = submitPost;
window.displayPosts = displayPosts;
window.calculateComplianceCost = calculateComplianceCost;
