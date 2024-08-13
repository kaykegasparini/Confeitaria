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

let cart = [];

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

//funcao popup modal
function showModal(title, message) {
    modalTitle.textContent = title;
    modalMessage.textContent = message;
    modal.classList.remove("hidden");
}

modalCloseBtn.addEventListener("click", function () {
    modal.classList.add("hidden");
});

// Checkout
checkoutBtn.addEventListener("click", function () {
    if (!checkOpen()) {
        showModal("Fechado", "Desculpe, estamos fechados no momento. Nosso horário de funcionamento é das 8h às 18h.");
        return;
    }

    if (cart.length === 0) {
        showModal("Carrinho Vazio", "Seu carrinho está vazio. Adicione alguns itens antes de finalizar o pedido.");
        return;
    }

    if (addressInput.value === "") {
        addressInput.classList.add("border-red-500");
        showModal("Endereço", "Por favor, insira seu endereço de entrega.");
        return;
    }

    // Prepare order for WhatsApp
    const cartItems = cart.map((item) =>
        `${item.name} - Quantidade: ${item.quantity} - Preço: R$${(item.price * item.quantity).toFixed(2)}`
    ).join("\n");

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const message = encodeURIComponent(`Novo Pedido:\n\n${cartItems}\n\nTotal: R$${total.toFixed(2)}\n\nEndereço de Entrega: ${addressInput.value}`);
    const phone = "17997442270";

    window.open(`https://wa.me/${phone}?text=${message}`, "_blank");

    // Clear cart and close modal
    cart = [];
    updateCartModal();
    cartModal.style.display = "none";
    addressInput.value = "";
});

//Mapa
function initMap() {
    // Localização da Confeitaria (substitua com as coordenadas reais)
    const confeitariaLocation = { lat: -20.4063, lng: -49.9894 }; // Coordenadas da Confeitaria Gasparini

    // Cria o mapa centrado na localização da confeitaria
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 15,
        center: confeitariaLocation,
    });

    // Adiciona um marcador para a confeitaria
    new google.maps.Marker({
        position: -20.437105 -49.987891,
        map: map,
        title: "Confeitaria Gasparini",
        icon: "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
    });

    // Obtém a localização do usuário
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function (position) {
                const userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };

                // Adiciona um marcador para a localização do usuário
                new google.maps.Marker({
                    position: userLocation,
                    map: map,
                    title: "Sua Localização",
                    icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
                });

                // Centraliza o mapa na localização do usuário
                map.setCenter(userLocation);
            },
            function (error) {
                console.error("Erro ao obter a localização: " + error.message);
            }
        );
    } else {
        console.error("Geolocalização não é suportada neste navegador.");
    }
}

// Inicializa o mapa quando a página é carregada
window.onload = initMap;

// Check if store is open
function checkOpen() {
    const now = new Date();
    const hour = now.getHours();
    return hour >= 8 && hour < 18;
}

// Update status every minute
setInterval(updateStoreStatus, 60000);