// ============================================
// 滕王阁数字之境 · 交互脚本
// ============================================

(function() {
  'use strict';

  // --- 自定义光标 ---
  const cursor = document.getElementById('cursorBrush');
  let cursorX = 0, cursorY = 0;

  document.addEventListener('mousemove', (e) => {
    cursorX = e.clientX;
    cursorY = e.clientY;
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
  });

  document.querySelectorAll('a, button, .ticket-flip, .poem-card, .food-card, .map-pin, .filter-tag, .accordion-header').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
  });

  document.addEventListener('mousedown', () => {
    cursor.classList.add('click');
    setTimeout(() => cursor.classList.remove('click'), 300);
  });

  // --- 卷轴进度条 ---
  const scrollProgress = document.getElementById('scrollProgress');
  const scrollKnob = document.getElementById('scrollKnob');

  function updateScrollProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = Math.min(scrollTop / docHeight, 1);
    scrollProgress.style.setProperty('--progress', progress * 100 + '%');
    scrollKnob.style.top = (progress * 188) + 'px';
    scrollProgress.querySelector('::before') // CSS handles this
    scrollProgress.style.cssText += `--progress:${progress}`;
  }

  window.addEventListener('scroll', updateScrollProgress);

  // --- 导航栏滚动效果 ---
  const navCapsule = document.getElementById('navCapsule');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
      navCapsule.classList.add('scrolled');
    } else {
      navCapsule.classList.remove('scrolled');
    }
  });

  // 导航高亮
  const sections = document.querySelectorAll('.section, .hero, .map-section, .footer-section');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 200;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('data-section') === current) {
        link.classList.add('active');
      }
    });
  });

  // --- 深色模式切换 ---
  const themeToggle = document.getElementById('themeToggle');
  let isDark = false;

  themeToggle.addEventListener('click', () => {
    isDark = !isDark;
    document.documentElement.setAttribute('data-theme', isDark ? 'night' : '');
    themeToggle.textContent = isDark ? '☀️' : '🌙';
  });

  // --- 水墨粒子画布 ---
  const heroCanvas = document.getElementById('hero-canvas');
  if (heroCanvas) {
    const ctx = heroCanvas.getContext('2d');
    let particles = [];

    function resizeHeroCanvas() {
      heroCanvas.width = window.innerWidth;
      heroCanvas.height = window.innerHeight;
    }

    resizeHeroCanvas();
    window.addEventListener('resize', resizeHeroCanvas);

    class InkParticle {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * heroCanvas.width;
        this.y = Math.random() * heroCanvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.15 + 0.02;
        this.life = Math.random() * 200 + 100;
        this.maxLife = this.life;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life--;
        if (this.life <= 0 || this.x < 0 || this.x > heroCanvas.width || this.y < 0 || this.y > heroCanvas.height) {
          this.reset();
        }
      }
      draw() {
        const alpha = this.opacity * (this.life / this.maxLife);
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(245, 239, 230, ${alpha})`;
        ctx.fill();
      }
    }

    for (let i = 0; i < 80; i++) {
      particles.push(new InkParticle());
    }

    function animateParticles() {
      ctx.clearRect(0, 0, heroCanvas.width, heroCanvas.height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      requestAnimationFrame(animateParticles);
    }

    animateParticles();
  }

  // --- Swiper 时间轴 ---
  new Swiper('.timeline-swiper', {
    slidesPerView: 'auto',
    spaceBetween: 24,
    freeMode: true,
    grabCursor: true,
    pagination: false,
  });

  // --- GSAP ScrollTrigger 动画 ---
  gsap.registerPlugin(ScrollTrigger);

  // 滚动入场
  document.querySelectorAll('.reveal').forEach(el => {
    // 如果元素已在视口内（子页面首屏），立即显示
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.9) {
      el.classList.add('visible');
    }
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      onEnter: () => el.classList.add('visible'),
    });
  });

  // 首屏视差
  const heroBg = document.querySelector('.hero-bg');
  const heroSection = document.querySelector('.hero');
  if (heroBg && heroSection) {
    gsap.to(heroBg, {
      scrollTrigger: {
        trigger: heroSection,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
      y: 100,
      opacity: 0.3,
    });
  }

  // 名句动画
  document.querySelectorAll('.quote-showcase').forEach(quote => {
    gsap.from(quote.querySelector('.big-quote'), {
      scrollTrigger: {
        trigger: quote,
        start: 'top 80%',
      },
      y: 30,
      opacity: 0,
      duration: 1,
      ease: 'power2.out',
    });
  });

  // --- 门票翻转 ---
  const ticketFlip = document.getElementById('ticketFlip');
  if (ticketFlip) {
    ticketFlip.addEventListener('click', () => {
      ticketFlip.classList.toggle('flipped');
    });
  }

  // --- 折叠面板 ---
  document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const body = item.querySelector('.accordion-body');
      const isOpen = item.classList.contains('open');

      // 关闭其他
      document.querySelectorAll('.accordion-item.open').forEach(openItem => {
        if (openItem !== item) {
          openItem.classList.remove('open');
          openItem.querySelector('.accordion-body').style.maxHeight = '0';
        }
      });

      if (isOpen) {
        item.classList.remove('open');
        body.style.maxHeight = '0';
      } else {
        item.classList.add('open');
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });

  // --- 阁内各层导览（手风琴） ---
  document.querySelectorAll('.floor-item').forEach(item => {
    item.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.floor-item.open').forEach(openItem => {
        openItem.classList.remove('open');
      });
      if (!isOpen) {
        item.classList.add('open');
      }
    });
  });

  // --- 筛选标签 ---
  const filterTags = document.querySelectorAll('.filter-tag');
  const foodCards = document.querySelectorAll('.food-card');

  filterTags.forEach(tag => {
    tag.addEventListener('click', () => {
      filterTags.forEach(t => t.classList.remove('active'));
      tag.classList.add('active');

      const filter = tag.dataset.filter;
      foodCards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = '';
          gsap.from(card, { opacity: 0, y: 20, duration: 0.4 });
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // --- 灯箱效果 ---
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');

  document.querySelectorAll('[data-lightbox] img, .map-static img').forEach(img => {
    img.addEventListener('click', () => {
      lightboxImg.src = img.src;
      lightbox.classList.add('active');
    });
  });

  lightboxClose.addEventListener('click', () => {
    lightbox.classList.remove('active');
  });

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      lightbox.classList.remove('active');
    }
  });

  // --- 懒加载 ---
  const lazyImages = document.querySelectorAll('.lazy-img');

  // 强制刷新所有图片 src，绕过浏览器缓存
  lazyImages.forEach(img => {
    if (img.src && !img.src.includes('?v=')) {
      img.src = img.src + '?v=' + Date.now();
    }
  });

  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.complete && img.naturalWidth > 0) {
          img.classList.add('loaded');
        } else {
          img.onload = () => img.classList.add('loaded');
          img.onerror = () => {
            img.style.opacity = '0.15';
            img.classList.add('loaded');
          };
        }
        imageObserver.unobserve(img);
      }
    });
  }, { rootMargin: '100px' });

  lazyImages.forEach(img => imageObserver.observe(img));

  // --- 视差横幅：滚动时背景缓动 + 进入视口触发文字动画 ---
  const parallaxBanners = document.querySelectorAll('.section-parallax');

  // 进入视口检测
  const parallaxObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
      }
    });
  }, { threshold: 0.25 });
  parallaxBanners.forEach(b => parallaxObserver.observe(b));

  // 滚动视差效果
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        parallaxBanners.forEach(banner => {
          const bg = banner.querySelector('.parallax-bg');
          if (!bg) return;
          const rect = banner.getBoundingClientRect();
          const speed = parseFloat(banner.dataset.speed) || 0.3;
          // 只在横幅可见时计算
          if (rect.bottom > 0 && rect.top < window.innerHeight) {
            const offset = (rect.top * speed);
            bg.style.transform = `translateY(${offset}px) scale(1.08)`;
          }
        });
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // --- 声音控制（模拟） ---
  const soundToggle = document.getElementById('soundToggle');
  let soundOn = false;

  soundToggle.addEventListener('click', () => {
    soundOn = !soundOn;
    soundToggle.classList.toggle('muted', !soundOn);
    soundToggle.textContent = soundOn ? '🔊' : '🔇';
    // 实际项目中可在此处初始化 Web Audio API 播放环境音
  });

  // --- 地图标点交互 ---
  const mapMarkers = document.querySelectorAll('.map-marker');
  mapMarkers.forEach(marker => {
    marker.addEventListener('click', (e) => {
      e.stopPropagation();
      const wasActive = marker.classList.contains('active');
      mapMarkers.forEach(m => m.classList.remove('active'));
      if (!wasActive) marker.classList.add('active');
    });
  });

  // 点击地图其他区域关闭popup
  const mapStatic = document.getElementById('mapStatic');
  if (mapStatic) {
    mapStatic.addEventListener('click', () => {
      mapMarkers.forEach(m => m.classList.remove('active'));
    });
  }

  // --- 平滑滚动 ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

})();
