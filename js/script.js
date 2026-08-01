// ===== ГОРОД =====
let currentCity = 'spb';

const cityData = {
    spb: {
        name: 'Санкт-Петербург',
        phone: '+7 (981) 960-0040',
        phones: ['+7 (981) 960-0040', '+7 (981) 960-0050', '+7 (981) 960-0055'],
        addresses: [
            'Дорога на Турухтанные острова, 18к4',
            'Набережная Обводного канала, 150р',
            'Улица Литовская, дом 16'
        ]
    },
    moscow: {
        name: 'Москва',
        phone: '+7 (499) 840-84-84',
        phones: ['+7 (499) 840-84-84', '+7 (977) 979-84-84'],
        addresses: [
            'Шарикоподшипниковская улица, 13, стр. 14, 115088',
            'Шарикоподшипниковская улица, 13, стр. 14, 115088'
        ]
    }
};

// ===== ОБЩИЕ МОДАЛКИ =====
function openCallback() {
    const modal = document.getElementById('callback-modal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function openPolicy() {
    const modal = document.getElementById('policy-modal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function openCookies() {
    const modal = document.getElementById('cookies-modal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// ===== МОДАЛКА ГОРОДА =====
function openCityModal() {
    const modal = document.getElementById('city-modal');
    if (!modal) return;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    document.querySelectorAll('.city-option').forEach(opt => {
        opt.classList.toggle('active', opt.dataset.city === currentCity);
    });
}

function closeCityModal() {
    const modal = document.getElementById('city-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function closeCityModalOutside(e) {
    if (e.target === e.currentTarget) {
        closeCityModal();
    }
}

function selectCity(city) {
    currentCity = city;
    updateCityUI(city);
    updateMobileContacts(city);
    
    document.querySelectorAll('.city-option').forEach(opt => {
        opt.classList.toggle('active', opt.dataset.city === city);
    });
    
    localStorage.setItem('cityConfirmed', 'true');
    localStorage.setItem('selectedCity', city);
    setTimeout(closeCityModal, 300);
}

function confirmCity() {
    if (currentCity) {
        localStorage.setItem('cityConfirmed', 'true');
        localStorage.setItem('selectedCity', currentCity);
        updateCityUI(currentCity);
        updateMobileContacts(currentCity);
        closeCityModal();
    } else {
        alert('Пожалуйста, выберите город');
    }
}

// ===== ОПРЕДЕЛЕНИЕ ГОРОДА =====
async function detectCity() {
    try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        const city = data.city || '';
        const region = data.region || '';
        const cityLower = (city + ' ' + region).toLowerCase();
        if (cityLower.includes('москва') || cityLower.includes('moscow')) return 'moscow';
        if (cityLower.includes('санкт-петербург') || cityLower.includes('peter') || cityLower.includes('spb')) return 'spb';
        return null;
    } catch (e) {
        return null;
    }
}

// ===== ОБНОВЛЕНИЕ UI =====
function updateCityUI(city) {
    const data = cityData[city];
    if (!data) return;
    
    const headerPhone = document.getElementById('header-phone');
    const headerCity = document.getElementById('header-city');
    const footerPhone = document.getElementById('footer-phone');
    const moscowAddress = document.getElementById('moscow-address');
    
    if (headerPhone) {
        headerPhone.textContent = data.phone;
        headerPhone.href = 'tel:' + data.phone.replace(/[\s()\-]/g, '');
    }
    if (headerCity) {
        headerCity.textContent = data.name;
    }
    if (footerPhone) {
        footerPhone.textContent = data.phone;
        footerPhone.href = 'tel:' + data.phone.replace(/[\s()\-]/g, '');
    }
    if (moscowAddress && city === 'moscow') {
        moscowAddress.textContent = data.addresses[0];
    }
    
    updateMobileContacts(city);
    
    const contactsSpb = document.getElementById('contacts-spb');
    const contactsMoscow = document.getElementById('contacts-moscow');
    if (contactsSpb && contactsMoscow) {
        contactsSpb.classList.toggle('active', city === 'spb');
        contactsMoscow.classList.toggle('active', city === 'moscow');
    }
    document.querySelectorAll('.city-tab').forEach(t => {
        t.classList.toggle('active', t.dataset.city === city);
    });
    
    localStorage.setItem('selectedCity', city);
    currentCity = city;
}

function switchCity(city) {
    currentCity = city;
    updateCityUI(city);
    updateMobileContacts(city);
    localStorage.setItem('cityConfirmed', 'true');
    localStorage.setItem('selectedCity', city);
}

// ===== МОБИЛЬНЫЕ КОНТАКТЫ =====
function updateMobileContacts(city) {
    const data = cityData[city];
    if (!data) return;
    
    const cityNameEl = document.getElementById('mobile-city-name');
    if (cityNameEl) cityNameEl.textContent = data.name;
    
    const container = document.getElementById('mobile-phones-addresses');
    if (container) {
        container.innerHTML = '';
        
        data.phones.forEach((phone, index) => {
            const branch = document.createElement('div');
            branch.className = 'mobile-branch';
            
            const phoneLink = document.createElement('a');
            phoneLink.href = 'tel:' + phone.replace(/[\s()\-]/g, '');
            phoneLink.className = 'branch-phone';
            phoneLink.textContent = phone;
            
            const address = document.createElement('p');
            address.className = 'branch-address';
            address.textContent = data.addresses[index] || data.addresses[data.addresses.length - 1];
            
            branch.appendChild(phoneLink);
            branch.appendChild(address);
            container.appendChild(branch);
        });
    }
    
    document.querySelectorAll('.mobile-city-option').forEach(opt => {
        opt.classList.toggle('active', opt.dataset.city === city);
    });
    
    const checkSpb = document.getElementById('mobile-check-spb');
    const checkMoscow = document.getElementById('mobile-check-moscow');
    if (checkSpb) checkSpb.style.opacity = city === 'spb' ? '1' : '0';
    if (checkMoscow) checkMoscow.style.opacity = city === 'moscow' ? '1' : '0';
}

function selectMobileCity(city) {
    currentCity = city;
    updateCityUI(city);
    updateMobileContacts(city);
    document.getElementById('mobile-city-dropdown').classList.remove('open');
    document.getElementById('mobile-city-btn').classList.remove('active');
    localStorage.setItem('cityConfirmed', 'true');
    localStorage.setItem('selectedCity', city);
}

function initMobileCitySelector() {
    const btn = document.getElementById('mobile-city-btn');
    const dropdown = document.getElementById('mobile-city-dropdown');
    if (!btn || !dropdown) return;
    
    btn.addEventListener('click', function(e) {
        e.stopPropagation();
        this.classList.toggle('active');
        dropdown.classList.toggle('open');
    });
    
    document.addEventListener('click', function(e) {
        if (!btn.contains(e.target) && !dropdown.contains(e.target)) {
            btn.classList.remove('active');
            dropdown.classList.remove('open');
        }
    });
}

function initCity() {
    if (localStorage.getItem('cityConfirmed') === 'true') {
        const savedCity = localStorage.getItem('selectedCity') || 'spb';
        currentCity = savedCity;
        updateCityUI(savedCity);
        updateMobileContacts(savedCity);
        return;
    }
    
    const urlParams = new URLSearchParams(window.location.search);
    const cityParam = urlParams.get('city');
    if (cityParam && (cityParam === 'moscow' || cityParam === 'spb')) {
        currentCity = cityParam;
        updateCityUI(currentCity);
        updateMobileContacts(currentCity);
        return;
    }
    
    detectCity().then(detected => {
        if (detected) {
            currentCity = detected;
            updateCityUI(currentCity);
            updateMobileContacts(currentCity);
        } else {
            setTimeout(openCityModal, 1000);
        }
    });
}

// ===== МОБИЛЬНОЕ МЕНЮ =====
function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const nav = document.getElementById('nav');
    if (!hamburger || !nav) {
        console.warn('⚠️ Элементы меню не найдены');
        return;
    }
    
    console.log('✅ Инициализация мобильного меню');
    
    hamburger.addEventListener('click', function(e) {
        e.stopPropagation();
        this.classList.toggle('active');
        nav.classList.toggle('active');
        document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
        console.log('Меню:', nav.classList.contains('active') ? 'открыто' : 'закрыто');
    });
    
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            nav.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

// ===== СКРОЛЛ ШАПКИ =====
function initHeaderScroll() {
    let lastScroll = 0;
    const header = document.querySelector('.header');
    if (!header) return;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        if (currentScroll <= 0) { header.classList.remove('hidden'); return; }
        if (currentScroll > lastScroll && currentScroll > 100) {
            header.classList.add('hidden');
        } else {
            header.classList.remove('hidden');
        }
        lastScroll = currentScroll;
    });
}

// ===== SWIPER =====
function initSwiper() {
    // Слайдер преимуществ
    const advantagesEl = document.querySelector('.advantages-swiper');
    if (advantagesEl && typeof Swiper !== 'undefined') {
        new Swiper(advantagesEl, {
            loop: true,
            autoplay: { delay: 4000, disableOnInteraction: false },
            pagination: { el: '.swiper-pagination', clickable: true },
            navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
        });
    }
    
    // Слайдер отзывов
    const reviewsEl = document.querySelector('.reviews-swiper');
    if (reviewsEl && typeof Swiper !== 'undefined') {
        new Swiper(reviewsEl, {
            loop: true,
            slidesPerView: 1,
            spaceBetween: 24,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.reviews-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.reviews-button-next',
                prevEl: '.reviews-button-prev',
            },
            breakpoints: {
                640: {
                    slidesPerView: 1,
                    spaceBetween: 20,
                },
                768: {
                    slidesPerView: 2,
                    spaceBetween: 24,
                },
                1024: {
                    slidesPerView: 3,
                    spaceBetween: 30,
                },
            },
        });
    }
}

// ===== АКТИВНАЯ ССЫЛКА =====
function initActiveNavLink() {
    const path = window.location.pathname;
    document.querySelectorAll('.nav-link').forEach(link => {
        const href = link.getAttribute('href');
        if (href === '/' && (path === '/' || path === '/index.html')) {
            link.classList.add('active');
        } else if (href && path.includes(href.replace('/', ''))) {
            link.classList.add('active');
        }
    });
}

// ===== ПЛАВНЫЙ СКРОЛЛ =====
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                window.scrollTo({
                    top: target.getBoundingClientRect().top + window.pageYOffset - 90,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== ОТПРАВКА ФОРМЫ =====
function submitForm(event) {
    event.preventDefault();
    const form = event.target;
    
    const data = {
        name: form.querySelector('input[type="text"]')?.value || '',
        phone: form.querySelector('input[type="tel"]')?.value || ''
    };
    
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = '⏳ Отправка...';
    submitBtn.disabled = true;
    
    fetch('/mail.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(data)
    })
    .then(response => response.json())
    .then(result => {
        if (result.success) {
            alert('✅ Заявка отправлена! Мы свяжемся с вами в ближайшее время.');
            form.reset();
            const phoneInput = form.querySelector('input[type="tel"]');
            if (phoneInput) phoneInput.value = '+7';
            closeModal('callback-modal');
        } else {
            alert('❌ ' + (result.error || 'Ошибка отправки. Попробуйте позже.'));
        }
    })
    .catch(() => {
        alert('❌ Ошибка отправки. Попробуйте позже.');
    })
    .finally(() => {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    });
}

// ===== ЗАКРЫТИЕ МОДАЛОК =====
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal-overlay')) {
        e.target.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// ===== СЛУШАЕМ СОБЫТИЕ ЗАГРУЗКИ ШАПКИ =====
document.addEventListener('headerLoaded', function() {
    console.log('📢 Шапка загружена, инициализируем...');
    
    setTimeout(function() {
        if (typeof initMobileMenu === 'function') {
            initMobileMenu();
        }
        if (typeof initMobileCitySelector === 'function') {
            initMobileCitySelector();
        }
        if (typeof updateMobileContacts === 'function') {
            updateMobileContacts(currentCity || 'spb');
        }
    }, 100);
});

// ===== АВТОМАТИЧЕСКОЕ ПОКАЗ МОДАЛКИ COOKIES =====
function initCookiesModal() {
    if (localStorage.getItem('cookiesAccepted') === 'true') {
        return;
    }
    
    setTimeout(function() {
        const modal = document.getElementById('cookies-modal');
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }, 1500);
}

// ===== ЭКСПОРТ =====
window.openCallback = openCallback;
window.openPolicy = openPolicy;
window.openCookies = openCookies;
window.closeModal = closeModal;
window.openCityModal = openCityModal;
window.closeCityModal = closeCityModal;
window.closeCityModalOutside = closeCityModalOutside;
window.selectCity = selectCity;
window.confirmCity = confirmCity;
window.selectMobileCity = selectMobileCity;
window.switchCity = switchCity;
window.submitForm = submitForm;
window.initMobileMenu = initMobileMenu;
window.initMobileCitySelector = initMobileCitySelector;
window.updateMobileContacts = updateMobileContacts;

// ===== ПЕРЕХВАТЫВАЕМ closeModal ДЛЯ COOKIES =====
const originalCloseModal = closeModal;
closeModal = function(id) {
    if (id === 'cookies-modal') {
        localStorage.setItem('cookiesAccepted', 'true');
    }
    originalCloseModal(id);
};

// ===== ЗАПУСК =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Запуск инициализации...');
    
    initSwiper();
    initSmoothScroll();
    initCity();
    initHeaderScroll();
    initActiveNavLink();
    
    // Если шапка уже загружена
    if (document.getElementById('hamburger')) {
        console.log('✅ Шапка уже загружена');
        initMobileMenu();
        initMobileCitySelector();
        updateMobileContacts(currentCity || 'spb');
    }
    
    // Автоматический показ модалки cookies
    initCookiesModal();
    
    console.log('🚗 Автосервис загружен');
    console.log('📍 Город:', cityData[currentCity]?.name);
});