/**
 * ==========================================================================
 * HARI KRISHNAN P | FUTURISTIC AI PORTFOLIO CONTROLLER
 * Neural Canvas // Cyber AI Chatbot // Scroll Animations // Audio FX // HUD
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. SYNTHESIZED CYBER AUDIO ENGINE (Web Audio API - Zero Asset Dependencies)
       ========================================================================== */
    class CyberAudio {
        constructor() {
            this.ctx = null;
            this.enabled = false;
        }

        init() {
            if (!this.ctx) {
                const AudioCtx = window.AudioContext || window.webkitAudioContext;
                if (AudioCtx) this.ctx = new AudioCtx();
            }
            if (this.ctx && this.ctx.state === 'suspended') {
                this.ctx.resume();
            }
        }

        playChirp(freq = 600, duration = 0.06, type = 'sine') {
            if (!this.enabled || !this.ctx) return;
            try {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = type;
                osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(freq * 1.5, this.ctx.currentTime + duration);

                gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

                osc.connect(gain);
                gain.connect(this.ctx.destination);

                osc.start();
                osc.stop(this.ctx.currentTime + duration);
            } catch (e) {
                console.warn('Audio playback error', e);
            }
        }

        playBlip(freq = 440) {
            this.playChirp(freq, 0.05, 'triangle');
        }

        playSuccess() {
            if (!this.enabled || !this.ctx) return;
            this.playChirp(520, 0.08, 'sine');
            setTimeout(() => this.playChirp(780, 0.1, 'sine'), 80);
        }

        playMessagePop() {
            if (!this.enabled || !this.ctx) return;
            this.playChirp(620, 0.05, 'sine');
            setTimeout(() => this.playChirp(930, 0.08, 'sine'), 50);
        }
    }

    const cyberAudio = new CyberAudio();
    const audioBtn = document.getElementById('audioToggleBtn');
    const audioIcon = document.getElementById('audioIcon');

    if (audioBtn) {
        audioBtn.addEventListener('click', () => {
            cyberAudio.init();
            cyberAudio.enabled = !cyberAudio.enabled;
            if (cyberAudio.enabled) {
                audioBtn.classList.add('audio-active');
                if (audioIcon) audioIcon.className = 'fa-solid fa-volume-high text-neon-cyan';
                cyberAudio.playSuccess();
            } else {
                audioBtn.classList.remove('audio-active');
                if (audioIcon) audioIcon.className = 'fa-solid fa-volume-xmark';
            }
        });
    }

    // Attach click feedback to cyber interactive buttons
    document.querySelectorAll('.cyber-btn, .filter-chip, .nav-item, .chat-chip, .bot-action-btn, .chat-send-btn, .chat-toggle-btn').forEach(el => {
        el.addEventListener('click', () => {
            if (cyberAudio.enabled) cyberAudio.playBlip(680);
        });
    });

    /* ==========================================================================
       2. INTERACTIVE NEURAL SYNAPSE CANVAS
       ========================================================================== */
    const canvas = document.getElementById('neural-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        const mouse = { x: null, y: null, radius: 140 };

        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

        window.addEventListener('mouseleave', () => {
            mouse.x = null;
            mouse.y = null;
        });

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            initNodes();
        });

        class NeuralNode {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.7;
                this.vy = (Math.random() - 0.5) * 0.7;
                this.radius = Math.random() * 2 + 1;
                this.color = Math.random() > 0.3 ? 'rgba(0, 243, 255, ' : 'rgba(0, 255, 136, ';
                this.alpha = Math.random() * 0.5 + 0.2;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;

                // Mouse repulsion
                if (mouse.x !== null) {
                    const dx = mouse.x - this.x;
                    const dy = mouse.y - this.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < mouse.radius) {
                        const force = (mouse.radius - dist) / mouse.radius;
                        this.x -= (dx / dist) * force * 2;
                        this.y -= (dy / dist) * force * 2;
                    }
                }
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = this.color + this.alpha + ')';
                ctx.shadowBlur = 8;
                ctx.shadowColor = '#00f3ff';
                ctx.fill();
                ctx.shadowBlur = 0;
            }
        }

        let nodes = [];
        function initNodes() {
            nodes = [];
            const count = Math.min(Math.floor((width * height) / 14000), 75);
            for (let i = 0; i < count; i++) {
                nodes.push(new NeuralNode());
            }
        }
        initNodes();

        function connectNodes() {
            const maxDist = 120;
            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    const dx = nodes[i].x - nodes[j].x;
                    const dy = nodes[i].y - nodes[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < maxDist) {
                        const alpha = (1 - dist / maxDist) * 0.22;
                        ctx.strokeStyle = `rgba(0, 243, 255, ${alpha})`;
                        ctx.lineWidth = 0.8;
                        ctx.beginPath();
                        ctx.moveTo(nodes[i].x, nodes[i].y);
                        ctx.lineTo(nodes[j].x, nodes[j].y);
                        ctx.stroke();
                    }
                }

                // Connect to mouse
                if (mouse.x !== null) {
                    const dx = mouse.x - nodes[i].x;
                    const dy = mouse.y - nodes[i].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < mouse.radius) {
                        const alpha = (1 - dist / mouse.radius) * 0.35;
                        ctx.strokeStyle = `rgba(0, 255, 136, ${alpha})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(nodes[i].x, nodes[i].y);
                        ctx.lineTo(mouse.x, mouse.y);
                        ctx.stroke();
                    }
                }
            }
        }

        function animateCanvas() {
            ctx.clearRect(0, 0, width, height);
            nodes.forEach(node => {
                node.update();
                node.draw();
            });
            connectNodes();
            requestAnimationFrame(animateCanvas);
        }
        animateCanvas();
    }

    /* ==========================================================================
       3. AMBIENT CURSOR GLOW FOLLOWER
       ========================================================================== */
    const cursorGlow = document.getElementById('cursor-glow');
    if (cursorGlow) {
        let cursorX = window.innerWidth / 2;
        let cursorY = window.innerHeight / 2;
        let currentX = cursorX;
        let currentY = cursorY;

        window.addEventListener('mousemove', (e) => {
            cursorX = e.clientX;
            cursorY = e.clientY;
        });

        function renderGlow() {
            currentX += (cursorX - currentX) * 0.12;
            currentY += (cursorY - currentY) * 0.12;
            cursorGlow.style.left = `${currentX}px`;
            cursorGlow.style.top = `${currentY}px`;
            requestAnimationFrame(renderGlow);
        }
        renderGlow();
    }

    /* ==========================================================================
       4. DYNAMIC TYPING ROTATOR (Hero Subtitle)
       ========================================================================== */
    const typedTarget = document.getElementById('typedOutput');
    if (typedTarget) {
        const phrases = [
            "Gen AI & Agentic AI Architect",
            "Project Engineer @ Pantech Chennai",
            "Deepfake Detection (PyTorch ResNet-18)",
            "Local LLMs & Hugging Face T5 Matchers",
            "Computer Vision & Real-Time OpenCV Video",
            "Meta FAISS Dense Vector Embeddings"
        ];
        let phraseIdx = 0;
        let charIdx = 0;
        let isDeleting = false;
        let typingSpeed = 80;

        function typeLoop() {
            const currentPhrase = phrases[phraseIdx];

            if (isDeleting) {
                typedTarget.textContent = currentPhrase.substring(0, charIdx - 1);
                charIdx--;
                typingSpeed = 40;
            } else {
                typedTarget.textContent = currentPhrase.substring(0, charIdx + 1);
                charIdx++;
                typingSpeed = 75;
            }

            if (!isDeleting && charIdx === currentPhrase.length) {
                isDeleting = true;
                typingSpeed = 2000;
            } else if (isDeleting && charIdx === 0) {
                isDeleting = false;
                phraseIdx = (phraseIdx + 1) % phrases.length;
                typingSpeed = 400;
            }

            setTimeout(typeLoop, typingSpeed);
        }
        typeLoop();
    }

    /* ==========================================================================
       5. SCROLL REVEAL ANIMATIONS (IntersectionObserver Engine)
       ========================================================================== */
    const revealElements = document.querySelectorAll(
        '.reveal-on-scroll, .reveal-left, .reveal-right, .skill-category'
    );

    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');

                    // If it is a skill category, trigger meter bar animation
                    if (entry.target.classList.contains('skill-category')) {
                        const meterBar = entry.target.querySelector('.meter-bar');
                        if (meterBar) {
                            const targetWidth = meterBar.getAttribute('data-width') || '90%';
                            meterBar.style.setProperty('--target-width', targetWidth);
                            meterBar.style.width = targetWidth;
                        }
                    }

                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: '0px 0px -40px 0px'
        });

        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        // Fallback: immediately show elements
        revealElements.forEach(el => {
            el.classList.add('is-visible');
            const meterBar = el.querySelector('.meter-bar');
            if (meterBar) {
                const targetWidth = meterBar.getAttribute('data-width') || '90%';
                meterBar.style.width = targetWidth;
            }
        });
    }

    /* ==========================================================================
       6. CYBER AI CHATBOT CONTROLLER (Compact Floating Assistant)
       ========================================================================== */
    const chatbot = document.getElementById('cyberChatbot');
    const chatFabBtn = document.getElementById('chatFabBtn');
    const chatToggleBtn = document.getElementById('chatToggleBtn');
    const heroChatBtn = document.getElementById('heroChatBtn');
    const botCloseBtn = document.getElementById('botCloseBtn');
    const botResetBtn = document.getElementById('botResetBtn');
    const chatForm = document.getElementById('chatForm');
    const chatInput = document.getElementById('chatInput');
    const chatMessages = document.getElementById('chatMessages');

    function openChat() {
        if (!chatbot) return;
        chatbot.classList.add('chat-open');
        chatbot.setAttribute('aria-hidden', 'false');
        if (chatFabBtn) chatFabBtn.style.transform = 'scale(0.85)';
        setTimeout(() => chatInput && chatInput.focus(), 300);
        cyberAudio.init();
        if (cyberAudio.enabled) cyberAudio.playBlip(700);
    }

    function closeChat() {
        if (!chatbot) return;
        chatbot.classList.remove('chat-open');
        chatbot.setAttribute('aria-hidden', 'true');
        if (chatFabBtn) chatFabBtn.style.transform = 'scale(1)';
        if (cyberAudio.enabled) cyberAudio.playBlip(500);
    }

    function toggleChat() {
        if (!chatbot) return;
        if (chatbot.classList.contains('chat-open')) {
            closeChat();
        } else {
            openChat();
        }
    }

    if (chatFabBtn) chatFabBtn.addEventListener('click', toggleChat);
    if (chatToggleBtn) chatToggleBtn.addEventListener('click', toggleChat);
    if (heroChatBtn) heroChatBtn.addEventListener('click', openChat);
    if (botCloseBtn) botCloseBtn.addEventListener('click', closeChat);

    function getCurrentTimeStr() {
        const d = new Date();
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    function scrollToBottom() {
        if (chatMessages) {
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }

    function appendUserMessage(text) {
        if (!chatMessages) return;
        const msgDiv = document.createElement('div');
        msgDiv.className = 'chat-msg user-msg';
        msgDiv.innerHTML = `
            <div class="msg-bubble">
                <div class="msg-sender"><i class="fa-solid fa-user"></i> YOU</div>
                <div class="msg-text">${escapeHtml(text)}</div>
                <div class="msg-time">${getCurrentTimeStr()}</div>
            </div>
        `;
        chatMessages.appendChild(msgDiv);
        scrollToBottom();
    }

    function showTypingIndicator() {
        if (!chatMessages) return null;
        const typingDiv = document.createElement('div');
        typingDiv.className = 'chat-msg bot-msg bot-typing-container';
        typingDiv.id = 'botTyping';
        typingDiv.innerHTML = `
            <div class="msg-bubble">
                <div class="msg-sender"><i class="fa-solid fa-robot"></i> HK//AI ASSISTANT</div>
                <div class="bot-typing">
                    <span></span><span></span><span></span>
                </div>
            </div>
        `;
        chatMessages.appendChild(typingDiv);
        scrollToBottom();
        return typingDiv;
    }

    function removeTypingIndicator() {
        const typingDiv = document.getElementById('botTyping');
        if (typingDiv) typingDiv.remove();
    }

    function appendBotMessage(htmlContent) {
        removeTypingIndicator();
        if (!chatMessages) return;
        const msgDiv = document.createElement('div');
        msgDiv.className = 'chat-msg bot-msg';
        msgDiv.innerHTML = `
            <div class="msg-bubble">
                <div class="msg-sender"><i class="fa-solid fa-robot"></i> HK//AI ASSISTANT</div>
                <div class="msg-text">${htmlContent}</div>
                <div class="msg-time">${getCurrentTimeStr()}</div>
            </div>
        `;
        chatMessages.appendChild(msgDiv);
        scrollToBottom();
        if (cyberAudio.enabled) cyberAudio.playMessagePop();
    }

    function escapeHtml(str) {
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    // Knowledge Base responses
    const botAnswers = {
        role: `
            <strong>💼 Current Position:</strong> <span class="text-neon-green">Project Engineer</span> at <strong>Pantech</strong> (Chennai, Tamil Nadu) since <strong>July 2026</strong>.<br><br>
            • Leading production engineering in <strong>Gen AI, Agentic AI, Computer Vision, and Edge AI</strong>.<br>
            • Designing real-time visual inspection systems and local neural pipelines using OpenCV, PyTorch, and Python.<br><br>
            <strong>Past Internships:</strong><br>
            • Full Stack Web Dev Intern @ <em>8Queens Software Technologies</em> (July–Aug 2023)<br>
            • Mobile App Dev Intern @ <em>NSIC</em> (Jan 2023)
        `,
        projects: `
            <strong>🚀 Flagship AI Repositories:</strong><br><br>
            1. <strong>DeepScan AI:</strong> Neural Media Forensics & Deepfake Detection (ResNet-18, 2D-FFT, ELA, SHA-256).<br>
            🔗 <a href="https://github.com/HKhari20/AI-deepfake-detection" target="_blank" rel="noopener">GitHub: DeepScan AI</a><br><br>
            2. <strong>NeuralScreen AI:</strong> Semantic Vector Resume Matcher (Hugging Face T5, Meta FAISS).<br>
            🔗 <a href="https://github.com/HKhari20/AI-resume-screening-system" target="_blank" rel="noopener">GitHub: NeuralScreen AI</a><br><br>
            3. <strong>Explainable Agentic AI:</strong> Financial Decision Framework with LangChain & XAI Audit Dashboards.<br><br>
            4. <strong>CardioPredict AI:</strong> Biomedical Risk Scoring WebApp (Published in IRJAEH).<br>
            🔗 <a href="https://github.com/HKhari20/ML-Project-9-Heart-Disease-Prediction-WebApp" target="_blank" rel="noopener">GitHub: CardioPredict AI</a><br><br>
            5. <strong>CV Smart Parking:</strong> Live Video Space Occupancy Detection via OpenCV (Published in IRJAEH).<br><br>
            6. <strong>AML Intelligence:</strong> Financial Anti-Money Laundering Anomaly Engine.
        `,
        skills: `
            <strong>🎯 Core Focus & Technical Stack:</strong><br>
            <span class="text-neon-cyan">"Gen AI, Agentic AI, AI/ML/DL, OpenCV"</span><br><br>
            • <strong>Deep Learning & CV:</strong> PyTorch, OpenCV, ResNet-18, 2D-FFT Spectral, Error Level Analysis (ELA), Segmentation<br>
            • <strong>LLMs & Vectors:</strong> Hugging Face Transformers, Sentence-Transformers, Meta FAISS, LangChain<br>
            • <strong>Languages & Frameworks:</strong> Python (Advanced), Java, SQL, C++, Flask, Streamlit, Node.js, HTML5/CSS3<br>
            • <strong>Data & Tools:</strong> MySQL, Power BI, Pandas, NumPy, Git, SHA-256
        `,
        research: `
            <strong>🔬 Peer-Reviewed Research Publications:</strong><br><br>
            1. <em>"Smart Parking System with Computer Vision"</em><br>
            Published in: <strong>IRJAEH</strong> (Dec 2024)<br>
            DOI: <a href="https://doi.org/10.47392/IRJAEH.2024.0389" target="_blank" rel="noopener">10.47392/IRJAEH.2024.0389</a><br><br>
            2. <em>"AI-Based Heart Disease Detection Using Machine Learning"</em><br>
            Published in: <strong>IRJAEH</strong> (Mar 2025)<br>
            DOI: <a href="https://doi.org/10.47392/IRJAEH.2025.0129" target="_blank" rel="noopener">10.47392/IRJAEH.2025.0129</a><br><br>
            • Presented research at <strong>ICMCTT-IV 2024</strong> and <strong>ICESM 2025</strong>.
        `,
        contact: `
            <strong>📬 Communication Uplinks:</strong><br><br>
            • <strong>Location:</strong> Chennai, Tamil Nadu, India<br>
            • <strong>Email:</strong> <a href="mailto:harikrishnan202003@gmail.com">harikrishnan202003@gmail.com</a><br>
            • <strong>Phone:</strong> +91 9750582800<br>
            • <strong>LinkedIn:</strong> <a href="https://www.linkedin.com/in/hari-krishnan-p2003/" target="_blank" rel="noopener">linkedin.com/in/hari-krishnan-p2003</a><br>
            • <strong>GitHub:</strong> <a href="https://github.com/HKhari20" target="_blank" rel="noopener">github.com/HKhari20</a>
        `,
        education: `
            <strong>🎓 Academic Credentials:</strong><br><br>
            • <strong>B.Tech in Artificial Intelligence & Data Science</strong><br>
            • Graduated with <strong>First Class (7.35 CGPA)</strong>.<br>
            • Specialized coursework: Deep Neural Networks, Natural Language Processing, Computer Vision, Big Data Analytics, Statistical Optimization.
        `,
        scan: `
            <div style="border-left: 2px solid var(--neon-cyan); padding-left: 8px;">
                <span class="text-neon-cyan">[INITIATING NEURAL MEDIA FORENSIC SCAN...]</span><br>
                ✓ PyTorch ResNet-18 Feature Extraction: 0.032 Manipulation Anomaly<br>
                ✓ 2D-FFT Spectrum: No periodic generative artifacts detected<br>
                ✓ ELA Residuals: Gradient consistency verified<br>
                ✓ SHA-256 Hash: <code style="font-size:0.68rem; color:var(--neon-green)">e3b0c442...996fb924</code><br>
                <strong class="text-neon-green">► VERDICT: AUTHENTIC MEDIA STREAM VERIFIED (99.4% Confidence)</strong>
            </div>
        `
    };

    function processBotQuery(userQuery) {
        const q = userQuery.toLowerCase().trim();

        showTypingIndicator();

        setTimeout(() => {
            if (q.includes('role') || q.includes('pantech') || q.includes('experience') || q.includes('job') || q.includes('work') || q.includes('intern') || q.includes('company')) {
                appendBotMessage(botAnswers.role);
            } else if (q.includes('project') || q.includes('repo') || q.includes('code') || q.includes('deepfake') || q.includes('deepscan') || q.includes('resumescreen') || q.includes('portfolio') || q.includes('cardio') || q.includes('heart')) {
                appendBotMessage(botAnswers.projects);
            } else if (q.includes('skill') || q.includes('stack') || q.includes('tech') || q.includes('python') || q.includes('opencv') || q.includes('pytorch') || q.includes('langchain') || q.includes('gen ai') || q.includes('agentic')) {
                appendBotMessage(botAnswers.skills);
            } else if (q.includes('research') || q.includes('paper') || q.includes('publication') || q.includes('irjaeh') || q.includes('conference') || q.includes('journal')) {
                appendBotMessage(botAnswers.research);
            } else if (q.includes('contact') || q.includes('email') || q.includes('phone') || q.includes('linkedin') || q.includes('github') || q.includes('reach') || q.includes('location') || q.includes('chennai') || q.includes('hire')) {
                appendBotMessage(botAnswers.contact);
            } else if (q.includes('education') || q.includes('degree') || q.includes('college') || q.includes('cgpa') || q.includes('btech') || q.includes('study')) {
                appendBotMessage(botAnswers.education);
            } else if (q.includes('scan') || q.includes('forensic') || q.includes('detect') || q.includes('test') || q.includes('simulate')) {
                appendBotMessage(botAnswers.scan);
            } else if (q.includes('who') || q.includes('about') || q.includes('hari') || q.includes('bio') || q.includes('summary')) {
                appendBotMessage(`
                    <strong>Hari Krishnan P</strong> is an AI & Machine Learning Engineer based in Chennai, currently working as a <strong>Project Engineer at Pantech</strong>.<br><br>
                    He specializes in <strong>Gen AI, Agentic AI, AI/ML/DL, and OpenCV</strong>, with published papers in international research journals and flagship neural platforms in Deepfake Forensics and Semantic Vector Search.
                `);
            } else if (q.includes('hi') || q.includes('hello') || q.includes('hey') || q.includes('greet')) {
                appendBotMessage(`
                    Hello! I'm Hari's cybernetic AI assistant. How can I help you today? You can ask about his <strong>current role at Pantech</strong>, explore his <strong>AI projects</strong>, view his <strong>skills</strong>, check his <strong>research publications</strong>, or get his <strong>contact info</strong>!
                `);
            } else {
                appendBotMessage(`
                    I understand you're inquiring about "<em>${escapeHtml(userQuery)}</em>". Here are key operational topics you can explore:<br><br>
                    • <strong>Current Role:</strong> Project Engineer @ Pantech (Chennai)<br>
                    • <strong>AI Stack:</strong> Gen AI, Agentic AI, PyTorch, OpenCV<br>
                    • <strong>Research:</strong> 2 published papers in IRJAEH<br>
                    • <strong>Projects:</strong> DeepScan AI, NeuralScreen AI, CardioPredict AI<br><br>
                    <em>Tip: Tap any quick chip above or ask a direct question!</em>
                `);
            }
        }, 400);
    }

    if (chatForm) {
        chatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const text = chatInput.value.trim();
            if (!text) return;

            appendUserMessage(text);
            chatInput.value = '';
            processBotQuery(text);
        });
    }

    // Quick Action Chips in Chat Window
    document.querySelectorAll('.chat-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            const query = chip.getAttribute('data-query');
            if (query) {
                appendUserMessage(query);
                processBotQuery(query);
            }
        });
    });

    // Reset Chatbot
    if (botResetBtn) {
        botResetBtn.addEventListener('click', () => {
            if (!chatMessages) return;
            chatMessages.innerHTML = `
                <div class="chat-msg bot-msg">
                    <div class="msg-bubble">
                        <div class="msg-sender"><i class="fa-solid fa-robot"></i> HK//AI ASSISTANT</div>
                        <div class="msg-text">
                            Conversation reset. I'm ready! Inquire about Hari's role as <strong>Project Engineer at Pantech</strong>, his flagship <strong>AI systems</strong>, peer-reviewed <strong>IRJAEH research</strong>, or communication details in Chennai.
                        </div>
                        <div class="msg-time">${getCurrentTimeStr()}</div>
                    </div>
                </div>
            `;
            if (cyberAudio.enabled) cyberAudio.playBlip(600);
        });
    }

    /* ==========================================================================
       7. PROJECT FILTER MATRIX CHIPS
       ========================================================================== */
    const filterChips = document.querySelectorAll('.filter-chip');
    const projectCards = document.querySelectorAll('.cyber-project-card');

    filterChips.forEach(chip => {
        chip.addEventListener('click', () => {
            filterChips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');

            const filter = chip.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    card.style.display = 'flex';
                    card.style.animation = 'fadeInCard 0.4s ease forwards';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    /* ==========================================================================
       8. STICKY NAVIGATION HUD & SCROLL SPY
       ========================================================================== */
    const headerHud = document.getElementById('header-hud');
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('section[id], header[id]');

    window.addEventListener('scroll', () => {
        const scrollPos = window.scrollY;

        // Sticky header styling
        if (headerHud) {
            if (scrollPos > 40) {
                headerHud.classList.add('sticky');
            } else {
                headerHud.classList.remove('sticky');
            }
        }

        // Active Section Detection
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.offsetHeight;
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navItems.forEach(link => {
            link.classList.remove('active');
            if (currentSectionId && link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });

    /* ==========================================================================
       9. MOBILE MENU DRAWER
       ========================================================================== */
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const navLinks = document.getElementById('nav-links');

    if (hamburgerBtn && navLinks) {
        hamburgerBtn.addEventListener('click', () => {
            navLinks.classList.toggle('nav-open');
        });

        // Close on link click
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                navLinks.classList.remove('nav-open');
            });
        });
    }

    /* ==========================================================================
       10. LIVE CHENNAI / BENGALURU IST CLOCK
       ========================================================================== */
    const liveClock = document.getElementById('liveClock');
    function updateClock() {
        if (!liveClock) return;
        const now = new Date();
        const options = {
            timeZone: 'Asia/Kolkata',
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        };
        liveClock.textContent = now.toLocaleTimeString('en-GB', options) + ' IST';
    }
    updateClock();
    setInterval(updateClock, 1000);

});
