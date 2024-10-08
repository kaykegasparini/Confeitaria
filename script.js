// DOM Elements
const menu = document.getElementById('menu');
const cartBtn = document.getElementById('cart-btn');
const cartModal = document.getElementById('cart-modal');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-btn');
const closeModalBtn = document.getElementById('close-modal-btn');
const cartCount = document.getElementById('cart-count');
const addressInput = document.getElementById('address');
const modal = document.getElementById("popup-modal");
const modalTitle = document.getElementById("popup-title");
const modalMessage = document.getElementById("popup-message");
const modalCloseBtn = document.getElementById("popup-close-btn");
const openMapModalBtn = document.getElementById('openMapModal');
const mapModal = document.getElementById('mapModal');
const closeMapModalBtn = document.getElementById('closeMapModal');

let cart = [];

openMapModalBtn.addEventListener('click', function () {
    mapModal.classList.remove('hidden');
    initMap(); // Inicializa o mapa quando o modal é aberto
});

// Close Map Modal
closeMapModalBtn.addEventListener('click', function () {
    mapModal.classList.add('hidden');
});

// Open Cart Modal
cartBtn.addEventListener("click", function () {
    updateCartModal();
    cartModal.style.display = "flex";
});

// Close Cart Modal when clicking outside
cartModal.addEventListener("click", function (event) {
    if (event.target === cartModal) {
        cartModal.style.display = "none";
    }
});

// Close Cart Modal with close button
closeModalBtn.addEventListener("click", function () {
    cartModal.style.display = "none";
});

// Add to Cart
menu.addEventListener("click", function (event) {
    let addToCartBtn = event.target.closest(".add-to-cart-btn");
    if (addToCartBtn) {
        const name = addToCartBtn.getAttribute('data-name');
        const price = parseFloat(addToCartBtn.getAttribute('data-price'));
        addToCart(name, price);
    }
});

// Add to Cart Function
function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name,
            price,
            quantity: 1,
        });
    }
    updateCartModal();
}

// Update Cart Modal
function updateCartModal() {
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex", "justify-between", "items-center", "mb-4", "bg-gray-100", "p-2", "rounded");

        cartItemElement.innerHTML = `
            <div>
                <p class="font-bold">${item.name}</p>
                <p>Quantidade: ${item.quantity}</p>
                <p class="font-medium">R$ ${(item.price * item.quantity).toFixed(2)}</p>
            </div>
            <div>
                <button class="bg-pink-500 text-white px-2 py-1 rounded-full mr-2 add-one-btn" data-name="${item.name}">+</button>
                <button class="bg-gray-500 text-white px-2 py-1 rounded-full remove-one-btn" data-name="${item.name}">-</button>
            </div>
        `;

        total += item.price * item.quantity;
        cartItemsContainer.appendChild(cartItemElement);
    });

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    cartCount.innerText = cart.reduce((sum, item) => sum + item.quantity, 0);
}

// Add or Remove One Item
cartItemsContainer.addEventListener("click", function (event) {
    const name = event.target.getAttribute("data-name");
    if (event.target.classList.contains("add-one-btn")) {
        addToCart(name, 0); // Price doesn't matter here as we're just adding quantity
    } else if (event.target.classList.contains("remove-one-btn")) {
        removeItemFromCart(name);
    }
});

// Remove Item from Cart
function removeItemFromCart(name) {
    const index = cart.findIndex(item => item.name === name);
    if (index !== -1) {
        if (cart[index].quantity > 1) {
            cart[index].quantity -= 1;
        } else {
            cart.splice(index, 1);
        }
        updateCartModal();
    }
}

// Address Input Validation
addressInput.addEventListener("input", function (event) {
    if (event.target.value !== "") {
        addressInput.classList.remove("border-red-500");
    }
});

// Show Popup Modal
function showModal(title, message) {
    modalTitle.textContent = title;
    modalMessage.textContent = message;
    modal.classList.remove("hidden");
}

modalCloseBtn.addEventListener("click", function () {
    modal.classList.add("hidden");
});

// Input Retirada ou Entrega
let deliveryOption = "pickup"; // Default to pickup

document.querySelectorAll('input[name="delivery-option"]').forEach((elem) => {
    elem.addEventListener("change", function(event) {
        const addressInput = document.getElementById("address");
        const modal = document.getElementById("popup-modal");

        deliveryOption = event.target.value;

        if (deliveryOption === "delivery") {
            addressInput.classList.remove("hidden");
            
        } else {
            addressInput.classList.add("hidden");
            modal.classList.add("hidden");
        }
    });
});

// Checkout
checkoutBtn.addEventListener("click", function () {
    if (!checkOpen()) {
        showModal("Fechado", "Desculpe, estamos fechados no momento. Nosso horário de funcionamento é das 8h às 18h, de segunda a sábado.");
        return;
    }

    if (cart.length === 0) {
        showModal("Carrinho Vazio", "Seu carrinho está vazio. Adicione alguns itens antes de finalizar o pedido.");
        return;
    }

    if (deliveryOption === "delivery" && addressInput.value === "") {
        addressInput.classList.add("border-red-500");
        showModal("Endereço", "Por favor, insira seu endereço de entrega.");
        return;
    }

    // Prepare order for WhatsApp
    const cartItems = cart.map((item) =>
        `${item.name} - Quantidade: ${item.quantity} - Preço: R$${(item.price * item.quantity).toFixed(2)}`
    ).join("\n");

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    let message;
    if (deliveryOption === "pickup") {
        message = encodeURIComponent(`Novo Pedido:\n\n${cartItems}\n\nTotal: R$${total.toFixed(2)}\n\nOpção: Retirada no local`);
    } else {
        message = encodeURIComponent(`Novo Pedido:\n\n${cartItems}\n\nTotal: R$${total.toFixed(2)}\n\nOpção: Entrega\n\nEndereço de entrega: ${addressInput.value}`);
    }
    const phone = "17982135155";

    window.open(`https://wa.me/${phone}?text=${message}`, "_blank");

    // Clear cart and close modal
    cart = [];
    updateCartModal();
    cartModal.style.display = "none";
    addressInput.value = "";
});


// Check if store is open
function checkOpen() {
    const now = new Date();
    const day = now.getDay();// 0 = Domingo, 1 = Segunda, ..., 6 = Sábado
    const hour = now.getHours();
    
    //Verifica se é Domingo
    if (day === 0) {
        return false;
    }

    if (hour < 8 || hour >= 18) {
        return false;
    }

    return true;

}

// Update status every minute
function updateStoreStatus() {
    const status = document.getElementById("store-status");
    status.textContent = checkOpen() ? "Aberto" : "Fechado";
}

setInterval(updateStoreStatus, 60000);
updateStoreStatus(); // Initial call to set status on page load
