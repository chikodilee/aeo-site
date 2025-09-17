
// Navigation Drawer Functionality
class NavigationDrawer {
    constructor() {
        this.mobileMenuBtn = document.getElementById('mobileMenuBtn');
        this.navDrawer = document.getElementById('navDrawer');
        this.drawerOverlay = document.getElementById('drawerOverlay');
        this.drawerClose = document.getElementById('drawerClose');
        this.drawerLinks = document.querySelectorAll('.drawer-link');
        
        this.initEventListeners();
    }
    
    initEventListeners() {
        // Mobile menu button click
        this.mobileMenuBtn?.addEventListener('click', () => this.toggleDrawer());
        
        // Drawer overlay click
        this.drawerOverlay?.addEventListener('click', () => this.closeDrawer());
        
        // Drawer close button click
        this.drawerClose?.addEventListener('click', () => this.closeDrawer());
        
        // Drawer link clicks
        this.drawerLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleDrawerLinkClick(e));
        });
        
        // Close drawer on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.navDrawer?.classList.contains('open')) {
                this.closeDrawer();
            }
        });
        
        // Handle window resize
        window.addEventListener('resize', () => this.handleResize());
    }
    
    toggleDrawer() {
        if (this.navDrawer?.classList.contains('open')) {
            this.closeDrawer();
        } else {
            this.openDrawer();
        }
    }
    
    openDrawer() {
        this.navDrawer?.classList.add('open');
        this.mobileMenuBtn?.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Set active link based on current section
        this.setActiveDrawerLink();
    }
    
    closeDrawer() {
        this.navDrawer?.classList.remove('open');
        this.mobileMenuBtn?.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    handleDrawerLinkClick(e) {
        const link = e.currentTarget;
        const sectionId = link.getAttribute('data-section');
        
        // Remove active class from all links
        this.drawerLinks.forEach(l => l.classList.remove('active'));
        
        // Add active class to clicked link
        link.classList.add('active');
        
        // Smooth scroll to section
        if (sectionId) {
            const section = document.getElementById(sectionId);
            if (section) {
                section.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
        
        // Close drawer after a short delay
        setTimeout(() => this.closeDrawer(), 300);
    }
    
    setActiveDrawerLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;
        
        let activeSection = null;
        
        sections.forEach(section => {
            const top = section.offsetTop;
            const bottom = top + section.offsetHeight;
            
            if (scrollPos >= top && scrollPos < bottom) {
                activeSection = section.id;
            }
        });
        
        // Update active drawer link
        this.drawerLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === activeSection) {
                link.classList.add('active');
            }
        });
    }
    
    handleResize() {
        // Close drawer if screen becomes large
        if (window.innerWidth > 768 && this.navDrawer?.classList.contains('open')) {
            this.closeDrawer();
        }
    }
}

// Smooth Scrolling for Navigation Links
class SmoothScroll {
    constructor() {
        this.initSmoothScroll();
    }
    
    initSmoothScroll() {
        // Handle all navigation links (desktop and mobile)
        const navLinks = document.querySelectorAll('a[href^="#"]');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                
                // Skip if it's just "#"
                if (href === '#') return;
                
                e.preventDefault();
                
                const targetId = href.substring(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Update URL without triggering scroll
                    history.pushState(null, null, href);
                }
            });
        });
    }
}

// Active Navigation Link Highlighting
class ActiveNavHighlight {
    constructor() {
        this.navLinks = document.querySelectorAll('.nav-link, .drawer-link');
        this.sections = document.querySelectorAll('section[id]');
        
        this.initScrollListener();
    }
    
    initScrollListener() {
        window.addEventListener('scroll', () => this.updateActiveLink());
        
        // Initial check
        this.updateActiveLink();
    }
    
    updateActiveLink() {
        const scrollPos = window.scrollY + 100;
        let activeSection = null;
        
        this.sections.forEach(section => {
            const top = section.offsetTop;
            const bottom = top + section.offsetHeight;
            
            if (scrollPos >= top && scrollPos < bottom) {
                activeSection = section.id;
            }
        });
        
        // Update navigation links
        this.navLinks.forEach(link => {
            const href = link.getAttribute('href');
            link.classList.remove('active');
            
            if (href === `#${activeSection}`) {
                link.classList.add('active');
            }
        });
    }
}

