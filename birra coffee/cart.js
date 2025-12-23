const cart = [];
const TAX_RATE = 0.05;

const addButtons = document.querySelectorAll('.add-to-cart');
const openCartBtn = document.getElementById('open-cart');
const closeCartBtn = document.getElementById('close-cart');
const cartPanel = document.getElementById('cart-panel');
const cartItemsContainer = document.getElementById('cart-items');
const subtotalEl = document.getElementById('cart-subtotal');
const taxEl = document.getElementById('cart-tax');
const totalEl = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-btn');

function openCart() {
  cartPanel.classList.remove('hidden');
}

function closeCart() {
  cartPanel.classList.add('hidden');
}

function updateCartBadge() {
  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  if (openCartBtn) {
    openCartBtn.textContent = `Cart (${totalQty})`;
  }
}

function renderCart() {
  cartItemsContainer.innerHTML = '';

  let subtotal = 0;

  cart.forEach((item, index) => {
    const lineTotal = item.price * item.qty;
    subtotal += lineTotal;

    const row = document.createElement('div');
    row.className = 'cart-item-row';
    row.innerHTML = `
      <div class="cart-item-info">
        <h4>${item.name}</h4>
        <p>${item.price} birr each</p>
      </div>
      <div class="cart-item-actions">
        <button class="qty-btn minus" data-index="${index}">-</button>
        <span class="qty">${item.qty}</span>
        <button class="qty-btn plus" data-index="${index}">+</button>
        <span class="line-total">${lineTotal} birr</span>
        <button class="remove-btn" data-index="${index}">✕</button>
      </div>
    `;
    cartItemsContainer.appendChild(row);
  });

  const tax = Math.round(subtotal * TAX_RATE);
  const total = subtotal + tax;

  subtotalEl.textContent = `${subtotal} birr`;
  taxEl.textContent = `${tax} birr`;
  totalEl.textContent = `${total} birr`;

  updateCartBadge();
}

addButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const card = btn.closest('.drink-card');
    const name = card.dataset.name;
    const price = parseInt(card.dataset.price, 10);

    const existing = cart.find(item => item.name === name);

    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ name, price, qty: 1 });
    }

    renderCart();
    openCart();
  });
});

openCartBtn?.addEventListener('click', openCart);
closeCartBtn?.addEventListener('click', closeCart);

// Handle +/- and remove
cartItemsContainer.addEventListener('click', (e) => {
  const index = e.target.dataset.index;
  if (index === undefined) return;

  if (e.target.classList.contains('plus')) {
    cart[index].qty += 1;
  } else if (e.target.classList.contains('minus')) {
    cart[index].qty = Math.max(1, cart[index].qty - 1);
  } else if (e.target.classList.contains('remove-btn')) {
    cart.splice(index, 1);
  }

  renderCart();
});

// Checkout – for now we can just go to checkout.html with query params
checkoutBtn.addEventListener('click', () => {
  const params = new URLSearchParams({
    cart: JSON.stringify(cart)
  });
  window.location.href = `checkout.html?${params.toString()}`;
});