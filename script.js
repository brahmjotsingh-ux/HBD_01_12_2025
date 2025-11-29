/**
 * ------------------------------------------------------------------
 * 1. CONFIGURATION
 * ------------------------------------------------------------------
 */
const CONFIG = {
    FRIEND_NAME: "Aarav", 
    BIRTHDATE: "2026-02-10T00:00:00", 
    FINAL_WISH_TEXT: "I hope your 25th year is absolutely incredible. You've grown so much and achieved amazing things. Can't wait to see what you do next. Eat lots of cake! 🎉"
};

/**
 * ------------------------------------------------------------------
 * 2. STATE MANAGEMENT
 * ------------------------------------------------------------------
 */
const state = {
    isCardOpen: false,
    selectedDecorTypes: new Set(), // Set to store multiple selections
    cakeFlavor: null,
    candlesBlown: 0,
    totalCandles: 25,
    isMicActive: false,
    audioContext: null,
    analyser: null,
    dataArray: null
};

const $ = (id) => document.getElementById(id);

/**
 * ------------------------------------------------------------------
 * 3. INITIALIZATION
 * ------------------------------------------------------------------
 */
document.addEventListener('DOMContentLoaded', () => {
    initCardOpening();
    initDecorationsFlow();
    initCakeSelection();
    
    $('card-greeting-name').innerText = `Happy Birthday ${CONFIG.FRIEND_NAME}!`;
    $('friend-name-display').innerText = `Happy 25th Birthday ${CONFIG.FRIEND_NAME}!`; // Fixed display ID logic
    if($('sender-msg-display')) $('sender-msg-display').innerText = CONFIG.FINAL_WISH_TEXT;
    $('lyric-name').innerText = CONFIG.FRIEND_NAME;
});

/**
 * ------------------------------------------------------------------
 * 4. CARD & FLOW LOGIC
 * ------------------------------------------------------------------
 */
function initCardOpening() {
    const card = $('birthday-card');
    const btnStart = $('btn-start-exp');

    card.addEventListener('click', () => {
        if (!state.isCardOpen) {
            card.classList.add('is-open');
            state.isCardOpen = true;
            // Unlock audio context hint
            setTimeout(() => {
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                if (AudioContext) state.audioContext = new AudioContext();
            }, 500);
        }
    });

    btnStart.addEventListener('click', (e) => {
        e.stopPropagation();
        transitionToStage2();
    });
}

function transitionToStage2() {
    $('stage-initial').classList.remove('active');
    $('stage-experience').classList.add('active');
    
    // Step 1: Ask for Time Sync
    initTimeCapture();
}

/**
 * ------------------------------------------------------------------
 * 5. TIME & TIMER
 * ------------------------------------------------------------------
 */
function initTimeCapture() {
    $('btn-use-device-time').addEventListener('click', () => {
        $('sec-timecheck').classList.add('hidden');
        
        // Step 2: Show Timer Only
        $('sec-countdown').classList.remove('hidden');
        startAgeCountdown();
        
        // After 4 seconds of staring at the timer, offer to decorate
        setTimeout(() => {
            $('btn-goto-decor').classList.remove('hidden');
        }, 4000);
    });
    
    $('btn-goto-decor').addEventListener('click', () => {
        // Hide timer temporarily to focus on decor
        $('sec-countdown').classList.add('hidden');
        $('sec-decorate').classList.remove('hidden');
    });
    
    $('btn-trigger-finale').addEventListener('click', () => {
        triggerBigCountdownSequence();
    });
}

