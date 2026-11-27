
(() => {
  const menu = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav-links');
  if (menu && nav) {
    menu.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      menu.setAttribute('aria-expanded', String(open));
    });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      nav.classList.remove('open'); menu.setAttribute('aria-expanded', 'false');
    }));
  }

  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add('is-visible'));
  }

  const sections = [...document.querySelectorAll('main section[id]')];
  const navLinks = [...document.querySelectorAll('.nav-links a[href^="#"]')];
  if ('IntersectionObserver' in window && sections.length && navLinks.length) {
    const activeObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id));
        }
      });
    }, { rootMargin: '-30% 0px -60% 0px' });
    sections.forEach(section => activeObserver.observe(section));
  }

  const filterButtons = document.querySelectorAll('[data-filter]');
  const cards = document.querySelectorAll('[data-category]');
  filterButtons.forEach(button => button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    filterButtons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    cards.forEach(card => {
      card.hidden = filter !== 'all' && !card.dataset.category.split(' ').includes(filter);
    });
  }));


  const number = id => {
    const el = document.getElementById(id);
    const value = el ? Number(el.value) : NaN;
    return Number.isFinite(value) && value >= 0 ? value : NaN;
  };
  const updateBreakEven = () => {
    const fixed = number('be-fixed'), price = number('be-price'), variable = number('be-variable');
    const output = document.getElementById('be-output'), note = document.getElementById('be-note');
    if (![fixed,price,variable].every(Number.isFinite)) { output.textContent='Check inputs'; note.textContent='Enter non-negative numbers.'; return; }
    const contribution = price - variable;
    if (contribution <= 0) { output.textContent='Not calculable'; note.textContent='Selling price must exceed variable cost.'; return; }
    output.textContent = Math.ceil(fixed / contribution).toLocaleString('en-IN') + ' units';
    note.textContent = 'Contribution per unit: ' + contribution.toLocaleString('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0});
  };
  const updateGrossMargin = () => {
    const revenue = number('gm-revenue'), cogs = number('gm-cogs');
    const output = document.getElementById('gm-output'), note = document.getElementById('gm-note');
    if (![revenue,cogs].every(Number.isFinite)) { output.textContent='Check inputs'; note.textContent='Enter non-negative numbers.'; return; }
    if (revenue === 0) { output.textContent='Not calculable'; note.textContent='Revenue must be greater than zero.'; return; }
    const margin = ((revenue-cogs)/revenue)*100;
    output.textContent = margin.toFixed(1) + '%';
    note.textContent = 'Gross profit: ' + (revenue-cogs).toLocaleString('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0});
  };
  const updateCurrentRatio = () => {
    const assets = number('cr-assets'), liabilities = number('cr-liabilities');
    const output = document.getElementById('cr-output'), note = document.getElementById('cr-note');
    if (![assets,liabilities].every(Number.isFinite)) { output.textContent='Check inputs'; note.textContent='Enter non-negative numbers.'; return; }
    if (liabilities === 0) { output.textContent='Not calculable'; note.textContent='Current liabilities must be greater than zero.'; return; }
    output.textContent = (assets/liabilities).toFixed(2) + '×';
    note.textContent = 'Working capital: ' + (assets-liabilities).toLocaleString('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0});
  };
  [['be-fixed','be-price','be-variable'],['gm-revenue','gm-cogs'],['cr-assets','cr-liabilities']].forEach(ids => ids.forEach(id => {
    const el=document.getElementById(id);
    if(el) el.addEventListener('input', () => { updateBreakEven(); updateGrossMargin(); updateCurrentRatio(); });
  }));
  updateBreakEven(); updateGrossMargin(); updateCurrentRatio();

  document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());
})();
