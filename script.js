// script.js

document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Custom Cursor System ---
    const cursor = document.getElementById('cursor-follower');
    const glow = document.getElementById('cursor-glow');
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        // Immediate glow update
        glow.style.left = `${mouseX}px`;
        glow.style.top = `${mouseY}px`;
    });

    function animateCursor() {
        // Lerp for smooth cursor movement
        cursorX += (mouseX - cursorX) * 0.2;
        cursorY += (mouseY - cursorY) * 0.2;

        // Use translate3d for GPU acceleration
        cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // --- 2. Hyper-Interactive Starfield ---
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    let stars = [];

    let resizeTimeout;
    function resize() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initStars(); // Re-init stars on resize for consistent density
        }, 100);
    }
    window.addEventListener('resize', resize);
    resize();

    class Star {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.z = Math.random() * canvas.width;
            this.size = 1.5;
        }

        update() {
            // Speed based on mouse vertical pos
            let speed = (mouseY / canvas.height) * 2 + 0.5;
            this.z -= speed;
            if (this.z <= 0) {
                this.z = canvas.width;
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
            }
        }

        draw() {
            let sx = (this.x - canvas.width / 2) * (canvas.width / this.z) + canvas.width / 2;
            let sy = (this.y - canvas.height / 2) * (canvas.width / this.z) + canvas.height / 2;
            let radius = (canvas.width / this.z) * this.size;
            let opacity = 1 - (this.z / canvas.width);

            ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
            ctx.beginPath();
            ctx.arc(sx, sy, radius, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function initStars() {
        stars = [];
        for (let i = 0; i < 400; i++) stars.push(new Star());
    }

    function animateStars() {
        ctx.fillStyle = 'rgba(15, 12, 41, 0.2)'; // Tail effect
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        stars.forEach(s => {
            s.update();
            s.draw();
        });
        requestAnimationFrame(animateStars);
    }
    initStars();
    animateStars();

    // --- 3. Magnetic Interaction ---
    const magneticElements = document.querySelectorAll('.glow-on-hover, .photo-card');

    magneticElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const distanceX = e.clientX - centerX;
            const distanceY = e.clientY - centerY;

            // Pull effect using translate3d for performance
            el.style.transform = `translate3d(${distanceX * 0.3}px, ${distanceY * 0.3}px, 0) scale(1.05)`;
        });

        el.addEventListener('mouseleave', () => {
            el.style.transform = `translate3d(0, 0, 0) scale(1)`;
        });
    });

    // --- 4. Title Reveal ---
    const titleElement = document.getElementById('celebration-title');
    if (titleElement) {
        const text = titleElement.innerText;
        titleElement.innerHTML = '';
        text.split('').forEach((char, index) => {
            const span = document.createElement('span');
            span.classList.add('letter');
            span.innerText = char === ' ' ? '\u00A0' : char;
            titleElement.appendChild(span);
            setTimeout(() => {
                span.classList.add('reveal');
                span.style.opacity = '1';
                span.style.transform = 'translateY(0)';
            }, 100 * index);
        });
    }

    // --- 5. Navigation & Confetti ---
    const startBtn = document.getElementById('start-btn');
    const landingView = document.getElementById('landing-view');
    const galleryView = document.getElementById('gallery-view');
    const bgMusic = document.getElementById('bg-music');

    startBtn.addEventListener('click', () => {
        confetti({
            particleCount: 200,
            spread: 90,
            origin: { y: 0.6 },
            colors: ['#ff9a9e', '#fad0c4', '#f1c40f', '#fff']
        });

        bgMusic.play().catch(e => console.log("Audio waiting..."));
        landingView.style.transition = 'opacity 1s cubic-bezier(0.77, 0, 0.175, 1)';
        landingView.classList.add('hidden');

        setTimeout(() => {
            landingView.style.display = 'none';
            galleryView.style.display = 'block';
            void galleryView.offsetWidth;
            galleryView.classList.add('active');
            galleryView.classList.remove('hidden');

            // Intersection Observer for scroll reveal
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }
                });
            }, { threshold: 0.1 });

            document.querySelectorAll('.photo-card').forEach(card => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(50px)';
                card.style.transition = 'all 1s cubic-bezier(0.23, 1, 0.32, 1)';
                observer.observe(card);
            });
        }, 1000);
    });

    // --- 6. Message Toggle ---
    const showMsgBtn = document.getElementById('show-message-btn');
    const msgContainer = document.getElementById('message-container');
    showMsgBtn.addEventListener('click', () => {
        const isHidden = msgContainer.classList.contains('hidden');
        msgContainer.classList.toggle('hidden', !isHidden);
        msgContainer.classList.toggle('visible', isHidden);
        showMsgBtn.innerText = isHidden ? 'Hide Message 💌' : 'View My Message 💌';
    });
});
