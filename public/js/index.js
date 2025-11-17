document.addEventListener('DOMContentLoaded', function () {
    const navLinks = document.querySelectorAll('nav a[href^="/"]');
    const sections = document.querySelectorAll('section[id]');

    // Map routes to section IDs
    const routeMap = {
        '/': 'home',
        '/home': 'home',
        '/about': 'about',
        '/skills': 'skills',
        '/projects': 'projects',
        '/contact': 'contact'
    };

    // Get current route and scroll to section
    function scrollToSection(route) {
        const sectionId = routeMap[route];
        if (sectionId) {
            const targetSection = document.getElementById(sectionId);
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        }
    }

    // Update active navigation link based on scroll position
    function updateActiveNav() {
        let current = '';
        const scrollPosition = window.scrollY;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = sectionId;
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('text-indigo-500');
            const href = link.getAttribute('href');
            const sectionId = routeMap[href];

            if (sectionId === current) {
                link.classList.add('text-indigo-500');
            }
        });

        // Update URL based on current section
        if (current) {
            const currentRoute = current === 'home' ? '/' : '/' + current;
            if (window.location.pathname !== currentRoute) {
                history.replaceState(null, null, currentRoute);
            }
        }
    }

    // Handle navigation clicks
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const route = this.getAttribute('href');

            // Update browser history
            history.pushState(null, null, route);

            // Scroll to section
            scrollToSection(route);
        });
    });

    // Handle scroll event
    window.addEventListener('scroll', updateActiveNav);

    // Handle browser back/forward buttons
    window.addEventListener('popstate', function () {
        scrollToSection(window.location.pathname);
    });

    // Initial scroll on page load based on URL
    scrollToSection(window.location.pathname);

    // Initial active nav update
    setTimeout(() => {
        updateActiveNav();
    }, 100);

    // Contact Form Submission
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Get form data
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                topic: document.getElementById('topic').value,
                message: document.getElementById('message').value
            };

            // Disable submit button and show loading state
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';

            try {
                // Send POST request to backend
                const response = await fetch('/send-email', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                });

                const result = await response.json();

                if (result.success) {
                    // Success toast notification
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: 'Message sent successfully!',
                        showConfirmButton: false,
                        timer: 3000,
                        toast: true,
                        timerProgressBar: true
                    });
                    contactForm.reset(); // Clear form
                } else {
                    // Error toast notification
                    Swal.fire({
                        position: 'top-end',
                        icon: 'error',
                        title: 'Failed to send message',
                        showConfirmButton: false,
                        timer: 3000,
                        toast: true,
                        timerProgressBar: true
                    });
                }

            } catch (error) {
                console.error('Form submission error:', error);
                // Error toast notification
                Swal.fire({
                    position: 'top-end',
                    icon: 'error',
                    title: 'An error occurred',
                    showConfirmButton: false,
                    timer: 3000,
                    toast: true,
                    timerProgressBar: true
                });
            } finally {
                // Re-enable submit button
                submitBtn.disabled = false;
                submitBtn.textContent = 'Send Message';
            }
        });
    }
});