/* ============================================
   SH GROUP — Website JavaScript
   Animations, Carousel, Scroll Effects
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // --- Preloader Animation ---
  const preloader = document.getElementById('preloader');
  const preloaderProgress = document.getElementById('preloaderProgress');
  
  if (preloader && preloaderProgress) {
    // Check if preloader has already run in this session
    if (sessionStorage.getItem('preloader_run')) {
      // Skip animation, hide preloader immediately
      preloader.style.display = 'none';
      preloader.classList.add('hidden');
      document.body.style.overflow = '';
      
      // Handle hash scroll rescue directly since we skipped the interval
      const hash = window.location.hash;
      if (hash) {
        const target = document.querySelector(hash);
        if (target) {
          const navbarEl = document.getElementById('navbar');
          const navHeight = navbarEl ? navbarEl.offsetHeight : 80;
          setTimeout(() => {
            window.scrollTo({
              top: target.offsetTop - navHeight,
              behavior: 'smooth'
            });
          }, 300);
        }
      }
    } else {
      // Run normal preloader animation
      let progress = 0;
      const progressInterval = setInterval(() => {
        progress += Math.random() * 15 + 5;
        if (progress >= 100) {
          progress = 100;
          clearInterval(progressInterval);
          preloaderProgress.style.width = '100%';
          
          // Set flag in sessionStorage
          sessionStorage.setItem('preloader_run', 'true');
          
          setTimeout(() => {
            preloader.classList.add('hidden');
            document.body.style.overflow = '';
            
            // Re-trigger scroll to hash target if present (blocked by preloader hidden overflow)
            const hash = window.location.hash;
            if (hash) {
              const target = document.querySelector(hash);
              if (target) {
                const navbarEl = document.getElementById('navbar');
                const navHeight = navbarEl ? navbarEl.offsetHeight : 80;
                setTimeout(() => {
                  window.scrollTo({
                    top: target.offsetTop - navHeight,
                    behavior: 'smooth'
                  });
                }, 300);
              }
            }
          }, 400);
        }
        preloaderProgress.style.width = progress + '%';
      }, 200);

      // Safety timeout - hide after 3s max
      setTimeout(() => {
        clearInterval(progressInterval);
        preloaderProgress.style.width = '100%';
        sessionStorage.setItem('preloader_run', 'true');
        setTimeout(() => preloader.classList.add('hidden'), 200);
      }, 3000);

      // Prevent scroll during preloader
      document.body.style.overflow = 'hidden';
    }
  }

  // --- Mobile Click-to-Call Banner ---
  const callBannerClose = document.getElementById('callBannerClose');
  const mobileCallBanner = document.getElementById('mobileCallBanner');

  if (callBannerClose && mobileCallBanner) {
    callBannerClose.addEventListener('click', () => {
      mobileCallBanner.classList.add('dismissed');
      // Move navbar to top when banner dismissed
      const navbar = document.getElementById('navbar');
      if (navbar) navbar.style.top = '0';
    });

    // Auto-hide banner on scroll down
    let bannerLastScrollY = 0;
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300 && window.scrollY > bannerLastScrollY) {
        mobileCallBanner.classList.add('dismissed');
      }
      bannerLastScrollY = window.scrollY;
    });
  }

  // --- Mobile Navigation Toggle ---
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  if (navToggle) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navLinks.classList.toggle('active');
    });

    // Close mobile menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navLinks.classList.remove('active');
      });
    });
  }

  // --- Navbar Scroll Effect ---
  const navbar = document.getElementById('navbar');
  let lastScrollY = 0;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScrollY = scrollY;
  });

  // --- Active Nav Link on Scroll ---
  const sections = document.querySelectorAll('section[id]');
  const navLinksAll = document.querySelectorAll('.nav-links a');

  function updateActiveNav() {
    const scrollPos = window.scrollY + 200;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollPos >= top && scrollPos < top + height) {
        navLinksAll.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav);

  // --- Scroll Reveal Animations ---
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -60px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // --- Animated Counter ---
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');
  let countersAnimated = false;

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !countersAnimated) {
        countersAnimated = true;
        animateCounters();
      }
    });
  }, { threshold: 0.5 });

  const statsBar = document.querySelector('.stats-bar');
  if (statsBar) counterObserver.observe(statsBar);

  function animateCounters() {
    statNumbers.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'));
      const duration = 2000;
      const step = target / (duration / 16);
      let current = 0;

      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        counter.textContent = Math.floor(current) + '+';
      }, 16);
    });
  }

  // --- Image Carousel / Slideshow ---
  const carouselTrack = document.getElementById('carouselTrack');
  const carouselDots = document.getElementById('carouselDots');
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');

  if (carouselTrack) {
    const slides = carouselTrack.querySelectorAll('.carousel-slide');
    let currentSlide = 0;
    let autoplayInterval;
    const autoplayDelay = 4000;

    // Create dots
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.classList.add('carousel-dot');
      if (i === 0) dot.classList.add('active');
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      dot.addEventListener('click', () => goToSlide(i));
      carouselDots.appendChild(dot);
    });

    const dots = carouselDots.querySelectorAll('.carousel-dot');

    function goToSlide(index) {
      // Remove active from all slides
      slides.forEach(s => s.classList.remove('active'));
      dots.forEach(d => d.classList.remove('active'));

      currentSlide = index;
      if (currentSlide >= slides.length) currentSlide = 0;
      if (currentSlide < 0) currentSlide = slides.length - 1;

      // Move track
      carouselTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
      
      // Activate current slide and dot
      slides[currentSlide].classList.add('active');
      dots[currentSlide].classList.add('active');
    }

    function nextSlide() {
      goToSlide(currentSlide + 1);
    }

    function prevSlide() {
      goToSlide(currentSlide - 1);
    }

    // Controls
    if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetAutoplay(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetAutoplay(); });

    // Autoplay
    function startAutoplay() {
      autoplayInterval = setInterval(nextSlide, autoplayDelay);
    }

    function resetAutoplay() {
      clearInterval(autoplayInterval);
      startAutoplay();
    }

    startAutoplay();

    // Pause on hover
    const carousel = document.getElementById('buildersCarousel');
    if (carousel) {
      carousel.addEventListener('mouseenter', () => clearInterval(autoplayInterval));
      carousel.addEventListener('mouseleave', startAutoplay);
    }

    // Touch/Swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    if (carousel) {
      carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });

      carousel.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
          if (diff > 0) {
            nextSlide();
          } else {
            prevSlide();
          }
          resetAutoplay();
        }
      }, { passive: true });
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') { prevSlide(); resetAutoplay(); }
      if (e.key === 'ArrowRight') { nextSlide(); resetAutoplay(); }
    });
  }

  // --- Gallery Lightbox ---
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const galleryItems = document.querySelectorAll('.gallery-item, .gallery-masonry-item');

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (img && lightbox && lightboxImg) {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });

  function closeLightbox() {
    if (lightbox) {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  // --- 3D Card Tilt Effect ---
  const serviceCards = document.querySelectorAll('.service-card, .why-card');

  serviceCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / centerY * -5;
      const rotateY = (x - centerX) / centerX * 5;

      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // --- Smooth Scroll for Anchor Links ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const navHeight = navbar ? navbar.offsetHeight : 80;
        const targetPosition = targetElement.offsetTop - navHeight;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // --- WhatsApp Button Entrance Animation ---
  const whatsappFloat = document.getElementById('whatsappFloat');
  if (whatsappFloat) {
    setTimeout(() => {
      whatsappFloat.style.opacity = '1';
      whatsappFloat.style.transform = 'translateY(0)';
    }, 2000);

    // Initialize hidden
    whatsappFloat.style.opacity = '0';
    whatsappFloat.style.transform = 'translateY(20px)';
    whatsappFloat.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  }

  // --- Parallax Effect for Hero ---
  const hero = document.querySelector('.hero');
  if (hero) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      const heroContent = hero.querySelector('.hero-content');
      if (heroContent && scrolled < window.innerHeight) {
        heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
        heroContent.style.opacity = 1 - (scrolled / (window.innerHeight * 0.8));
      }
    });
  }

  // --- Staggered Animation Helper ---
  function addStaggerDelay(elements, baseDelay = 0.1) {
    elements.forEach((el, i) => {
      el.style.transitionDelay = `${i * baseDelay}s`;
    });
  }

  // Apply stagger to various grids
  addStaggerDelay(document.querySelectorAll('.about-feature'), 0.08);

  console.log('✨ SH Group Website loaded successfully!');
  console.log('🌐 shgroup.co.in');
});

// --- Contact Form Handler ---
function handleFormSubmit(event) {
  event.preventDefault();

  const form = event.target;
  const name = form.querySelector('#contactName').value;
  const phone = form.querySelector('#contactPhone').value;
  const email = form.querySelector('#contactEmail').value;
  const division = form.querySelector('#contactDivision').value;
  const message = form.querySelector('#contactMessage').value;
  const submitBtn = document.getElementById('contactSubmitBtn');

  // Format message for WhatsApp
  const whatsappMessage = encodeURIComponent(
    `🔔 *New Inquiry from SH Group Website*\n\n` +
    `👤 *Name:* ${name}\n` +
    `📞 *Phone:* ${phone}\n` +
    `✉️ *Email:* ${email}\n` +
    `🏢 *Division:* ${division}\n` +
    `💬 *Message:* ${message}`
  );

  // Animate button
  const originalText = submitBtn.innerHTML;
  submitBtn.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
    Message Sent!
  `;
  submitBtn.style.background = 'linear-gradient(135deg, #25D366, #128C7E)';
  submitBtn.disabled = true;

  // Open WhatsApp with the form data
  setTimeout(() => {
    window.open(`https://wa.me/919849388477?text=${whatsappMessage}`, '_blank');
    
    // Reset form after 3 seconds
    setTimeout(() => {
      form.reset();
      submitBtn.innerHTML = originalText;
      submitBtn.style.background = '';
      submitBtn.disabled = false;
    }, 3000);
  }, 800);
}

/* ============================================
   CHATBOT LOGIC
   ============================================ */
