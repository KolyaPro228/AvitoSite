document.addEventListener("DOMContentLoaded", function() {
    // Кэширование DOM элементов
    const DOM = {
        cartModalIcon: document.querySelector(".fa-cart-shopping"),
        cartModal: document.querySelector(".cart-modal"),
        cartModalOverlay: document.querySelector(".cart-modal-overlay"),
        randomContainer: document.querySelector(".random-product"),
        productCategories: document.querySelector(".product-categories"),
        categoryContainer: document.querySelector(".category-product"),
        toggle: document.querySelector(".toggle-theme"),
        barsIcon: document.querySelector(".fa-bars")
    };

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let totalPrice = 0;

    const productArray = [
        {
            id: 0,
            name: "Loqi X332 Wired Headset",
            price: 80,
            image: "./images/headset1.webp",
            category: "headset"
        },
        {   
            id: 1,
            name: "AA Gaming Headset",
            price: 120,
            image: "./images/headset2.webp",
            category: "headset"
        },
        {   
            id: 2,
            name: "SS Wireless Headset",
            price: 180,
            image: "./images/headset3.webp",
            category: "headset"
        },
        {   
            id: 3,
            name: "Atec Vintage Headset",
            price: 250,
            image: "./images/headset4.webp",
            category: "headset"
        },
        {   
            id: 4,
            name: "AA Wireless Mouse",
            price: 40,
            image: "./images/mouse2.webp",
            category: "mouse"
        },
        {   
            id: 5,
            name: "Logitech MX Master 2S",
            price: 110,
            image: "./images/mouse1.webp",
            category: "mouse"
        },
        {   
            id: 6,
            name: "GX Vintage Keyboard",
            price: 49,
            image: "./images/keyboard1.webp",
            category: "keyboard"
        },
        {   
            id: 7,
            name: "AudioTechnica Microphone",
            price: 49,
            image: "./images/microphone1.webp",
            category: "microphone"
        }
    ];

    // Инициализация
    function init() {
        setupEventListeners();
        if (cart.length > 0) {
            renderCartFromStorage();
        }
        if (DOM.randomContainer) {
            renderProducts();
        }
    }

    // Настройка обработчиков событий
    function setupEventListeners() {
        // Делегирование событий
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('add-cart-btn')) {
                handleAddToCart(e);
            } else if (e.target.classList.contains('close-cart-modal') || 
                      e.target.classList.contains('continue-shopping')) {
                closeCartModal();
            }
        });

        document.addEventListener('change', function(e) {
            if (e.target.classList.contains('modalQuantity')) {
                handleQuantityChange(e);
            }
        });

        // Оригинальные обработчики
        DOM.toggle?.addEventListener('click', toggleTheme);
        DOM.barsIcon?.addEventListener('click', toggleMobileMenu);
    }

    function toggleTheme() {
        document.body.classList.toggle("dark");
    }

    function toggleMobileMenu() {
        const mobileMenu = document.querySelector(".nav-menu-mobile");
        const navIcons = document.querySelector(".nav-right");
        mobileMenu.classList.toggle("open");
        navIcons.classList.toggle("open");
    }

    function toggleCartModal() {
        DOM.cartModal.style.display = DOM.cartModal.style.display === 'block' ? 'none' : 'block';
        DOM.cartModalOverlay.style.display = DOM.cartModalOverlay.style.display === 'block' ? 'none' : 'block';
    }

    function closeCartModal() {
        DOM.cartModal.style.display = 'none';
        DOM.cartModalOverlay.style.display = 'none';
    }

    function handleAddToCart(e) {
        const productElement = e.target.closest(".main-product");
        const productId = parseInt(productElement.getAttribute("data-id"));
        const quantity = parseInt(productElement.querySelector(".quantity").value);
        
        addToCart(productId, quantity);
        showCartNotification();
        updateCartUI();
    }

    function addToCart(productId, quantity) {
        const product = productArray.find(p => p.id === productId);
        const existingItem = cart.find(item => item.id === productId);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({ id: productId, quantity });
        }

        totalPrice += product.price * quantity;
        updateLocalStorage();
    }

    function showCartNotification() {
        const notification = document.querySelector(".cart-notification");
        notification.style.display = "flex";
        setTimeout(() => {
            notification.style.display = "none";
        }, 1500);
    }

    function updateCartUI() {
        const cartRedDot = document.querySelector(".cart-red-dot");
        cartRedDot.style.display = cart.length > 0 ? "inline" : "none";
        renderTotalPrice();
    }

    function renderTotalPrice() {
        const totalPriceElement = document.querySelector(".total-price span");
        if (totalPriceElement) {
            totalPriceElement.textContent = `$${totalPrice}`;
        }
    }

    function updateLocalStorage() {
        localStorage.setItem("cart", JSON.stringify(cart));
    }

    function renderCartFromStorage() {
        cart.forEach(item => {
            const product = productArray.find(p => p.id === item.id);
            if (product) {
                totalPrice += product.price * item.quantity;
            }
        });
        updateCartUI();
    }

    function renderProducts() {
        // Рендер случайных товаров
        const randomCount = Math.min(4, productArray.length);
        const randomProducts = getRandomProducts(randomCount);
        
        randomProducts.forEach(product => {
            renderProduct(product, DOM.randomContainer);
        });

        // Рендер товаров по категориям (изначально Headset)
        const headsetProducts = productArray.filter(p => p.category === "headset");
        headsetProducts.forEach(product => {
            renderProduct(product, DOM.categoryContainer);
        });

        // Обработчики для категорий
        if (DOM.productCategories) {
            Array.from(DOM.productCategories.children).forEach(category => {
                category.addEventListener('click', function() {
                    const categoryName = this.textContent.toLowerCase();
                    filterProductsByCategory(categoryName);
                });
            });
        }
    }

    function getRandomProducts(count) {
        const shuffled = [...productArray].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }

    function renderProduct(product, container) {
        const productHTML = `
            <div class="main-product" data-id="${product.id}" data-category="${product.category}">
                <img src="${product.image}" class="product-image" alt="${product.name}" loading="lazy" width="300" height="300">
                <div class="main-product-info">
                    <h3>${product.name}</h3>
                    <h4>Price: <span>$${product.price}</span></h4>
                    <select name="quantity" class="quantity">
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                    </select>
                    <button class="add-cart-btn">Add to Cart</button>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', productHTML);
    }

    function filterProductsByCategory(category) {
        DOM.categoryContainer.innerHTML = '';
        const filteredProducts = productArray.filter(p => 
            p.category === category || 
            (category === 'mouse' && p.category === 'mouse') ||
            (category === 'microphones' && p.category === 'microphone')
        );
        
        filteredProducts.forEach(product => {
            renderProduct(product, DOM.categoryContainer);
        });
    }

    function handleQuantityChange(e) {
        const productElement = e.target.closest(".cart-modal-product");
        const productId = parseInt(productElement.getAttribute("data-id"));
        const newQuantity = parseInt(e.target.value);
        
        updateCartQuantity(productId, newQuantity);
    }

    function updateCartQuantity(productId, newQuantity) {
        const item = cart.find(i => i.id === productId);
        if (item) {
            const product = productArray.find(p => p.id === productId);
            totalPrice -= product.price * item.quantity;
            item.quantity = newQuantity;
            totalPrice += product.price * newQuantity;
            
            updateLocalStorage();
            renderTotalPrice();
        }
    }

    // Запуск приложения
    init();
});
