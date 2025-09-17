
// Documentation Page JavaScript
class DocumentationPage {
    constructor() {
        this.initSmoothScrolling();
        this.initActiveNavigation();
        this.initTOCGeneration();
        this.initSearchFunctionality();
        this.initProgressTracking();
    }
    
    initSmoothScrolling() {
        // Handle anchor links
        const anchorLinks = document.querySelectorAll('a[href^="#"]');
        
        anchorLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                
                if (href === '#') return;
                
                e.preventDefault();
                
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 120; // Account for sticky nav
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                    
                    // Update URL
                    history.pushState(null, null, href);
                }
            });
        });
    }
    
    initActiveNavigation() {
        const navSections = document.querySelectorAll('.nav-section');
        const docSections = document.querySelectorAll('.doc-section');
        
        const updateActiveNav = () => {
            const scrollPos = window.scrollY + 150;
            let activeSection = null;
            
            docSections.forEach(section => {
                const top = section.offsetTop;
                const bottom = top + section.offsetHeight;
                
                if (scrollPos >= top && scrollPos < bottom) {
                    activeSection = section.id;
                }
            });
            
            navSections.forEach(nav => {
                nav.classList.remove('active');
                const href = nav.getAttribute('href');
                if (href === `#${activeSection}`) {
                    nav.classList.add('active');
                }
            });
        };
        
        window.addEventListener('scroll', updateActiveNav);
        updateActiveNav(); // Initial check
    }
    
    initTOCGeneration() {
        // Auto-generate table of contents
        const tocContainer = document.querySelector('.toc');
        const headings = document.querySelectorAll('.doc-content h3[id]');
        
        if (tocContainer && headings.length > 0) {
            tocContainer.innerHTML = ''; // Clear existing
            
            headings.forEach(heading => {
                const li = document.createElement('li');
                const a = document.createElement('a');
                
                a.href = `#${heading.id}`;
                a.textContent = heading.textContent.replace(/^\w+\s+/, ''); // Remove icon
                
                li.appendChild(a);
                tocContainer.appendChild(li);
            });
        }
    }
    
    initSearchFunctionality() {
        // Create search box
        const sidebar = document.querySelector('.sidebar-content');
        if (sidebar) {
            const searchBox = document.createElement('div');
            searchBox.className = 'search-box';
            searchBox.innerHTML = `
                <input type="text" placeholder="Search documentation..." class="search-input">
                <div class="search-results"></div>
            `;
            
            sidebar.insertBefore(searchBox, sidebar.firstChild);
            
            const searchInput = searchBox.querySelector('.search-input');
            const searchResults = searchBox.querySelector('.search-results');
            
            searchInput.addEventListener('input', (e) => {
                const query = e.target.value.toLowerCase().trim();
                
                if (query.length < 3) {
                    searchResults.innerHTML = '';
                    searchResults.style.display = 'none';
                    return;
                }
                
                this.performSearch(query, searchResults);
            });
        }
    }
    
    performSearch(query, resultsContainer) {
        const contentElements = document.querySelectorAll('.doc-content h2, .doc-content h3, .doc-content p');
        const results = [];
        
        contentElements.forEach(element => {
            const text = element.textContent.toLowerCase();
            if (text.includes(query)) {
                let section = element.closest('.doc-section');
                if (section) {
                    const sectionTitle = section.querySelector('h2').textContent;
                    const snippet = text.substring(0, 100) + '...';
                    
                    results.push({
                        title: sectionTitle,
                        snippet: snippet,
                        element: element,
                        sectionId: section.id
                    });
                }
            }
        });
        
        this.displaySearchResults(results, resultsContainer);
    }
    
    displaySearchResults(results, container) {
        if (results.length === 0) {
            container.innerHTML = '<div class="no-results">No results found</div>';
        } else {
            container.innerHTML = results.slice(0, 5).map(result => `
                <div class="search-result" data-section="${result.sectionId}">
                    <div class="result-title">${result.title}</div>
                    <div class="result-snippet">${result.snippet}</div>
                </div>
            `).join('');
            
            // Add click handlers
            container.querySelectorAll('.search-result').forEach(resultEl => {
                resultEl.addEventListener('click', () => {
                    const sectionId = resultEl.getAttribute('data-section');
                    const section = document.getElementById(sectionId);
                    if (section) {
                        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        container.innerHTML = '';
                        container.style.display = 'none';
                    }
                });
            });
        }
        
        container.style.display = 'block';
    }
    
    initProgressTracking() {
        // Create progress bar
        const progressBar = document.createElement('div');
        progressBar.className = 'reading-progress';
        progressBar.innerHTML = '<div class="progress-fill"></div>';
        
        document.body.appendChild(progressBar);
        
        const progressFill = progressBar.querySelector('.progress-fill');
        
        window.addEventListener('scroll', () => {
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight - windowHeight;
            const scrolled = window.scrollY;
            const progress = (scrolled / documentHeight) * 100;
            
            progressFill.style.width = `${Math.min(progress, 100)}%`;
        });
    }
}

