class CustomHeader extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
    <header class="sticky-header">
      <nav aria-label="Главное меню" class="custom-header">
        <div class="header-section left">
          <a href="/" class="logo" aria-label="Перейти на главную страницу">
            <img
              src="img/icons/ICON=Default.svg"
              loading="lazy"
              width="24" height="24"
              alt="logo"
            />
          </a>
          <span class="brand-name">FORMA’SINT.</span>
          <span class="brand-name">IDOMODS &lt;/&gt;</span>
        </div>
        <ul class="header-section center" role="menubar">
          <li><a href="#home" role="menuitem">HOME</a></li>
          <li><a href="#brands" role="menuitem">FEATURED PRODUCTS</a></li>
          <li><a href="#listing" role="menuitem">PRODUCT LISTING</a></li>
        </ul>
        <div class="header-section right">
          <img
            src="img/icons/ICONS=Icon_user.svg"
            loading="lazy"
            width="24" height="24"
            alt="logo"
            class="header-logo"
          />
          <span class="brand-role">FRONTEND DEVELOPER</span>
        </div>
      </nav>
    </header>
    `;
  }
}
customElements.define('custom-header', CustomHeader);