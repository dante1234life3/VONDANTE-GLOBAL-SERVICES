const cards = document.querySelectorAll('.card');
const filters = document.querySelectorAll('.filter');
const search = document.querySelector('.search');
const cartCount = document.getElementById('cartCount');
const cartList = document.getElementById('cartList');
const cartEmpty = document.getElementById('cartEmpty');
const cartTotal = document.getElementById('cartTotal');
const address = document.getElementById('address');
const mapLink = document.getElementById('mapLink');
const checkoutForm = document.getElementById('checkoutForm');
const orderMessage = document.getElementById('orderMessage');
const warmButton = document.getElementById('warmButton');
const customerEmail = document.getElementById('customerEmail');
const country = document.getElementById('country');
const state = document.getElementById('state');
const language = document.getElementById('language');
const countryName = document.getElementById('countryName');
let cart = [];
const rates = { NGN: 1, USD: 0.00063, GBP: 0.00050, GHS: 0.0097 };
const symbols = { NGN: '₦', USD: '$', GBP: '£', GHS: 'GH₵' };
const countryCodes = { nigeria: 'NGN', 'united states': 'USD', 'united kingdom': 'GBP', ghana: 'GHS' };

function money(naira) {
    return `${symbols[country.value]}${(naira * rates[country.value]).toFixed(2)}`;
}

function updateLocation() {
    state.innerHTML = country.selectedOptions[0].dataset.states.split(',').map(item => `<option>${item}</option>`).join('');
    document.querySelectorAll('.price').forEach(price => price.textContent = money(Number(price.dataset.ngn)));
    renderCart();
}

country.addEventListener('change', updateLocation);
countryName.addEventListener('input', () => {
    const code = countryCodes[countryName.value.trim().toLowerCase()];
    if (!code) return;
    country.value = code;
    updateLocation();
});
language.addEventListener('change', () => {
    document.querySelector('.shop').textContent = language.value === 'yo' ? 'Ra ọja' : language.value === 'ig' ? 'Zụta ugbu a' : language.value === 'ha' ? 'Saya yanzu' : 'Shop now';
});
updateLocation();
countryName.value = 'Nigeria';
const user = JSON.parse(localStorage.getItem('vondanteUser') || '{}');
const isOwner = user.role === 'owner';

cards.forEach(card => {
    if (!isOwner) return;
    const stock = document.createElement('label');
    stock.className = 'stock';
    stock.innerHTML = 'Owner stock: <input type="number" min="0" value="10"><b>Available</b>';
    card.querySelector('.details').prepend(stock);
    stock.querySelector('input').addEventListener('input', () => updateStock(card, stock));
});

function updateStock(card, stock) {
    const soldOut = Number(stock.querySelector('input').value) <= 0;
    stock.querySelector('b').textContent = soldOut ? 'Sold out' : 'Available';
    card.querySelectorAll('.add').forEach(button => button.disabled = soldOut);
}

cards.forEach(card => {
    const rating = document.createElement('div');
    rating.className = 'rating';
    rating.innerHTML = [1, 2, 3, 4, 5].map(number => `<button type="button" data-rating="${number}">★</button>`).join('');
    card.querySelector('.details').prepend(rating);
    rating.addEventListener('click', event => {
        if (event.target.tagName !== 'BUTTON') return;
        rating.querySelectorAll('button').forEach(star => star.classList.toggle('selected', star.dataset.rating <= event.target.dataset.rating));
    });
});

function showProducts() {
    const word = search.value.toLowerCase();
    const chosen = document.querySelector('.filter.active').dataset.category;

    cards.forEach(card => {
        const name = card.querySelector('h3').textContent.toLowerCase();
        const rightType = chosen === 'all' || card.dataset.category === chosen;
        card.hidden = !(rightType && name.includes(word));
    });
}

function addToCart(button) {
    const name = button.dataset.name || button.closest('.card').querySelector('h3').textContent;
    const cardPrice = button.closest('.card').querySelector('.price');
    const price = Number(button.dataset.price || cardPrice?.textContent.replace(/[^0-9.]/g, '')) || 0;
    const item = cart.find(product => product.name === name);
    item ? item.quantity++ : cart.push({ name, price, quantity: 1 });
    renderCart();
    button.textContent = 'Added';
}

function renderCart() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    cartCount.textContent = count;
    cartTotal.textContent = money(total);
    cartList.innerHTML = cart.map(item => `<li>${item.name} x${item.quantity} - ${money(item.price * item.quantity)}</li>`).join('');
    cartEmpty.hidden = cart.length > 0;
}

filters.forEach(filter => filter.addEventListener('click', event => {
    event.preventDefault();
    filters.forEach(item => item.classList.remove('active'));
    filter.classList.add('active');
    showProducts();
}));

search.addEventListener('input', showProducts);
document.querySelectorAll('.add').forEach(button => button.addEventListener('click', () => addToCart(button)));
warmButton.addEventListener('click', () => document.body.classList.toggle('warm'));
document.getElementById('logoutButton').addEventListener('click', () => localStorage.removeItem('vondanteUser'));
address.addEventListener('input', () => {
    mapLink.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address.value)}`;
    mapLink.hidden = !address.value.trim();
});
checkoutForm.addEventListener('submit', event => {
    event.preventDefault();
    if (!cart.length) return alert('Add a product before placing your order.');
    orderMessage.textContent = `Order VG-${Math.floor(100000 + Math.random() * 900000)} placed for ${customerEmail.value} via GIG Logistics. Your products are on their way!`;
    cart = [];
    renderCart();
    checkoutForm.reset();
    mapLink.hidden = true;
});
