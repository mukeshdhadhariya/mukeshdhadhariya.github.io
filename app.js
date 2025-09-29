// Portfolio Data
const portfolioData = {
    "name": "Mukesh Dhadhariya",
    "role": "Full Stack Developer",
    "subrole": "B.Tech CSE @ IIIT Bhagalpur",
    "location": "Nagaur, Rajasthan, India",
    "phone": "+91 9783609918",
    "email": "mukeshdhadhariya1@gmail.com",
    "github": "https://github.com/mukeshdhadhariya",
    "linkedin": "https://www.linkedin.com/in/mukesh-dhadhariya-5a4b99290",
    "portfolio": "https://mukeshdhadhariya.github.io/Mukesh-dhadhariya/",
    "resume": "assets/MukeshDhadhariya.pdf",
    "education": {
        "college": "Indian Institute of Information Technology, Bhagalpur",
        "period": "Aug 2023 – Jul 2027 (Expected)",
        "degree": "B.Tech in Computer Science & Engineering"
    },
    "experiences": [
        {
            "role": "Full Stack Developer Intern",
            "company": "MindShift Technology",
            "period": "Jan 2024 – Feb 2024",
            "bullets": [
                "Developed microservices (User, Post, Comment) with MongoDB & Mongoose.",
                "Built responsive front-end with Next.js, TailwindCSS & shadcn/ui.",
                "Implemented secure JWT auth with HTTP-only cookies.",
                "Optimized media handling via FFmpeg, reducing processing costs.",
                "Containerized and deployed with Docker for scalability."
            ]
        },
        {
            "role": "Product Management Intern",
            "company": "IIIT Bhagalpur",
            "period": "Jan 2024 – Feb 2024",
            "bullets": [
                "Built a union employee portal integrating multiple work zones.",
                "Led a team of 6 : collaborated with stakeholders on warehouse mgmt.",
                "Owned product design, development, testing & delivery."
            ]
        }
    ],
    "projects": [
        {
            "title": "AI Human-like Virtual Assistant",
            "period": "Sept 2024 – Oct 2024",
            "desc": [
                "OS-level voice assistant with human-like conversation & command execution.",
                "Automates launching apps, browser control, WhatsApp Web & YouTube tasks."
            ],
            "stack": ["MERN", "TailwindCSS", "OpenAI", "Hugging Face"],
            "github": "https://github.com/mukeshdhadhariya/neha-ai"
        },
        {
            "title": "Full-Stack Social Media Application",
            "period": "Oct 2024 – Nov 2024",
            "desc": [
                "Instagram-like app with auth, real-time chat, posts, stories & media sharing.",
                "Media upload, feed algorithms & mobile-optimized JWT auth."
            ],
            "stack": ["MERN", "shadcn/ui", "Socket.IO", "Cloudinary", "JWT"],
            "github": "https://github.com/mukeshdhadhariya/social_media",
            "demo": "https://social-media-es9m.vercel.app/login"
        },
        {
            "title": "RAG PDF Reader Application",
            "period": "May 2025 – Aug 2025",
            "desc": [
                "AI-powered PDF reader using Retrieval-Augmented Generation (RAG) architecture.",
                "Upload PDFs, generate embeddings, and query content with semantic search.",
                "Background processing with BullMQ and AI responses using LangChain, ValKey, and Gemini."
            ],
            "stack": ["Next.js", "Node.js", "JavaScript", "VectorDB", "BullMQ", "LangChain", "ValKey", "Gemini"],
            "github": "https://github.com/mukeshdhadhariya/chat-with-pdf"
        },
        {
            "title": "women-safety-web",
            "period": "2025 Working",
            "desc": [
                "Multi-user web platform for analyzing women's safety using AI and deep learning.",
                "Users can create posts with images, text, and tags; AI model predicts a safety percentage for each post.",
                "Admin dashboard displays overall safety score aggregated from all posts.",
                "Built with Flask for AI model serving, Node.js for backend services, and responsive React UI."
            ],
            "stack": ["React", "Node.js", "Flask", "Deep Learning", "MongoDB/MySQL"],
            "github": "https://github.com/mukeshdhadhariya/women-safety-web"
        }
    ],
    "skills": {
        "languages": ["C/C++", "JavaScript", "TypeScript", "Python", "SQL", "HTML/CSS"],
        "frameworks": ["React.js", "Next.js", "Express.js", "TailwindCSS", "Bootstrap", "shadcn/ui", "Django"],
        "tools": ["Node.js", "MongoDB", "REST APIs", "Git", "GitHub", "Linux", "Postman", "Docker"],
        "coursework": [
            "Data Structures & Algorithms",
            "Operating Systems",
            "Object-Oriented Programming",
            "Database Management Systems",
            "Software Engineering",
            "Computer Networks",
            "WebSockets"
        ]
    },
    "leadership": [
        {
            "title": "Student Mentor — PyC, Adhaaya Club of IIIT Bhagalpur",
            "period": "Jan 2024 – Present",
            "detail": "Mentored 40+ students in CP, DSA & academics; improved performance and rankings."
        }
    ],
    "achievements": [
        {"title": "Coding Ninjas Slayground 2.0 Contest", "note": "Top 10% Rank"},
        {"title": "Algorithmia: The ICPC Style Coding Challenge", "note": "Finalist"}
    ],
    "profiles": [
        {"name": "LeetCode", "note": "220+ Problems", "url": "https://leetcode.com/u/mukeshhdhadhariya/"},
        {"name": "Code360", "note": "220+ Problems", "url": "https://www.naukri.com/code360/profile/f7613f81-1c1a-4107-bb31-7ed7b179f118"},
        {"name": "GeeksforGeeks", "note": "45+ Problems", "url": "https://www.geeksforgeeks.org/user/mukeshdha3ips/"},
        {"name": "CodeChef", "note": "1577+ rating", "url": "https://www.codechef.com/users/its_hunter"}
    ],
    "nav": ["home","about","education","experience","projects","skills","contact"]
};

