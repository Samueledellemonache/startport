document.addEventListener("DOMContentLoaded", () => {
    console.log("Script loaded");

    // Cache DOM elements
    const elements = { 
        header: document.querySelector(".sticky-header"),
        navbarToggler: document.getElementById("navbar-toggler"),
        navbarCollapse: document.getElementById("navbar-collapse"),
        modal: document.getElementById("successModal"),
        span: document.querySelector(".close"),
        form: document.querySelector('form')
    };

    // Scroll handler
    const handleScroll = () => {
        if (!elements.header) return;
        const isScrolled = window.scrollY > 50;
        elements.header.style.backgroundColor = isScrolled ? "rgba(19, 19, 19, 0.9)" : "rgba(19, 19, 19, 1)";
        elements.header.style.boxShadow = isScrolled ? "0 2px 10px rgba(0, 0, 0, 0.5)" : "none";
    };

    // Navbar functionality (fixed)
    const navbarController = () => {
        if (!elements.navbarToggler || !elements.navbarCollapse) return;

        const toggleNavbar = () => {
            const isVisible = elements.navbarCollapse.style.display === "block";
            elements.navbarCollapse.style.display = isVisible ? "none" : "block";
        };

        const closeNavbar = () => {
            elements.navbarCollapse.style.display = "none";
        };

        // Initialize navbar state
        elements.navbarCollapse.style.display = "none";

        elements.navbarToggler.addEventListener("click", toggleNavbar);

        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                closeNavbar();
                
                // Handle internal navigation
                if (link.href.includes(window.location.host)) {
                    e.preventDefault();
                    const url = new URL(link.href);
                    
                    if (url.pathname === window.location.pathname) {
                        // Same page anchor link
                        const targetId = url.hash.substring(1);
                        const targetSection = document.getElementById(targetId);
                        targetSection?.scrollIntoView({ behavior: 'smooth' });
                    } else {
                        // Different page navigation
                        window.location.href = url.href;
                    }
                }
            });
        });

        elements.navbarCollapse.addEventListener('mouseleave', closeNavbar);
    };

    // Form handling
    const formController = () => {
        if (!elements.form) return;

        const handleFormSubmit = (event) => {
            event.preventDefault();
            const formData = new FormData(elements.form);

            fetch('https://formspree.io/f/xnnjlaly', {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            })
            .then(response => {
                if (response.ok && elements.modal) {
                    elements.modal.style.display = "block";
                    elements.form.reset();
                }
            })
            .catch(error => console.error('Error:', error));
        };

        elements.form.addEventListener('submit', handleFormSubmit);
        
        if (elements.span) {
            elements.span.addEventListener('click', () => {
                elements.modal.style.display = "none";
            });
        }

        window.addEventListener('click', (event) => {
            if (event.target === elements.modal) {
                elements.modal.style.display = "none";
            }
        });
    };

    // Skill item tooltips
    const skillController = () => {
        document.querySelectorAll('.skill-item').forEach(item => {
            const handleSkillHover = (e) => {
                const rect = item.getBoundingClientRect();
                let left = e.clientX - rect.left;
                let top = e.clientY - rect.top + 20;
                
                left = Math.max(0, Math.min(left, rect.width));
                item.style.setProperty('--tooltip-x', `${left}px`);
                item.style.setProperty('--tooltip-y', `${top}px`);
            };

            item.addEventListener('mousemove', handleSkillHover);
        });
    };

    // PDF handling
    const pdfController = () => {
        document.querySelectorAll('.open-pdf').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const pdfUrl = button.dataset.pdf || button.getAttribute('onclick')?.match(/'([^']+)'/)?.[1];
                if (pdfUrl) window.open(pdfUrl, '_blank');
            });
        });
    };

    // Portfolio page controller
    const portfolioController = () => {
        if (!window.location.pathname.includes('portfolio.html')) return;
        
        document.querySelectorAll('.portfolio-item').forEach(item => {
            item.style.cursor = 'pointer';
            item.addEventListener('click', (e) => {
                if (!e.target.closest('.open-pdf')) {
                    const pdfUrl = item.dataset.pdf;
                    if (pdfUrl) window.open(pdfUrl, '_blank');
                }
            });
        });
    };

    // Initialize all controllers
    const init = () => {
        window.addEventListener("scroll", handleScroll);
        handleScroll(); // Initial scroll check
        navbarController();
        formController();
        skillController();
        pdfController();
        portfolioController();
    };

    init();
});