function startAgeCountdown() {
    const display = $('age-timer');
    const birthDateObj = new Date(CONFIG.BIRTHDATE);
    const yearOfBirth = birthDateObj.getFullYear() - 25;
    const actualBirthDate = new Date(birthDateObj);
    actualBirthDate.setFullYear(yearOfBirth);

    setInterval(() => {
        const now = new Date();
        const diff = now - actualBirthDate;

        const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
        const days = Math.floor((diff % (1000 * 60 * 60 * 24 * 365.25)) / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        display.innerHTML = `
            ${years} Years <br>
            ${days} Days, ${hours} Hours <br>
            ${minutes} Mins, ${seconds} Secs
        `;
    }, 1000);
}

/**
 * ------------------------------------------------------------------
 * 6. DECORATIONS
 * ------------------------------------------------------------------
 */
function initDecorationsFlow() {
    const btns = document.querySelectorAll('.decor-btn');
    
    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Toggle selection state
            const type = btn.dataset.type;
            if (state.selectedDecorTypes.has(type)) {
                state.selectedDecorTypes.delete(type);
                btn.classList.remove('active');
            } else {
                state.selectedDecorTypes.add(type);
                btn.classList.add('active');
            }
        });
    });

    $('btn-apply-decor').addEventListener('click', () => {
        $('sec-decorate').classList.add('hidden');

        // Play transition animation
        const overlay = $('decorating-overlay');
        overlay.classList.remove('hidden');
        
        setTimeout(() => {
            // Apply ALL selected decorations
            if (state.selectedDecorTypes.size === 0) {
                // If nothing selected, just do confetti as default
                addDecoration('confetti'); 
            } else {
                state.selectedDecorTypes.forEach(type => {
                    addDecoration(type);
                });
            }
            
            overlay.classList.add('hidden');
            
            // Show Timer again + Trigger Button for Finale
            $('sec-countdown').classList.remove('hidden');
            $('btn-goto-decor').classList.add('hidden'); // Hide the old button
            $('btn-trigger-finale').classList.remove('hidden'); // Show finale button
        }, 2000);
    });
}

function getRandomColor() {
    const colors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#ff9f43', '#5f27cd', '#54a0ff', '#fab1a0'];
    return colors[Math.floor(Math.random() * colors.length)];
}

function addDecoration(type) {
    const layer = $('decorations-layer');
    
    if (type === 'balloons') {
        for(let i=0; i<8; i++) {
            const b = document.createElement('div');
            b.classList.add('balloon');
            b.style.background = getRandomColor();
            b.style.left = Math.random() * 90 + '%';
            b.style.animationDuration = (Math.random() * 5 + 8) + 's'; // Slower, more majestic
            b.style.animationDelay = Math.random() * 5 + 's';
            layer.appendChild(b);
        }
    } else if (type === 'lights') {
        const l = document.createElement('div');
        l.style.position = 'absolute'; l.style.top = '0'; l.style.width = '100%'; l.style.height = '15px';
        l.style.borderTop = `6px dotted #FFE66D`; // Gold lights
        l.style.boxShadow = `0 5px 20px #FFE66D`;
        l.style.zIndex = '100';
        layer.appendChild(l);
    } else if (type === 'confetti') {
        fireConfetti();
        setInterval(() => fireConfetti(), 3000); // Recurring
    } else if (type === 'bubbles') {
        for(let i=0; i<15; i++) {
            const b = document.createElement('div');
            b.classList.add('bubble');
            b.style.width = (Math.random() * 60 + 40) + 'px'; // Bigger bubbles
            b.style.height = b.style.width;
            b.style.left = Math.random() * 95 + '%';
            b.style.animationDuration = (Math.random() * 5 + 8) + 's';
            b.style.animationDelay = Math.random() * 5 + 's';
            layer.appendChild(b);
        }
    } else if (type === 'flowers') {
        const flowers = ['🌸', '🌺', '🌻', '🌹', '🌷'];
        for(let i=0; i<12; i++) {
            const f = document.createElement('div');
            f.classList.add('flower');
            f.innerText = flowers[Math.floor(Math.random() * flowers.length)];
            f.style.left = Math.random() * 90 + '%';
            f.style.animationDuration = (Math.random() * 5 + 8) + 's';
            f.style.animationDelay = Math.random() * 5 + 's';
            layer.appendChild(f);
        }
    }
}

