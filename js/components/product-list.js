import { fetchBrands } from '../api.js';

class ProductList extends HTMLElement {
  constructor() {
    super();
    this.pageSizeOptions = [14, 24, 36];
    this.pageSize = this.pageSizeOptions[0];
    this.products = [];
    this.dropdownOpen = false;
    this.currentModalProduct = null;
  }

  connectedCallback() {
    this.renderBase();
    this.fetchData();
  }

  async fetchData() {
    try {
      this.products = await fetchBrands(this.pageSize, 1);
      this.renderProducts();
    } catch (error) {
      console.error('Failed to fetch products:', error);
      this.innerHTML = '<p>Error loading products.</p>';
    }
  }

  showProductModal(product) {
    const overlay = document.createElement('div');
    overlay.className = 'product-modal-overlay';
    overlay.innerHTML = `
      <div class="product-modal">
        <button class="product-modal-close" aria-label="Закрыть">
          <img src="img/icons/ICONS=CLOSE.svg"/>
          <p>CLOSE</p>
        </button>
        <div class="product-modal-info">
            ID: ${product.id ?? ''}
        </div>
        <img class="product-modal-img" src="${product.image ? product.image.replace('.png', '.webp') : ''}"
            srcset="${product.image ? product.image.replace('.png', '.webp') : ''} 1x, ${product.image || ''} 2x">        
      </div>
    `;
    overlay.querySelector('.product-modal-close').onclick = () => this.hideProductModal();
    overlay.onclick = (e) => {
      if (e.target === overlay) this.hideProductModal();
    };
    document.addEventListener('keydown', this._escListener = (e) => {
      if (e.key === 'Escape') this.hideProductModal();
    });
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';
    this.currentModalProduct = overlay;
  }
  hideProductModal() {
    if (this.currentModalProduct) {
      document.body.removeChild(this.currentModalProduct);
      document.body.style.overflow = '';
      document.removeEventListener('keydown', this._escListener);
      this.currentModalProduct = null;
    }
  }


  renderBase() {
    const pageSizes = [
      this.pageSize,
      ...this.pageSizeOptions.filter(size => size !== this.pageSize)
    ];
    this.innerHTML = `
      <div class="product-list-container">
        <div class="page-size-selector">
          <label for="page-size" class="page-size-text">Number of products per page</label>
          <div id="page-size" class="custom-select ${this.dropdownOpen ? ' open' : ''}" tabindex="0">
            <div class="custom-select__selected">
              ${this.pageSize}
              <img
                src="img/icons/ICONS=chevron_down.svg"
                loading="lazy"
                >
            </div>
            <div class="custom-select__options">
              ${pageSizes.map(size =>
                `<div class="custom-select__option${size === this.pageSize ? ' selected' : ''}" data-value="${size}">
                    ${size}
                    ${size === this.pageSize
                    ? `<img class="list-chevron-up" src="img/icons/ICONS=chevron_down.svg" loading="lazy">`
                    : ''
                    }
                </div>`
              ).join('')}
            </div>
          </div>

        </div>
        <div class="product-list"></div>
      </div>
    `;
    const select = this.querySelector('.custom-select');
    const selected = this.querySelector('.custom-select__selected');
    const options = this.querySelector('.custom-select__options');

    selected.addEventListener('click', (e) => {
      this.dropdownOpen = !this.dropdownOpen;
      select.classList.toggle('open', this.dropdownOpen);
    });

    document.addEventListener('click', this._closeDropdown = (e) => {
      if (!select.contains(e.target)) {
        this.dropdownOpen = false;
        select.classList.remove('open');
      }
    });

    options.querySelectorAll('.custom-select__option').forEach(opt => {
      opt.addEventListener('click', (e) => {
        this.pageSize = parseInt(opt.getAttribute('data-value'));
        this.dropdownOpen = false;
        this.renderBase();
        this.fetchData();
      });
    });


    this.querySelector('#page-size').addEventListener('change', (event) => {
      this.pageSize = parseInt(event.target.value);
      this.fetchData();
    });
  }
  disconnectedCallback() {
    document.removeEventListener('click', this._closeDropdown);
  }


  renderProducts() {
    const productListDiv = this.querySelector('.product-list');
    if (!productListDiv) return;

    if (!Array.isArray(this.products) || this.products.length === 0) {
      productListDiv.innerHTML = '<p>Нет товаров для отображения.</p>';
      return;
    }

    const productCards = this.products.map((product, index) => {
      return (
        `<div class="product-card" style="cursor:pointer;" data-product-id="${product.id}">
        <div class="product-card-image-block">
          <img
            class="product-card-image"
            src="${product.image ? product.image.replace('.png', '.webp') : ''}"
            srcset="${product.image ? product.image.replace('.png', '.webp') : ''} 1x, ${product.image || ''} 2x"
            loading="lazy"
            alt="${product.text || ''}"
          >
        </div>
        <div class="brand-badge">ID: ${product.id ?? ''}</div>
      </div>`
      );
    });

    const SPECIAL_BLOCK_INDEX = 5;
    if (productCards.length >= SPECIAL_BLOCK_INDEX) {
      productCards.splice(SPECIAL_BLOCK_INDEX, 0, `
      <div class="product-special-block">
        <div class="special-text">
          <p>Forma’sint.</p>
          <h3>You'll look and feel like the champion.</h3>
        </div>
        <button class="special-btn">
          Check this out
          <img class="special-btn-img" src="img/icons/ICONS=chevron_down.svg" loading="lazy">
        </button>
      </div>
    `);
    }

    productListDiv.innerHTML = productCards.join('');
    productListDiv.querySelectorAll('.product-card').forEach(card => {
      card.addEventListener('click', (e) => {
        const productId = card.getAttribute('data-product-id');
        const product = this.products.find(p => String(p.id) === String(productId));
        if (product) this.showProductModal(product);
      });
    });
  }
}

customElements.define('product-list', ProductList);