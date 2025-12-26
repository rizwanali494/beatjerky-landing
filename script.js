// ===== Scroll to Top on Page Load/Refresh =====
// Prevent browser from restoring scroll position
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

// Scroll to top immediately on page load
window.addEventListener('beforeunload', () => {
    window.scrollTo(0, 0);
});

// Ensure scroll is at top when page loads
window.addEventListener('load', () => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
});

// Also scroll to top on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.scrollTo(0, 0);
    });
} else {
    window.scrollTo(0, 0);
}

// ===== Navigation Toggle =====
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
const navbar = document.querySelector('.navbar');

if (navToggle) {
    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        navToggle.classList.toggle('active');
    });
}

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// ===== Scroll Progress Indicator =====
const scrollProgress = document.getElementById('scrollProgress');
const scrollProgressBar = scrollProgress?.querySelector('.scroll-progress-bar');

function updateScrollProgress() {
    if (!scrollProgressBar) return;
    
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollableHeight = documentHeight - windowHeight;
    const scrollPercentage = (scrollTop / scrollableHeight) * 100;
    
    scrollProgressBar.style.width = `${Math.min(scrollPercentage, 100)}%`;
}

// ===== Navbar Scroll Effect =====
let lastScroll = 0;
let ticking = false;

function updateOnScroll() {
    const currentScroll = window.pageYOffset;
    
    // Update scroll progress
    updateScrollProgress();
    
    // Update navbar
    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Update parallax effects
    updateParallax();
    
    lastScroll = currentScroll;
    ticking = false;
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(updateOnScroll);
        ticking = true;
    }
}, { passive: true });

// ===== Enhanced Smooth Scrolling for Anchor Links =====
function smoothScrollTo(target, offset = 84) {
    const targetElement = typeof target === 'string' ? document.querySelector(target) : target;
    if (!targetElement) return;
    
    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const duration = Math.min(Math.abs(distance) * 0.5, 1000); // Max 1 second
    let start = null;
    
    function easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }
    
    function animation(currentTime) {
        if (start === null) start = currentTime;
        const timeElapsed = currentTime - start;
        const progress = Math.min(timeElapsed / duration, 1);
        const ease = easeInOutCubic(progress);
        
        window.scrollTo(0, startPosition + distance * ease);
        
        if (timeElapsed < duration) {
            requestAnimationFrame(animation);
        }
    }
    
    requestAnimationFrame(animation);
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href !== '#demo') {
            e.preventDefault();
            smoothScrollTo(href, 84); // Account for navbar + progress bar
        }
    });
});

// ===== AOS (Animate On Scroll) Implementation =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('aos-animate');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all elements with data-aos attribute
document.querySelectorAll('[data-aos]').forEach(el => {
    observer.observe(el);
});

// ===== Screenshot Carousel =====
const carouselTrack = document.querySelector('.carousel-track');
const prevBtn = document.querySelector('.carousel-btn.prev');
const nextBtn = document.querySelector('.carousel-btn.next');
const screenshotItems = document.querySelectorAll('.screenshot-item');

let currentIndex = 0;
const itemsToShow = 3;
const gap = 8; // 0.5rem in pixels

function updateCarousel() {
    if (!carouselTrack) return;
    
    const itemWidth = screenshotItems[0]?.offsetWidth || 300;
    const translateX = -(currentIndex * (itemWidth + gap));
    
    carouselTrack.style.transform = `translateX(${translateX}px)`;
    
    // Update button states
    if (prevBtn) {
        prevBtn.disabled = currentIndex === 0;
        prevBtn.style.opacity = currentIndex === 0 ? '0.5' : '1';
    }
    
    if (nextBtn) {
        const maxIndex = Math.max(0, screenshotItems.length - itemsToShow);
        nextBtn.disabled = currentIndex >= maxIndex;
        nextBtn.style.opacity = currentIndex >= maxIndex ? '0.5' : '1';
    }
}

if (prevBtn) {
    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateCarousel();
        }
    });
}

if (nextBtn) {
    nextBtn.addEventListener('click', () => {
        const maxIndex = Math.max(0, screenshotItems.length - itemsToShow);
        if (currentIndex < maxIndex) {
            currentIndex++;
            updateCarousel();
        }
    });
}

// Handle window resize
// let resizeTimer;
// window.addEventListener('resize', () => {
//     clearTimeout(resizeTimer);
//     resizeTimer = setTimeout(() => {
//         updateCarousel();
//     }, 250);
// });

// Initialize carousel
// updateCarousel();

// // ===== Auto-play carousel (optional)
// let autoPlayInterval;
// function startAutoPlay() {
//     autoPlayInterval = setInterval(() => {
//         const maxIndex = Math.max(0, screenshotItems.length - itemsToShow);
//         if (currentIndex < maxIndex) {
//             currentIndex++;
//         } else {
//             currentIndex = 0;
//         }
//         updateCarousel();
//     }, 5000);
// }

// // Pause on hover
// if (carouselTrack) {
//     carouselTrack.addEventListener('mouseenter', () => {
//         if (autoPlayInterval) {
//             clearInterval(autoPlayInterval);
//         }
//     });
    
//     carouselTrack.addEventListener('mouseleave', () => {
//         startAutoPlay();
//     });
// }

// Touch/swipe support for carousel
let touchStartX = 0;
let touchEndX = 0;

