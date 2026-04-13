document.addEventListener('DOMContentLoaded', function () {
  function isInPages() {
    return window.location.pathname.includes('/pages/');
  }

  function gotoCart() {
    if (isInPages()) window.location.href = 'carrito.html';
    else window.location.href = 'pages/carrito.html';
  }

  function gotoLogin() {
    if (isInPages()) window.location.href = 'login.html';
    else window.location.href = 'pages/login.html';
  }

  function getUrlCategoryFilter() {
    var params = new URLSearchParams(window.location.search);
    var category = params.get('category') || params.get('categoría');
    if (!category) return null;
    category = category.toLowerCase();
    return category;
  }

  function getUrlSearchTerm() {
    var params = new URLSearchParams(window.location.search);
    return params.get('search') || '';
  }

  var urlCategoryFilter = getUrlCategoryFilter();
  var urlSearchTerm = getUrlSearchTerm();

  if (urlCategoryFilter && document.querySelector('.page-header h1')) {
    var headerTitle = document.querySelector('.page-header h1');
    if (urlCategoryFilter === 'hombre') {
      headerTitle.textContent = 'Productos para Hombre';
    } else if (urlCategoryFilter === 'mujer') {
      headerTitle.textContent = 'Productos para Mujer';
    }
  } else if (urlSearchTerm && document.querySelector('.page-header h1')) {
    var headerTitle = document.querySelector('.page-header h1');
    headerTitle.textContent = 'Resultados de búsqueda: "' + urlSearchTerm + '"';
  }

  // Delegated click handling for product "Añadir" buttons and nav icons
  document.addEventListener('click', function (e) {
    var addBtn = e.target.closest('.product-card-add');
    if (addBtn) {
      // Collect simple product info (if available) and save to localStorage
      try {
        var card = addBtn.closest('.product-card');
        var name = card && card.querySelector('.product-card-name') ? card.querySelector('.product-card-name').textContent.trim() : 'Producto';
        var price = card && card.querySelector('.product-card-price-value') ? card.querySelector('.product-card-price-value').textContent.trim() : '';
        var cart = JSON.parse(localStorage.getItem('cart') || '[]');
        cart.push({ name: name, price: price, qty: 1 });
        localStorage.setItem('cart', JSON.stringify(cart));
      } catch (err) {
        // silent
      }

      gotoCart();
      e.preventDefault();
      return;
    }

    var icon = e.target.closest('.icon');
    if (icon) {
      var aria = (icon.getAttribute('aria-label') || '').toLowerCase();
      if (aria.includes('carrito')) {
        gotoCart();
        e.preventDefault();
        return;
      }
      if (aria.includes('cuenta') || aria.includes('usuario') || aria.includes('perfil')) {
        gotoLogin();
        e.preventDefault();
        return;
      }
    }

    // Hamburger menu toggle
    var hamburger = e.target.closest('.hamburger');
    if (hamburger) {
      var menu = document.querySelector('.mobile-menu');
      if (menu) {
        var isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
        hamburger.setAttribute('aria-expanded', !isExpanded);
        menu.setAttribute('aria-hidden', isExpanded);
        if (isExpanded) {
          menu.classList.remove('show');
        } else {
          menu.classList.add('show');
        }
      }
      e.preventDefault();
      return;
    }

    // Product detail buttons
    var sizeBtn = e.target.closest('.size-option');
    if (sizeBtn) {
      // Remove selected class from all size options
      var allSizes = sizeBtn.parentElement.querySelectorAll('.size-option');
      allSizes.forEach(function(btn) {
        btn.classList.remove('selected');
      });
      // Add selected class to clicked button
      sizeBtn.classList.add('selected');
      e.preventDefault();
      return;
    }

    var colorBtn = e.target.closest('.color-option');
    if (colorBtn) {
      // Remove selected class from all color options
      var allColors = colorBtn.parentElement.querySelectorAll('.color-option');
      allColors.forEach(function(btn) {
        btn.classList.remove('selected');
      });
      // Add selected class to clicked button
      colorBtn.classList.add('selected');
      e.preventDefault();
      return;
    }

    // Add to cart button in product detail
    var addToCartBtn = e.target.closest('button[type="submit"]');
    if (addToCartBtn && addToCartBtn.textContent.includes('Agregar al Carrito')) {
      try {
        var productName = document.querySelector('.product-detail-info h1')?.textContent.trim() || 'Producto';
        var productPrice = document.querySelector('.product-detail-price')?.textContent.trim() || '';
        var selectedSize = document.querySelector('.size-option.selected')?.getAttribute('data-size') || '';
        var selectedColor = document.querySelector('.color-option.selected')?.getAttribute('data-color') || '';
        var quantity = document.getElementById('quantity')?.value || 1;

        var cart = JSON.parse(localStorage.getItem('cart') || '[]');
        cart.push({
          name: productName,
          price: productPrice,
          size: selectedSize,
          color: selectedColor,
          qty: parseInt(quantity)
        });
        localStorage.setItem('cart', JSON.stringify(cart));

        // Show success message or redirect
        alert('Producto agregado al carrito!');
        gotoCart();
      } catch (err) {
        alert('Error al agregar al carrito');
      }
      e.preventDefault();
      return;
    }

    // Cart quantity buttons
    var quantityBtn = e.target.closest('.quantity-btn');
    if (quantityBtn) {
      var cartItem = quantityBtn.closest('.cart-item');
      var index = parseInt(cartItem.getAttribute('data-index'));
      var cart = JSON.parse(localStorage.getItem('cart') || '[]');
      var action = quantityBtn.getAttribute('data-action');

      if (action === 'increase') {
        cart[index].qty += 1;
      } else if (action === 'decrease' && cart[index].qty > 1) {
        cart[index].qty -= 1;
      }

      localStorage.setItem('cart', JSON.stringify(cart));
      loadCart();
      e.preventDefault();
      return;
    }

    // Cart remove item
    var removeBtn = e.target.closest('.cart-item-remove');
    if (removeBtn) {
      var index = parseInt(removeBtn.getAttribute('data-index'));
      var cart = JSON.parse(localStorage.getItem('cart') || '[]');
      cart.splice(index, 1);
      localStorage.setItem('cart', JSON.stringify(cart));
      loadCart();
      e.preventDefault();
      return;
    }
  });

  // Price Range Slider functionality
  var minRangeInput = document.getElementById('minRange');
  var maxRangeInput = document.getElementById('maxRange');
  var priceMinInput = document.getElementById('priceMin');
  var priceMaxInput = document.getElementById('priceMax');

  if (minRangeInput && maxRangeInput && priceMinInput && priceMaxInput) {
    function formatPrice(value) {
      return '$' + parseInt(value).toLocaleString('es-CO');
    }

    function updateValues() {
      var minVal = parseInt(minRangeInput.value);
      var maxVal = parseInt(maxRangeInput.value);

      if (minVal > maxVal) {
        minRangeInput.value = maxVal;
        minVal = maxVal;
      }

      if (maxVal < minVal) {
        maxRangeInput.value = minVal;
        maxVal = minVal;
      }

      priceMinInput.value = minVal;
      priceMaxInput.value = maxVal;
      
      // Aplica el filtro cuando cambia el rango de precio
      applyFilters();
    }

    minRangeInput.addEventListener('input', updateValues);
    maxRangeInput.addEventListener('input', updateValues);

    priceMinInput.addEventListener('input', function () {
      var value = parseInt(this.value) || 0;
      if (value > parseInt(maxRangeInput.value)) {
        value = parseInt(maxRangeInput.value);
        this.value = value;
      }
      minRangeInput.value = value;
      applyFilters();
    });

    priceMaxInput.addEventListener('input', function () {
      var value = parseInt(this.value) || 200000;
      if (value < parseInt(minRangeInput.value)) {
        value = parseInt(minRangeInput.value);
        this.value = value;
      }
      maxRangeInput.value = value;
      applyFilters();
    });

    // Initialize
    updateValues();
  }

  // Filter functionality
  function applyFilters(searchTerm) {
    searchTerm = typeof searchTerm !== 'undefined' && searchTerm !== null ? searchTerm : urlSearchTerm;
    var grid = document.getElementById('products-grid');
    if (!grid) return;

    var cards = grid.querySelectorAll('.product-card');
    var categoriesChecked = Array.from(document.querySelectorAll('input[name="category"]:checked')).map(el => el.value);
    var colorsChecked = Array.from(document.querySelectorAll('input[name="color"]:checked')).map(el => el.value);
    var minPrice = parseInt(document.getElementById('priceMin')?.value || 0);
    var maxPrice = parseInt(document.getElementById('priceMax')?.value || 200000);

    var visibleCount = 0;

    cards.forEach(function(card) {
      var category = card.getAttribute('data-category');
      var color = card.getAttribute('data-color');
      var price = parseInt(card.getAttribute('data-price') || 0);
      var genderAttr = (card.getAttribute('data-gender') || '').toLowerCase();
      var genders = genderAttr ? genderAttr.split(',').map(function(item) { return item.trim(); }) : [];

      var name = card.querySelector('.product-card-name').textContent.toLowerCase();
      var desc = card.querySelector('.product-card-description').textContent.toLowerCase();

      // Si no hay filtros seleccionados, mostrar todos
      var matchesCategory = categoriesChecked.length === 0 || categoriesChecked.includes(category);
      var matchesColor = colorsChecked.length === 0 || colorsChecked.includes(color);
      var matchesPrice = price >= minPrice && price <= maxPrice;
      var matchesUrlCategory = !urlCategoryFilter || category === urlCategoryFilter || genders.includes(urlCategoryFilter);
      var matchesSearch = !searchTerm || name.includes(searchTerm) || desc.includes(searchTerm);

      var shouldShow = matchesCategory && matchesColor && matchesPrice && matchesUrlCategory && matchesSearch;

      if (shouldShow) {
        card.style.display = '';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    // Actualizar el contador de productos
    var countElement = document.querySelector('.products-count strong');
    if (countElement) {
      countElement.textContent = visibleCount;
    }

    // Si no hay productos, mostrar mensaje
    if (visibleCount === 0) {
      var existingMessage = grid.nextElementSibling;
      if (!existingMessage || !existingMessage.classList.contains('no-products')) {
        var noProductsMsg = document.createElement('div');
        noProductsMsg.className = 'no-products';
        noProductsMsg.innerHTML = '<p style="text-align: center; padding: 2rem; color: #999;">No se encontraron productos con los filtros seleccionados</p>';
        grid.parentNode.insertBefore(noProductsMsg, grid.nextSibling);
      }
    } else {
      var existingMessage = grid.nextElementSibling;
      if (existingMessage && existingMessage.classList.contains('no-products')) {
        existingMessage.remove();
      }
    }
  }

  // Agregar event listeners a los checkboxes de filtros
  var filterCheckboxes = document.querySelectorAll('input[name="category"], input[name="color"]');
  filterCheckboxes.forEach(function(checkbox) {
    checkbox.addEventListener('change', function() {
      applyFilters();
    });
  });

  // Event listener para la búsqueda
  var searchInput = document.querySelector('input[type="search"]');
  if (searchInput) {
    // Si hay término de búsqueda en URL, setearlo
    if (urlSearchTerm) {
      searchInput.value = urlSearchTerm;
    }
    searchInput.addEventListener('input', function() {
      var searchTerm = this.value.toLowerCase().trim();
      applyFilters(searchTerm);
    });
    searchInput.addEventListener('keyup', function(e) {
      if (e.key === 'Enter') {
        var searchTerm = this.value.toLowerCase().trim();
        applyFilters(searchTerm);
      }
    });
  }

  // Aplicar filtros iniciales si hay búsqueda en URL
  if (urlSearchTerm) {
    applyFilters(urlSearchTerm);
  }

  // Event listener para el form de búsqueda global
  var searchForm = document.querySelector('.search-form');
  if (searchForm) {
    searchForm.addEventListener('submit', function(e) {
      e.preventDefault();
      var searchInput = this.querySelector('input[name="search"]');
      var term = searchInput.value.trim();
      if (term) {
        var url = isInPages() ? 'productos.html?search=' + encodeURIComponent(term) : 'pages/productos.html?search=' + encodeURIComponent(term);
        window.location.href = url;
      }
    });
  }

  // Botón limpiar filtros
  var clearButton = document.querySelector('button[class*="btn-secondary"]');
  if (clearButton && clearButton.textContent.includes('Limpiar')) {
    clearButton.addEventListener('click', function() {
      // Limpiar checkboxes
      filterCheckboxes.forEach(function(checkbox) {
        checkbox.checked = false;
      });
      
      // Resetear precios
      if (document.getElementById('minRange')) document.getElementById('minRange').value = 0;
      if (document.getElementById('maxRange')) document.getElementById('maxRange').value = 200000;
      if (document.getElementById('priceMin')) document.getElementById('priceMin').value = 0;
      if (document.getElementById('priceMax')) document.getElementById('priceMax').value = 200000;

      // Limpiar búsqueda
      if (searchInput) searchInput.value = '';
      
      applyFilters();
    });
  }

  // Carrusel de imágenes en detalle de producto
  var carouselImages = document.getElementById('carouselImages');
  var prevBtn = document.getElementById('prevBtn');
  var nextBtn = document.getElementById('nextBtn');

  if (carouselImages && prevBtn && nextBtn) {
    var slides = Array.from(carouselImages.querySelectorAll('.carousel-img'));
    var currentSlide = 0;

    function updateCarousel() {
      carouselImages.style.transform = 'translateX(-' + (currentSlide * 100) + '%)';
      prevBtn.disabled = currentSlide === 0;
      nextBtn.disabled = currentSlide === slides.length - 1;
    }

    prevBtn.addEventListener('click', function() {
      if (currentSlide > 0) {
        currentSlide -= 1;
        updateCarousel();
      }
    });

    nextBtn.addEventListener('click', function() {
      if (currentSlide < slides.length - 1) {
        currentSlide += 1;
        updateCarousel();
      }
    });

    slides.forEach(function(img, index) {
      img.addEventListener('click', function() {
        currentSlide = index;
        updateCarousel();
      });
    });

    updateCarousel();
  }

  // Cart functionality
  function loadCart() {
    var cartItems = document.querySelector('.cart-items');
    if (!cartItems) return;

    var cart = JSON.parse(localStorage.getItem('cart') || '[]');
    if (cart.length === 0) {
      cartItems.innerHTML = '<div style="text-align: center; padding: 2rem; color: #999;">Tu carrito está vacío</div>';
      updateCartSummary([]);
      return;
    }

    var html = '';
    cart.forEach(function(item, index) {
      html += `
        <div class="cart-item" data-index="${index}">
          <div class="cart-item-image">
            <img src="../assets/images/camiseta running.webp" alt="${item.name}">
          </div>
          <div class="cart-item-info">
            <h3 class="cart-item-name">${item.name}</h3>
            <div class="cart-item-details">
              ${item.size ? 'Talle: ' + item.size.toUpperCase() : ''} ${item.color ? '| Color: ' + item.color : ''}
            </div>
            <div class="cart-item-price">${item.price}</div>
            <div class="cart-item-quantity">
              <button class="quantity-btn" data-action="decrease">-</button>
              <input type="number" value="${item.qty}" min="1" class="quantity-input">
              <button class="quantity-btn" data-action="increase">+</button>
            </div>
            <div style="margin-top: var(--spacing-md);">
              <a href="#" class="cart-item-remove" data-index="${index}">Eliminar</a>
            </div>
          </div>
        </div>
      `;
    });
    cartItems.innerHTML = html;
    updateCartSummary(cart);
  }

  function updateCartSummary(cart) {
    var summary = document.querySelector('.cart-summary');
    if (!summary) return;

    var subtotal = cart.reduce(function(total, item) {
      var price = parseInt(item.price.replace(/[^\d]/g, '')) || 0;
      return total + (price * item.qty);
    }, 0);

    var tax = Math.round(subtotal * 0.19); // 19% IVA
    var shipping = subtotal >= 100000 ? 0 : 10000;
    var total = subtotal + tax + shipping;

    var summaryHtml = `
      <h3>Resumen del Pedido</h3>
      <div class="summary-row">
        <span>Subtotal:</span>
        <span>$ ${subtotal.toLocaleString('es-CO')}</span>
      </div>
      <div class="summary-row">
        <span>Impuesto (IVA):</span>
        <span>$ ${tax.toLocaleString('es-CO')}</span>
      </div>
      <div class="summary-row">
        <span>Envío:</span>
        <span class="${shipping === 0 ? 'text-success' : ''}">${shipping === 0 ? 'Gratis' : '$ ' + shipping.toLocaleString('es-CO')}</span>
      </div>
      <div class="summary-row total">
        <span>Total:</span>
        <span>$ ${total.toLocaleString('es-CO')}</span>
      </div>
      <div class="cart-actions">
        <a href="finalizar-compra.html" class="btn btn-primary btn-lg">Proceder al Pago</a>
        <a href="productos.html" class="btn btn-secondary" style="width: 100%;">Seguir Comprando</a>
      </div>
      <div style="text-align: center; margin-top: var(--spacing-xl); font-size: var(--font-size-xs); color: var(--color-text-secondary);">
        Compra segura con encriptación SSL
      </div>
    `;

    summary.innerHTML = summaryHtml;
  }

  // Load cart on cart page
  if (document.querySelector('.cart-items')) {
    loadCart();
  }

  // Close mobile menu when clicking outside
  document.addEventListener('click', function(e) {
    var menu = document.querySelector('.mobile-menu');
    var hamburger = document.querySelector('.hamburger');
    if (menu && hamburger && menu.classList.contains('show')) {
      if (!menu.contains(e.target) && !hamburger.contains(e.target)) {
        menu.classList.remove('show');
        hamburger.setAttribute('aria-expanded', 'false');
        menu.setAttribute('aria-hidden', 'true');
      }
    }
  });

  var confirmOrderBtn = document.getElementById('confirm-order');

if (confirmOrderBtn) {
  confirmOrderBtn.addEventListener('click', function () {

    var cart = JSON.parse(localStorage.getItem('cart') || '[]');

    localStorage.setItem('lastOrder', JSON.stringify(cart));

    localStorage.removeItem('cart');

    if (window.location.pathname.includes('/pages/')) {
      window.location.href = 'detalles-orden.html';
    } else {
      window.location.href = 'pages/detalles-orden.html';
    }

  });
}

var loginBtn = document.querySelector('.btn-login');

if (loginBtn) {
  loginBtn.addEventListener('click', function () {

    var email = document.querySelector('input[type="email"]').value;
    var password = document.querySelector('input[type="password"]').value;

    // usuario admin falso
    if (email === "admin@sportswear.com" && password === "1234") {

      alert("Bienvenido administrador");

      if (window.location.pathname.includes('/pages/')) {
        window.location.href = 'admin-productos.html';
      } else {
        window.location.href = 'pages/admin-productos.html';
      }

    } else {
      alert("Usuario o contraseña incorrectos");
    }

  });
}
function getProducts() {
  return JSON.parse(localStorage.getItem("products")) || [];
}

function saveProducts(products) {
  localStorage.setItem("products", JSON.stringify(products));
}

var loginBtn = document.querySelector('.btn-login');

if (loginBtn) {
  loginBtn.addEventListener('click', function (e) {

    e.preventDefault(); // 🚨 CLAVE

    var email = document.querySelector('input[type="email"]').value;
    var password = document.querySelector('input[type="password"]').value;

    if (email === "admin@sportswear.com" && password === "1234") {

      localStorage.setItem("isAdmin", "true");

      alert("Bienvenido administrador");

      if (window.location.pathname.includes('/pages/')) {
        window.location.href = 'admin-productos.html';
      } else {
        window.location.href = 'pages/admin-productos.html';
      }

    } else {
      alert("Usuario o contraseña incorrectos");
    }

  });
}
});