(function() {
  const toggle = document.getElementById('chatbotToggle');
  const win = document.getElementById('chatbotWindow');
  const closeBtn = document.getElementById('chatbotClose');
  const messagesEl = document.getElementById('chatbotMessages');
  const inputEl = document.getElementById('chatbotInput');
  const sendBtn = document.getElementById('chatbotSend');
  const badge = toggle?.querySelector('.chatbot-badge');

  if (!toggle || !win) return;

  let chatOpen = false;
  let step = 'greeting';
  let userData = {};

  function getTime() {
    return new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  }

  function addBotMsg(text, extras = '') {
    const div = document.createElement('div');
    div.className = 'chat-msg bot';
    div.innerHTML = `
      <div class="chat-msg-avatar"><img src="assets/logos/sh-group-dp.webp" alt="SH"></div>
      <div>
        <div class="chat-msg-bubble">${text}</div>
        ${extras}
        <span class="chat-msg-time">SH Group · ${getTime()}</span>
      </div>`;
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function addUserMsg(text) {
    const div = document.createElement('div');
    div.className = 'chat-msg user';
    div.innerHTML = `
      <div>
        <div class="chat-msg-bubble">${text}</div>
        <span class="chat-msg-time" style="text-align:right;">${getTime()} · Sent</span>
      </div>`;
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function showTyping() {
    const div = document.createElement('div');
    div.className = 'chat-msg bot';
    div.id = 'typingMsg';
    div.innerHTML = `
      <div class="chat-msg-avatar"><img src="assets/logos/sh-group-dp.webp" alt="SH"></div>
      <div class="chat-msg-bubble">
        <div class="typing-indicator"><span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span></div>
      </div>`;
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function hideTyping() {
    const t = document.getElementById('typingMsg');
    if (t) t.remove();
  }

  function botReply(text, extras = '', delay = 1000) {
    showTyping();
    setTimeout(() => {
      hideTyping();
      addBotMsg(text, extras);
    }, delay);
  }

  function quickReplies(options) {
    return '<div class="chat-quick-replies">' +
      options.map(o => `<button class="chat-quick-btn" data-value="${o}">${o}</button>`).join('') +
      '</div>';
  }

  function showLeadForm() {
    const formHtml = `
      <div class="chat-form" id="chatLeadForm">
        <input type="text" placeholder="Your Name" id="chatName" required>
        <input type="tel" placeholder="Phone Number" id="chatPhone" required>
        <button class="chat-form-submit" id="chatFormSubmit">
          Send via WhatsApp ➜
        </button>
      </div>`;
    return formHtml;
  }

  // Open greeting
  function startChat() {
    if (messagesEl.children.length > 0) return;
    setTimeout(() => {
      addBotMsg('👋 Welcome to <strong>SH Group!</strong><br>How can I help you today?',
        quickReplies(['SH Traders', 'SH Builders', 'SH Medical', 'Contact Us', 'Get a Quote']));
      step = 'menu';
    }, 500);
  }

  // Handle quick reply clicks
  messagesEl.addEventListener('click', (e) => {
    if (e.target.classList.contains('chat-quick-btn')) {
      const val = e.target.getAttribute('data-value');
      handleUserChoice(val);
    }
    if (e.target.id === 'chatFormSubmit' || e.target.closest('#chatFormSubmit')) {
      e.preventDefault();
      const name = document.getElementById('chatName')?.value;
      const phone = document.getElementById('chatPhone')?.value;
      if (name && phone) {
        userData.name = name;
        userData.phone = phone;
        const msg = encodeURIComponent(
          `🔔 *New Lead from SH Group Chatbot*\n\n` +
          `👤 *Name:* ${name}\n📞 *Phone:* ${phone}\n` +
          `🏢 *Interest:* ${userData.interest || 'General'}\n💬 *Via:* Website Chatbot`
        );
        addUserMsg(`${name} · ${phone}`);
        botReply('✅ Thank you! Redirecting you to WhatsApp for instant support...', '', 800);
        setTimeout(() => {
          window.open(`https://wa.me/919849388477?text=${msg}`, '_blank');
        }, 1800);
        step = 'done';
      }
    }
  });

  function handleUserChoice(val) {
    addUserMsg(val);

    // Remove old quick reply buttons
    document.querySelectorAll('.chat-quick-replies').forEach(el => el.remove());

    userData.interest = val;

    if (val === 'SH Traders') {
      botReply('🏗️ <strong>SH Traders</strong> supplies premium building materials including:<br><br>• Cement — UltraTech, ACC, Ambuja, Dalmia, Ramco, KCP, Birla<br>• Steel — Tata Steel, Jindal, JSW, Kamdhenu<br>• AAC Blocks, Red Bricks, Cover Blocks<br>• Binding Wire & Construction Chemicals<br><br>Would you like to get a price quote?',
        quickReplies(['Get Price Quote', 'Talk to Expert', 'Back to Menu']), 1200);
    } else if (val === 'SH Builders') {
      botReply('🏠 <strong>SH Builders</strong> offers:<br><br>• Complete House Construction<br>• 3D Elevation Design<br>• Floor Planning (Vastu compliant)<br>• Real Estate Services<br><br>Since 2020, we\'ve completed 20+ projects!',
        quickReplies(['Free Consultation', 'View Projects', 'Get Quote', 'Back to Menu']), 1200);
    } else if (val === 'SH Medical') {
      botReply('🔬 <strong>SH Medical Devices</strong> provides:<br><br>• Precision Surgical Instruments<br>• Complete OT Kits<br>• Scalpels, Forceps, Scissors<br>• Needle Holders & Retractors<br><br>Supplying quality instruments across India!',
        quickReplies(['Request Catalog', 'Contact Sales', 'Back to Menu']), 1200);
    } else if (val === 'Contact Us') {
      botReply('📞 <strong>Contact SH Group:</strong><br><br>📱 <a href="tel:+919849388477" style="color:#1565c0;">+91 98493 88477</a><br>✉️ <a href="mailto:cjangaiah@gmail.com" style="color:#1565c0;">cjangaiah@gmail.com</a><br>🌐 <a href="https://shgroup.co.in" style="color:#1565c0;">shgroup.co.in</a><br><br>Or share your details and we\'ll call you back!',
        quickReplies(['Call Back Request', 'WhatsApp Chat', 'Back to Menu']), 1200);
    } else if (val === 'Get a Quote' || val === 'Get Price Quote' || val === 'Get Quote' || val === 'Free Consultation' || val === 'Request Catalog' || val === 'Contact Sales' || val === 'Call Back Request') {
      botReply('📝 Please share your details so we can reach out to you:', showLeadForm(), 800);
      step = 'form';
    } else if (val === 'WhatsApp Chat') {
      addUserMsg('Opening WhatsApp...');
      window.open('https://wa.me/919849388477?text=Hi%2C%20I%27m%20interested%20in%20SH%20Group%20services', '_blank');
    } else if (val === 'View Projects') {
      botReply('🏗️ Check out our latest projects in the <strong>SH Builders</strong> section above! Scroll up to see our gallery of stunning house elevations.',
        quickReplies(['Get Quote', 'Back to Menu']), 800);
    } else if (val === 'Talk to Expert') {
      botReply('📝 Share your details and our expert will call you within 30 minutes:', showLeadForm(), 800);
      step = 'form';
    } else if (val === 'Back to Menu') {
      botReply('What else can I help you with?',
        quickReplies(['SH Traders', 'SH Builders', 'SH Medical', 'Contact Us', 'Get a Quote']), 600);
      step = 'menu';
    }
  }

  // Free text input
  function handleTextInput() {
    const text = inputEl.value.trim();
    if (!text) return;
    inputEl.value = '';
    addUserMsg(text);

    const lower = text.toLowerCase();
    if (lower.includes('price') || lower.includes('cost') || lower.includes('rate') || lower.includes('quote')) {
      botReply('📝 I\'d love to help with pricing! Please share your details:', showLeadForm(), 1000);
    } else if (lower.includes('cement') || lower.includes('steel') || lower.includes('material') || lower.includes('brick')) {
      handleUserChoice('SH Traders');
    } else if (lower.includes('build') || lower.includes('house') || lower.includes('construction') || lower.includes('elevation')) {
      handleUserChoice('SH Builders');
    } else if (lower.includes('medical') || lower.includes('surgical') || lower.includes('hospital')) {
      handleUserChoice('SH Medical');
    } else if (lower.includes('contact') || lower.includes('phone') || lower.includes('call') || lower.includes('number')) {
      handleUserChoice('Contact Us');
    } else if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
      botReply('Hello! 😊 Welcome to SH Group. How can I assist you today?',
        quickReplies(['SH Traders', 'SH Builders', 'SH Medical', 'Get a Quote']), 600);
    } else {
      botReply('Thanks for your message! Let me connect you with the right team.',
        quickReplies(['SH Traders', 'SH Builders', 'SH Medical', 'Contact Us']), 1000);
    }
  }

  // Event Listeners
  toggle.addEventListener('click', () => {
    chatOpen = !chatOpen;
    if (chatOpen) {
      win.classList.add('active');
      if (badge) badge.style.display = 'none';
      startChat();
      inputEl.focus();
    } else {
      win.classList.remove('active');
    }
  });

  closeBtn.addEventListener('click', () => {
    chatOpen = false;
    win.classList.remove('active');
  });

  sendBtn.addEventListener('click', handleTextInput);
  inputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleTextInput();
  });
})();