if (carouselTrack) {
    carouselTrack.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    carouselTrack.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
}

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swipe left - next
            const maxIndex = Math.max(0, screenshotItems.length - itemsToShow);
            if (currentIndex < maxIndex) {
                currentIndex++;
                updateCarousel();
            }
        } else {
            // Swipe right - previous
            if (currentIndex > 0) {
                currentIndex--;
                updateCarousel();
            }
        }
    }
}

// ===== Contact Form Handling =====
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');
        
        // Simple validation
        if (!name || !email || !message) {
            showNotification('Please fill in all fields', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }
        
        // Simulate form submission
        showNotification('Thank you for your message! We\'ll get back to you soon.', 'success');
        contactForm.reset();
        
        // In a real application, you would send the data to a server here
        // Example: await fetch('/api/contact', { method: 'POST', body: formData });
    });
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '100px',
        right: '20px',
        padding: '1rem 2rem',
        borderRadius: '12px',
        color: '#fff',
        fontWeight: '600',
        zIndex: '10000',
        opacity: '0',
        transform: 'translateX(100px)',
        transition: 'all 0.3s ease',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
    });
    
    if (type === 'success') {
        notification.style.background = 'linear-gradient(135deg, #B717DB 0%, #D127AE 100%)';
    } else {
        notification.style.background = 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)';
    }
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// ===== Enhanced Parallax Effects =====
function updateParallax() {
    const scrolled = window.pageYOffset;
    const windowHeight = window.innerHeight;
    
    // Hero background parallax with scale effect
    const heroBg = document.querySelector('.hero-background');
    if (heroBg) {
        const rect = heroBg.getBoundingClientRect();
        const elementTop = rect.top + window.pageYOffset;
        const distance = scrolled - elementTop;
        const yPos = distance * 0.4;
        const scale = 1 + Math.min((distance / windowHeight) * 0.1, 0.15);
        
        heroBg.style.transform = `translateY(${yPos}px) scale(${scale})`;
        heroBg.style.setProperty('--parallax-y', `${yPos * 0.3}px`);
    }
    
    // AI background parallax with scale effect
    const aiBg = document.querySelector('.ai-background');
    if (aiBg) {
        const rect = aiBg.getBoundingClientRect();
        const elementTop = rect.top + window.pageYOffset;
        const distance = scrolled - elementTop;
        const yPos = distance * 0.25;
        const scale = 1 + Math.min((distance / windowHeight) * 0.08, 0.12);
        
        aiBg.style.transform = `translateY(${yPos}px) scale(${scale})`;
        aiBg.style.setProperty('--parallax-y', `${yPos * 0.2}px`);
    }
}

// ===== Button Hover Ripple Effect Enhancement =====
document.querySelectorAll('.btn-primary').forEach(btn => {
    btn.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Add ripple styles dynamically
const style = document.createElement('style');
style.textContent = `
    .btn-primary {
        position: relative;
        overflow: hidden;
    }
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ===== Lazy Loading for Images (if you add images later) =====
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ===== Dynamic Hero Background Animation =====
function createFloatingOrbs() {
    const heroBackground = document.querySelector('.hero-background');
    if (!heroBackground) return;
    
    for (let i = 0; i < 5; i++) {
        const orb = document.createElement('div');
        orb.className = 'floating-orb';
        orb.style.cssText = `
            position: absolute;
            width: ${100 + Math.random() * 200}px;
            height: ${100 + Math.random() * 200}px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(183, 23, 219, 0.2) 0%, transparent 70%);
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: float ${10 + Math.random() * 10}s ease-in-out infinite;
            animation-delay: ${Math.random() * 5}s;
        `;
        heroBackground.appendChild(orb);
    }
}

// Add floating orb animation
const orbStyle = document.createElement('style');
orbStyle.textContent = `
    @keyframes float {
        0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.5;
        }
        33% {
            transform: translate(30px, -30px) scale(1.1);
            opacity: 0.8;
        }
        66% {
            transform: translate(-20px, 20px) scale(0.9);
            opacity: 0.6;
        }
    }
`;
document.head.appendChild(orbStyle);

// Initialize floating orbs
createFloatingOrbs();

// ===== Performance Optimization: Debounce Scroll Events =====
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debounce to scroll handlers
const debouncedScroll = debounce(() => {
    // Scroll-dependent operations
}, 10);

window.addEventListener('scroll', debouncedScroll);

// ===== Initialize on DOM Load =====
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all features
    updateCarousel();
    
    // Add loaded class to body for fade-in animation
    document.body.classList.add('loaded');
});

// ===== Keyboard Navigation for Carousel =====
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' && prevBtn) {
        prevBtn.click();
    } else if (e.key === 'ArrowRight' && nextBtn) {
        nextBtn.click();
    }
});

// ===== Accessibility: Focus Management =====
document.querySelectorAll('a, button').forEach(element => {
    element.addEventListener('focus', function() {
        this.style.outline = '2px solid #B717DB';
        this.style.outlineOffset = '2px';
    });
    
    element.addEventListener('blur', function() {
        this.style.outline = '';
        this.style.outlineOffset = '';
    });
});

// ===== Watch Demo Button Handler =====
document.querySelectorAll('a[href="#demo"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        // You can implement a modal or redirect to a video here
        showNotification('Demo video coming soon!', 'success');
    });
});

console.log('BeatJerky landing page loaded successfully! 🎵');

