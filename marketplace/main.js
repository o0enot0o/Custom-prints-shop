// КАТЕГОРІЇ — скролл + кнопки стрілок
const list = document.getElementById("categoriesList");
const leftBtn = document.querySelector(".left-btn");
const rightBtn = document.querySelector(".right-btn");
let scrollStep = 176 * 4;

list.addEventListener("wheel", e => {
  if (window.innerWidth > 768) {
    e.preventDefault();
    list.scrollBy({ left: e.deltaY * 2.5, behavior: "smooth" });
  }
});

rightBtn.addEventListener("click", () => list.scrollBy({ left: scrollStep, behavior: "smooth" }));
leftBtn.addEventListener("click", () => list.scrollBy({ left: -scrollStep, behavior: "smooth" }));

function updateFade() {
  const items = document.querySelectorAll(".category-item");
  const rect = list.getBoundingClientRect();
  items.forEach(item => {
    item.classList.remove("fade-left", "fade-right");
    const r = item.getBoundingClientRect();
    if (r.right < rect.left + 50) item.classList.add("fade-left");
    if (r.left > rect.right - 50) item.classList.add("fade-right");
  });
}
list.addEventListener("scroll", updateFade);
window.addEventListener("load", updateFade);

// ДАНІ ТОВАРІВ — нормальні назви
const productsData = {
  "Плакати": [
    { name: "Мотиваційний плакат «Never Give Up»", price: 8.99 },
    { name: "Плакат з котиками", price: 7.49 },
    { name: "Мінімалістичний постер «Гори»", price: 9.99 },
    { name: "Аніме-постер «Attack on Titan»", price: 11.99 },
    { name: "Ретро-плакат 80-х", price: 8.49 }
  ],
  "Футболки": [
    { name: "Футболка «I Paused My Game»", price: 19.99 },
    { name: "Футболка з мемом «This is Fine»", price: 18.99 },
    { name: "Оверсайз «Minimal Cat»", price: 22.99 }
  ],
  "Кружки": [
    { name: "Кружка «Кодую на каві»", price: 12.99 },
    { name: "Чашка з єдинорогом", price: 14.99 }
  ],
  "Стікери": [
    { name: "Набір стікерів «Programmer Life»", price: 4.99 },
    { name: "Голографічні стікери", price: 6.49 }
  ],
  "Чохли": [
    { name: "Чохол на iPhone «Зоряна ніч»", price: 15.99 },
    { name: "Чохол «Rick and Morty»", price: 16.99 }
  ],
  "Постери": [
    { name: "Постер «The Mandalorian»", price: 12.99 },
    { name: "Музичний постер «Daft Punk»", price: 13.99 }
  ],
  "Картини": [
    { name: "Картина «Зоряна ніч» Ван Гог", price: 39.99 },
    { name: "Абстрактна картина «Ocean Wave»", price: 44.99 }
  ],
  "Подушки": [
    { name: "Подушка «Кіт у коробці»", price: 24.99 },
    { name: "Декоративна подушка «Геометрія»", price: 26.99 }
  ],
  "Брелоки": [
    { name: "Брелок «Baby Yoda»", price: 6.99 },
    { name: "Акриловий брелок аніме", price: 5.99 }
  ]
};

// РЕНДЕР ТОВАРІВ
const productRow = document.getElementById("productRow");
const productTitle = document.querySelector(".product-title");
const categoryItems = document.querySelectorAll(".category-item");

function renderProducts(category) {
  productRow.innerHTML = "";
  const products = productsData[category] || [];

  products.forEach(p => {
    const card = document.createElement("div");
    card.className = "product-card";

    card.innerHTML = `
      <div class="product-img" style="background-image: ur[](https://picsum.photos/300/400?random=${Math.random()})"></div>
      <div class="product-info">
        <div class="product-name">${p.name}</div>
        <p class="product-price">${p.price.toFixed(2)}$</p>
        <button class="buy-btn">Купити</button>
      </div>
    `;

    // Клік по картці — відкриває сторінку товару
    card.addEventListener("click", e => {
      if (!e.target.closest(".buy-btn")) {
        openProductPage(p);
      }
    });

    // Додаємо в кошик
    card.querySelector(".buy-btn").addEventListener("click", e => {
      e.stopPropagation();
      const existing = cart.find(i => i.name === p.name);
      if (existing) {
        existing.qty++;
      } else {
        cart.push({ ...p, qty: 1, checked: true });
      }
      updateCart();
    });

    productRow.appendChild(card);
  });
}

// Активна категорія
function setActiveCategory(elem) {
  categoryItems.forEach(i => i.classList.remove("active-category"));
  elem.classList.add("active-category");
}