// FAQ Interaction Enhancement
class FAQEnhancements {
    constructor() {
        this.initFAQSearch();
        this.initFAQAnalytics();
    }
    
    initFAQSearch() {
        const faqSection = document.querySelector('#faqs');
        if (!faqSection) return;
        
        // Add search box to FAQ section
        const searchBox = document.createElement('div');
        searchBox.className = 'faq-search';
        searchBox.innerHTML = `
            <input type="text" placeholder="Search FAQs..." class="faq-search-input">
        `;
        
        const faqTitle = faqSection.querySelector('h2');
        faqTitle.insertAdjacentElement('afterend', searchBox);
        
        const searchInput = searchBox.querySelector('.faq-search-input');
        const faqItems = faqSection.querySelectorAll('.faq-detail');
        
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            
            faqItems.forEach(item => {
                const text = item.textContent.toLowerCase();
                if (text.includes(query) || query === '') {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }
    
    initFAQAnalytics() {
        const faqItems = document.querySelectorAll('.faq-detail');
        
        faqItems.forEach(item => {
            const summary = item.querySelector('summary');
            
            summary.addEventListener('click', () => {
                const question = summary.textContent;
                console.log(`FAQ viewed: ${question}`);
                
                // You could send this data to analytics
                // analytics.track('FAQ Viewed', { question: question });
            });
        });
    }
}

// Copy Code Functionality
class CodeCopyFeature {
    constructor() {
        this.initCodeBlocks();
    }
    
    initCodeBlocks() {
        const codeBlocks = document.querySelectorAll('.code-example');
        
        codeBlocks.forEach(block => {
            const copyBtn = document.createElement('button');
            copyBtn.className = 'copy-code-btn';
            copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
            copyBtn.title = 'Copy code';
            
            block.style.position = 'relative';
            block.appendChild(copyBtn);
            
            copyBtn.addEventListener('click', async () => {
                const code = block.querySelector('code').textContent;
                
                try {
                    await navigator.clipboard.writeText(code);
                    copyBtn.innerHTML = '<i class="fas fa-check"></i>';
                    copyBtn.style.color = '#38a169';
                    
                    setTimeout(() => {
                        copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
                        copyBtn.style.color = '';
                    }, 2000);
                } catch (err) {
                    console.error('Failed to copy code:', err);
                }
            });
        });
    }
}

// Print/Export Functionality
class ExportFeatures {
    constructor() {
        this.initPrintButton();
        this.initPDFExport();
    }
    
    initPrintButton() {
        const header = document.querySelector('.doc-header .container');
        
        const printBtn = document.createElement('button');
        printBtn.className = 'print-btn';
        printBtn.innerHTML = '<i class="fas fa-print"></i> Print Guide';
        printBtn.style.cssText = `
            position: absolute;
            top: 1rem;
            right: 2rem;
            background: rgba(255,255,255,0.2);
            color: white;
            border: 1px solid rgba(255,255,255,0.3);
            padding: 0.5rem 1rem;
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.3s ease;
        `;
        
        printBtn.addEventListener('click', () => {
            window.print();
        });
        
        header.style.position = 'relative';
        header.appendChild(printBtn);
    }
    
    initPDFExport() {
        // This would require a PDF generation library
        // For now, we'll just add the button structure
        const navContent = document.querySelector('.nav-content');
        
        const exportBtn = document.createElement('button');
        exportBtn.className = 'export-pdf-btn';
        exportBtn.innerHTML = '<i class="fas fa-file-pdf"></i> Export PDF';
        exportBtn.style.cssText = `
            background: #e53e3e;
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s ease;
            margin-left: 1rem;
        `;
        
        exportBtn.addEventListener('click', () => {
            alert('PDF export feature coming soon!');
        });
        
        navContent.appendChild(exportBtn);
    }
}

// Keyboard Navigation
class KeyboardNavigation {
    constructor() {
        this.initKeyboardShortcuts();
    }
    
    initKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Only activate shortcuts when not typing in inputs
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                return;
            }
            
            switch (e.key) {
                case '/':
                    e.preventDefault();
                    const searchInput = document.querySelector('.search-input, .faq-search-input');
                    if (searchInput) {
                        searchInput.focus();
                    }
                    break;
                    
                case 'Escape':
                    // Clear search results
                    const searchResults = document.querySelector('.search-results');
                    if (searchResults) {
                        searchResults.innerHTML = '';
                        searchResults.style.display = 'none';
                    }
                    break;
                    
                case 'ArrowUp':
                    if (e.ctrlKey) {
                        e.preventDefault();
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                    break;
                    
                case 'ArrowDown':
                    if (e.ctrlKey) {
                        e.preventDefault();
                        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                    }
                    break;
            }
        });
    }
}