/* ============================================
   HERO PARTICLES
   ============================================ */
(function() {
  const canvas = document.getElementById('heroParticles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  let w, h;
  const PARTICLE_COUNT = 60;
  const CONNECT_DIST = 120;
  const colors = [
    'rgba(212, 175, 55, 0.6)',
    'rgba(255, 255, 255, 0.4)',
    'rgba(21, 101, 192, 0.5)',
    'rgba(255, 255, 255, 0.25)',
    'rgba(212, 175, 55, 0.35)'
  ];

  function resize() {
    const hero = canvas.parentElement;
    w = canvas.width = hero.offsetWidth;
    h = canvas.height = hero.offsetHeight;
  }

  function createParticle() {
    return {
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      r: Math.random() * 2.5 + 1,
      color: colors[Math.floor(Math.random() * colors.length)],
      pulse: Math.random() * Math.PI * 2
    };
  }

  function init() {
    resize();
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(createParticle());
    }
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECT_DIST) {
          const alpha = (1 - dist / CONNECT_DIST) * 0.15;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(212, 175, 55, ${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    // Draw particles
    particles.forEach(p => {
      p.pulse += 0.02;
      const glow = Math.sin(p.pulse) * 0.3 + 0.7;
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * glow, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();

      // Glow effect
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * glow * 3, 0, Math.PI * 2);
      const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * glow * 3);
      grad.addColorStop(0, p.color);
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  init();
  draw();
  window.addEventListener('resize', () => { resize(); });
})();

/* ============================================
   SCROLL PROGRESS BAR
   ============================================ */
(function() {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const pct = (scrolled / maxScroll) * 100;
    bar.style.width = pct + '%';
  });
})();

/* ============================================
   BACK TO TOP
   ============================================ */
(function() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  });
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();
