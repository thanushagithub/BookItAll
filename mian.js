function goBack() {
  window.location.href = "dashboard.html";
}

document.addEventListener("DOMContentLoaded", function () {
  // Display the splash screen for 3 seconds, then show the login page
  setTimeout(function () {
    document.getElementById("splash-screen").style.display = "none";
    document.getElementById("login-container").style.display = "block";
  }, 5000); // 3000ms = 3 seconds
});

document.addEventListener("DOMContentLoaded", function () {
  const confettiSettings = {
    maxCount: 150,
    speed: 2,
    frameInterval: 15,
    alpha: 1.0,
    gradient: false,
  };

  const confetti = {
    maxCount: confettiSettings.maxCount,
    speed: confettiSettings.speed,
    frameInterval: confettiSettings.frameInterval,
    alpha: confettiSettings.alpha,
    gradient: confettiSettings.gradient,
    start: null,
    stop: null,
    toggle: null,
    pause: null,
    resume: null,
    remove: null,
    isPaused: null,
    isRunning: null,
  };

  (function () {
    confetti.start = startConfetti;
    confetti.stop = stopConfetti;
    confetti.toggle = toggleConfetti;
    confetti.pause = pauseConfetti;
    confetti.resume = resumeConfetti;
    confetti.togglePause = toggleConfettiPause;
    confetti.isPaused = isConfettiPaused;
    confetti.isRunning = isConfettiRunning;
    let supportsAnimationFrame = true;
    const colors = [
      "rgba(30,144,255,",
      "rgba(107,142,35,",
      "rgba(255,215,0,",
      "rgba(255,192,203,",
      "rgba(106,90,205,",
      "rgba(173,216,230,",
      "rgba(238,130,238,",
      "rgba(152,251,152,",
      "rgba(70,130,180,",
      "rgba(244,164,96,",
      "rgba(210,105,30,",
      "rgba(220,20,60,",
    ];
    let confettiCanvas = null;
    let context = null;
    let particles = [];
    let animationTimer = null;
    let pause = false;
    let lastFrameTime = Date.now();

    function createCanvas() {
      confettiCanvas = document.createElement("canvas");
      confettiCanvas.setAttribute("id", "confetti-canvas");
      confettiCanvas.setAttribute(
        "style",
        "display:block;z-index:999999;pointer-events:none;position:fixed;top:0"
      );
      document.body.prepend(confettiCanvas);
      confettiCanvas.width = window.innerWidth;
      confettiCanvas.height = window.innerHeight;
      context = confettiCanvas.getContext("2d");
      window.addEventListener("resize", resizeCanvas, true);
    }

    function resizeCanvas() {
      confettiCanvas.width = window.innerWidth;
      confettiCanvas.height = window.innerHeight;
    }

    function generateParticle() {
      const particle = {
        x: Math.random() * confettiCanvas.width,
        y: Math.random() * confettiCanvas.height - confettiCanvas.height,
        diameter: Math.random() * 10 + 5,
        tilt: Math.random() * 10 - 10,
        tiltAngleIncrement: Math.random() * 0.07 + 0.05,
        tiltAngle: Math.random() * Math.PI,
        color:
          colors[Math.floor(Math.random() * colors.length)] +
          confettiSettings.alpha +
          ")",
        color2:
          colors[Math.floor(Math.random() * colors.length)] +
          confettiSettings.alpha +
          ")",
      };
      return particle;
    }

    function startConfetti(timeout) {
      const count = confettiSettings.maxCount;
      for (let i = 0; i < count; i++) {
        particles.push(generateParticle());
      }
      animationTimer = requestAnimationFrame(runAnimation);
      if (timeout) {
        setTimeout(stopConfetti, timeout);
      }
    }

    function stopConfetti() {
      cancelAnimationFrame(animationTimer);
      animationTimer = null;
    }

    function runAnimation() {
      if (!supportsAnimationFrame) {
        context.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
      }
      if (particles.length === 0) {
        context.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
        return;
      }
      context.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
      particles.forEach((particle, index) => {
        particle.tiltAngle += particle.tiltAngleIncrement;
        particle.x += Math.sin(lastFrameTime) - 0.5;
        particle.y +=
          (Math.cos(lastFrameTime) +
            particle.diameter +
            confettiSettings.speed) *
          0.5;
        particle.tilt = 15 * Math.sin(particle.tiltAngle);
        if (
          particle.x > confettiCanvas.width + 20 ||
          particle.x < -20 ||
          particle.y > confettiCanvas.height
        ) {
          particles.splice(index, 1);
        }
      });
      drawParticles();
      lastFrameTime = Date.now();
      animationTimer = requestAnimationFrame(runAnimation);
    }

    function drawParticles() {
      particles.forEach((particle) => {
        context.beginPath();
        context.lineWidth = particle.diameter;
        const x = particle.x + particle.tilt;
        const y = particle.y + particle.tilt + particle.diameter / 2;
        const gradient = context.createLinearGradient(
          x,
          particle.y,
          particle.x,
          y
        );
        gradient.addColorStop(0, particle.color);
        gradient.addColorStop(1, particle.color2);
        context.strokeStyle = gradient;
        context.moveTo(x, particle.y);
        context.lineTo(particle.x, y);
        context.stroke();
      });
    }

    function toggleConfetti() {
      if (animationTimer) {
        stopConfetti();
      } else {
        startConfetti();
      }
    }

    function pauseConfetti() {
      pause = true;
    }

    function resumeConfetti() {
      pause = false;
      runAnimation();
    }

    function toggleConfettiPause() {
      if (pause) {
        resumeConfetti();
      } else {
        pauseConfetti();
      }
    }

    function isConfettiPaused() {
      return pause;
    }

    function isConfettiRunning() {
      return animationTimer !== null;
    }

    createCanvas();
  })();

  function showToaster(message) {
    const toaster = document.getElementById("toaster");
    toaster.textContent = message;
    toaster.style.display = "block";
    setTimeout(() => {
      toaster.style.display = "none";
      redirectToDashboard(); // Redirect after toaster is hidden
    }, 3000);
  }

  function redirectToDashboard() {
    window.location.href = "dashboard.html"; // Change to your dashboard URL
  }

  function handleFormSubmission(event) {
    event.preventDefault();
    confetti.start();
    showToaster("Booking Successful!");
  }

  document
    .getElementById("trainBookingForm")
    ?.addEventListener("submit", handleFormSubmission);
  document
    .getElementById("movieBookingForm")
    ?.addEventListener("submit", handleFormSubmission);
  document
    .getElementById("flightBookingForm")
    ?.addEventListener("submit", handleFormSubmission);
  document
    .getElementById("busBookingForm")
    ?.addEventListener("submit", handleFormSubmission);
});