// Initialize all features when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new DocumentationPage();
    new FAQEnhancements();
    new CodeCopyFeature();
    new ExportFeatures();
    new KeyboardNavigation();
});

// Add CSS for additional features
const additionalStyles = `
<style>
.search-box {
    margin-bottom: 1.5rem;
}

.search-input, .faq-search-input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    font-size: 0.9rem;
}

.search-input:focus, .faq-search-input:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.search-results {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    box-shadow: 0 10px 25px rgba(0,0,0,0.1);
    max-height: 300px;
    overflow-y: auto;
    z-index: 100;
    display: none;
}

.search-result {
    padding: 1rem;
    border-bottom: 1px solid #f7fafc;
    cursor: pointer;
    transition: background 0.3s ease;
}

.search-result:hover {
    background: #f7fafc;
}

.search-result:last-child {
    border-bottom: none;
}

.result-title {
    font-weight: 600;
    color: #1a202c;
    margin-bottom: 0.25rem;
}

.result-snippet {
    font-size: 0.8rem;
    color: #4a5568;
}

.no-results {
    padding: 1rem;
    text-align: center;
    color: #a0aec0;
}

.faq-search {
    margin-bottom: 2rem;
}

.reading-progress {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background: rgba(255,255,255,0.3);
    z-index: 9999;
}

.progress-fill {
    height: 100%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    transition: width 0.3s ease;
    width: 0%;
}

.copy-code-btn {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    background: rgba(255,255,255,0.1);
    color: #e2e8f0;
    border: 1px solid rgba(255,255,255,0.2);
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.8rem;
    transition: all 0.3s ease;
}

.copy-code-btn:hover {
    background: rgba(255,255,255,0.2);
}

@media print {
    .doc-nav, .doc-sidebar, .back-btn, .print-btn, .export-pdf-btn {
        display: none !important;
    }
    
    .doc-layout {
        grid-template-columns: 1fr !important;
    }
    
    .doc-content {
        box-shadow: none !important;
        border: none !important;
    }
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', additionalStyles);
