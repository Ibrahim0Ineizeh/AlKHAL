import '@fontsource/dm-sans/latin-400.css';
import '@fontsource/dm-sans/latin-500.css';
import '@fontsource/dm-sans/latin-600.css';
import '@fontsource/fraunces/latin-500.css';
import '@fontsource/noto-naskh-arabic/arabic-500.css';
import './style.css';
import { categories, drinks, shop } from './menu';
import type { ModelViewerElement } from '@google/model-viewer';

const icons = {
  spin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M20 7v5h-5M4 17v-5h5"/><path d="M6.1 6.1a8 8 0 0 1 13.6 4.1M4.3 13.8a8 8 0 0 0 13.6 4.1"/></svg>',
  cube: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" aria-hidden="true"><path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z"/><path d="m4 7.5 8 4.5 8-4.5M12 12v9M8 5.2l8 4.5"/></svg>',
  reset: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 5v5h5"/><path d="M4.6 9a8 8 0 1 1-.2 5"/></svg>',
};
const escape = (text: string) => text.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]!);
const price = (value: number) => new Intl.NumberFormat(shop.locale, {
  minimumFractionDigits: shop.priceDecimals,
  maximumFractionDigits: shop.priceDecimals,
}).format(value);

document.title = `${shop.name} · Menu`;
document.querySelector('meta[name="description"]')?.setAttribute('content', `Explore the ${shop.name} menu, with drink categories, prices in dinars, and interactive 3D previews.`);

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <a class="skip-link" href="#coffee-menu">Skip to the menu</a>
  <div class="page-shell">
    <header class="site-header">
      <div class="brand" aria-label="${escape(shop.name)}">
        <img class="brand-logo" src="${escape(shop.logo)}" alt="${escape(shop.name)} — Alkhal" width="556" height="459" />
      </div>
      <div class="header-note"><span class="brand-star" aria-hidden="true">✳</span><span>A moment for coffee.</span></div>
      <div class="header-menu"><span lang="ar" dir="rtl">القائمة</span><span>MENU</span></div>
    </header>

    <main id="coffee-menu">
      <div class="page-heading"><h1>Menu</h1><p>${icons.cube}<span>A closer look at your next cup.</span></p></div>
      <div class="category-picker" role="group" aria-label="Drink categories">
        ${categories.map((category, index) => `<button type="button" class="category-button" data-category="${category.id}" aria-pressed="${index === 0}" aria-controls="menu-results">${category.name}</button>`).join('')}
      </div>
      <div id="menu-results">
      <div class="coffee-grid">
        ${drinks.map((drink, index) => `
          <article class="coffee-card tone-${drink.tone}" aria-labelledby="${drink.id}-name" data-drink="${drink.id}" data-category="${drink.category}" ${drink.category !== categories[0].id ? 'hidden' : ''}>
            <div class="card-scene">
              <div class="scene-topline"><span><span class="item-number">${String(index + 1).padStart(2, '0')}</span> ${categories.find((category) => category.id === drink.category)!.sceneLabel}</span><span class="view-badge">360° VIEW</span></div>
              <div class="model-stage">
                <div class="stage-ring" aria-hidden="true"></div>
                <model-viewer src="${escape(drink.model)}" alt="${escape(drink.modelAlt)} — ${escape(drink.name)} cup preview"
                  camera-controls touch-action="pan-y" disable-zoom disable-pan
                  camera-orbit="${index ? '-30' : '25'}deg 75deg 105%" field-of-view="30deg"
                  min-camera-orbit="auto 35deg auto" max-camera-orbit="auto 100deg auto"
                  shadow-intensity="1" shadow-softness="1" exposure="1.15"
                  environment-image="neutral" interaction-prompt="none" loading="eager"
                  aria-label="${escape(drink.name)} 3D cup. Drag horizontally or use arrow keys to rotate.">
                  <div slot="progress-bar" class="loading-indicator" role="status">Preparing your cup<span></span></div>
                </model-viewer>
                <div class="model-fallback" hidden role="status"><span>${icons.cube}</span><p>The 3D preview is unavailable.</p><p class="fallback-description">The drink details are below.</p><button type="button" class="retry-model">Try again</button></div>
              </div>
              <div class="viewer-tools"><span class="drag-hint">${icons.spin}<span>Drag to explore</span></span><div class="viewer-buttons"><button type="button" class="icon-button reset-view" aria-label="Reset ${escape(drink.name)} view" title="Reset view" disabled>${icons.reset}</button></div></div>
            </div>
            <div class="drink-details"><div class="drink-title"><h2 id="${drink.id}-name">${escape(drink.name)}</h2><span class="arabic-name" lang="ar" dir="rtl">${escape(drink.arabicName)}</span></div><div class="drink-bottom"><p>${escape(drink.description)}</p><div class="price"><span>${price(drink.price)}</span><span>${escape(shop.currency)}</span></div></div><div class="card-footnote"><span>${escape(drink.modelNote)}</span>${shop.isDemo ? '<span>Sample price</span>' : ''}</div></div>
          </article>
        `).join('')}
      </div>
      <div class="category-empty" hidden><h2 id="empty-category-name"></h2><p>No drinks in this category yet.</p></div>
      </div>
      <p class="sr-only" id="category-status" role="status"></p>
      <p class="menu-note"><span aria-hidden="true">✳</span>Take your time. Our team is here when you’re ready.</p>
    </main>

    <footer class="site-footer"><span class="footer-brand" lang="ar" dir="rtl">${escape(shop.name)}</span><span>${shop.isDemo ? 'Preview menu · prices to be confirmed' : 'Enjoy your coffee.'}</span><span>Browse. Discover. Enjoy.</span></footer>
  </div>
