// Ayurveda Education Reform Platform - Authentication System
// Secure user management without requiring external services

class AuthenticationManager {
    constructor() {
        this.users = this.loadUsers();
        this.currentUser = this.getCurrentUser();
        this.initializeAuthUI();
    }
    
    loadUsers() {
        try {
            return JSON.parse(localStorage.getItem('platform_users') || '{}');
        } catch (error) {
            console.log('Creating new user database');
            return {};
        }
    }
    
    saveUsers() {
        localStorage.setItem('platform_users', JSON.stringify(this.users));
    }
    
    getCurrentUser() {
        try {
            const sessionUser = sessionStorage.getItem('current_user');
            return sessionUser ? JSON.parse(sessionUser) : null;
        } catch (error) {
            return null;
        }
    }
    
    setCurrentUser(user) {
        this.currentUser = user;
        if (user) {
            sessionStorage.setItem('current_user', JSON.stringify(user));
        } else {
            sessionStorage.removeItem('current_user');
        }
        this.updateAuthUI();
    }
    
    hashPassword(password) {
        // Simple hash function for demo (in production, use proper bcrypt)
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash.toString();
    }
    
    register(userData) {
        const { email, password, name, institution, role, state } = userData;
        
        // Validation
        if (!email || !password || !name || !institution) {
            throw new Error('Please fill in all required fields');
        }
        
        if (this.users[email]) {
            throw new Error('Email already registered. Please login instead.');
        }
        
        if (password.length < 6) {
            throw new Error('Password must be at least 6 characters long');
        }
        
        // Create new user
        const newUser = {
            id: Date.now(),
            email: email.toLowerCase(),
            password: this.hashPassword(password),
            name: name,
            institution: institution,
            role: role,
            state: state,
            registrationDate: new Date().toISOString(),
            verified: false,
            posts: [],
            proposals: [],
            activityScore: 0
        };
        
        this.users[email.toLowerCase()] = newUser;
        this.saveUsers();
        
        // Auto-login after registration
        const userProfile = { ...newUser };
        delete userProfile.password; // Don't store password in session
        this.setCurrentUser(userProfile);
        
        this.showNotification('Registration successful! Welcome to the reform movement.', 'success');
        return userProfile;
    }
    
    login(email, password) {
        const user = this.users[email.toLowerCase()];
        
        if (!user) {
            throw new Error('Email not found. Please register first.');
        }
        
        if (user.password !== this.hashPassword(password)) {
            throw new Error('Invalid password. Please try again.');
        }
        
        // Create session user (without password)
        const userProfile = { ...user };
        delete userProfile.password;
        this.setCurrentUser(userProfile);
        
        this.showNotification(`Welcome back, ${user.name}!`, 'success');
        return userProfile;
    }
    
    logout() {
        const userName = this.currentUser ? this.currentUser.name : 'User';
        this.setCurrentUser(null);
        this.showNotification(`Goodbye, ${userName}. Your voice matters in our movement!`, 'info');
        location.reload(); // Refresh page to reset UI
    }
    
    isLoggedIn() {
        return this.currentUser !== null;
    }
    
    getUserRole() {
        return this.currentUser ? this.currentUser.role : 'guest';
    }
    
