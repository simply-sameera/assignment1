const CART_KEY = "shopCart";

function getCart() {
    try {
        return JSON.parse(localStorage.getItem(CART_KEY)) || [];
    } catch {
        return [];
    }
}

function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function toRupees(price) {
    return Math.ceil(price * 95);
}

function formatPrice(price) {
    return `Rs${toRupees(price)}/-`;
}

function formatRupees(amount) {
    return `Rs${Math.ceil(amount)}/-`;
}

function addToCart(product) {
    const cart = getCart();
    const existingItem = cart.find((item) => item.id === product.id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    saveCart(cart);
    updateCartCount();
}

function updateCartCount() {
    const cartLink = document.querySelector(".cart-link");
    if (!cartLink) return;

    const totalItems = getCart().reduce((sum, item) => sum + item.quantity, 0);
    cartLink.innerHTML = `Cart (${totalItems})`;
}

function createProductCard(product) {
    const outerDiv = document.createElement("div");
    outerDiv.classList.add("outerDiv");

    const heading = document.createElement("h2");
    heading.innerText = product.title;

    const image = document.createElement("img");
    image.src = product.thumbnail;
    image.alt = product.title;

    const description = document.createElement("p");
    description.innerText = product.description;

    const priceCart = document.createElement("div");
    priceCart.classList.add("price-cart");

    const price = document.createElement("p");
    price.innerText = formatPrice(product.price);

    const addButton = document.createElement("button");
    addButton.classList.add("add-btn");
    addButton.innerText = "Add to Cart";
    addButton.addEventListener("click", () => {
        addToCart(product);
        window.location.href = "cart.html";
    });

    const viewLink = document.createElement("a");
    viewLink.href = `product.html?id=${product.id}`;
    viewLink.classList.add("view-details-link");
    viewLink.innerText = "View Details";

    priceCart.append(price, addButton);
    outerDiv.append(heading, image, description, priceCart, viewLink);
    return outerDiv;
}

async function dataFetching() {
    const main = document.querySelector("main");
    if (!main || document.body.dataset.page !== "home") return;

    const url = "https://dummyjson.com/products?limit=194";
    const apiRes = await fetch(url);
    const resData = await apiRes.json();
    const products = resData.products;

    products.forEach((product) => {
        main.appendChild(createProductCard(product));
    });

    updateCartCount();
}

function renderCartPage() {
    const container = document.getElementById("cart-items");
    if (!container) return;

    const cart = getCart();

    if (cart.length === 0) {
        container.innerHTML = `
            <div class="empty-cart">
                <h2>Your cart is empty</h2>
                <a href="index.html" class="back-link">Continue Shopping</a>
            </div>
        `;
        return;
    }

    const cartItems = cart.map((item) => {
        const itemTotal = toRupees(item.price) * item.quantity;

        return `
            <div class="cart-item">
                <img src="${item.thumbnail}" alt="${item.title}" />
                <div class="cart-item-info">
                    <h3>${item.title}</h3>
                    <p>${item.description}</p>
                    <p class="cart-item-price">${formatPrice(item.price)} × ${item.quantity}</p>
                </div>
                <div class="cart-item-total">${formatRupees(itemTotal)}</div>
            </div>
        `;
    }).join("");

    const subtotal = cart.reduce((sum, item) => sum + toRupees(item.price) * item.quantity, 0);

    container.innerHTML = `
        <div class="cart-list">${cartItems}</div>
        <div class="bill-summary">
            <h3>Bill Summary</h3>
            <p>Subtotal: ${formatRupees(subtotal)}</p>
            <p>Shipping: Rs0/-</p>
            <h2>Total: ${formatRupees(subtotal)}</h2>
        </div>
    `;
}

document.addEventListener("DOMContentLoaded", () => {
    if (document.body.dataset.page === "home") {
        dataFetching();
    }

    if (document.body.dataset.page === "cart") {
        renderCartPage();
    }

    updateCartCount();
});
