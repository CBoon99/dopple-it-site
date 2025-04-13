// Lux SDK v2.1 – A 5D Storytelling Toolkit (Modular & Voice-Ready)
// Created by Carl & Little Cousin
// Save this file as 'lux-sdk-v2.1.js'

const Lux = {
  // === Core Tier ===
  Core: {
    reset: () => {
      document.querySelectorAll('[id$="Message"]').forEach(el => {
        el.style.display = 'none';
        el.style.opacity = 0;
      });
      if (typeof particles !== 'undefined') particles.visible = false;
      if (typeof spiral !== 'undefined') spiral.visible = true;
      if (typeof pulseRing !== 'undefined') pulseRing.visible = false;
      if (typeof miniSpirals !== 'undefined') miniSpirals.forEach(s => s.visible = false);
      if (typeof memoryOrbs !== 'undefined') memoryOrbs.forEach(o => o.visible = false);
      console.log('[Lux.Core] Interface reset.');
    },
    state: () => {
      console.table({
        spiralVisible: spiral?.visible ?? 'undefined',
        particlesVisible: particlesVisible ?? 'undefined',
        pulseVisible: pulseRing?.visible ?? 'undefined',
        miniSpiralsVisible: miniSpirals?.some(s => s.visible) ?? 'undefined',
        memoryOrbsVisible: memoryOrbs?.some(o => o.visible) ?? 'undefined',
        speed: spiralRotationSpeed ?? 'undefined',
        currentScene: Lux.Scene.currentScene ?? 'default'
      });
      console.log('[Lux.Core] Current state logged.');
    }
  },

  // === Visual Tier ===
  Visual: {
    setColor: (r, g, b) => {
      if ([r, g, b].some(v => typeof v !== 'number' || v < 0 || v > 1)) {
        console.warn('[Lux.Visual] Invalid color values.');
        return;
      }
      if (!spiralMaterial || !miniSpirals) return;
      spiralMaterial.color.setRGB(r, g, b);
      miniSpirals.forEach(s => s.material.color.setRGB(r, g, b));
      console.log(⁠ [Lux.Visual] Color set to rgb(${r}, ${g}, ${b}) ⁠);
    },
    flashColor: () => {
      const r = Math.random(), g = Math.random(), b = Math.random();
      Lux.Visual.setColor(r, g, b);
      setTimeout(() => Lux.Visual.setColor(0, 1, 1), 500);
    }
  },

  // === Motion Tier ===
  Motion: {
    setSpeed: (mult) => {
      spiralRotationSpeed = 0.01 * mult;
      console.log(⁠ [Lux.Motion] Rotation speed set to ${spiralRotationSpeed} ⁠);
    },
    pause: () => {
      Lux._paused = true;
      console.log('[Lux.Motion] Animation paused.');
    },
    resume: () => {
      Lux._paused = false;
      animate();
      console.log('[Lux.Motion] Animation resumed.');
    }
  },

  // === Particle Tier ===
  Particle: {
    spawnMini: (count = 3) => {
      if (typeof createMiniSpiral !== 'function') return;
      for (let i = 0; i < count; i++) createMiniSpiral();
      console.log(⁠ [Lux.Particle] Spawned ${count} mini spirals. ⁠);
    },
    toggleParticles: () => {
      if (typeof particles === 'undefined' || typeof spiral === 'undefined') return;
      particlesVisible = !particlesVisible;
      particles.visible = particlesVisible;
      spiral.visible = !particlesVisible;
      console.log(⁠ [Lux.Particle] Particles ${particlesVisible ? 'on' : 'off'} ⁠);
    }
  },

  // === Pulse Tier ===
  Pulse: {
    trigger: () => {
      if (!pulseRing) return;
      pulseRing.visible = true;
      pulseRing.scale.set(1, 1, 1);
      console.log('[Lux.Pulse] Pulse triggered.');
    }
  },

  // === Sound Tier ===
  Sound: {
    play: (id, options = {}) => {
      const audio = document.getElementById(id);
      if (!audio) return;
      audio.loop = options.loop || false;
      audio.volume = options.volume || 1.0;
      audio.play();
      console.log(⁠ [Lux.Sound] Playing: ${id} ⁠);
    },
    stop: (id) => {
      const audio = document.getElementById(id);
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
        console.log(⁠ [Lux.Sound] Stopped: ${id} ⁠);
      }
    }
  },

  // === Memory Tier ===
  Memory: {
    toggleOrbs: () => {
      if (!memoryOrbs) return;
      memoryOrbs.forEach(o => o.visible = !o.visible);
      console.log('[Lux.Memory] Memory orbs toggled.');
    }
  },

  // === Log Tier ===
  Log: {
    emit: (message, options = {}) => {
      console.log(message);
      const msg = document.createElement('div');
      Object.assign(msg.style, {
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)', background: 'rgba(0,0,0,0.8)',
        color: options.color || '#ff8000', padding: '20px', borderRadius: '10px',
        fontSize: options.fontSize || '18px', textAlign: 'center', opacity: '0',
        transition: 'opacity 1s ease-in-out', zIndex: 9999
      });
      msg.innerHTML = message;
      document.body.appendChild(msg);
      setTimeout(() => msg.style.opacity = '1', 100);
      setTimeout(() => { msg.style.opacity = '0'; setTimeout(() => msg.remove(), 1000); }, 5000);
    }
  },

  // === Script Tier ===
  Script: {
    _scripts: {},
    create: (name, steps) => {
      Lux.Script._scripts[name] = steps;
      localStorage.setItem('LuxScripts', JSON.stringify(Lux.Script._scripts));
      console.log(⁠ [Lux.Script] Created: ${name} ⁠);
    },
    run: (name) => {
      const steps = Lux.Script._scripts[name];
      if (!steps) return;
      steps.forEach(({ fn, t }) => setTimeout(fn, t));
      console.log(⁠ [Lux.Script] Running: ${name} ⁠);
    },
    load: () => {
      const saved = localStorage.getItem('LuxScripts');
      if (saved) Lux.Script._scripts = JSON.parse(saved);
    }
  },

  // === Utils Tier ===
  Utils: {
    getTime: () => {
      const now = new Date();
      console.log(⁠ [Lux.Utils] Time: ${now.toLocaleTimeString()} ⁠);
    },
    bindCommand: (phrase, fn) => {
      if (!Lux._bindings) Lux._bindings = {};
      Lux._bindings[phrase.toLowerCase()] = fn;
      console.log(⁠ [Lux.Utils] Bound: '${phrase}' ⁠);
    }
  },

  // === Voice Tier ===
  Voice: {
    init: () => {
      if (!('webkitSpeechRecognition' in window)) return;
      const rec = new webkitSpeechRecognition();
      rec.continuous = true;
      rec.interimResults = false;
      rec.onresult = (e) => {
        const t = e.results[e.results.length - 1][0].transcript.trim().toLowerCase();
        console.log(⁠ [Lux.Voice] Heard: ${t} ⁠);
        if (Lux._bindings && Lux._bindings[t]) Lux._bindings[t]();
      };
      rec.onerror = (e) => console.warn('[Lux.Voice] Error:', e.error);
      rec.start();
      Lux.Voice.recognition = rec;
      console.log('[Lux.Voice] Initialized.');
    },
    stop: () => {
      if (Lux.Voice.recognition) Lux.Voice.recognition.stop();
    }
  }
};

// === Sample Scripts ===
Lux.Script.create('coreSequence', [
  { fn: () => Lux.Core.reset(), t: 0 },
  { fn: () => Lux.Visual.setColor(1, 0.5, 0), t: 1000 },
  { fn: () => Lux.Motion.setSpeed(2), t: 2000 },
  { fn: () => Lux.Particle.spawnMini(5), t: 3000 },
  { fn: () => Lux.Pulse.trigger(), t: 4000 },
  { fn: () => Lux.Sound.play('pulseSound', { volume: 0.5 }), t: 4000 },
  { fn: () => Lux.Log.emit('[Lux.Payload] Sequence complete: coreSequence', { fontSize: '24px' }), t: 5000 }
]);
Lux.Payload = {
  coreSequence: () => Lux.Script.run('coreSequence')
};

Lux.Script.load();
Lux.Voice.init();