    updateUserActivity() {
        if (this.currentUser) {
            const user = this.users[this.currentUser.email];
            if (user) {
                user.activityScore += 1;
                user.lastActivity = new Date().toISOString();
                this.saveUsers();
                
                // Update session user
                this.currentUser.activityScore = user.activityScore;
                this.setCurrentUser(this.currentUser);
            }
        }
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `auth-notification ${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#2ecc71' : type === 'error' ? '#e74c3c' : '#3498db'};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 10000;
            max-width: 350px;
            font-size: 14px;
            animation: slideInRight 0.3s ease-out;
        `;
        
        notification.innerHTML = `
            ${message}
            <button onclick="this.parentElement.remove()" style="
                background: none;
                border: none;
                color: white;
                float: right;
                font-size: 18px;
                cursor: pointer;
                margin-left: 10px;
                margin-top: -2px;
            ">×</button>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }
    
    initializeAuthUI() {
        // Add auth modal CSS
        const authCSS = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            
            .auth-modal {
                display: none;
                position: fixed;
                z-index: 10000;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0,0,0,0.7);
                backdrop-filter: blur(5px);
            }
            
            .auth-modal-content {
                background: white;
                margin: 5% auto;
                padding: 30px;
                border-radius: 20px;
                width: 90%;
                max-width: 450px;
                box-shadow: 0 20px 40px rgba(0,0,0,0.3);
                position: relative;
                animation: modalSlideIn 0.3s ease-out;
            }
            
            @keyframes modalSlideIn {
                from { transform: translateY(-50px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            
            .auth-tabs {
                display: flex;
                margin-bottom: 30px;
                background: #f8f9fa;
                border-radius: 10px;
                padding: 5px;
            }
            
            .auth-tab {
                flex: 1;
                padding: 12px;
                text-align: center;
                background: none;
                border: none;
                cursor: pointer;
                border-radius: 8px;
                transition: all 0.3s ease;
                font-weight: bold;
                color: #666;
            }
            
            .auth-tab.active {
                background: linear-gradient(45deg, #667eea, #764ba2);
                color: white;
            }
            
            .auth-form-group {
                margin-bottom: 20px;
            }
            
            .auth-form-group label {
                display: block;
                margin-bottom: 8px;
                font-weight: bold;
                color: #2c3e50;
            }
            
            .auth-form-group input,
            .auth-form-group select {
                width: 100%;
                padding: 12px;
                border: 2px solid #ddd;
                border-radius: 8px;
                font-size: 16px;
                transition: border-color 0.3s ease;
            }
            
            .auth-form-group input:focus,
            .auth-form-group select:focus {
                outline: none;
                border-color: #667eea;
                box-shadow: 0 0 10px rgba(102, 126, 234, 0.2);
            }
            
            .auth-btn {
                width: 100%;
                background: linear-gradient(45deg, #667eea, #764ba2);
                color: white;
                border: none;
                padding: 15px;
                border-radius: 25px;
                font-size: 16px;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.3s ease;
                margin-bottom: 15px;
            }
            
            .auth-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
            }
            
            .user-profile {
                background: rgba(255, 255, 255, 0.9);
                padding: 15px 20px;
                border-radius: 10px;
                margin-bottom: 20px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            
            .user-info {
                flex: 1;
            }
            
            .user-name {
                font-weight: bold;
                color: #2c3e50;
                margin-bottom: 5px;
            }
            
            .user-details {
                font-size: 14px;
                color: #666;
            }
            
            .logout-btn {
                background: #e74c3c;
                color: white;
                border: none;
                padding: 8px 15px;
                border-radius: 15px;
                cursor: pointer;
                font-size: 14px;
                transition: all 0.3s ease;
            }
            
            .logout-btn:hover {
                background: #c0392b;
            }
            
            .auth-link {
                color: #667eea;
                cursor: pointer;
                text-decoration: underline;
                font-size: 14px;
            }
            
            .close-modal {
                position: absolute;
                right: 15px;
                top: 15px;
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
                color: #999;
            }
            
            .close-modal:hover {
                color: #333;
            }
        `;
        
        const style = document.createElement('style');
        style.textContent = authCSS;
        document.head.appendChild(style);
        
        this.createAuthModal();
        this.updateAuthUI();
    }
    