// Animated Scroll Reveal
class ScrollReveal {
    constructor() {
        this.observerOptions = {
            threshold: 0.2,
            rootMargin: '0px 0px -50px 0px'
        };
        
        this.initObserver();
    }
    
    initObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = entry.target.getAttribute('data-delay') || 0;
                    
                    setTimeout(() => {
                        entry.target.classList.add('animate-in');
                    }, delay);
                    
                    observer.unobserve(entry.target);
                }
            });
        }, this.observerOptions);
        
        // Observe elements with scroll animation
        const animatedElements = document.querySelectorAll('.animate-on-scroll');
        animatedElements.forEach(el => observer.observe(el));
    }
}

// Interactive Features
class InteractiveFeatures {
    constructor() {
        this.initFeatureTiles();
        this.initVotingButtons();
        this.initFormSubmission();
        this.initDocumentationLink();
    }
    
    initFeatureTiles() {
        const featureTiles = document.querySelectorAll('.interactive-tile');
        
        featureTiles.forEach(tile => {
            tile.addEventListener('click', () => {
                const feature = tile.getAttribute('data-feature');
                this.showFeatureDemo(feature, tile);
            });
        });
    }
    
    showFeatureDemo(feature, tile) {
        const demoPreview = tile.querySelector('.demo-preview');
        const originalText = demoPreview.textContent;
        
        // Show loading state
        demoPreview.textContent = 'Loading demo...';
        
        // Simulate demo loading
        setTimeout(() => {
            demoPreview.textContent = `${feature} demo ready!`;
            
            // Reset after 2 seconds
            setTimeout(() => {
                demoPreview.textContent = originalText;
            }, 2000);
        }, 1000);
    }
    
    initVotingButtons() {
        const voteButtons = document.querySelectorAll('.vote-btn');
        
        voteButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const voteCount = btn.querySelector('.vote-count');
                const currentVotes = parseInt(voteCount.textContent);
                const hasVoted = btn.classList.contains('voted');
                
                if (hasVoted) {
                    // Remove vote
                    voteCount.textContent = currentVotes - 1;
                    btn.classList.remove('voted');
                    btn.style.background = '#f7fafc';
                    btn.style.color = '#4a5568';
                } else {
                    // Add vote
                    voteCount.textContent = currentVotes + 1;
                    btn.classList.add('voted');
                    btn.style.background = '#667eea';
                    btn.style.color = 'white';
                }
            });
        });
    }
    
    initFormSubmission() {
        const featureForm = document.querySelector('.feature-form');
        
        featureForm?.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const submitBtn = featureForm.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            
            // Show loading state
            submitBtn.textContent = 'Submitting...';
            submitBtn.disabled = true;
            
            // Simulate submission
            setTimeout(() => {
                submitBtn.textContent = 'Submitted! ✓';
                
                // Reset form
                setTimeout(() => {
                    featureForm.reset();
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }, 2000);
            }, 1500);
        });
    }
    
    initDocumentationLink() {
        const docLink = document.getElementById('documentationLink');
        
        docLink?.addEventListener('click', (e) => {
            e.preventDefault();
            this.openDocumentation();
        });
    }
    
    openDocumentation() {
        // Create and show documentation modal/page
        const docWindow = window.open('documentation.html', '_blank');
        
        if (!docWindow) {
            // Fallback if popup blocked
            alert('Documentation will open in a new tab. Please allow popups for the best experience.');
        }
    }
}

// Navbar Scroll Effect
class NavbarScrollEffect {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.initScrollEffect();
    }
    
    initScrollEffect() {
        let lastScrollY = window.scrollY;
        
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            
            if (currentScrollY > 100) {
                this.navbar?.classList.add('scrolled');
            } else {
                this.navbar?.classList.remove('scrolled');
            }
            
            // Hide navbar when scrolling down, show when scrolling up
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                this.navbar?.style.setProperty('transform', 'translateY(-100%)');
            } else {
                this.navbar?.style.setProperty('transform', 'translateY(0)');
            }
            
            lastScrollY = currentScrollY;
        });
    }
}

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new NavigationDrawer();
    new SmoothScroll();
    new ActiveNavHighlight();
    new ScrollReveal();
    new InteractiveFeatures();
    new NavbarScrollEffect();
});

// Handle page load from anchor links
window.addEventListener('load', () => {
    if (window.location.hash) {
        setTimeout(() => {
            const target = document.querySelector(window.location.hash);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }, 100);
    }
});
