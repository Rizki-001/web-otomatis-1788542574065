// Inisialisasi State Keranjang dari LocalStorage
let cart = JSON.parse(localStorage.getItem('tokokita_cart')) || [];

// Inisialisasi Event Listener setelah DOM loaded
document.addEventListener('DOMContentLoaded', () => {
    updateCartBadge();
    
    // Toggle Mobile Menu
    const menuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Render Keranjang jika di cart.html
    if (window.location.pathname.includes('cart.html')) {
        renderCart();
    }
});

// Fungsi Format Rupiah
function formatRupiah(amount) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);
}

// Tambah Produk ke Keranjang
function addToCart(id, name, price, image) {
    const existingIndex = cart.findIndex(item => item.id === id);

    if (existingIndex > -1) {
        cart[existingIndex].quantity += 1;
    } else {
        cart.push({ id, name, price, image, quantity: 1 });
    }

    saveCart();
    updateCartBadge();
    alert(`${name} telah ditambahkan ke keranjang!`);
}

// Simpan ke LocalStorage
function saveCart() {
    localStorage.setItem('tokokita_cart', JSON.stringify(cart));
}

// Update Jumlah Badge di Navbar
function updateCartBadge() {
    const badge = document.getElementById('cart-badge');
    if (badge) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        badge.textContent = totalItems;
    }
}

// Render Halaman Keranjang
function renderCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    const emptyMsg = document.getElementById('empty-cart-msg');
    const subtotalEl = document.getElementById('subtotal-price');
    const totalEl = document.getElementById('total-price');

    if (!cartItemsContainer) return;

    cartItemsContainer.innerHTML = '';

    if (cart.length === 0) {
        emptyMsg.classList.remove('hidden');
        subtotalEl.textContent = formatRupiah(0);
        totalEl.textContent = formatRupiah(0);
        return;
    }

    emptyMsg.classList.add('hidden');
    let total = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const row = document.createElement('div');
        row.className = 'py-4 flex flex-col sm:flex-row items-center justify-between gap-4';
        row.innerHTML = `
            <div class="flex items-center gap-4 w-full sm:w-auto">
                <img src="${item.image}" class="w-16 h-16 object-cover rounded-lg">
                <div>
                    <h4 class="font-bold text-gray-800">${item.name}</h4>
                    <p class="text-sm text-gray-500">${formatRupiah(item.price)}</p>
                </div>
            </div>
            <div class="flex items-center justify-between w-full sm:w-auto gap-6">
                <div class="flex items-center border rounded-lg">
                    <button onclick="changeQuantity(${item.id}, -1)" class="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-600">-</button>
                    <span class="px-4 py-1 text-sm font-semibold">${item.quantity}</span>
                    <button onclick="changeQuantity(${item.id}, 1)" class="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-600">+</button>
                </div>
                <span class="font-bold text-gray-800 min-w-[100px] text-right">${formatRupiah(itemTotal)}</span>
                <button onclick="removeFromCart(${item.id})" class="text-red-500 hover:text-red-700">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        `;
        cartItemsContainer.appendChild(row);
    });

    subtotalEl.textContent = formatRupiah(total);
    totalEl.textContent = formatRupiah(total);
}

// Ubah Kuantitas Produk di Keranjang
function changeQuantity(id, change) {
    const index = cart.findIndex(item => item.id === id);
    if (index > -1) {
        cart[index].quantity += change;
        if (cart[index].quantity <= 0) {
            cart.splice(index, 1);
        }
        saveCart();
        renderCart();
        updateCartBadge();
    }
}

// Hapus Item dari Keranjang
function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    renderCart();
    updateCartBadge();
}

// Simulasi Checkout
function checkout() {
    if (cart.length === 0) {
        alert('Keranjang Anda kosong!');
        return;
    }
    alert('Terima kasih telah berbelanja! Pesanan Anda sedang diproses.');
    cart = [];
    saveCart();
    renderCart();
    updateCartBadge();
}

// Submit Form Kontak
function handleContactSubmit(event) {
    event.preventDefault();
    alert('Pesan Anda berhasil dikirim! Kami akan menghubungi Anda segera.');
    event.target.reset();
}