// DOM Elements
const themeToggle = document.getElementById('themeToggle');
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const contactForm = document.getElementById('contactForm');
const toast = document.getElementById('toast');
const projectsGrid = document.querySelector('.projects-grid');
const skillsContainer = document.querySelector('.skills-container');
const leadershipGrid = document.querySelector('.leadership-grid');
const achievementsGrid = document.querySelector('.achievements-grid');
const profilesGrid = document.querySelector('.profiles-grid');

// Theme Toggle
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
    }
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
}

// Active Navigation
function setActiveNavLink() {
    const sections = document.querySelectorAll('section');
    const scrollPos = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// Smooth Scrolling
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Mobile Menu
function initMobileMenu() {
    mobileMenuBtn.addEventListener('click', () => {
        const navLinks = document.querySelector('.nav-links');
        navLinks.classList.toggle('active');
    });
}

// Form Submission
function initContactForm() {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Form validation
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;
        
        if (!name || !email || !subject || !message) {
            showToast('Please fill in all fields', 'error');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showToast('Please enter a valid email address', 'error');
            return;
        }
        
        // Simulate form submission
        showToast('Message sent successfully!', 'success');
        
        // Reset form
        contactForm.reset();
        
        /*
        // Example EmailJS integration (commented out)
        // You would need to include EmailJS script and initialize with your user ID
        emailjs.sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', this)
            .then(() => {
                showToast('Message sent successfully!', 'success');
                this.reset();
            })
            .catch((error) => {
                console.error('Error:', error);
                showToast('Failed to send message. Please try again.', 'error');
            });
        */
    });
}

// Toast Notification
function showToast(message, type = 'success') {
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Fade-up Animation
function initScrollAnimations() {
    const fadeElements = document.querySelectorAll('.fade-up');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });
    
    fadeElements.forEach(el => observer.observe(el));
}

// Populate Dynamic Content
function populateProjects() {
    portfolioData.projects.forEach(project => {
        const projectCard = document.createElement('div');
        projectCard.className = 'card fade-up';
        
        let stackHTML = '';
        project.stack.forEach(tech => {
            stackHTML += `<span class="badge">${tech}</span>`;
        });
        
        let linksHTML = '';
        if (project.github) {
            linksHTML += `<a href="${project.github}" class="btn btn-outline" target="_blank">Source</a>`;
        }
        if (project.demo) {
            linksHTML += `<a href="${project.demo}" class="btn btn-primary" target="_blank">Live Demo</a>`;
        }
        
        projectCard.innerHTML = `
            <h3>${project.title}</h3>
            <p class="timeline-period">${project.period}</p>
            <ul>
                ${project.desc.map(item => `<li>${item}</li>`).join('')}
            </ul>
            <div class="project-stack">
                ${stackHTML}
            </div>
            <div class="project-links">
                ${linksHTML}
            </div>
        `;
        
        projectsGrid.appendChild(projectCard);
    });
}

function populateSkills() {
    Object.keys(portfolioData.skills).forEach(category => {
        const skillCategory = document.createElement('div');
        skillCategory.className = 'skill-category fade-up';
        
        let skillsHTML = '';
        portfolioData.skills[category].forEach(skill => {
            skillsHTML += `<span class="skill-item">${skill}</span>`;
        });
        
        skillCategory.innerHTML = `
            <h3>${category.charAt(0).toUpperCase() + category.slice(1)}</h3>
            <div class="skill-list">
                ${skillsHTML}
            </div>
        `;
        
        skillsContainer.appendChild(skillCategory);
    });
}

function populateLeadership() {
    portfolioData.leadership.forEach(item => {
        const leadershipCard = document.createElement('div');
        leadershipCard.className = 'card fade-up';
        
        leadershipCard.innerHTML = `
            <h3>${item.title}</h3>
            <p class="timeline-period">${item.period}</p>
            <p>${item.detail}</p>
        `;
        
        leadershipGrid.appendChild(leadershipCard);
    });
}

function populateAchievements() {
    portfolioData.achievements.forEach(item => {
        const achievementCard = document.createElement('div');
        achievementCard.className = 'card fade-up';
        
        achievementCard.innerHTML = `
            <h3>${item.title}</h3>
            <p>${item.note}</p>
        `;
        
        achievementsGrid.appendChild(achievementCard);
    });
}

function populateProfiles() {
    portfolioData.profiles.forEach(item => {
        const profileCard = document.createElement('div');
        profileCard.className = 'card fade-up';
        
        profileCard.innerHTML = `
            <h3>${item.name}</h3>
            <p>${item.note}</p>
            <a href="${item.url}" class="btn btn-outline" target="_blank">View Profile</a>
        `;
        
        profilesGrid.appendChild(profileCard);
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize theme
    initTheme();
    
    // Initialize smooth scrolling
    initSmoothScroll();
    
    // Initialize mobile menu
    initMobileMenu();
    
    // Initialize contact form
    initContactForm();
    
    // Initialize scroll animations
    initScrollAnimations();
    
    // Populate dynamic content
    populateProjects();
    populateSkills();
    populateLeadership();
    populateAchievements();
    populateProfiles();
    
    // Event listeners
    themeToggle.addEventListener('click', toggleTheme);
    window.addEventListener('scroll', setActiveNavLink);
    
    // Set initial active nav link
    setActiveNavLink();
});