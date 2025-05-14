import { fetchBrands } from '../api.js';

class BrandsSlider extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.itemCount = 12;
    this.favorites = new Set();
    this.brands = [];
  }

  connectedCallback() {
    this.render();
    this.loadBrands();
    this.attachScrollEvent();
  }

  async loadBrands() {
    console.log('[brands-slider] Запуск loadBrands');
    try {
      const rawBrands = await fetchBrands(this.itemCount, 1);
      const badges = [null, "Limited edition", "Bestseller"];

      this.brands = rawBrands.map(brand => ({
        ...brand,
        price: 300,
        title: "Alpine climbing jacket",
        badge: badges[Math.floor(Math.random() * badges.length)]
      }));

      this.renderBrands(this.brands);
      this.updateArrows();
    } catch (e) {
      console.error('[brands-slider] Ошибка запроса:', e);
      this.shadowRoot.querySelector('.slider-track').innerHTML =
        `<div>Error loading data</div>`;
    }
  }

  attachScrollEvent() {
    const track = this.shadowRoot.querySelector('.slider-track');
    track.addEventListener('scroll', () => this.updateArrows());
  }

  updateArrows() {
    const track = this.shadowRoot.querySelector('.slider-track');
    const btnPrev = this.shadowRoot.querySelector('.slider-btn.prev');
    const btnNext = this.shadowRoot.querySelector('.slider-btn.next');

    const atStart = track.scrollLeft === 0;
    const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth -20;

    btnPrev.style.opacity = atStart ? '0' : '1';
    btnPrev.disabled = atStart;

    btnNext.style.opacity = atEnd ? '0' : '1';
    btnNext.disabled = atEnd;
  }

  scrollTrack(direction) {
    const track = this.shadowRoot.querySelector('.slider-track');
    const scrollAmount = track.clientWidth + 24;
    track.scrollBy({ left: direction === 'next' ? scrollAmount : -scrollAmount, behavior: 'smooth' });
  }

  toggleFavorite(id) {
    if (this.favorites.has(id)) {
      this.favorites.delete(id);
    } else {
      this.favorites.add(id);
    }
    this.renderBrands(this.brands);
  }

  render() {
    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="/css/brands-slider.css">
      <link rel="stylesheet" href="/css/index.css">
      <section id="brands">
        <h4>Featured products</h4>
        <h2 class="slider-title">Browse featured</h2>
        
        <div class="slider-container">
          <button class="slider-btn prev" aria-label="prev">
            <img src="img/icons/Chevron_right.svg">
          </button>
          <div class="slider" aria-label="Слайдер брендов">
            <div class="slider-track"></div>
          </div>
          <button class="slider-btn next" aria-label="next">
            <img src="img/icons/Chevron_right.svg">
          </button>
        </div>
      </section>
    `;

    this.shadowRoot.querySelector('.slider-btn.prev').addEventListener('click', () => this.scrollTrack('prev'));
    this.shadowRoot.querySelector('.slider-btn.next').addEventListener('click', () => this.scrollTrack('next'));
  }

  renderBrands(brands) {
    if (!Array.isArray(brands)) return;
    const track = this.shadowRoot.querySelector('.slider-track');
    track.innerHTML = '';
    brands.map(brand => {
      const el = document.createElement('div');
      el.className = 'brand-card';
      const isFavorite = this.favorites.has(brand.id);
      el.innerHTML = `
      <div>
        <div class="brand-card-image-block">
          <img
            class="brand-card-image"
            src="${brand.image.replace('.png', '.webp')}"
            srcset="${brand.image.replace('.png', '.webp')} 1x, ${brand.image} 2x"
            loading="lazy"
            alt="${brand.text}"
          >
        </div>
        <div class="brand-badge ${brand.badge === "Limited edition" ? 'limited' : brand.badge === "Bestseller" ? 'bestseller' : null}">
          ${brand.badge ? `<span class="badge">${brand.badge}</span>` : ''}
        </div>
        <button class="fav-btn" aria-label="Добавить в избранное" title="Добавить в избранное">
          <img class="fav-icon" src="/img/icons/${!isFavorite ? 'FAV FORMA ICON=Default.svg' : 'FAV ICON=Fill.svg'}" alt="">
        </button>
        <div class="brand-card-info">
          <b>${brand.title}</b>
          <p>€${brand.price},00 EUR</>
        </div>
        
      </div>`;
      el.querySelector('.fav-btn').addEventListener('click', () => {
        this.toggleFavorite(brand.id);
      });
      track.appendChild(el);
    });
    this.updateArrows();
  }
}

customElements.define('brands-slider', BrandsSlider);