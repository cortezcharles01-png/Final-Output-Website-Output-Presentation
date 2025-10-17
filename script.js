/* ===========================================================
    CSHOP MAIN SCRIPT.JS (Updated: Cart now shows images)
   =========================================================== */

/* ===============================
    CART MANAGEMENT
   =============================== */

// Add a product to cart (with image support)
/* ===============================
    PRODUCT VIEW SYSTEM
   =============================== */
function viewProduct(productName) {
  localStorage.setItem('selectedProduct', productName);
  location.href = 'product.html';
}

function addToCart(name, price, img = '', qtyId = 'qty') {
  const qtyElem = document.getElementById(qtyId);
  const qty = qtyElem ? parseInt(qtyElem.textContent) : 1;

  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const existing = cart.find(item => item.name === name);

  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ name, price, img, qty });
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  alert(`${qty} ${name}(s) added to cart!`);
}

// Update quantity in product detail
function updateQty(change) {
  const qty = document.getElementById('qty');
  let value = parseInt(qty.textContent);
  value = Math.max(1, value + change);
  qty.textContent = value;
}

// Load cart items dynamically
function loadCart() {
  const cartContainer = document.getElementById('cart-items');
  const cartTotalElem = document.getElementById('cart-total');
  const cart = JSON.parse(localStorage.getItem('cart')) || [];

  cartContainer.innerHTML = '';
  let total = 0;

  if (cart.length === 0) {
    cartContainer.innerHTML = '<p class="empty-cart">Your cart is empty 🛒</p>';
    if (cartTotalElem) cartTotalElem.textContent = '$0';
    return;
  }

  cart.forEach((item, index) => {
    const itemTotal = item.price * item.qty;
    total += itemTotal;

    const div = document.createElement('div');
    div.classList.add('cart-item');
    div.innerHTML = `
      <img src="${item.img || 'https://via.placeholder.com/60?text=' + item.name.charAt(0)}" alt="${item.name}">
      <div class="cart-details">
        <h4>${item.name}</h4>
        <div class="qty-control">
          <button onclick="changeQty(${index}, -1)">−</button>
          <span>${item.qty}</span>
          <button onclick="changeQty(${index}, 1)">+</button>
        </div>
      </div>
      <div class="cart-right">
        <p>$${item.price * item.qty}</p>
        <button class="remove-btn" onclick="removeFromCart(${index})">✖</button>
      </div>
    `;
    cartContainer.appendChild(div);
  });

  if (cartTotalElem) cartTotalElem.textContent = `$${total.toFixed(2)}`;
}

// Change quantity inside the cart
function changeQty(index, delta) {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  if (!cart[index]) return;

  cart[index].qty += delta;
  if (cart[index].qty <= 0) {
    cart.splice(index, 1);
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  loadCart();
}

// Remove an item from the cart
function removeFromCart(index) {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart.splice(index, 1);
  localStorage.setItem('cart', JSON.stringify(cart));
  loadCart();
}

// Checkout and go to confirmation page
function checkout() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  // Simulate processing
  setTimeout(() => {
    localStorage.removeItem('cart');
    location.href = 'confirmation.html';
  }, 1000);
}

/* ===============================
   CATEGORY SYSTEM
   =============================== */

// Navigate to selected category
function openCategory(category) {
  localStorage.setItem('selectedCategory', category);
  location.href = 'category.html';
}

// Product data per category
const productsByCategory = {
  'Processors': [
    { name: 'Intel i9-13900K', price: 599, img: 'cpu1.jpg' },
    { name: 'AMD Ryzen 9 7950X', price: 699, img: 'cpu2.jpg' },
  ],
  'RAM': [
    { name: 'Corsair Vengeance 16GB', price: 75, img: 'ram1.jpg' },
    { name: 'Kingston Fury 8GB', price: 45, img: 'ram2.jpg' },
  ],
  'Motherboards': [
    { name: 'ASUS ROG STRIX Z790', price: 320, img: 'motherboard1.jpg' },
    { name: 'MSI B650 Tomahawk', price: 210, img: 'motherboard2.jpg' },
  ],
  'Graphics Cards': [
    { name: 'NVIDIA RTX 4080', price: 1199, img: 'gpu1.jpg' },
    { name: 'AMD RX 7900XT', price: 899, img: 'gpu2.jpg' },
  ],
  'Accessories': [
    { name: 'Logitech G502 Mouse', price: 60, img: 'acc1.jpg' },
    { name: 'HyperX Keyboard', price: 90, img: 'acc2.jpg' },
  ],
};

// Load products for a category
function loadCategory() {
  const category = localStorage.getItem('selectedCategory');
  const titleElem = document.getElementById('category-title');
  const container = document.getElementById('category-products');

  if (!category || !productsByCategory[category]) {
    titleElem.textContent = 'Category Not Found';
    return;
  }

  titleElem.textContent = category;
  container.innerHTML = '';

  productsByCategory[category].forEach(item => {
    const div = document.createElement('div');
    div.classList.add('product');
    div.innerHTML = `
      <img src="${item.img}" alt="${item.name}">
      <h4>${item.name}</h4>
      <p>$${item.price}</p>
      <button class="btn-primary" onclick="addToCart('${item.name}', ${item.price}, '${item.img}')">Add to Cart</button>
    `;
    container.appendChild(div);
  });
}

/* ===============================
    PAGE INITIALIZATION
   =============================== */

document.addEventListener('DOMContentLoaded', () => {
  if (document.body.classList.contains('cart-page')) loadCart();
  if (document.body.classList.contains('category-page')) loadCategory();
});

