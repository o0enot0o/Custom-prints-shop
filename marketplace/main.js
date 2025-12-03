// ============================
// КАТЕГОРИИ — скролл + fade
// ============================
const list = document.getElementById("categoriesList");
const leftBtn = document.querySelector(".left-btn");
const rightBtn = document.querySelector(".right-btn");
let scrollStep = 176 * 4;

list.addEventListener("wheel", function (e) {
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
  items.forEach((item) => {
    item.classList.remove("fade-left", "fade-right");
    const r = item.getBoundingClientRect();
    if (r.left < rect.left + 40) item.classList.add("fade-left");
    if (r.right > rect.right - 40) item.classList.add("fade-right");
  });
}
list.addEventListener("scroll", updateFade);
window.addEventListener("load", updateFade);

// ============================
// ЛОГИКА КАТЕГОРИЙ И ТОВАРОВ
// ============================
const categoryItems = document.querySelectorAll(".category-item");
const productRow = document.getElementById("productRow");
const productTitle = document.querySelector(".product-title");
const searchInput = document.querySelector(".search__input");

// Полный список товаров с шаблонами
const productsData = {
  "Плакати": [
    { name: "Дитячий плакат", price: 5.99, template: "Для дітей" },
    { name: "Плакат для дорослих", price: 6.99, template: "Для дорослих" },
    { name: "Літній плакат", price: 5.49, template: "Літні" },
    { name: "Осінній плакат", price: 5.49, template: "Осінні" },
    { name: "Зимовий плакат", price: 6.49, template: "Зимові" },
    { name: "Весняний плакат", price: 5.29, template: "Весняні" }
  ],
  "Футболки": [
    { name: "Футболка чоловіча", price: 14.99, template: "Чоловіки" },
    { name: "Футболка жіноча", price: 14.99, template: "Жінки" },
    { name: "Футболка дитяча", price: 13.99, template: "Для дітей" }
  ],
  "Кружки": [
    { name: "Кружка зимова", price: 9.99, template: "Зимові" },
    { name: "Кружка весняна", price: 9.49, template: "Весняні" }
  ],
  "Стікери": [
    { name: "Стікери для дітей", price: 2.49, template: "Для дітей" },
    { name: "Стікери для дорослих", price: 2.99, template: "Для дорослих" }
  ],
  "Чохли": [
    { name: "Чохол чоловічий", price: 12.99, template: "Чоловіки" },
    { name: "Чохол жіночий", price: 12.99, template: "Жінки" }
  ],
  "Постери": [
    { name: "Літній постер", price: 7.99, template: "Літні" },
    { name: "Зимовий постер", price: 8.49, template: "Зимові" }
  ],
  "Картини": [
    { name: "Картина для дітей", price: 19.99, template: "Для дітей" },
    { name: "Картина для дорослих", price: 20.99, template: "Для дорослих" }
  ],
  "Подушки": [
    { name: "Подушка чоловіча", price: 15.99, template: "Чоловіки" },
    { name: "Подушка жіноча", price: 15.99, template: "Жінки" }
  ],
  "Брелоки": [
    { name: "Брелок дитячий", price: 4.99, template: "Для дітей" },
    { name: "Брелок для дорослих", price: 5.49, template: "Для дорослих" }
  ]
};

// Функция рендера товаров
function renderProducts(category, filter = "") {
  productRow.innerHTML = "";
  const products = productsData[category] || [];
  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(filter.toLowerCase()) ||
    p.template.toLowerCase().includes(filter.toLowerCase())
  );

  if (filtered.length === 0) {
    productRow.textContent = "Товари не знайдено";
    return;
  }

  filtered.forEach(p => {
    const card = document.createElement("div");
    card.className = "product-card";

    const img = document.createElement("div");
    img.className = "product-img";
    card.append(img);

    const price = document.createElement("p");
    price.className = "product-price";
    price.textContent = p.price + "$";
    card.append(price);

    const btn = document.createElement("button");
    btn.className = "buy-btn";
    btn.textContent = "Купити";
    card.append(btn);

    productRow.append(card);
  });
}

// Установить активную категорию
function setActiveCategory(elem) {
  categoryItems.forEach(i => i.classList.remove("active-category"));
  elem.classList.add("active-category");
}

// Клик по категории
categoryItems.forEach(item => {
  item.addEventListener("click", () => {
    const cat = item.textContent;
    setActiveCategory(item);
    productTitle.textContent = `Товари з категорії: ${cat}`;
    renderProducts(cat, searchInput.value);
  });
});

// Пошук
searchInput.addEventListener("input", () => {
  const activeCategory = document.querySelector(".category-item.active-category");
  if (activeCategory) {
    renderProducts(activeCategory.textContent, searchInput.value);
  }
});

// Инициализация: первая категория
if (categoryItems.length) {
  const first = categoryItems[0];
  setActiveCategory(first);
  renderProducts(first.textContent);
}