`;

const categoryButtons = document.querySelectorAll<HTMLButtonElement>('.category-button');
const drinkCards = document.querySelectorAll<HTMLElement>('.coffee-card');
const emptyCategory = document.querySelector<HTMLElement>('.category-empty')!;
const coffeeGrid = document.querySelector<HTMLElement>('.coffee-grid')!;

categoryButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const category = categories.find((item) => item.id === button.dataset.category)!;
    categoryButtons.forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
    let count = 0;
    drinkCards.forEach((card) => {
      card.hidden = card.dataset.category !== category.id;
      if (!card.hidden) count += 1;
    });
    coffeeGrid.hidden = count === 0;
    emptyCategory.hidden = count !== 0;
    document.querySelector('#empty-category-name')!.textContent = category.name;
    document.querySelector('#category-status')!.textContent = count
      ? `${category.name}: ${count} ${count === 1 ? 'drink' : 'drinks'}.`
      : `${category.name}: no drinks in this category yet.`;
  });
});

document.querySelectorAll<HTMLElement>('.coffee-card').forEach((card, index) => {
  const drink = drinks[index];
  const viewer = card.querySelector<ModelViewerElement>('model-viewer')!;
  const resetButton = card.querySelector<HTMLButtonElement>('.reset-view')!;
  const fallback = card.querySelector<HTMLDivElement>('.model-fallback')!;
  const hint = card.querySelector<HTMLElement>('.drag-hint')!;
  const loader = card.querySelector<HTMLElement>('.loading-indicator')!;
  const initialOrbit = viewer.getAttribute('camera-orbit')!;
  let loadTimer: ReturnType<typeof setTimeout>;

  function showFallback() {
    clearTimeout(loadTimer);
    loader.hidden = true;
    viewer.hidden = true;
    fallback.hidden = false;
    resetButton.disabled = true;
    hint.style.visibility = 'hidden';
  }

  function startLoading() {
    clearTimeout(loadTimer);
    loader.hidden = false;
    loadTimer = setTimeout(showFallback, 30000);
  }

  viewer.addEventListener('load', () => {
    clearTimeout(loadTimer);
    loader.hidden = true;
    viewer.hidden = false;
    fallback.hidden = true;
    resetButton.disabled = false;
    hint.style.visibility = '';
  });
  viewer.addEventListener('error', showFallback);

  resetButton.addEventListener('click', () => {
    viewer.cameraOrbit = initialOrbit;
    viewer.resetTurntableRotation(0);
  });

  card.querySelector('.retry-model')!.addEventListener('click', async () => {
    fallback.hidden = true;
    viewer.hidden = false;
    startLoading();
    try {
      await import('@google/model-viewer');
      const retryUrl = new URL(drink.model, window.location.href);
      retryUrl.searchParams.set('retry', String(Date.now()));
      viewer.src = retryUrl.href;
    } catch { showFallback(); }
  });

  startLoading();
  void import('@google/model-viewer').catch(showFallback);
});