categoryItems.forEach(item => {
  item.addEventListener("click", () => {
    const cat = item.textContent.trim();
    setActiveCategory(item);
    productTitle.textContent = `Товари з категорії: ${cat}`;
    renderProducts(cat);
  });
});

if (categoryItems.length) {
  setActiveCategory(categoryItems[0]);
  renderProducts(categoryItems[0].textContent.trim());
}

// МОДАЛКА «ПРО НАС»
document.querySelector(".js-about").addEventListener("click", e => {
  e.preventDefault();
  document.getElementById("aboutModal").classList.add("active");
});
document.querySelector("#aboutModal .modal-close").addEventListener("click", () => {
  document.getElementById("aboutModal").classList.remove("active");
});
document.getElementById("aboutModal").addEventListener("click", e => {
  if (e.target === e.currentTarget) e.currentTarget.classList.remove("active");
});

// КОРЗИНА
let cart = [];
const cartCount = document.querySelector(".cart-count");
const miniCart = document.getElementById("miniCart");
const cartItemsContainer = document.getElementById("cartItems");
const cartTotalEl = document.getElementById("cartTotal");
const openCartBtn = document.querySelector(".js-cart-open");
const closeCartBtn = document.querySelector(".js-cart-close");

openCartBtn.addEventListener("click", e => {
  e.preventDefault();
  miniCart.classList.toggle("active");
});
closeCartBtn.addEventListener("click", () => miniCart.classList.remove("active"));

document.addEventListener("click", e => {
  if (!openCartBtn.contains(e.target) && !miniCart.contains(e.target)) {
    miniCart.classList.remove("active");
  }
});

function updateCart() {
  cartCount.textContent = cart.length;
  cartItemsContainer.innerHTML = "";
  let total = 0;

  cart.forEach((item, i) => {
    if (item.checked) total += item.price * item.qty;
    const div = document.createElement("div");
    div.className = "mini-cart__item";
    div.innerHTML = `
      <input type="checkbox" class="mini-cart__checkbox" data-index="${i}" ${item.checked ? 'checked' : ''}>
      <div class="mini-cart__img" style="background-image: ur[](https://picsum.photos/100/100?random=${i})"></div>
      <div class="mini-cart__info">
        <div class="mini-cart__name">${item.name}</div>
        <div class="mini-cart__price">${(item.price * item.qty).toFixed(2)} $</div>
      </div>
      <button class="mini-cart__remove" data-index="${i}">×</button>
    `;
    cartItemsContainer.appendChild(div);
  });

  cartTotalEl.textContent = total.toFixed(2) + " $";
}

// Видалення товару — без закриття кошика
cartItemsContainer.addEventListener("click", e => {
  if (e.target.classList.contains("mini-cart__remove")) {
    e.stopPropagation();
    const i = +e.target.dataset.index;
    cart.splice(i, 1);
    updateCart();
  }
});

cartItemsContainer.addEventListener("change", e => {
  if (e.target.classList.contains("mini-cart__checkbox")) {
    const i = +e.target.dataset.index;
    cart[i].checked = e.target.checked;
    updateCart();
  }
});

// СТОРІНКА ТОВАРУ
const productPage = document.getElementById("productPage");

function openProductPage(product) {
  document.getElementById("pageTitle").textContent = product.name;
  document.getElementById("pagePrice").textContent = product.price.toFixed(2) + " $";
  document.getElementById("mainImg").style.backgroundImage = `ur[](https://picsum.photos/800/1000?random=${Date.now()})`;

  // Схожі товари
  const similar = document.getElementById("similarProducts");
  similar.innerHTML = "";
  const all = Object.values(productsData).flat().filter(p => p.name !== product.name);
  const shuffled = all.sort(() => 0.5 - Math.random()).slice(0, 4);
  shuffled.forEach(p => {
    const c = document.createElement("div");
    c.className = "product-card";
    c.innerHTML = `
      <div class="product-img" style="background-image: ur[](https://picsum.photos/300/400?random=${Math.random()})"></div>
      <div class="product-info">
        <div class="product-name">${p.name}</div>
        <p class="product-price">${p.price.toFixed(2)}$</p>
      </div>
    `;
    c.addEventListener("click", e => {
      if (!e.target.closest(".buy-btn")) openProductPage(p);
    });
    similar.appendChild(c);
  });

  productPage.classList.add("active");
  document.body.style.overflow = "hidden";
}

// Закриття сторінки товару
document.querySelector(".product-page__close").addEventListener("click", () => {
  productPage.classList.remove("active");
  document.body.style.overflow = "";
});

