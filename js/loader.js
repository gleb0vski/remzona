// ===== ЗАГРУЗЧИК КОМПОНЕНТОВ =====
function loadComponent(containerId, filePath) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Контейнер #${containerId} не найден`);
        return;
    }
    
    fetch(filePath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(html => {
            container.innerHTML = html;
            console.log('✅ Компонент загружен:', filePath);
            
            if (filePath.includes('header')) {
                document.dispatchEvent(new CustomEvent('headerLoaded'));
            }
            if (filePath.includes('footer')) {
                document.dispatchEvent(new CustomEvent('footerLoaded'));
                setTimeout(function() {
                    if (typeof initSwiper === 'function') {
                        initSwiper();
                    }
                }, 200);
            }
        })
        .catch(error => {
            console.error('Ошибка загрузки:', error);
            container.innerHTML = `<p style="color:red; text-align:center; padding:20px;">⚠️ Ошибка загрузки компонента</p>`;
        });
}

// ===== ОПРЕДЕЛЯЕМ БАЗОВЫЙ ПУТЬ =====
function getBasePath() {
    // Если мы на GitHub Pages
    if (window.location.hostname.includes('github.io')) {
        // Получаем имя репозитория из URL
        const pathParts = window.location.pathname.split('/');
        if (pathParts.length > 1 && pathParts[1]) {
            return '/' + pathParts[1] + '/';
        }
    }
    return '/';
}

// ===== ЗАГРУЗКА ШАПКИ =====
function loadHeader() {
    const basePath = getBasePath();
    loadComponent('header-placeholder', basePath + 'components/header.html');
}

// ===== ЗАГРУЗКА ФУТЕРА =====
function loadFooter() {
    const basePath = getBasePath();
    loadComponent('footer-placeholder', basePath + 'components/footer.html');
}

// ===== ЗАПУСК =====
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        loadHeader();
        loadFooter();
    });
} else {
    loadHeader();
    loadFooter();
}

console.log('🔄 Загрузчик компонентов активирован');