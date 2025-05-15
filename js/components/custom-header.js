class CustomHeader extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
    <header class="sticky-header">
      <nav aria-label="Главное меню" class="custom-header">
        <div class="header-section left">
          <a href="#" class="logo" aria-label="Перейти на главную страницу">
            <img
              class="forma-icon"
              src="img/icons/FORMA ICON=Default.svg"
              loading="lazy"
              width="24" height="24"
              alt="logo"
            />
            FORMA’SINT.
          </a>
          <span class="brand-name">IDOMODS &lt;/&gt;</span>
        </div>
        <ul class="header-section center" role="menubar">
          <li><a href="#home" role="menuitem">HOME</a></li>
          <li><a href="#brands" role="menuitem">FEATURED PRODUCTS</a></li>
          <li><a href="#product-list" role="menuitem">PRODUCT LISTING</a></li>
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
    document.addEventListener('click', function(e) {
      const link = e.target.closest('a[href^="#"]');
      if (link && !link.hasAttribute('download') && link.getAttribute('href') !== '#') {
        const targetId = link.getAttribute('href').slice(1);
        const targetEl =
          document.getElementById(targetId) ||
          document.querySelector(targetId) ||
          document.querySelector(`[name='${targetId}']`);

        if (targetEl) {
          e.preventDefault();
          const rect = targetEl.getBoundingClientRect();
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          window.scrollTo({
            top: rect.top + scrollTop - 130,
            behavior: 'smooth'
          });
        }
      }
    });

    const icon = this.querySelector('.forma-icon');
    if (icon) {
      icon.addEventListener('mouseenter', () => {
        icon.src = 'img/icons/FORMA ICON=Fill.svg';
      });
      icon.addEventListener('mouseleave', () => {
        icon.src = 'img/icons/FORMA ICON=Default.svg';
      });
    }
  }
}
customElements.define('custom-header', CustomHeader);