function fireConfetti() {
    const layer = $('decorations-layer');
    for(let i=0; i<20; i++) {
        const c = document.createElement('div');
        c.classList.add('confetti-piece');
        c.style.background = getRandomColor();
        c.style.top = '-10px';
        c.style.left = Math.random() * 100 + '%';
        c.style.transition = 'top 4s ease-out, transform 4s linear';
        layer.appendChild(c);
        setTimeout(() => {
            c.style.top = '110vh';
            c.style.transform = `rotate(${Math.random()*720}deg)`;
        }, 100);
        // Cleanup
        setTimeout(() => c.remove(), 4500);
    }
}

/**
 * ------------------------------------------------------------------
 * 7. BIG COUNTDOWN SEQUENCE
 * ------------------------------------------------------------------
 */
async function triggerBigCountdownSequence() {
    $('sec-countdown').classList.add('hidden');
    const overlay = $('big-countdown-overlay');
    const numEl = $('big-count-number');
    const colors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#ff9f43', '#5f27cd', '#ff4757'];
    
    overlay.classList.remove('hidden');
    
    for (let i = 5; i > 0; i--) {
        numEl.innerText = i;
        numEl.style.animation = 'none';
        numEl.offsetHeight; /* trigger reflow */
        numEl.style.animation = 'popIn 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        
        // Change overlay bg color temporarily
        overlay.style.backgroundColor = colors[i % colors.length];
        
        await new Promise(r => setTimeout(r, 1000));
    }
    
    overlay.classList.add('hidden');
    
    // Show Cake Selection
    $('sec-cake-selection').classList.remove('hidden');
}

/**
 * ------------------------------------------------------------------
 * 8. CAKE & CANDLE FLOW
 * ------------------------------------------------------------------
 */
function initCakeSelection() {
    const cards = document.querySelectorAll('.cake-card');
    cards.forEach(card => {
        card.addEventListener('click', () => {
            cards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            
            const flavor = card.dataset.flavor;
            
            // Wait slightly for visual selection then go to stage
            setTimeout(() => {
                $('sec-cake-selection').classList.add('hidden');
                $('cake-stage').classList.remove('hidden');
                renderCake(flavor);
            }, 500);
        });
    });

    $('btn-enable-mic').addEventListener('click', enableMicrophone);
    
    $('btn-submit-wish').addEventListener('click', () => {
        const wishText = $('wish-input').value;
        const lastCandle = document.querySelector('.candle .flame:not(.out)');
        if(lastCandle) lastCandle.classList.add('out');
        
        $('wish-container').classList.add('hidden');
        
        // Store Wish
        if(wishText) {
            localStorage.setItem('birthday_wish', wishText);
            console.log("%c 🎉 BIRTHDAY WISH CAPTURED: " + wishText, "color: #FF6B6B; font-size: 16px; font-weight: bold;");
            alert("Wish sealed in the stars! (Check console for dev access)");
        }
        
        // Play song & Show Lyrics immediately after last candle
        playHappyBirthdaySequence();
    });
    
    $('btn-cut-cake').addEventListener('click', cutTheCake);
}

function renderCake(flavor) {
    const img = $('main-cake-img');
    const sources = {
        'chocolate': 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80',
        'blackforest': 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&w=600&q=80',
        'redvelvet': 'https://images.unsplash.com/photo-1616541823729-00fe0aacd32c?auto=format&fit=crop&w=600&q=80',
        'blueberry': 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=600&q=80',
        'lotus': 'https://images.unsplash.com/photo-1550950158-d0d960dff51b?auto=format&fit=crop&w=600&q=80'
    };
    img.src = sources[flavor];
    
    // Create candles scattered ON TOP of the cake
    const container = $('candles-holder');
    container.innerHTML = '';
    state.candlesBlown = 0;
    
    for(let i=0; i < state.totalCandles; i++) {
        const c = document.createElement('div');
        c.className = 'candle';
        c.innerHTML = '<div class="flame"></div>';
        
        // Random placement within the container (which overlays the top half of image)
        // Keep them somewhat centered but scattered
        const leftPos = 10 + Math.random() * 80; // 10% to 90% width
        const topPos = 10 + Math.random() * 80;  // 10% to 90% height of the overlay
        
        c.style.left = leftPos + '%';
        c.style.top = topPos + '%';
        c.style.zIndex = Math.floor(topPos); // Lower candles appear in front
        
        container.appendChild(c);
    }
}

