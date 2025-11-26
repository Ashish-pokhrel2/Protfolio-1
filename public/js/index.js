document.addEventListener('DOMContentLoaded', function () {
    // Video Background Auto-play Fix
    const bgVideo = document.getElementById('bgVideo');
    if (bgVideo) {
        bgVideo.play().catch(error => {
            console.log('Video autoplay failed:', error);
            // Try playing with user interaction
            document.addEventListener('click', () => {
                bgVideo.play();
            }, { once: true });
        });
    }

    const navLinks = document.querySelectorAll('nav a[href^="/"]');
    const sections = document.querySelectorAll('section[id]');

    // Map routes to section IDs
    const routeMap = {
        '/': 'home',
        '/home': 'home',
        '/about': 'about',
        '/skills': 'skills',
        '/gallery': 'gallery',
        '/projects': 'projects',
        '/contact': 'contact'
    };

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

            history.pushState(null, null, route);

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



// Theme toggle - runs after DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  const html = document.documentElement;
  const themeText = document.getElementById("themeText");

  // Load theme or use default (dark)
  let theme = localStorage.getItem("theme") || "dark";

  function applyTheme() {
    if (theme === "light") {
      html.classList.remove("dark");
      if (themeText) themeText.textContent = "Dark Mode";
    } else {
      html.classList.add("dark");
      if (themeText) themeText.textContent = "Bright Mode";
    }
  }

  window.changeTheme = function() {
    theme = theme === "dark" ? "light" : "dark";
    localStorage.setItem("theme", theme);
    applyTheme();
  }

  applyTheme();
});



function directToProject(project){
    if (project == "nbk") {
      window.location.href = "https://nbkcollege.com"; 
    }

    else if(project == "chatmeDaddy"){
         window.location.href = "https://chatmedaddy.netlify.app/"; 

    }
    else if(project == "todoList"){
                window.location.href = "https://todo-list-mu-ebon-96.vercel.app/"; 
 
    }



}
//    const signupBtn = document.getElementById("signupBtn");
//    console.log(signupBtn)

//     // Scroll to top when Sign Up is clicked
//     signupBtn.addEventListener("click", () => {
function scrollFunction(){
   window.scrollTo({
     top: 0,
     behavior: "smooth"
   });
}

// ============================================
// IMAGE SLIDER FUNCTIONALITY
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const sliderWrapper = document.getElementById('sliderWrapper');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const indicators = document.querySelectorAll('#indicators button');
    const currentSlideEl = document.getElementById('currentSlide');
    
    if (!sliderWrapper) return; // Exit if slider doesn't exist on page
    
    let currentIndex = 0;
    const totalSlides = 3;
    let autoplayInterval;
    
    // Function to update slider position
    function updateSlider(index) {
        // Ensure index is within bounds
        if (index < 0) {
            currentIndex = totalSlides - 1;
        } else if (index >= totalSlides) {
            currentIndex = 0;
        } else {
            currentIndex = index;
        }
        
        // Move slider
        const offset = -currentIndex * 100;
        sliderWrapper.style.transform = `translateX(${offset}%)`;
        
        // Update current slide number
        currentSlideEl.textContent = currentIndex + 1;
        
        // Update indicator dots
        indicators.forEach((indicator, idx) => {
            if (idx === currentIndex) {
                indicator.classList.remove('bg-white/50');
                indicator.classList.add('bg-white');
            } else {
                indicator.classList.remove('bg-white');
                indicator.classList.add('bg-white/50');
            }
        });
    }
    
    // Next slide function
    function nextSlide() {
        updateSlider(currentIndex + 1);
    }
    
    // Previous slide function
    function prevSlide() {
        updateSlider(currentIndex - 1);
    }
    
    // Event listeners for navigation buttons
    nextBtn.addEventListener('click', () => {
        nextSlide();
        resetAutoplay();
    });
    
    prevBtn.addEventListener('click', () => {
        prevSlide();
        resetAutoplay();
    });
    
    // Event listeners for indicator dots
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            updateSlider(index);
            resetAutoplay();
        });
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevSlide();
            resetAutoplay();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
            resetAutoplay();
        }
    });
    
    // Touch/Swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    sliderWrapper.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    sliderWrapper.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swiped left - go to next slide
                nextSlide();
            } else {
                // Swiped right - go to previous slide
                prevSlide();
            }
            resetAutoplay();
        }
    }
    
    // Autoplay functionality
    function startAutoplay() {
        autoplayInterval = setInterval(() => {
            nextSlide();
        }, 5000); // Change slide every 5 seconds
    }
    
    function stopAutoplay() {
        clearInterval(autoplayInterval);
    }
    
    function resetAutoplay() {
        stopAutoplay();
        startAutoplay();
    }
    
    // Pause autoplay on hover
    const sliderContainer = sliderWrapper.parentElement;
    sliderContainer.addEventListener('mouseenter', stopAutoplay);
    sliderContainer.addEventListener('mouseleave', startAutoplay);
    
    // Start autoplay on page load
    startAutoplay();
    
    // Initialize slider
    updateSlider(0);
});
