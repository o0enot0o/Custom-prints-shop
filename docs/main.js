// Fade-in при скролі
document.addEventListener('scroll', () => {
  document.querySelectorAll('.fade-in').forEach(el => {
    if (el.getBoundingClientRect().top < window.innerHeight * 0.8) {
      el.classList.add('visible');
    }
  });
});

// Елементи форми
const switchLink = document.getElementById('switch-link');
const switchText = document.getElementById('switch-text');
const formTitle = document.getElementById('form-title');
const submitBtn = document.getElementById('submit-btn');
const termsText = document.getElementById('terms-text');
const authForm = document.getElementById('authForm');
const formBlock = document.querySelector('.form-block');

let isLoginMode = false;

// HTML для посилань на умови та політику
const registerTermsHTML = '* Реєструючись, ви приймаєте наші <a href="legal/terms.html">Умови використання</a> і <a href="legal/privacy.html">Політику конфіденційності</a>.<br>Цей сайт захищено reCAPTCHA Enterprise. До нього застосовуються <a href="https://policies.google.com/privacy" target="_blank">Політика конфіденційності</a> Google та <a href="https://policies.google.com/terms" target="_blank">Загальні положення та умови</a>.';

const loginTermsHTML = 'Увійшовши, ви погоджуєтеся з нашими <a href="legal/terms.html">Умовами використання</a> та <a href="legal/privacy.html">Політикою конфіденційності</a>.<br>Цей сайт захищено reCAPTCHA Enterprise. До нього застосовуються <a href="https://policies.google.com/privacy" target="_blank">Політика конфіденційності</a> Google та <a href="https://policies.google.com/terms" target="_blank">Загальні положення та умови</a>.';

// Перемикання між режимами реєстрації і входу
switchLink.addEventListener('click', (e) => {
  e.preventDefault();

  isLoginMode = !isLoginMode;

  if (isLoginMode) {
    formBlock.classList.add('login-mode');
    formTitle.textContent = 'Вхід';
    switchText.textContent = 'Немає акаунту?';
    switchLink.textContent = 'Зареєструватися';
    submitBtn.textContent = 'Увійти';
    termsText.innerHTML = loginTermsHTML;
  } else {
    formBlock.classList.remove('login-mode');
    formTitle.textContent = 'Реєстрація';
    switchText.textContent = 'Вже маєте акаунт?';
    switchLink.textContent = 'Увійти';
    submitBtn.textContent = 'Зареєструватися';
    termsText.innerHTML = registerTermsHTML;
  }

  authForm.reset();
});

// Обробка submit
authForm.addEventListener('submit', (e) => {
  e.preventDefault();

  if (isLoginMode) {
    // Вхід
    const email = document.getElementById('email1').value;
    const pass = document.getElementById('pass1').value;

    if (!email || !pass) return alert('Заповніть всі поля!');

    localStorage.setItem('userRegistered', 'true');
    alert('Вхід успішний! Перенаправляємо в магазин...');
    window.location.href = '../marketplace/index.html';
  } else {
    // Реєстрація
    const email1 = document.getElementById('email1').value;
    const email2 = document.getElementById('email2').value;
    const pass1 = document.getElementById('pass1').value;
    const pass2 = document.getElementById('pass2').value;

    if (email1 !== email2) return alert('Електронні адреси не співпадають!');
    if (pass1 !== pass2 || pass1.length < 6) return alert('Паролі не співпадають або занадто короткі!');

    localStorage.setItem('userRegistered', 'true');
    alert('Реєстрація успішна! Перенаправляємо в магазин...');
    window.location.href = '../marketplace/index.html';
  }
});

// Паралакс із затемненням
const parallaxSections = document.querySelectorAll('.hero-header, .features-section');
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  parallaxSections.forEach(section => {
    const bg = section.querySelector('.parallax-bg');
    const overlay = section.querySelector('.overlay');
    if (bg) bg.style.transform = `translateY(${scrollY * 0.3}px)`;
    if (overlay) {
      const darkness = Math.min(0.65, 0.25 + scrollY / 1200);
      overlay.style.background = `rgba(0,0,0,${darkness})`;
    }
  });
});