function playHappyBirthdaySequence() {
    const audio = $('audio-celebration'); 
    audio.play();
    
    // Confetti burst
    fireConfetti();
    
    // Show Lyrics
    $('lyrics-display').classList.remove('hidden');
    
    setTimeout(() => {
        $('btn-cut-cake').classList.remove('hidden');
    }, 16000); // Wait for song roughly
}

/**
 * ------------------------------------------------------------------
 * 9. MICROPHONE & WIND
 * ------------------------------------------------------------------
 */
function enableMicrophone() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert("Microphone not supported. Use tap fallback!");
        return;
    }
    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
        $('btn-enable-mic').classList.add('hidden');
        $('mic-status').classList.remove('hidden');
        
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const audioCtx = new AudioContext();
        const analyser = audioCtx.createAnalyser();
        const microphone = audioCtx.createMediaStreamSource(stream);
        microphone.connect(analyser);
        analyser.fftSize = 256;
        
        state.analyser = analyser;
        state.dataArray = new Uint8Array(analyser.frequencyBinCount);
        detectBlowLoop();
    });
}

function detectBlowLoop() {
    if (state.candlesBlown >= state.totalCandles) return;
    requestAnimationFrame(detectBlowLoop);
    state.analyser.getByteFrequencyData(state.dataArray);
    
    let sum = 0;
    for(let i=0; i<state.dataArray.length; i++) sum += state.dataArray[i];
    let avg = sum / state.dataArray.length;
    
    // If blowing detected (volume threshold)
    if (avg > 40) {
        showWindEffect(); // Visual feedback
        // Add random chance to extinguish to simulate realism (not all at once)
        if(Math.random() > 0.3) {
            blowOutCandleBatch(1);
        }
    }
}

function showWindEffect() {
    // Create visual wind streaks
    const windLayer = $('wind-layer');
    // Limit number of streaks
    if(windLayer.childElementCount > 10) return;
    
    const streak = document.createElement('div');
    streak.className = 'wind-streak';
    streak.style.top = Math.random() * 100 + 'vh';
    streak.style.left = '-200px';
    windLayer.appendChild(streak);
    
    // CSS animation handles movement, remove after
    setTimeout(() => streak.remove(), 1000);
}

function blowOutCandleBatch(count) {
    const flames = document.querySelectorAll('.flame:not(.out)');
    if (flames.length === 0) return;

    let limit = Math.min(count, flames.length);
    for (let i = 0; i < limit; i++) {
        // Stop at last candle for the wish
        if (document.querySelectorAll('.flame:not(.out)').length === 1) {
            promptLastWish();
            return;
        }
        flames[i].classList.add('out');
        state.candlesBlown++;
    }
}

function promptLastWish() {
    $('wish-container').classList.remove('hidden');
    $('mic-status').innerText = "One left... make a wish! ✨";
}

function cutTheCake() {
    $('main-cake-img').style.transform = "scale(0.95) rotate(2deg)"; // Simple shake/cut effect
    $('btn-cut-cake').classList.add('hidden');
    $('slice-offer').classList.remove('hidden');
    
    setTimeout(() => {
        $('sec-final').classList.remove('hidden');
        $('sec-final').scrollIntoView({ behavior: 'smooth' });
    }, 2000);
}