    createAuthModal() {
        const authModal = document.createElement('div');
        authModal.id = 'authModal';
        authModal.className = 'auth-modal';
        
        authModal.innerHTML = `
            <div class="auth-modal-content">
                <button class="close-modal" onclick="authManager.closeModal()">×</button>
                <h2 style="text-align: center; margin-bottom: 30px; color: #2c3e50;">
                    🕉️ Join the Reform Movement
                </h2>
                
                <div class="auth-tabs">
                    <button class="auth-tab active" id="loginTab" onclick="authManager.showTab('login')">
                        Login
                    </button>
                    <button class="auth-tab" id="registerTab" onclick="authManager.showTab('register')">
                        Register
                    </button>
                </div>
                
                <!-- Login Form -->
                <div id="loginForm" class="auth-form">
                    <div class="auth-form-group">
                        <label>Email:</label>
                        <input type="email" id="loginEmail" placeholder="your@email.com">
                    </div>
                    
                    <div class="auth-form-group">
                        <label>Password:</label>
                        <input type="password" id="loginPassword" placeholder="Your password">
                    </div>
                    
                    <button class="auth-btn" onclick="authManager.handleLogin()">
                        🚪 Login to Platform
                    </button>
                    
                    <p style="text-align: center; margin-top: 15px; color: #666;">
                        New to the movement? 
                        <span class="auth-link" onclick="authManager.showTab('register')">Create account</span>
                    </p>
                </div>
                
                <!-- Register Form -->
                <div id="registerForm" class="auth-form" style="display: none;">
                    <div class="auth-form-group">
                        <label>Full Name: *</label>
                        <input type="text" id="registerName" placeholder="Dr. Your Name">
                    </div>
                    
                    <div class="auth-form-group">
                        <label>Email: *</label>
                        <input type="email" id="registerEmail" placeholder="your@email.com">
                    </div>
                    
                    <div class="auth-form-group">
                        <label>Password: *</label>
                        <input type="password" id="registerPassword" placeholder="At least 6 characters">
                    </div>
                    
                    <div class="auth-form-group">
                        <label>Institution: *</label>
                        <input type="text" id="registerInstitution" placeholder="Your Ayurveda College">
                    </div>
                    
                    <div class="auth-form-group">
                        <label>Role:</label>
                        <select id="registerRole">
                            <option value="faculty">Faculty/Teacher</option>
                            <option value="principal">Principal</option>
                            <option value="student">Student</option>
                            <option value="admin">Administrator</option>
                            <option value="researcher">Researcher</option>
                        </select>
                    </div>
                    
                    <div class="auth-form-group">
                        <label>State:</label>
                        <select id="registerState">
                            <option value="Andhra Pradesh">Andhra Pradesh</option>
                            <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                            <option value="Assam">Assam</option>
                            <option value="Bihar">Bihar</option>
                            <option value="Chhattisgarh">Chhattisgarh</option>
                            <option value="Goa">Goa</option>
                            <option value="Gujarat">Gujarat</option>
                            <option value="Haryana">Haryana</option>
                            <option value="Himachal Pradesh">Himachal Pradesh</option>
                            <option value="Jharkhand">Jharkhand</option>
                            <option value="Karnataka">Karnataka</option>
                            <option value="Kerala">Kerala</option>
                            <option value="Madhya Pradesh">Madhya Pradesh</option>
                            <option value="Maharashtra">Maharashtra</option>
                            <option value="Manipur">Manipur</option>
                            <option value="Meghalaya">Meghalaya</option>
                            <option value="Mizoram">Mizoram</option>
                            <option value="Nagaland">Nagaland</option>
                            <option value="Odisha">Odisha</option>
                            <option value="Punjab">Punjab</option>
                            <option value="Rajasthan">Rajasthan</option>
                            <option value="Sikkim">Sikkim</option>
                            <option value="Tamil Nadu" selected>Tamil Nadu</option>
                            <option value="Telangana">Telangana</option>
                            <option value="Tripura">Tripura</option>
                            <option value="Uttar Pradesh">Uttar Pradesh</option>
                            <option value="Uttarakhand">Uttarakhand</option>
                            <option value="West Bengal">West Bengal</option>
                        </select>
                    </div>
                    
                    <button class="auth-btn" onclick="authManager.handleRegister()">
                        🌟 Join the Movement
                    </button>
                    
                    <p style="text-align: center; margin-top: 15px; color: #666;">
                        Already have an account? 
                        <span class="auth-link" onclick="authManager.showTab('login')">Login here</span>
                    </p>
                </div>
            </div>
        `;
        
        document.body.appendChild(authModal);
    }
    
    showModal() {
        document.getElementById('authModal').style.display = 'block';
    }
    
    closeModal() {
        document.getElementById('authModal').style.display = 'none';
    }
    
