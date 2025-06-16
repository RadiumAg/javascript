document.addEventListener('DOMContentLoaded', () => {
  // 获取所有玻璃元素
  const glassElements = document.querySelectorAll(
    '.glass-surface, .control-item, .glass-button'
  );

  // 1. 动态视差效果
  document.addEventListener('mousemove', e => {
    const mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    const mouseY = (e.clientY / window.innerHeight - 0.5) * 2;

    glassElements.forEach(el => {
      const depth = Number.parseFloat(el.dataset.depth) || 0.05;
      const moveX = mouseX * 20 * depth;
      const moveY = mouseY * 20 * depth;
      const rotateX = mouseY * 5;
      const rotateY = -mouseX * 5;

      el.style.transform = `translate3d(${moveX}px, ${moveY}px, 0) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

      // 动态调整阴影
      const shadowX = mouseX * 10;
      const shadowY = mouseY * 10;
      el.style.boxShadow = `
                ${shadowX}px ${shadowY}px 30px rgba(0, 0, 0, 0.2),
                inset 0 0 0 1px rgba(255, 255, 255, 0.1)
            `;
    });
  });

  // 2. 触摸反馈 - 波纹效果
  function createRipple(e) {
    const button = e.currentTarget;
    const ripple = document.createElement('span');
    ripple.classList.add('ripple');

    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x - size / 2}px`;
    ripple.style.top = `${y - size / 2}px`;

    button.append(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 600);
  }

  document.querySelectorAll('.glass-button, .control-item').forEach(button => {
    button.addEventListener('click', createRipple);
  });

  // 3. 滑块交互
  const brightnessSlider = document.querySelector('.slider-track');
  const brightnessThumb = document.querySelector('.slider-thumb');
  const progressThumb = document.querySelector('.progress-thumb');

  let isDragging = false;

  function handleSliderMove(e) {
    if (!isDragging) return;

    const rect = brightnessSlider.getBoundingClientRect();
    let pos = (e.clientX - rect.left) / rect.width;
    pos = Math.max(0, Math.min(1, pos));

    brightnessThumb.style.left = `${pos * 100}%`;
  }

  brightnessThumb.addEventListener('mousedown', () => {
    isDragging = true;
    document.addEventListener('mousemove', handleSliderMove);
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
    document.removeEventListener('mousemove', handleSliderMove);
  });

  brightnessSlider.addEventListener('click', e => {
    const rect = brightnessSlider.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    brightnessThumb.style.left = `${pos * 100}%`;
  });

  // 4. 系统主题检测
  function updateTheme() {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.body.classList.toggle('dark-mode', isDark);
  }

  window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', updateTheme);
  updateTheme();

  // 添加波纹样式
  const style = document.createElement('style');
  style.textContent = `
        .ripple {
            position: absolute;
            border-radius: 50%;
            background-color: rgba(255, 255, 255, 0.4);
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        }
        
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
  document.head.append(style);

  // 为元素添加随机深度
  glassElements.forEach((el, index) => {
    el.dataset.depth = (0.03 + index * 0.01).toFixed(2);
  });

  // 音乐播放器模拟进度
  let progress = 0;
  setInterval(() => {
    progress = (progress + 0.5) % 100;
    document.querySelector('.progress-thumb').style.left = `${progress}%`;
  }, 1000);
});