productPage.addEventListener("click", e => {
  if (e.target === productPage) {
    productPage.classList.remove("active");
    document.body.style.overflow = "";
  }
});

document.addEventListener("keydown", e => {
  if (e.key === "Escape" && productPage.classList.contains("active")) {
    productPage.classList.remove("active");
    document.body.style.overflow = "";
  }
});

// Додати з повної сторінки в кошик
document.getElementById("addToCartFull").addEventListener("click", () => {
  const name = document.getElementById("pageTitle").textContent;
  const price = parseFloat(document.getElementById("pagePrice").textContent);
  const existing = cart.find(i => i.name === name);
  if (existing) existing.qty++; else cart.push({name, price, qty:1, checked:true});
  updateCart();
});

// ОФОРМЛЕННЯ ЗАМОВЛЕННЯ
const checkoutModal = document.getElementById("checkoutModal");
const checkoutBtn = document.getElementById("checkoutBtn");
const checkoutClose = document.querySelector(".checkout-close");
const checkoutItemsContainer = document.getElementById("checkoutItems");
const checkoutSubtotal = document.getElementById("checkoutSubtotal");
const checkoutGrandTotal = document.getElementById("checkoutGrandTotal");
const submitOrderBtn = document.querySelector(".submit-order-btn");

// Відкрити модалку
checkoutBtn.addEventListener("click", () => {
  if (cart.filter(item => item.checked).length === 0) {
    alert("Оберіть товари для замовлення!");
    return;
  }
  updateCheckoutSummary();
  checkoutModal.classList.add("active");
  document.body.style.overflow = "hidden";
});

// Закрити модалку
checkoutClose.addEventListener("click", () => {
  checkoutModal.classList.remove("active");
  document.body.style.overflow = "";
});
checkoutModal.addEventListener("click", e => {
  if (e.target === checkoutModal) {
    checkoutModal.classList.remove("active");
    document.body.style.overflow = "";
  }
});
document.addEventListener("keydown", e => {
  if (e.key === "Escape" && checkoutModal.classList.contains("active")) {
    checkoutModal.classList.remove("active");
    document.body.style.overflow = "";
  }
});

// Оновити сумарі в чекауті
function updateCheckoutSummary() {
  checkoutItemsContainer.innerHTML = "";
  let total = 0;
  const checkedItems = cart.filter(item => item.checked);
  checkedItems.forEach(item => {
    const div = document.createElement("div");
    div.className = "checkout-item";
    div.innerHTML = `
      <span>${item.name} x ${item.qty}</span>
      <span>${(item.price * item.qty).toFixed(2)} $</span>
    `;
    checkoutItemsContainer.appendChild(div);
    total += item.price * item.qty;
  });
  checkoutSubtotal.textContent = total.toFixed(2) + " $";
  checkoutGrandTotal.textContent = total.toFixed(2) + " $"; // Доставка не обчислена, просто текст
}

// Логіка для оплати: показ суб-опцій
const paymentRadios = document.querySelectorAll('input[name="payment"]');
const nonCashOptions = document.querySelector(".non-cash-options");
paymentRadios.forEach(radio => {
  radio.addEventListener("change", () => {
    nonCashOptions.style.display = radio.value === "non-cash" ? "block" : "none";
  });
});

// Підтвердити замовлення (просто алерт для прикладу)
submitOrderBtn.addEventListener("click", () => {
  const fullName = document.getElementById("fullName").value;
  const phone = document.getElementById("phone").value;
  const email = document.getElementById("email").value;
  const city = document.getElementById("city").value;
  const postOffice = document.getElementById("postOffice").value;
  const payment = document.querySelector('input[name="payment"]:checked').value;
  let nonCashType = "";
  if (payment === "non-cash") {
    const selected = document.querySelector('input[name="non-cash-type"]:checked');
    if (!selected) {
      alert("Оберіть тип безготівкового розрахунку!");
      return;
    }
    nonCashType = selected.value;
  }

  if (!fullName || !phone || !email || !city || !postOffice) {
    alert("Заповніть всі поля!");
    return;
  }

  alert(`Замовлення підтверджено!\nПІБ: ${fullName}\nТелефон: ${phone}\nEmail: ${email}\nМісто: ${city}\nВідділення: ${postOffice}\nОплата: ${payment}${nonCashType ? ` (${nonCashType})` : ""}`);
  // Очистити кошик або надіслати на сервер
  cart = cart.filter(item => !item.checked);
  updateCart();
  checkoutModal.classList.remove("active");
  document.body.style.overflow = "";
});

// Ініціалізація
updateCart();