    showTab(tabName) {
        // Update tabs
        document.querySelectorAll('.auth-tab').forEach(tab => tab.classList.remove('active'));
        document.getElementById(tabName + 'Tab').classList.add('active');
        
        // Show/hide forms
        document.getElementById('loginForm').style.display = tabName === 'login' ? 'block' : 'none';
        document.getElementById('registerForm').style.display = tabName === 'register' ? 'block' : 'none';
    }
    
    handleLogin() {
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        try {
            this.login(email, password);
            this.closeModal();
        } catch (error) {
            this.showNotification(error.message, 'error');
        }
    }
    
    handleRegister() {
        const userData = {
            name: document.getElementById('registerName').value,
            email: document.getElementById('registerEmail').value,
            password: document.getElementById('registerPassword').value,
            institution: document.getElementById('registerInstitution').value,
            role: document.getElementById('registerRole').value,
            state: document.getElementById('registerState').value
        };
        
        try {
            this.register(userData);
            this.closeModal();
        } catch (error) {
            this.showNotification(error.message, 'error');
        }
    }
    
    updateAuthUI() {
        // Add user profile to header if logged in
        const header = document.querySelector('header');
        if (!header) return;
        
        // Remove existing profile
        const existingProfile = document.querySelector('.user-profile');
        if (existingProfile) {
            existingProfile.remove();
        }
        
        if (this.isLoggedIn()) {
            const userProfile = document.createElement('div');
            userProfile.className = 'user-profile';
            userProfile.innerHTML = `
                <div class="user-info">
                    <div class="user-name">🕉️ ${this.currentUser.name}</div>
                    <div class="user-details">
                        ${this.currentUser.role} at ${this.currentUser.institution} | 
                        Activity: ${this.currentUser.activityScore || 0} points
                    </div>
                </div>
                <button class="logout-btn" onclick="authManager.logout()">Logout</button>
            `;
            header.appendChild(userProfile);
        } else {
            // Add login button to header
            const loginBtn = document.createElement('div');
            loginBtn.style.cssText = 'text-align: center; margin-top: 20px;';
            loginBtn.innerHTML = `
                <button class="btn" onclick="authManager.showModal()" style="font-size: 14px;">
                    🔐 Login / Register
                </button>
            `;
            header.appendChild(loginBtn);
        }
    }
}

// Initialize authentication when DOM is loaded
let authManager;

document.addEventListener('DOMContentLoaded', function() {
    authManager = new AuthenticationManager();
    
    // Make authManager globally available
    window.authManager = authManager;
    
    // Track user activity
    document.addEventListener('click', () => {
        if (authManager.isLoggedIn()) {
            authManager.updateUserActivity();
        }
    });
});

// Enhanced form submissions with user tracking
function enhancedSubmitPost() {
    if (!authManager.isLoggedIn()) {
        authManager.showNotification('Please login to post messages', 'info');
        authManager.showModal();
        return;
    }
    
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;
    const category = document.getElementById('category').value;
    const anonymity = document.getElementById('anonymity').value;
    
    if (!subject || !message) {
        authManager.showNotification('Please fill in both subject and message fields.', 'error');
        return;
    }
    
    const authorName = anonymity === 'anonymous' ? 
        `Anonymous ${authManager.currentUser.role}` : 
        authManager.currentUser.name;
    
    const newPost = forumManager.addPost({
        author: authorName,
        authorId: authManager.currentUser.id,
        category: category,
        subject: subject,
        content: message,
        userRole: authManager.currentUser.role,
        institution: authManager.currentUser.institution
    });
    
    // Track user post
    const user = authManager.users[authManager.currentUser.email];
    if (user) {
        user.posts.push(newPost.id);
        user.activityScore += 5; // Reward for posting
        authManager.saveUsers();
        authManager.updateAuthUI();
    }
    
    displayPosts();
    
    // Clear form
    document.getElementById('subject').value = '';
    document.getElementById('message').value = '';
    
    authManager.showNotification('Your voice has been added to the forum. Together we create change!', 'success');
}

// Replace the original submitPost function
if (typeof submitPost !== 'undefined') {
    submitPost = enhancedSubmitPost;
}
