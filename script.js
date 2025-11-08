(() => {
  const canvas = document.getElementById('birdCanvas');
  const ctx = canvas.getContext('2d');

  // Set full size
  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Bird image - simple silhouette shape drawing
  // Alternatively, you can use a bird image by loading Image and drawing it
  // For simplicity, we'll draw basic bird shapes (V shapes) here

  class Bird {
    constructor(x, y, speedX, speedY, scale, flapSpeed) {
      this.x = x;
      this.y = y;
      this.speedX = speedX;
      this.speedY = speedY;
      this.scale = scale;
      this.flap = 0;
      this.flapSpeed = flapSpeed;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      // Flap animation cycling
      this.flap += this.flapSpeed;

      // Reset position if off right side
      if (this.x > canvas.width + 20) {
        this.x = -20;
        this.y = Math.random() * (canvas.height * 0.6);
      }

      // Keep Y in view (bounce vertically)
      if (this.y < 20 || this.y > canvas.height * 0.7) {
        this.speedY = -this.speedY;
      }
    }

    draw(ctx) {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.scale(this.scale, this.scale);
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#d0f0c0';
      ctx.fillStyle = 'rgba(192, 255, 172, 0.4)';

      // Animate wing flap with flap parameter between 0 and PI
      const wingAngle = Math.sin(this.flap) * 0.5 + 0.5; // 0 to 1

      // Draw simple "V" shaped bird with flapping wings
      ctx.beginPath();
      // left wing
      ctx.moveTo(0, 0);
      ctx.lineTo(-20, -10 * wingAngle);
      ctx.lineTo(-15, 0);
      // right wing
      ctx.moveTo(0, 0);
      ctx.lineTo(20, -10 * wingAngle);
      ctx.lineTo(15, 0);

      ctx.stroke();
      ctx.restore();
    }
  }

  // Create multiple birds with random initial properties
  const birds = [];
  const birdCount = 10;
  for (let i = 0; i < birdCount; i++) {
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight * 0.5;
    const speedX = 1 + Math.random() * 1.5; // 1 to 2.5 px per frame
    const speedY = (Math.random() - 0.5) * 0.5; // small vertical movement
    const scale = 0.7 + Math.random() * 0.6;
    const flapSpeed = 0.05 + Math.random() * 0.05;
    birds.push(new Bird(x, y, speedX, speedY, scale, flapSpeed));
  }

  // Animation loop
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    birds.forEach(bird => {
      bird.update();
      bird.draw(ctx);
    });
    requestAnimationFrame(animate);
  }

  animate();
})();
