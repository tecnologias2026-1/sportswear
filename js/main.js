// ========================================
// JAVASCRIPT PRINCIPAL - SPORTSWEAR
// ========================================

// MENÚ MÓVIL
document.addEventListener('DOMContentLoaded', function() {
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (hamburger) {
    hamburger.addEventListener('click', function() {
      const isExpanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', !isExpanded);
      mobileMenu.setAttribute('aria-hidden', isExpanded);
      
      if (isExpanded) {
        mobileMenu.style.display = 'none';
      } else {
        mobileMenu.style.display = 'flex';
      }
    });

    // Cerrar menú al hacer clic en un enlace
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('aria-hidden', 'true');
        mobileMenu.style.display = 'none';
      });
    });
  }

  // BÚSQUEDA
  const searchForm = document.querySelector('.search');
  if (searchForm) {
    searchForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const query = this.querySelector('input').value;
      if (query) {
        window.location.href = `productos.html?search=${encodeURIComponent(query)}`;
      }
    });
  }

  // OPCIONES DE PRODUCTO (Detalle)
  const sizeOptions = document.querySelectorAll('.size-option');
  sizeOptions.forEach(option => {
    option.addEventListener('click', function() {
      sizeOptions.forEach(opt => opt.classList.remove('selected'));
      this.classList.add('selected');
    });
  });

  const colorOptions = document.querySelectorAll('.color-option');
  colorOptions.forEach(option => {
    option.addEventListener('click', function() {
      colorOptions.forEach(opt => opt.classList.remove('selected'));
      this.classList.add('selected');
    });
  });

  // IMÁGENES DEL PRODUCTO
  const smallImages = document.querySelectorAll('.product-detail-images-small img');
  const mainImage = document.getElementById('mainImage');
  
  if (mainImage) {
    smallImages.forEach(img => {
      img.addEventListener('click', function() {
        mainImage.src = this.src;
      });
    });
  }

  // AÑADIR AL CARRITO
  const addToCartBtns = document.querySelectorAll('.product-card-add');
  addToCartBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
      if (this.href) return; // Si tiene href, dejar que navegue
      e.preventDefault();
      alert('¡Producto añadido al carrito!');
      // En una aplicación real, aquí iría la lógica de agregar al carrito
    });
  });

  // FAVORITOS
  const favoritesBtns = document.querySelectorAll('.product-card-heart');
  favoritesBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      this.textContent = this.textContent === '♡' ? '♥' : '♡';
      this.style.color = this.textContent === '♥' ? '#EF4444' : 'inherit';
    });
  });

  // CANTIDAD EN CARRITO
  const quantityInputs = document.querySelectorAll('.cart-item-quantity input');
  const quantityBtns = document.querySelectorAll('.cart-item-quantity button');
  
  quantityBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const input = this.parentElement.querySelector('input');
      const currentValue = parseInt(input.value);
      
      if (this.textContent === '+') {
        input.value = currentValue + 1;
      } else if (currentValue > 1) {
        input.value = currentValue - 1;
      }
      
      // Disparar evento de cambio para actualizar total
      input.dispatchEvent(new Event('change'));
    });
  });

  quantityInputs.forEach(input => {
    input.addEventListener('change', function() {
      // Aquí iría la lógica para actualizar el total del carrito
      console.log('Cantidad actualizada:', this.value);
    });
  });

  // RANGO DE PRECIOS
  const minRange = document.getElementById('minRange');
  const maxRange = document.getElementById('maxRange');
  const priceMin = document.getElementById('priceMin');
  const priceMax = document.getElementById('priceMax');
  const priceDisplay = document.querySelector('.price-display');

  if (minRange && maxRange) {
    const updatePriceRange = () => {
      const min = parseInt(minRange.value);
      const max = parseInt(maxRange.value);

      if (min > max) {
        minRange.value = max;
      }

      if (priceMin) priceMin.value = min;
      if (priceMax) priceMax.value = max;

      if (priceDisplay) {
        priceDisplay.textContent = `$ ${min.toLocaleString('es-CO')} - $ ${max.toLocaleString('es-CO')}`;
      }
    };

    minRange.addEventListener('input', updatePriceRange);
    maxRange.addEventListener('input', updatePriceRange);

    if (priceMin) {
      priceMin.addEventListener('change', () => {
        minRange.value = Math.max(0, parseInt(priceMin.value) || 0);
        updatePriceRange();
      });
    }

    if (priceMax) {
      priceMax.addEventListener('change', () => {
        maxRange.value = Math.max(0, parseInt(priceMax.value) || 0);
        updatePriceRange();
      });
    }
  }

  // LIMPIAR FILTROS
  const clearFiltersBtn = document.querySelector('.btn-secondary[style*="width: 100%"]');
  if (clearFiltersBtn && clearFiltersBtn.textContent.includes('Limpiar')) {
    clearFiltersBtn.addEventListener('click', function() {
      document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
        cb.checked = false;
      });
      if (minRange) minRange.value = 0;
      if (maxRange) maxRange.value = 200000;
      alert('Filtros limpios');
    });
  }

  // ORDENAMIENTO DE PRODUCTOS
  const sortSelect = document.getElementById('sort');
  if (sortSelect) {
    sortSelect.addEventListener('change', function() {
      console.log('Ordenar por:', this.value);
      // En una aplicación real, aquí iría la lógica de reordenamiento
    });
  }

  // PAGINACIÓN
  const paginationBtns = document.querySelectorAll('.pagination-btn');
  paginationBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
      if (!this.disabled && !this.classList.contains('active')) {
        paginationBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  });

  // VALIDAR SELECCIONES EN DETALLE DE PRODUCTO
  const addToCartDetailBtn = document.querySelector('.product-detail-actions .btn-primary');
  if (addToCartDetailBtn) {
    addToCartDetailBtn.addEventListener('click', function() {
      const selectedSize = document.querySelector('.size-option.selected');
      const selectedColor = document.querySelector('.color-option.selected');
      const quantity = document.getElementById('quantity').value;

      if (!selectedSize || !selectedColor) {
        alert('Por favor selecciona un talle y color');
        return;
      }

      alert(`✓ Producto añadido al carrito\nTalle: ${selectedSize.textContent}\nCantidad: ${quantity}`);
      // En una aplicación real, aquí iría la lógica de agregar al carrito
    });
  }

  // CORAZÓN EN DETALLE
  const heartDetailBtn = document.querySelector('.product-detail-actions .btn-outline');
  if (heartDetailBtn) {
    heartDetailBtn.addEventListener('click', function() {
      this.textContent = this.textContent === '♡' ? '♥' : '♡';
      this.style.color = this.textContent === '♥' ? '#EF4444' : 'inherit';
    });
  }

  // ELIMINAR ITEMS DEL CARRITO
  const removeCartItems = document.querySelectorAll('.cart-item-remove');
  removeCartItems.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      if (confirm('¿Deseas eliminar este artículo del carrito?')) {
        this.closest('.cart-item').remove();
        alert('Artículo eliminado del carrito');
      }
    });
  });

  // VALIDACIÓN DE FORMULARIOS
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');

  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const email = this.querySelector('input[type="email"]').value;
      const password = this.querySelector('input[type="password"]').value;

      if (email && password) {
        alert(`¡Bienvenido ${email}!`);
        // En una aplicación real, aquí iría la lógica de autenticación
      }
    });
  }

  if (registerForm) {
    registerForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const email = this.querySelector('input[type="email"]').value;
      const password = this.querySelector('#password').value;
      const confirmPassword = this.querySelector('#confirm-password').value;

      if (password !== confirmPassword) {
        alert('Las contraseñas no coinciden');
        return;
      }

      if (password.length < 8) {
        alert('La contraseña debe tener al menos 8 caracteres');
        return;
      }

      alert(`¡Cuenta creada exitosamente!\nCorreo: ${email}`);
      // En una aplicación real, aquí iría la lógica de registro
    });
  }

  // SMOOTH SCROLL PARA ANCHORS
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // FORMATO DE MONEDA
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(value);
  };

  // Aplicar formato a precios en la página
  document.querySelectorAll('[class*="price"]').forEach(element => {
    const text = element.textContent;
    if (text.includes('$')) {
      const match = text.match(/\d+(?:\.\d+)?/);
      if (match) {
        const number = parseFloat(match[0].replace('.', ''));
        element.textContent = '$ ' + number.toLocaleString('es-CO');
      }
    }
  });

  console.log('✓ SportSwear JavaScript cargado correctamente');
});

// FUNCIONES GLOBALES

/**
 * Agregar producto al carrito
 */
window.addToCart = function(productId, quantity = 1) {
  console.log(`Agregando producto ${productId} con cantidad ${quantity} al carrito`);
  // Implementar lógica de carrito aquí
};

/**
 * Eliminar producto del carrito
 */
window.removeFromCart = function(productId) {
  console.log(`Eliminando producto ${productId} del carrito`);
  // Implementar lógica de carrito aquí
};

/**
 * Actualizar cantidad en carrito
 */
window.updateCartQuantity = function(productId, quantity) {
  console.log(`Actualizando cantidad de ${productId} a ${quantity}`);
  // Implementar lógica de carrito aquí
};

/**
 * Obtener total del carrito
 */
window.getCartTotal = function() {
  // Implementar lógica de carrito aquí
  return 0;
};
