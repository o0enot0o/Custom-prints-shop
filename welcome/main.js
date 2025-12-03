document.getElementById('registerForm')?.addEventListener('submit', function(e) {
  e.preventDefault();

  const email1 = document.querySelectorAll('input[type="email"]')[0].value;
  const email2 = document.querySelectorAll('input[type="email"]')[1].value;
  const pass1 = document.querySelectorAll('input[type="password"]')[0].value;
  const pass2 = document.querySelectorAll('input[type="password"]')[1].value;

  if (email1 !== email2) return alert('Електронні адреси не співпадають!');
  if (pass1 !== pass2 || pass1.length < 6) return alert('Паролі не співпадають або занадто короткий!');

  localStorage.setItem('userRegistered', 'true');
  alert('Реєстрація успішна! Перенаправляємо в магазин...');
  window.location.href = '../marketplace/index.html';
});

// Кнопки Google / Facebook
document.querySelectorAll('.btn-social').forEach(btn => {
  btn.addEventListener('click', () => {
    localStorage.setItem('userRegistered', 'true');
    alert('Вхід через соцмережу успішний!');
    window.location.href = '../marketplace/index.html';
  });
});