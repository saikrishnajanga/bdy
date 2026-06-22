/* ===== Birthday Surprise Website — Complete JavaScript ===== */
document.addEventListener('DOMContentLoaded', () => {

  // =============================================
  // 0. THEME TOGGLE
  // =============================================
  const themeToggle = document.getElementById('theme-toggle');
  const savedTheme = localStorage.getItem('birthday-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  themeToggle.textContent = savedTheme === 'light' ? '☀️' : '🌙';
  themeToggle.addEventListener('click', () => {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    themeToggle.textContent = next === 'light' ? '☀️' : '🌙';
    localStorage.setItem('birthday-theme', next);
  });

  // =============================================
  // 1. AUTO-PLAY MUSIC + PROMPT
  // =============================================
  const audio = document.getElementById('bg-audio');
  const musicToggle = document.getElementById('music-toggle');
  const musicPlayBtn = document.getElementById('music-play-btn');
  const musicDisc = document.getElementById('music-disc');
  const equalizer = document.getElementById('equalizer');
  const musicPrompt = document.getElementById('music-prompt');
  let isPlaying = false;

  function startMusic() {
    audio.play().then(() => {
      isPlaying = true;
      musicDisc.classList.add('spinning');
      equalizer.classList.add('active');
      musicToggle.classList.add('playing');
      musicPlayBtn.innerHTML = '<span id="play-icon">⏸</span> Pause';
      musicPrompt.classList.add('hidden');
    }).catch(() => {
      // Autoplay blocked — keep prompt visible
    });
  }

  function toggleMusic() {
    if (isPlaying) {
      audio.pause();
      isPlaying = false;
      musicDisc.classList.remove('spinning');
      equalizer.classList.remove('active');
      musicToggle.classList.remove('playing');
      musicPlayBtn.innerHTML = '<span id="play-icon">▶</span> Play Song';
    } else {
      startMusic();
    }
  }

  // Try auto-play immediately
  startMusic();

  // If autoplay blocked, play on first user interaction
  function firstInteraction() {
    if (!isPlaying) startMusic();
    document.removeEventListener('click', firstInteraction);
    document.removeEventListener('touchstart', firstInteraction);
  }
  document.addEventListener('click', firstInteraction);
  document.addEventListener('touchstart', firstInteraction);

  musicPrompt.addEventListener('click', (e) => {
    e.stopPropagation();
    startMusic();
  });

  musicToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMusic();
  });
  musicPlayBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMusic();
  });

  // =============================================
  // 2. HERO PARTICLES
  // =============================================
  const heroCanvas = document.getElementById('hero-canvas');
  const heroCtx = heroCanvas.getContext('2d');
  let heroParticles = [];

  function resizeHeroCanvas() {
    heroCanvas.width = heroCanvas.parentElement.offsetWidth;
    heroCanvas.height = heroCanvas.parentElement.offsetHeight;
  }
  resizeHeroCanvas();
  window.addEventListener('resize', resizeHeroCanvas);

  class HeroParticle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * heroCanvas.width;
      this.y = Math.random() * heroCanvas.height;
      this.size = Math.random() * 4 + 1;
      this.speedX = (Math.random() - 0.5) * 0.8;
      this.speedY = (Math.random() - 0.5) * 0.8;
      this.opacity = Math.random() * 0.5 + 0.1;
      this.type = Math.random() < 0.4 ? 'sparkle' : Math.random() < 0.7 ? 'heart' : 'dot';
      this.hue = Math.random() < 0.5 ? 330 : 275;
      this.life = 0;
      this.maxLife = 200 + Math.random() * 300;
      this.pulseSpeed = 0.02 + Math.random() * 0.03;
    }
    update() {
      this.x += this.speedX; this.y += this.speedY; this.life++;
      if (this.life > this.maxLife || this.x < -20 || this.x > heroCanvas.width + 20 || this.y < -20 || this.y > heroCanvas.height + 20) this.reset();
    }
    draw(ctx) {
      const pulse = Math.sin(this.life * this.pulseSpeed) * 0.3 + 0.7;
      ctx.globalAlpha = this.opacity * pulse;
      if (this.type === 'heart') {
        const s = this.size * 2;
        ctx.fillStyle = 'hsla(340,90%,65%,1)';
        ctx.beginPath();
        ctx.moveTo(this.x, this.y + s / 4);
        ctx.bezierCurveTo(this.x, this.y, this.x - s / 2, this.y, this.x - s / 2, this.y + s / 4);
        ctx.bezierCurveTo(this.x - s / 2, this.y + s / 2, this.x, this.y + s * 0.7, this.x, this.y + s);
        ctx.bezierCurveTo(this.x, this.y + s * 0.7, this.x + s / 2, this.y + s / 2, this.x + s / 2, this.y + s / 4);
        ctx.bezierCurveTo(this.x + s / 2, this.y, this.x, this.y, this.x, this.y + s / 4);
        ctx.fill();
      } else if (this.type === 'sparkle') {
        ctx.fillStyle = 'hsla(45,100%,75%,1)';
        ctx.shadowBlur = 10; ctx.shadowColor = 'rgba(255,215,0,0.5)';
        ctx.beginPath(); ctx.arc(this.x, this.y, 1.5, 0, Math.PI * 2); ctx.fill();
        ctx.shadowBlur = 0;
      } else {
        ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${this.hue},100%,75%,1)`; ctx.fill();
      }
      ctx.globalAlpha = 1;
    }
  }

  const pCount = Math.min(70, Math.floor((heroCanvas.width * heroCanvas.height) / 15000));
  for (let i = 0; i < pCount; i++) heroParticles.push(new HeroParticle());

  function animateHero() {
    heroCtx.clearRect(0, 0, heroCanvas.width, heroCanvas.height);
    heroParticles.forEach(p => { p.update(); p.draw(heroCtx); });
    requestAnimationFrame(animateHero);
  }
  animateHero();

  // =============================================
  // 3. TYPEWRITER
  // =============================================
  const typewriterEl = document.getElementById('typewriter');
  const typeText = 'Chinnodaaa';
  let charIdx = 0;
  function typeWriter() {
    if (charIdx < typeText.length) {
      typewriterEl.textContent += typeText.charAt(charIdx); charIdx++;
      setTimeout(typeWriter, 120);
    } else {
      setTimeout(() => { typewriterEl.style.borderRight = '3px solid transparent'; }, 2000);
    }
  }
  setTimeout(typeWriter, 1200);

  // =============================================
  // 4. COUNTDOWN
  // =============================================
  function getTargetDate() {
    const now = new Date();
    let target = new Date(now.getFullYear(), 5, 25);
    if (target < now) target = new Date(now.getFullYear() + 1, 5, 25);
    return target;
  }
  const targetDate = getTargetDate();

  function updateCountdown() {
    const diff = targetDate - new Date();
    if (diff <= 0) {
      document.getElementById('cd-days').textContent = '00';
      document.getElementById('cd-hours').textContent = '00';
      document.getElementById('cd-mins').textContent = '00';
      document.getElementById('cd-secs').textContent = '00';
      document.getElementById('countdown-msg').textContent = "🎉 It's your birthday! Happy Birthday Chinnodaaa! 🎂🎊";
      launchConfetti(3000);
      return;
    }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    document.getElementById('cd-days').textContent = String(d).padStart(2, '0');
    document.getElementById('cd-hours').textContent = String(h).padStart(2, '0');
    document.getElementById('cd-mins').textContent = String(m).padStart(2, '0');
    document.getElementById('cd-secs').textContent = String(s).padStart(2, '0');
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);

  // =============================================
  // 5. SCROLL REVEAL
  // =============================================
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });
  revealElements.forEach(el => revealObserver.observe(el));

  // =============================================
  // 6. GIFT CARD GALLERY — with feelings
  // =============================================
  const galleryGrid = document.getElementById('gallery-grid');
  const galleryPhotos = [
    { src: 'photos/WhatsApp Image 2026-06-18 at 17.56.15 (1).jpeg', feeling: '"This one always makes me smile. You radiate happiness 💗"' },
    { src: 'photos/WhatsApp Image 2026-06-18 at 17.56.15.jpeg', feeling: '"I couldn\'t stop staring when I first saw this. Just... wow ✨"' },
    { src: 'photos/WhatsApp Image 2026-06-18 at 17.57.06.jpeg', feeling: '"My heartbeat literally changed when I first saw this photo 💓"' },
    { src: 'photos/WhatsApp Image 2026-06-18 at 17.57.33.jpeg', feeling: '"This look... I wish I could freeze this moment forever 🌟"' },
    { src: 'photos/WhatsApp Image 2026-06-18 at 17.57.34 (1).jpeg', feeling: '"The way you shine here — no filter needed, ever 👑"' },
    { src: 'photos/WhatsApp Image 2026-06-18 at 17.57.34.jpeg', feeling: '"I saved this the second I saw it. Pure magic ✨"' },
    { src: 'photos/WhatsApp Image 2026-06-18 at 17.57.57.jpeg', feeling: '"Looking at this gives me peace. You\'re my calm in every storm 🌊"' },
    { src: 'photos/WhatsApp Image 2026-06-18 at 18.11.42 (1).jpeg', feeling: '"My favourite human in my favourite photo. Perfect combo 💎"' },
    { src: 'photos/WhatsApp Image 2026-06-18 at 18.11.42.jpeg', feeling: '"Every time I see this I think — how did I get so lucky? 🍀"' },
    { src: 'photos/WhatsApp Image 2026-06-18 at 18.13.10 (1).jpeg', feeling: '"This energy is everything. You are everything 🔥"' },
  ];

  const giftIcons = [
    { icon: '🎁', text: 'Tap to unwrap!' },
    { icon: '💝', text: 'Open with love' },
    { icon: '🌟', text: 'Reveal the star' },
    { icon: '🎀', text: 'Untie the ribbon' },
    { icon: '🦋', text: 'Set it free' },
    { icon: '🌹', text: 'A rose for you' },
    { icon: '👑', text: 'Crown moment' },
    { icon: '💎', text: 'Discover the gem' },
    { icon: '🎈', text: 'Pop to see!' },
    { icon: '🌸', text: 'Bloom a memory' },
  ];

  function buildGallery() {
    galleryGrid.innerHTML = '';
    galleryPhotos.forEach((photo, idx) => {
      const card = document.createElement('div');
      card.className = 'gift-card reveal';
      const gift = giftIcons[idx % giftIcons.length];
      card.innerHTML = `
        <img src="${photo.src}" alt="Memory ${idx + 1}" loading="lazy">
        <div class="gift-feeling"><p>${photo.feeling}</p></div>
        <div class="gift-wrap">
          <span class="gift-icon">${gift.icon}</span>
          <span class="gift-text">${gift.text}</span>
        </div>
      `;
      card.addEventListener('click', () => {
        if (!card.classList.contains('unwrapped')) {
          card.classList.add('unwrapped');
        } else {
          openLightbox(idx);
        }
      });
      galleryGrid.appendChild(card);
      revealObserver.observe(card);
    });
  }
  buildGallery();

  // Lightbox
  let lightboxEl = document.createElement('div');
  lightboxEl.className = 'lightbox';
  lightboxEl.innerHTML = `<button class="lightbox-close">✕</button><button class="lightbox-nav lightbox-prev">‹</button><img src="" alt="Photo"><button class="lightbox-nav lightbox-next">›</button>`;
  document.body.appendChild(lightboxEl);
  let currentLB = 0;
  const allPhotos = galleryPhotos.map(p => p.src);

  lightboxEl.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
  lightboxEl.querySelector('.lightbox-prev').addEventListener('click', () => navLB(-1));
  lightboxEl.querySelector('.lightbox-next').addEventListener('click', () => navLB(1));
  lightboxEl.addEventListener('click', (e) => { if (e.target === lightboxEl) closeLightbox(); });

  function openLightbox(idx) {
    currentLB = idx;
    lightboxEl.querySelector('img').src = allPhotos[idx];
    lightboxEl.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() { lightboxEl.classList.remove('active'); document.body.style.overflow = ''; }
  function navLB(dir) {
    currentLB = (currentLB + dir + allPhotos.length) % allPhotos.length;
    lightboxEl.querySelector('img').src = allPhotos[currentLB];
  }

  // =============================================
  // 7. ENVELOPE & LETTER
  // =============================================
  const envelope = document.getElementById('envelope');
  const letterContainer = document.getElementById('letter-container');
  const letterParagraphs = document.querySelectorAll('#letter p');

  document.getElementById('envelope-trigger').addEventListener('click', () => {
    envelope.classList.add('open');
    setTimeout(() => {
      letterContainer.classList.add('active');
      letterParagraphs.forEach((p, i) => { setTimeout(() => p.classList.add('show'), 180 * (i + 1)); });
      document.body.style.overflow = 'hidden';
    }, 800);
  });

  document.getElementById('letter-close').addEventListener('click', () => {
    letterContainer.classList.remove('active'); document.body.style.overflow = '';
  });
  letterContainer.addEventListener('click', (e) => {
    if (e.target === letterContainer) { letterContainer.classList.remove('active'); document.body.style.overflow = ''; }
  });

  // =============================================
  // 8. BALLOON POP GAME
  // =============================================
  const balloonField = document.getElementById('balloon-field');
  const wishReveal = document.getElementById('wish-reveal');
  const wishText = document.getElementById('wish-text');
  const wishEmoji = document.getElementById('wish-emoji');
  const wishesFoundEl = document.getElementById('wishes-found');
  let wishesFound = 0;

  const balloonWishes = [
    { emoji: '☀️', wish: 'You make every single day brighter just by existing!' },
    { emoji: '👑', wish: 'Best friend = Best human on this planet. That\'s you!' },
    { emoji: '🌅', wish: 'Your smile is my favourite view in the whole world' },
    { emoji: '💫', wish: 'Life became 1000x better the day you walked into it' },
    { emoji: '🌍', wish: 'You deserve the entire world and more, Chinnodaaa!' },
    { emoji: '🦋', wish: 'Thank you for being the most beautiful soul I know' },
    { emoji: '🌟', wish: 'Forever grateful that the universe gave me YOU' },
    { emoji: '💎', wish: 'You are one in 7.8 billion — literally irreplaceable!' },
    { emoji: '🔥', wish: 'Your energy, your vibe, your everything — ICONIC' },
    { emoji: '💖', wish: 'Happy Birthday to the person who owns my whole heart!' },
  ];

  const balloonColors = [
    '#ff6b9d', '#c44dff', '#ffd700', '#ff4081', '#7c4dff',
    '#00bcd4', '#ff9800', '#e91e63', '#9c27b0', '#4caf50'
  ];

  function createBalloons() {
    balloonField.innerHTML = '';
    const cols = window.innerWidth < 480 ? 5 : 5;
    const rows = 2;

    balloonWishes.forEach((wish, i) => {
      const balloon = document.createElement('div');
      balloon.className = 'balloon';
      const col = i % cols;
      const row = Math.floor(i / cols);
      const xPercent = 8 + (col * (84 / (cols - 1)));
      const yOffset = row * 180 + Math.random() * 30;
      balloon.style.left = `${xPercent}%`;
      balloon.style.top = `${yOffset + 20}px`;
      balloon.style.animationDelay = `${Math.random() * 2}s`;
      balloon.style.animationDuration = `${3 + Math.random() * 2}s`;

      const color = balloonColors[i];
      balloon.innerHTML = `
        <div class="balloon-body" style="background:${color};border-top-color:${color}">
          <span style="filter:drop-shadow(0 0 4px rgba(255,255,255,0.4))">${wish.emoji}</span>
        </div>
        <div class="balloon-string"></div>
      `;

      balloon.addEventListener('click', (e) => {
        e.stopPropagation();
        if (balloon.classList.contains('popped')) return;
        balloon.classList.add('popped');
        wishesFound++;
        wishesFoundEl.textContent = wishesFound;

        // Mini confetti burst at balloon position
        launchConfetti(800);

        // Show wish card
        setTimeout(() => {
          wishEmoji.textContent = wish.emoji;
          wishText.textContent = wish.wish;
          wishReveal.classList.add('active');
          document.body.style.overflow = 'hidden';
        }, 400);

        // All popped celebration
        if (wishesFound === balloonWishes.length) {
          setTimeout(() => launchConfetti(5000), 1500);
        }
      });

      balloonField.appendChild(balloon);
    });
  }
  createBalloons();

  document.getElementById('wish-close').addEventListener('click', () => {
    wishReveal.classList.remove('active');
    document.body.style.overflow = '';
  });
  wishReveal.addEventListener('click', (e) => {
    if (e.target === wishReveal) { wishReveal.classList.remove('active'); document.body.style.overflow = ''; }
  });

  // =============================================
  // 9. CONFETTI SYSTEM
  // =============================================
  const confettiCanvas = document.getElementById('confetti-canvas');
  const confettiCtx = confettiCanvas.getContext('2d');
  let confettiPieces = [];

  function resizeCC() { confettiCanvas.width = window.innerWidth; confettiCanvas.height = window.innerHeight; }
  resizeCC(); window.addEventListener('resize', resizeCC);

  class ConfettiPiece {
    constructor() {
      this.x = Math.random() * confettiCanvas.width;
      this.y = -20;
      this.size = Math.random() * 10 + 5;
      this.speedY = Math.random() * 4 + 2;
      this.speedX = (Math.random() - 0.5) * 4;
      this.rotation = Math.random() * 360;
      this.rotationSpeed = (Math.random() - 0.5) * 10;
      this.color = ['#ff6b9d','#c44dff','#ffd700','#ff85b1','#d88aff','#ffe44d','#fff'][Math.floor(Math.random() * 7)];
      this.shape = Math.random() < 0.5 ? 'rect' : 'circle';
      this.wobble = Math.random() * 10;
    }
    update() {
      this.y += this.speedY; this.x += this.speedX + Math.sin(this.wobble) * 0.5;
      this.wobble += 0.05; this.rotation += this.rotationSpeed; this.speedY += 0.02;
    }
    draw(ctx) {
      ctx.save(); ctx.translate(this.x, this.y); ctx.rotate(this.rotation * Math.PI / 180);
      ctx.fillStyle = this.color;
      if (this.shape === 'rect') ctx.fillRect(-this.size / 2, -this.size / 4, this.size, this.size / 2);
      else { ctx.beginPath(); ctx.arc(0, 0, this.size / 3, 0, Math.PI * 2); ctx.fill(); }
      ctx.restore();
    }
  }

  function launchConfetti(duration = 3000) {
    const spawn = setInterval(() => {
      for (let i = 0; i < 5; i++) confettiPieces.push(new ConfettiPiece());
    }, 50);
    setTimeout(() => { clearInterval(spawn); setTimeout(() => { confettiPieces = []; }, 4000); }, duration);
  }

  function animateConfetti() {
    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    confettiPieces = confettiPieces.filter(p => p.y < confettiCanvas.height + 50);
    confettiPieces.forEach(p => { p.update(); p.draw(confettiCtx); });
    requestAnimationFrame(animateConfetti);
  }
  animateConfetti();

  // =============================================
  // 10. BIRTHDAY CAKE
  // =============================================
  const flame = document.getElementById('flame');
  const smokeContainer = document.getElementById('smoke-container');
  const cakeMessage = document.getElementById('cake-message');
  let candleLit = true;

  document.getElementById('cake-element').addEventListener('click', () => {
    if (!candleLit) return;
    candleLit = false;
    flame.classList.add('out');
    document.querySelector('.flame-glow').style.opacity = '0';
    for (let i = 0; i < 8; i++) {
      const smoke = document.createElement('div');
      smoke.className = 'smoke';
      smoke.style.left = `${(Math.random() - 0.5) * 20}px`;
      smoke.style.animationDelay = `${i * 0.15}s`;
      smokeContainer.appendChild(smoke);
      setTimeout(() => smoke.classList.add('active'), 50);
      setTimeout(() => smoke.remove(), 3000);
    }
    setTimeout(() => { cakeMessage.classList.add('show'); launchConfetti(2000); }, 1000);
  });

  // =============================================
  // 11. FIREWORKS
  // =============================================
  const fwCanvas = document.getElementById('fireworks-canvas');
  const fwCtx = fwCanvas.getContext('2d');
  let fireworks = [], fwParticles = [], fwVisible = false;

  function resizeFW() {
    const s = document.getElementById('final');
    fwCanvas.width = s.offsetWidth; fwCanvas.height = s.offsetHeight;
  }
  resizeFW(); window.addEventListener('resize', resizeFW);

  class Firework {
    constructor(x, y, ty) { this.x = x; this.y = y; this.ty = ty; this.speed = 3 + Math.random() * 2; this.alive = true; this.trail = []; }
    update() {
      this.trail.push({ x: this.x, y: this.y }); if (this.trail.length > 8) this.trail.shift();
      this.y -= this.speed;
      if (this.y <= this.ty) { this.alive = false; this.explode(); }
    }
    explode() {
      const hue = Math.random() * 60 + 310;
      for (let i = 0; i < 50; i++) {
        const a = (Math.PI * 2 * i) / 50, sp = 1 + Math.random() * 3;
        fwParticles.push({ x: this.x, y: this.y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: 60 + Math.random() * 40, maxLife: 100, color: `hsl(${hue + Math.random() * 40},100%,${50 + Math.random() * 30}%)`, size: 2 + Math.random() * 2 });
      }
    }
    draw(ctx) {
      this.trail.forEach((p, i) => { ctx.globalAlpha = i / this.trail.length * 0.5; ctx.fillStyle = '#ffd700'; ctx.beginPath(); ctx.arc(p.x, p.y, 2, 0, Math.PI * 2); ctx.fill(); });
      ctx.globalAlpha = 1; ctx.fillStyle = '#ffd700'; ctx.shadowBlur = 10; ctx.shadowColor = '#ffd700'; ctx.beginPath(); ctx.arc(this.x, this.y, 3, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0;
    }
  }

  function animateFW() {
    fwCtx.globalCompositeOperation = 'destination-out'; fwCtx.fillStyle = 'rgba(0,0,0,0.15)'; fwCtx.fillRect(0, 0, fwCanvas.width, fwCanvas.height);
    fwCtx.globalCompositeOperation = 'lighter';
    fireworks = fireworks.filter(f => f.alive); fireworks.forEach(f => { f.update(); f.draw(fwCtx); });
    fwParticles = fwParticles.filter(p => p.life > 0);
    fwParticles.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.vy += 0.03; p.vx *= 0.99; p.life--;
      fwCtx.globalAlpha = p.life / p.maxLife; fwCtx.fillStyle = p.color;
      fwCtx.beginPath(); fwCtx.arc(p.x, p.y, p.size * (p.life / p.maxLife), 0, Math.PI * 2); fwCtx.fill();
    });
    fwCtx.globalAlpha = 1; fwCtx.globalCompositeOperation = 'source-over';
    if (fwVisible && Math.random() < 0.04) fireworks.push(new Firework(Math.random() * fwCanvas.width, fwCanvas.height, 50 + Math.random() * fwCanvas.height * 0.4));
    requestAnimationFrame(animateFW);
  }
  animateFW();

  new IntersectionObserver((entries) => {
    entries.forEach(e => { fwVisible = e.isIntersecting; if (e.isIntersecting) resizeFW(); });
  }, { threshold: 0.2 }).observe(document.getElementById('final'));

  // =============================================
  // 12. FALLING PETALS
  // =============================================
  const petalsOverlay = document.getElementById('petals-overlay');
  const petalCount = window.innerWidth < 768 ? 12 : 20;
  for (let i = 0; i < petalCount; i++) {
    const petal = document.createElement('div');
    petal.className = 'petal';
    petal.style.left = `${Math.random() * 100}%`;
    petal.style.animationDuration = `${8 + Math.random() * 10}s`;
    petal.style.animationDelay = `${Math.random() * 10}s`;
    petal.style.width = `${8 + Math.random() * 12}px`;
    petal.style.height = `${8 + Math.random() * 12}px`;
    petal.style.background = ['#ff6b9d','#ffa3c4','#c44dff','#d88aff'][Math.floor(Math.random() * 4)];
    petalsOverlay.appendChild(petal);
  }

  // =============================================
  // 13. ESC KEY
  // =============================================
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeLightbox();
      letterContainer.classList.remove('active');
      wishReveal.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  // =============================================
  // 14. SURPRISE REPLY FORM (Web3Forms)
  // =============================================
  const surpriseForm = document.getElementById('surprise-form');
  const replySuccess = document.getElementById('reply-success');
  const replySubmitBtn = document.getElementById('reply-submit-btn');
  const replyError = document.getElementById('reply-error');

  if (surpriseForm) {
    surpriseForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const btnText = replySubmitBtn.querySelector('.btn-text');
      const btnLoading = replySubmitBtn.querySelector('.btn-loading');
      replySubmitBtn.disabled = true;
      btnText.style.display = 'none';
      btnLoading.style.display = 'inline';
      replyError.style.display = 'none';

      const name = document.getElementById('reply-name').value;
      const message = document.getElementById('reply-message').value;

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          access_key: '2e3cb0d2-735c-4fdc-8e5b-b1c822aed40e',
          subject: '🎂 Surprise Birthday Reply!',
          from_name: 'Birthday Surprise Website',
          name: name,
          message: message
        })
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          surpriseForm.style.display = 'none';
          replySuccess.style.display = 'block';
        } else {
          throw new Error(data.message || 'Something went wrong');
        }
      })
      .catch(err => {
        replyError.textContent = '❌ Could not send message. Please try again!';
        replyError.style.display = 'block';
        replySubmitBtn.disabled = false;
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
      });
    });
  }
});
