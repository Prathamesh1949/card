document.addEventListener('DOMContentLoaded', () => {

    // Stage 1 to Stage 2 Reveal Logic
    const lightstickContainer = document.getElementById('lightstick-container');
    const introScreen = document.getElementById('intro-screen');
    const mainContent = document.getElementById('main-content');

    let revealed = false;
    let isVideoVisible = false;

    lightstickContainer.addEventListener('click', () => {
        if (revealed) return;
        revealed = true;

        // Play background music
        const bgMusic = document.getElementById('bg-music');
        if (bgMusic) {
            bgMusic.play().catch(err => console.log('Audio playback failed:', err));
        }

        // Massive confetti burst
        fireMassiveConfetti();

        // Crossfade screens
        introScreen.classList.add('fade-out');

        setTimeout(() => {
            introScreen.style.display = 'none';
            mainContent.classList.add('visible');

            // Trigger background particles
            createParticles();

            // Trigger scroll animations and balloons
            startScrollObserver();
            createBalloons();

        }, 1200); // Wait for fade out
    });

    // Replay Logic
    const replayBtn = document.getElementById('replay-btn');
    if (replayBtn) {
        replayBtn.addEventListener('click', () => {
            // Go back to the top
            mainContent.scrollTo({ top: 0, behavior: 'smooth' });
            fireMassiveConfetti();
        });
    }

    // Keyboard navigation (adjust scroll position)
    document.addEventListener('keydown', (e) => {
        if (introScreen.style.display !== 'none') return;

        const viewportHeight = window.innerHeight;
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
            mainContent.scrollBy({ top: viewportHeight, behavior: 'smooth' });
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
            mainContent.scrollBy({ top: -viewportHeight, behavior: 'smooth' });
        }
    });

    // Scroll Observer to trigger slide-in text and elements on scroll
    function startScrollObserver() {
        const animatedElements = document.querySelectorAll('.animate-on-scroll, .side-flower');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');

                    // For panels, add hovering float animation
                    if (entry.target.classList.contains('slide-content')) {
                        setTimeout(() => {
                            entry.target.classList.add('floating-panel');
                        }, 500);
                    }
                } else {
                    // Remove if we want them to re-animate scaling back up
                    entry.target.classList.remove('is-visible');
                    entry.target.classList.remove('floating-panel');
                }
            });
        }, {
            threshold: 0.2, // Trigger when 20% visible
            rootMargin: "0px 0px -50px 0px"
        });

        animatedElements.forEach(el => observer.observe(el));

        // Also observe whole slides for the float effect
        const slides = document.querySelectorAll('.slide-content');
        slides.forEach(el => observer.observe(el));

        // Observe video section to hide balloons
        const videoSection = document.querySelector('.video-theme');
        if (videoSection) {
            const videoObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    isVideoVisible = entry.isIntersecting;
                    const bc = document.getElementById('balloons-container');
                    if (bc) {
                        bc.style.opacity = isVideoVisible ? '0' : '1';
                        bc.style.transition = 'opacity 0.5s ease';
                    }
                });
            }, { threshold: 0.4 });
            videoObserver.observe(videoSection);
        }
    }

    // Add balloons logic
    function createBalloons() {
        const balloonContainer = document.getElementById('balloons-container');
        if (!balloonContainer) return;

        const colors = [
            'radial-gradient(circle at 30% 30%, #ff9a9e, #fecfef)', // Pinkish
            'radial-gradient(circle at 30% 30%, #c77dff, #7b2cbf)', // BTS Purple
            'radial-gradient(circle at 30% 30%, #fb8500, #ffb703)', // Marigold Orange
            'radial-gradient(circle at 30% 30%, #48cae4, #00b4d8)'  // Levi Blue/Green
        ];

        // Create a new balloon every 1.5 seconds
        setInterval(() => {
            if (isVideoVisible) return;

            if (mainContent.style.opacity === '1' || mainContent.classList.contains('visible')) {
                const balloon = document.createElement('div');
                balloon.classList.add('balloon');

                // Randomize balloon properties
                const leftPos = Math.random() * 90; // 0 to 90vw
                const color = colors[Math.floor(Math.random() * colors.length)];
                const duration = Math.random() * 10 + 15; // 15 to 25 seconds to float up

                balloon.style.left = `${leftPos}vw`;
                balloon.style.background = color;
                balloon.style.animationDuration = `${duration}s`;

                balloonContainer.appendChild(balloon);

                // Clean up after it floats away
                setTimeout(() => {
                    balloon.remove();
                }, duration * 1000);
            }
        }, 1500);
    }

    // Confetti logic
    function fireMassiveConfetti() {
        const duration = 4000;
        const end = Date.now() + duration;

        (function frame() {
            // Purple/Gold/Red/Green theme mapping to BTS/Itachi/Levi
            confetti({
                particleCount: 8,
                angle: 60,
                spread: 70,
                origin: { x: 0 },
                colors: ['#7b2cbf', '#c77dff', '#d90429', '#2a9d8f', '#ffd700']
            });
            confetti({
                particleCount: 8,
                angle: 120,
                spread: 70,
                origin: { x: 1 },
                colors: ['#7b2cbf', '#c77dff', '#d90429', '#2a9d8f', '#ffd700']
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        }());

    }

    // Background floating particles
    function createParticles() {
        const container = document.getElementById('particles-container');
        const particleCount = 30;

        // Colors mapping to themes: purple, pink, red, green, gold
        const colors = ['#7b2cbf', '#ffb7c5', '#d90429', '#2a9d8f', '#ffd700'];

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');

            // Randomize properties
            const size = Math.random() * 8 + 3;
            const left = Math.random() * 100;
            const animationDuration = Math.random() * 15 + 10;
            const delay = Math.random() * 10;
            const color = colors[Math.floor(Math.random() * colors.length)];

            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${left}vw`;
            particle.style.backgroundColor = color;
            particle.style.animationDuration = `${animationDuration}s`;
            particle.style.animationDelay = `${delay}s`;

            // Glow effect
            particle.style.boxShadow = `0 0 ${size * 2}px ${color}`;

            container.appendChild(particle);
        }
    }

    // Video Audio Focus Logic
    const birthdayVideo = document.querySelector('.video-container video');
    const bgMusic = document.getElementById('bg-music');

    if (birthdayVideo && bgMusic) {
        // When she hits play on the video, pause the background music
        birthdayVideo.addEventListener('play', () => {
            bgMusic.pause();
        });

        // Optional: If she pauses or finishes the video, resume background music
        birthdayVideo.addEventListener('pause', () => {
            // Only resume if we are still inside the main content view
            if (mainContent.classList.contains('visible')) {
                bgMusic.play().catch(e => console.log('Audio resume failed', e));
            }
        });

        birthdayVideo.addEventListener('ended', () => {
            if (mainContent.classList.contains('visible')) {
                bgMusic.play().catch(e => console.log('Audio resume failed', e));
            }
        });
    }

});
