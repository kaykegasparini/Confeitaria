const menu = document.getElementById('menu')
const cartBtn = document.getElementById('cart-btn')
const cartModal = document.getElementById('cart-modal')
const cartItemsContainer = document.getElementById('cart-items')
const cartTotal = document.getElementById('cart-total')
const checkoutBtn = document.getElementById('chekout-btn')
const closeModalBtn = document.getElementById('close-modal-btn')
const cartCount = document.getElementById('cart-count')
const addressInput = document.getElementById('address')
const addresWarn = document.getElementById('address-warn')

let cart = [];

// Abrir Modal
cartBtn.addEventListener("click", function () {
    updateCartModal();
    cartModal.style.display = "flex"
})

// Fechar Modal
cartModal.addEventListener("click", function (event) {
    if (event.target === cartModal) {
        cartModal.style.display = "none"
    }
})

// Botao Fechar
closeModalBtn.addEventListener("click", function () {
    cartModal.style.display = "none"
})

menu.addEventListener("click", function (event) {
    let parentButton = event.target.closest(".add-to-cart-btn")
    if (parentButton) {
        const name = parentButton.getAttribute('data-name')
        const price = parseFloat(parentButton.getAttribute('data-price'))

        // Add no Carrinho
        addToCart(name, price)

    }
})

//Funcao Carrinho
function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name)

    if (existingItem) {
        // Se ja existe aumenta +1
        existingItem.quantity += 1
    } else {
        cart.push({
            name,
            price,
            quantity: 1,
        })
    }

    updateCartModal()
}

//Atualiza carrnho
function updateCartModal() {
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("felx", "justify-between", "mb-4", "flex-col")

        cartItemElement.innerHTML = `
        <div class="flex items-center justify-between">
            <div>
                <p class="font-bold">${item.name}</p>
                <p>Quantidade${item.quantity}</p>
                <p class="font-medium mb-2">R$ ${item.price.toFixed(2)}</p>
            </div>

                <button class="remove-btn" data-name="${item.name}">
                    Remover
                </button>
        </div>
        `

        total += item.price * item.quantity;

        cartItemsContainer.appendChild(cartItemElement)
    })

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    cartCount.innerText = cart.length;
}

//Remover Item Carrinho
cartItemsContainer.addEventListener("click", function(event){
    if(event.target.classList.contains("remove-btn")){
        const name = event.target.getAttribute("data-name")

        removeItemCart(name)
    }
})

function removeItemCart(name){
    const index = cart.findIndex(item => item.name === name) 

    if(index !== 1){
        const item = cart[index];

        if(item.quantity > 1){
            item.quantity -=1;
            updateCartModal();
            return;
        }

        cart.splice(index, 1);
        updateCartModal();
    }
}

addressInput.addEventListener("input", function(event){
    let inputValue = event.target.value;

    if(inputValue !== ""){
        addressInput.classList.remove("border-red-500")
        addresWarn.classList.add("hidden")
    }
})

//Finalizar Pedido
checkoutBtn.addEventListener("click", function(){
    const isOpen = checkOpen();
    if(!isOpen){ 
        Toastify({
            text: "Ops o restaurante esta Fechado :(",
            duration: 3000,
            close: true,
            gravity: "top", //  `cima` ou `baixo`
            position: "left", // `Esquerda`, `centro` or `direita`
            stopOnFocus: true, // mouse em cima fica parado, nao fecha o aviso
            style: {
              background: "#ef4444",
            },
          }).showToast();
        return;
    }

    if(cart.length === 0) return;
    if(addressInput.value === ""){
        addresWarn.classList.remove("hidden")
        addressInput.classList.add("border-red-500")
        return;
    }

    //enviar pedido API Whats
    const cartItems = cart.map((item) => {
        return (
            `${item.name} Quantidade: (${item.quantity}) Preço R$${item.price} |`
        )
    }).join("")
    
    const message = encodeURIComponent(cartItems)
    const phone = "17997442270"

    window.open(`https://wa.me/${phone}?text=${message} Endereço:${addressInput.value}`, "_blank")

    cart = [];
    updateCartModal();
})

//Verificar Horairo
function checkOpen(){
    const data = new Date();
    const hora = data.getHours();
    return hora >=  18 && hora < 22;
}

const spanItem = document.getElementById("date-span")
const isOpen = checkOpen();

if(isOpen){
    spanItem.classList.remove("bg-red-500")
    spanItem.classList.add("bg-green-600")
} else {
    spanItem.classList.remove("bg-green-600")
    spanItem.classList.add("bg-red-500")
}