class PreviewSection extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <section class="preview-section">
      <h1>
        <img src="img/text/LOGO FORMA.svg" alt="preview" class="preview-title" />
      </h1>
      <img src="img/backgrounds/56aba026b5b193219432364aab843d25a229b4ed.jpg" alt="preview" class="preview-img" />
      </section>
    `;
    setTimeout(() => this.updatePreviewImgHeight(), 0);
    window.addEventListener('resize', () => this.updatePreviewImgHeight());
  }

  updatePreviewImgHeight() {
    const title = this.querySelector('.preview-title');
    const img = this.querySelector('.preview-img');
    if (!title || !img) return;
    const titleHeight = title.getBoundingClientRect().height + 42;
    const available = window.innerHeight - 240 - titleHeight;
    img.style.height = (available > 0 ? available : 0) + 'px';
  }
}


customElements.define('preview-section', PreviewSection);