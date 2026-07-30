/**
 * FIRE OWL COLLECTIBLES - JavaScript Otimizado
 * Versão: 2.1.0
 * Autor: NickDev (Defaull7 Tech)
 * Com suporte a internacionalização (i18n)
 */

'use strict';

// ============================================
// SISTEMA DE INTERNACIONALIZAÇÃO
// ============================================
function updatePageLanguage() {
    const currentLang = i18nManager.getCurrentLang();
    
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.dataset.i18n;
        const text = i18nManager.t(key);
        if (text !== key) {
            el.textContent = text;
        }
    });
    
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.dataset.i18nPlaceholder;
        const text = i18nManager.t(key);
        if (text !== key) {
            el.placeholder = text;
        }
    });
    
    document.querySelectorAll('[data-i18n-aria]').forEach(el => {
        const key = el.dataset.i18nAria;
        const text = i18nManager.t(key);
        if (text !== key) {
            el.setAttribute('aria-label', text);
        }
    });
    
    document.querySelectorAll('[data-i18n-option]').forEach(select => {
        const key = select.dataset.i18nOption;
        const text = i18nManager.t(key);
        if (text !== key && select.children[0]) {
            select.children[0].textContent = text;
        }
    });
    
    document.querySelectorAll('option[data-i18n]').forEach(option => {
        const key = option.dataset.i18n;
        const text = i18nManager.t(key);
        if (text !== key) {
            option.textContent = text;
        }
    });
    
    const langLabels = {
        'pt-BR': 'PT',
        'en-US': 'EN',
        'es-ES': 'ES'
    };
    const langLabel = document.getElementById('langLabel');
    if (langLabel) {
        langLabel.textContent = langLabels[currentLang] || 'PT';
    }
    
    document.querySelectorAll('.lang-option').forEach(btn => {
        if (btn.dataset.lang === currentLang) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

function initLanguageSelector() {
    const langToggle = document.getElementById('langToggle');
    const langMenu = document.getElementById('langMenu');
    const langOptions = document.querySelectorAll('.lang-option');
    
    if (!langToggle || !langMenu) return;
    
    langToggle.addEventListener('click', () => {
        const isHidden = langMenu.hidden;
        langMenu.hidden = !isHidden;
    });
    
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.language-selector')) {
            langMenu.hidden = true;
        }
    });
    
    langOptions.forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.dataset.lang;
            i18nManager.setLanguage(lang);
            updatePageLanguage();
            if (state.produtos.length > 0) {
                renderizarCards();
            }
            langMenu.hidden = true;
        });
    });
    
    updatePageLanguage();
}

// ============================================
// CONFIGURAÇÃO GLOBAL
// ============================================
const CONFIG = {
    STORAGE_KEYS: {
        ORDERS: 'fireowl_pedidos'
    },
    EMAILJS: {
        SERVICE_ID: 'service_4pe3q7q',
        TEMPLATE_ID: 'template_7pryx1l'
    },
    ANIMATION: {
        DURATION: 300,
        STAGGER: 100
    }
};

// ============================================
// ESTADO DA APLICAÇÃO
// ============================================
const state = {
    produtos: [],
    musicas: [],
    pedidos: [],
    filtros: {
        busca: '',
        marca: '',
        franquia: '',
        faixaPreco: ''
    },
    player: {
        currentTrack: 0,
        isPlaying: false
    },
    slider: {
        currentIndex: 0,
        totalSlides: 0
    },
    metrics: {
        totalProdutos: 0,
        totalMarcas: 0,
        totalFranquias: 0
    },
    catalogoTipo: 'base'
};

// ============================================
// ELEMENTOS DOM
// ============================================
const elements = {
    searchInput: document.getElementById('busca-input'),
    btnBuscar: document.getElementById('btnBuscar'),
    filtroMarca: document.getElementById('filtroMarca'),
    filtroFranquia: document.getElementById('filtroFranquia'),
    filtroFaixaPreco: document.getElementById('filtroFaixaPreco'),
    cardContainer: document.getElementById('cardContainer'),
    loadingState: document.getElementById('loadingState'),
    noResults: document.getElementById('noResults'),
    totalProdutos: document.getElementById('totalProdutos'),
    totalMarcas: document.getElementById('totalMarcas'),
    totalFranquias: document.getElementById('totalFranquias'),
    sliderTrack: document.getElementById('sliderTrack'),
    sliderPrev: document.getElementById('sliderPrev'),
    sliderNext: document.getElementById('sliderNext'),
    sliderDots: document.getElementById('sliderDots'),
    mpToggle: document.getElementById('mpToggle'),
    mpContent: document.getElementById('mpContent'),
    mpClose: document.getElementById('mpClose'),
    mpTitle: document.getElementById('mpTitle'),
    mpArtist: document.getElementById('mpArtist'),
    mpPlay: document.getElementById('mpPlay'),
    mpPrev: document.getElementById('mpPrev'),
    mpNext: document.getElementById('mpNext'),
    mpProgress: document.getElementById('mpProgress'),
    mpCurrent: document.getElementById('mpCurrent'),
    mpDuration: document.getElementById('mpDuration'),
    mpVolume: document.getElementById('mpVolume'),
    modalVisualizar: document.getElementById('modalVisualizar'),
    modalBody: document.getElementById('modalBody'),
    modalClose: document.getElementById('modalClose'),
    orderToggle: document.getElementById('orderToggle'),
    orderContent: document.getElementById('orderContent'),
    orderClose: document.getElementById('orderClose'),
    orderForm: document.getElementById('orderForm'),
    orderMessages: document.getElementById('orderMessages'),
    orderBadge: document.getElementById('orderBadge'),
    pedProduto: document.getElementById('pedProduto'),
    pedQuantidade: document.getElementById('pedQuantidade'),
    pedNome: document.getElementById('pedNome'),
    pedEmail: document.getElementById('pedEmail'),
    pedMensagem: document.getElementById('pedMensagem'),
    orderSubmit: document.getElementById('orderSubmit'),
    orderStatus: document.getElementById('orderStatus'),
    tabBase: document.getElementById('tabBase'),
    tabPremium: document.getElementById('tabPremium'),
    filterToggle: document.getElementById('filterToggle'),
    filterDropdown: document.getElementById('filterDropdown')
};

// ============================================
// AUDIO PLAYER
// ============================================
const audio = new Audio();
audio.volume = 0.3;

// ============================================
// DADOS FALLBACK
// ============================================
const fallbackData = {
    produtos: [
        {
            id: 1,
            nome: 'Hulkbuster XM Studios',
            marca: 'XM Studios',
            franquia: 'Marvel',
            descricao: 'Estátua premium do Hulkbuster em escala 1/4 com detalhes extraordinários e base temática.',
            preco: 49990.00,
            imagem: 'https://via.placeholder.com/400x500/1a1a1a/D4AF37?text=Hulkbuster',
            link: '#',
            estoque: 1,
            destaque: true
        },
        {
            id: 2,
            nome: 'Iron Man Mark LXXXV',
            marca: 'Hot Toys',
            franquia: 'Marvel',
            descricao: 'Action figure 1/6 scale do Iron Man Mark 85 com LED e acessórios.',
            preco: 3299.00,
            imagem: 'https://via.placeholder.com/400x500/1a1a1a/D4AF37?text=Iron+Man',
            link: '#',
            estoque: 3,
            destaque: false
        }
    ],
    musicas: [
        { titulo: 'Epic Cinematic', artista: 'Audio Library', arquivo: 'musicas/track01.mp3' },
        { titulo: 'Dark Ambient', artista: 'Background Music', arquivo: 'musicas/track02.mp3' }
    ]
};

// ============================================
// UTILITÁRIOS
// ============================================
const utils = {
    formatCurrency(value) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    },

    formatTime(seconds) {
        if (isNaN(seconds) || !isFinite(seconds)) return '0:00';
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return `${m}:${s.toString().padStart(2, '0')}`;
    },

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
};

// ============================================
// CARREGAMENTO DE DADOS
// ============================================
async function carregarDados() {
    try {
        showLoading(true);
        const response = await fetch('data.json');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const json = await response.json();
        
        if (Array.isArray(json)) {
            state.produtos = json;
            state.musicas = [];
        } else {
            state.produtos = json.produtos || json.dados || [];
            state.musicas = json.musicas || [];
        }
        
        if (state.produtos.length === 0) state.produtos = fallbackData.produtos;
        if (state.musicas.length === 0) state.musicas = fallbackData.musicas;
        
        calcularMetricas();
        preencherFiltros();
        preencherSelectPedidos();
        renderizarSlider();
        renderizarCards();
        
        if (state.musicas.length > 0) loadTrack(0);
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
        state.produtos = fallbackData.produtos;
        state.musicas = fallbackData.musicas;
        calcularMetricas();
        preencherFiltros();
        preencherSelectPedidos();
        renderizarSlider();
        renderizarCards();
    } finally {
        showLoading(false);
    }
}

function calcularMetricas() {
    const marcas = new Set(state.produtos.map(p => p.marca).filter(Boolean));
    const franquias = new Set(state.produtos.map(p => p.franquia).filter(Boolean));
    state.metrics = {
        totalProdutos: state.produtos.reduce((acc, p) => acc + (p.estoque || 1), 0),
        totalMarcas: marcas.size,
        totalFranquias: franquias.size
    };
    atualizarStats();
}

function atualizarStats() {
    animateNumber(elements.totalProdutos, state.metrics.totalProdutos);
    animateNumber(elements.totalMarcas, state.metrics.totalMarcas);
    animateNumber(elements.totalFranquias, state.metrics.totalFranquias);
}

function animateNumber(element, target) {
    if (!element) return;
    const duration = 1000;
    const start = 0;
    const startTime = performance.now();
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(start + (target - start) * easeOut);
        element.textContent = current.toLocaleString('pt-BR');
        if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
}

// ============================================
// FILTROS
// ============================================
function preencherFiltros() {
    const marcas = [...new Set(state.produtos.map(p => p.marca).filter(Boolean))].sort();
    const franquias = [...new Set(state.produtos.map(p => p.franquia).filter(Boolean))].sort();
    
    elements.filtroMarca.innerHTML = '<option value="">Todas as Marcas</option>';
    marcas.forEach(marca => {
        const opt = document.createElement('option');
        opt.value = marca;
        opt.textContent = marca;
        elements.filtroMarca.appendChild(opt);
    });
    
    elements.filtroFranquia.innerHTML = '<option value="">Todas as Franquias</option>';
    franquias.forEach(franquia => {
        const opt = document.createElement('option');
        opt.value = franquia;
        opt.textContent = franquia;
        elements.filtroFranquia.appendChild(opt);
    });
}

function aplicarFiltros() {
    let filtrados = [...state.produtos];
    if (state.filtros.busca) {
        const termo = state.filtros.busca.toLowerCase().trim();
        filtrados = filtrados.filter(p =>
            (p.nome && p.nome.toLowerCase().includes(termo)) ||
            (p.descricao && p.descricao.toLowerCase().includes(termo)) ||
            (p.marca && p.marca.toLowerCase().includes(termo)) ||
            (p.franquia && p.franquia.toLowerCase().includes(termo))
        );
    }
    if (state.filtros.marca) filtrados = filtrados.filter(p => p.marca === state.filtros.marca);
    if (state.filtros.franquia) filtrados = filtrados.filter(p => p.franquia === state.filtros.franquia);
    if (state.filtros.faixaPreco) {
        filtrados = filtrados.filter(p => {
            const preco = p.preco || 0;
            switch(state.filtros.faixaPreco) {
                case '0-1000': return preco <= 1000;
                case '1000-5000': return preco > 1000 && preco <= 5000;
                case '5000-10000': return preco > 5000 && preco <= 10000;
                case '10000+': return preco > 10000;
                default: return true;
            }
        });
    }
    if (state.catalogoTipo === 'premium') {
        filtrados = filtrados.filter(p => p.destaque === true);
    }
    renderizarCards(filtrados);
}

// ============================================
// RENDERIZAÇÃO DE CARDS
// ============================================
function renderizarCards(produtos) {
    if (!elements.cardContainer) return;
    if (!produtos) {
        let filtrados = [...state.produtos];
        if (state.catalogoTipo === 'premium') {
            filtrados = filtrados.filter(p => p.destaque === true);
        }
        produtos = filtrados;
    }
    elements.cardContainer.innerHTML = '';
    if (produtos.length === 0) {
        showNoResults(true);
        return;
    }
    showNoResults(false);
    const fragment = document.createDocumentFragment();
    produtos.forEach((produto, index) => {
        const card = criarCard(produto, index);
        fragment.appendChild(card);
    });
    elements.cardContainer.appendChild(fragment);
}

function criarCard(produto, index) {
    const article = document.createElement('article');
    article.className = 'card';
    article.style.animationDelay = `${index * CONFIG.ANIMATION.STAGGER}ms`;
    const precoFormatado = utils.formatCurrency(produto.preco || 0);
    const estoqueInfo = produto.estoque ? `• ${produto.estoque} unid.` : '';
    article.innerHTML = `
        ${produto.imagem ? `<img src="${produto.imagem}" alt="${utils.escapeHtml(produto.nome)}" class="card-image" loading="lazy">` : ''}
        <div class="card-content">
            <div class="card-header">
                <h3 class="card-title">${utils.escapeHtml(produto.nome)}</h3>
                ${produto.marca ? `<p class="card-subtitle">${utils.escapeHtml(produto.marca)}</p>` : ''}
            </div>
            <p class="card-description">${utils.escapeHtml(produto.descricao || '')}</p>
            <div class="card-meta">
                ${produto.franquia ? `<span class="card-meta-item">🎬 ${utils.escapeHtml(produto.franquia)}</span>` : ''}
                ${estoqueInfo ? `<span class="card-meta-item">📦 ${estoqueInfo}</span>` : ''}
            </div>
            <div class="card-price">${precoFormatado}</div>
            <div class="card-actions">
                <button class="card-btn card-btn-primary" onclick="abrirVisualizacao('${produto.id}')">Visualizar</button>
                <button class="card-btn card-btn-secondary" onclick="abrirPedido('${utils.escapeHtml(produto.nome)}')">Efetuar Pedido</button>
            </div>
        </div>
    `;
    return article;
}

function showLoading(show) {
    if (elements.loadingState) elements.loadingState.hidden = !show;
}
function showNoResults(show) {
    if (elements.noResults) elements.noResults.hidden = !show;
    if (elements.cardContainer) elements.cardContainer.style.display = show ? 'none' : 'grid';
}

// ============================================
// SLIDER
// ============================================
function renderizarSlider() {
    if (!elements.sliderTrack) return;
    const produtos = state.produtos;
    if (produtos.length === 0) return;
    state.slider.totalSlides = produtos.length;
    
    elements.sliderTrack.innerHTML = '';
    produtos.forEach((produto) => {
        const slide = document.createElement('div');
        slide.className = 'slide';
        const preco = utils.formatCurrency(produto.preco || 0);
        slide.innerHTML = `
            <img src="${produto.imagem}" alt="${utils.escapeHtml(produto.nome)}" class="slide-image" loading="lazy">
            <div class="slide-info">
                <h2 class="slide-title">${utils.escapeHtml(produto.nome)}</h2>
                <p class="slide-marca">${utils.escapeHtml(produto.marca || '')}</p>
                <p class="slide-desc">${utils.escapeHtml(produto.descricao || '')}</p>
                <p class="slide-price">${preco}</p>
                <div class="slide-actions">
                    <button class="slide-btn slide-btn-primary" onclick="abrirVisualizacao('${produto.id}')">Visualizar</button>
                    <button class="slide-btn slide-btn-secondary" onclick="abrirPedido('${utils.escapeHtml(produto.nome)}')">Efetuar Pedido</button>
                </div>
            </div>
        `;
        elements.sliderTrack.appendChild(slide);
    });
    
    elements.sliderDots.innerHTML = '';
    for (let i = 0; i < state.slider.totalSlides; i++) {
        const dot = document.createElement('button');
        dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
        dot.dataset.index = i;
        dot.setAttribute('aria-label', `Ir para slide ${i+1}`);
        dot.addEventListener('click', () => moverSlider(i));
        elements.sliderDots.appendChild(dot);
    }
    
    moverSlider(0);
}

function moverSlider(index) {
    const total = state.slider.totalSlides;
    if (total === 0) return;
    index = (index + total) % total;
    state.slider.currentIndex = index;
    const offset = -index * 100;
    if (elements.sliderTrack) {
        elements.sliderTrack.style.transform = `translateX(${offset}%)`;
    }
    const dots = elements.sliderDots.querySelectorAll('.slider-dot');
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
}

// ============================================
// MODAL DE VISUALIZAÇÃO
// ============================================
function abrirVisualizacao(id) {
    const produto = state.produtos.find(p => p.id == id);
    if (!produto) return;
    const modal = elements.modalVisualizar;
    const body = elements.modalBody;
    if (!modal || !body) return;
    const preco = utils.formatCurrency(produto.preco || 0);
    body.innerHTML = `
        <img src="${produto.imagem}" alt="${utils.escapeHtml(produto.nome)}">
        <h2>${utils.escapeHtml(produto.nome)}</h2>
        <p class="marca">${utils.escapeHtml(produto.marca || '')}</p>
        <p class="desc">${utils.escapeHtml(produto.descricao || '')}</p>
        <p class="preco">${preco}</p>
        <div style="display:flex; gap:var(--spacing-md); margin-top:var(--spacing-md);">
            <button class="slide-btn slide-btn-primary" onclick="fecharModalVisualizacao(); abrirPedido('${utils.escapeHtml(produto.nome)}')">Efetuar Pedido</button>
            <button class="slide-btn slide-btn-secondary" onclick="fecharModalVisualizacao()">Fechar</button>
        </div>
    `;
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
}

function fecharModalVisualizacao() {
    if (elements.modalVisualizar) elements.modalVisualizar.hidden = true;
    document.body.style.overflow = '';
}

// ============================================
// MINI PLAYER
// ============================================
function loadTrack(index) {
    if (!state.musicas || state.musicas.length === 0) {
        updatePlayerInfo('Nenhuma música', '—');
        return;
    }
    state.player.currentTrack = (index + state.musicas.length) % state.musicas.length;
    const track = state.musicas[state.player.currentTrack];
    audio.src = track.arquivo;
    updatePlayerInfo(track.titulo || 'Sem título', track.artista || 'Desconhecido');
    elements.mpProgress.value = 0;
    elements.mpCurrent.textContent = '0:00';
    openPlayer();
    if (state.player.isPlaying) playAudio();
}

function updatePlayerInfo(title, artist) {
    if (elements.mpTitle) elements.mpTitle.textContent = title;
    if (elements.mpArtist) elements.mpArtist.textContent = artist;
}

function togglePlay() {
    if (!state.musicas || state.musicas.length === 0) return;
    if (audio.paused) playAudio(); else pauseAudio();
}

function playAudio() {
    audio.play().then(() => {
        state.player.isPlaying = true;
        if (elements.mpPlay) elements.mpPlay.textContent = '⏸';
    }).catch(err => {
        console.warn('Erro ao reproduzir:', err);
        state.player.isPlaying = false;
        if (elements.mpPlay) elements.mpPlay.textContent = '▶';
    });
}

function pauseAudio() {
    audio.pause();
    state.player.isPlaying = false;
    if (elements.mpPlay) elements.mpPlay.textContent = '▶';
}

function nextTrack() { loadTrack(state.player.currentTrack + 1); }
function prevTrack() { loadTrack(state.player.currentTrack - 1); }

function openPlayer() {
    if (elements.mpContent) elements.mpContent.hidden = false;
    if (elements.mpToggle) elements.mpToggle.classList.add('active');
}

function closePlayer() {
    if (elements.mpContent) elements.mpContent.hidden = true;
    if (elements.mpToggle) elements.mpToggle.classList.remove('active');
}

// ============================================
// HUB DE PEDIDOS
// ============================================
function carregarPedidos() {
    try {
        const stored = localStorage.getItem(CONFIG.STORAGE_KEYS.ORDERS);
        state.pedidos = stored ? JSON.parse(stored) : [];
        atualizarBadgePedidos();
    } catch (error) {
        console.error('Erro ao carregar pedidos:', error);
        state.pedidos = [];
    }
}

function preencherSelectPedidos() {
    if (!elements.pedProduto) return;
    elements.pedProduto.innerHTML = '<option value="">Selecione o produto *</option>';
    state.produtos.forEach(produto => {
        const opt = document.createElement('option');
        opt.value = produto.nome;
        opt.textContent = produto.nome;
        elements.pedProduto.appendChild(opt);
    });
}

function renderizarPedidos() {
    if (!elements.orderMessages) return;
    if (state.pedidos.length === 0) {
        elements.orderMessages.innerHTML = `
            <div class="order-empty">
                <p>Nenhum pedido ainda.</p>
                <p class="order-hint">Faça seu pedido agora!</p>
            </div>
        `;
        return;
    }
    const fragment = document.createDocumentFragment();
    state.pedidos.slice().reverse().forEach(ped => {
        const item = document.createElement('div');
        item.className = 'order-item';
        item.innerHTML = `
            <div class="order-item-header">
                <span class="order-author">${utils.escapeHtml(ped.nome)}</span>
                <span class="order-product">${utils.escapeHtml(ped.produto)} x${ped.quantidade}</span>
            </div>
            <div class="order-text">${utils.escapeHtml(ped.mensagem || '')}</div>
        `;
        fragment.appendChild(item);
    });
    elements.orderMessages.innerHTML = '';
    elements.orderMessages.appendChild(fragment);
}

function atualizarBadgePedidos() {
    if (!elements.orderBadge) return;
    const count = state.pedidos.length;
    if (count > 0) {
        elements.orderBadge.textContent = count > 99 ? '99+' : count;
        elements.orderBadge.hidden = false;
    } else {
        elements.orderBadge.hidden = true;
    }
}

function openOrderHub() {
    if (elements.orderContent) elements.orderContent.hidden = false;
    if (elements.orderToggle) {
        elements.orderToggle.classList.add('active');
        elements.orderToggle.setAttribute('aria-expanded', 'true');
    }
    renderizarPedidos();
}

function closeOrderHub() {
    if (elements.orderContent) elements.orderContent.hidden = true;
    if (elements.orderToggle) {
        elements.orderToggle.classList.remove('active');
        elements.orderToggle.setAttribute('aria-expanded', 'false');
    }
}

function validarPedido() {
    let valido = true;
    const campos = [
        { id: 'pedProduto', err: 'errProduto', msg: 'Selecione um produto', validate: v => v.trim() !== '' },
        { id: 'pedQuantidade', err: 'errQuantidade', msg: 'Quantidade mínima 1', validate: v => parseInt(v) >= 1 },
        { id: 'pedNome', err: 'errNomePed', msg: 'Nome é obrigatório', validate: v => v.trim().length >= 2 },
        { id: 'pedEmail', err: 'errEmailPed', msg: 'Email válido é obrigatório', validate: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) }
    ];
    campos.forEach(({ id, err, msg, validate }) => {
        const el = document.getElementById(id);
        const errEl = document.getElementById(err);
        if (!el || !errEl) return;
        const val = el.value.trim();
        if (!validate(val)) {
            el.classList.add('error');
            errEl.textContent = msg;
            valido = false;
        } else {
            el.classList.remove('error');
            errEl.textContent = '';
        }
    });
    return valido;
}

async function enviarPedido(pedido) {
    const templateParams = {
        from_name: pedido.nome,
        from_email: pedido.email,
        produto: pedido.produto,
        quantidade: pedido.quantidade,
        mensagem: pedido.mensagem || 'Sem mensagem adicional',
        datetime: new Date().toLocaleString('pt-BR'),
        to_email: 'contato@fireowlcollectibles.com'
    };
    try {
        if (typeof emailjs !== 'undefined') {
            await emailjs.send(CONFIG.EMAILJS.SERVICE_ID, CONFIG.EMAILJS.TEMPLATE_ID, templateParams);
            console.log('Pedido enviado por email!');
            return true;
        }
    } catch (err) {
        console.error('Erro ao enviar email:', err);
    }
    return false;
}

async function handleSubmitPedido(e) {
    e.preventDefault();
    if (!validarPedido()) return;
    
    const pedido = {
        nome: elements.pedNome.value.trim(),
        email: elements.pedEmail.value.trim(),
        produto: elements.pedProduto.value,
        quantidade: parseInt(elements.pedQuantidade.value) || 1,
        mensagem: elements.pedMensagem.value.trim(),
        data: new Date().toISOString()
    };
    
    elements.orderSubmit.disabled = true;
    elements.orderSubmit.textContent = 'Enviando...';
    elements.orderStatus.textContent = '';
    elements.orderStatus.className = 'form-status';
    
    const enviado = await enviarPedido(pedido);
    
    state.pedidos.push(pedido);
    localStorage.setItem(CONFIG.STORAGE_KEYS.ORDERS, JSON.stringify(state.pedidos));
    renderizarPedidos();
    atualizarBadgePedidos();
    
    elements.orderForm.reset();
    elements.orderSubmit.disabled = false;
    elements.orderSubmit.textContent = 'Fazer Pedido';
    
    elements.orderStatus.textContent = enviado ? '✓ Pedido enviado com sucesso!' : '✓ Pedido salvo localmente';
    elements.orderStatus.className = 'form-status success';
    setTimeout(() => {
        elements.orderStatus.textContent = '';
        elements.orderStatus.className = 'form-status';
    }, 4000);
}

function abrirPedido(produtoNome) {
    openOrderHub();
    if (elements.pedProduto) elements.pedProduto.value = produtoNome;
    setTimeout(() => {
        if (elements.pedQuantidade) elements.pedQuantidade.focus();
    }, 300);
}

// ============================================
// CATÁLOGO - TABS
// ============================================
function alternarCatalogo(tipo) {
    state.catalogoTipo = tipo;
    if (elements.tabBase) elements.tabBase.classList.toggle('active', tipo === 'base');
    if (elements.tabPremium) elements.tabPremium.classList.toggle('active', tipo === 'premium');
    aplicarFiltros();
}

// ============================================
// EVENT LISTENERS
// ============================================
function setupEventListeners() {
    // Busca
    if (elements.btnBuscar) elements.btnBuscar.addEventListener('click', handleBuscar);
    if (elements.searchInput) {
        elements.searchInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleBuscar(); });
        const debouncedSearch = utils.debounce((value) => {
            state.filtros.busca = value;
            aplicarFiltros();
        }, 300);
        elements.searchInput.addEventListener('input', (e) => debouncedSearch(e.target.value));
    }
    
    // Filtros
    if (elements.filtroMarca) elements.filtroMarca.addEventListener('change', (e) => {
        state.filtros.marca = e.target.value;
        aplicarFiltros();
    });
    if (elements.filtroFranquia) elements.filtroFranquia.addEventListener('change', (e) => {
        state.filtros.franquia = e.target.value;
        aplicarFiltros();
    });
    if (elements.filtroFaixaPreco) elements.filtroFaixaPreco.addEventListener('change', (e) => {
        state.filtros.faixaPreco = e.target.value;
        aplicarFiltros();
    });
    
    // Slider
    if (elements.sliderPrev) elements.sliderPrev.addEventListener('click', () => moverSlider(state.slider.currentIndex - 1));
    if (elements.sliderNext) elements.sliderNext.addEventListener('click', () => moverSlider(state.slider.currentIndex + 1));
    
    // Mini Player
    if (elements.mpToggle) elements.mpToggle.addEventListener('click', openPlayer);
    if (elements.mpClose) elements.mpClose.addEventListener('click', closePlayer);
    if (elements.mpPlay) elements.mpPlay.addEventListener('click', togglePlay);
    if (elements.mpNext) elements.mpNext.addEventListener('click', nextTrack);
    if (elements.mpPrev) elements.mpPrev.addEventListener('click', prevTrack);
    if (elements.mpProgress) {
        elements.mpProgress.addEventListener('input', (e) => {
            if (audio.duration) audio.currentTime = (e.target.value / 100) * audio.duration;
        });
    }
    if (elements.mpVolume) {
        elements.mpVolume.addEventListener('input', (e) => {
            audio.volume = parseFloat(e.target.value);
        });
    }
    
    // Order Hub
    if (elements.orderToggle) elements.orderToggle.addEventListener('click', openOrderHub);
    if (elements.orderClose) elements.orderClose.addEventListener('click', closeOrderHub);
    if (elements.orderForm) elements.orderForm.addEventListener('submit', handleSubmitPedido);
    
    // Modal Visualização
    if (elements.modalClose) elements.modalClose.addEventListener('click', fecharModalVisualizacao);
    if (elements.modalVisualizar) {
        elements.modalVisualizar.addEventListener('click', (e) => {
            if (e.target === elements.modalVisualizar) fecharModalVisualizacao();
        });
    }
    
    // Botões de catálogo
    if (elements.tabBase) elements.tabBase.addEventListener('click', () => alternarCatalogo('base'));
    if (elements.tabPremium) elements.tabPremium.addEventListener('click', () => alternarCatalogo('premium'));
    
    // Toggle do botão Filtros
    if (elements.filterToggle && elements.filterDropdown) {
        elements.filterToggle.addEventListener('click', () => {
            const isOpen = elements.filterDropdown.classList.toggle('open');
            elements.filterToggle.setAttribute('aria-expanded', isOpen);
        });
    }
    
    // Audio events
    audio.addEventListener('timeupdate', () => {
        if (audio.duration && elements.mpProgress) {
            elements.mpProgress.value = (audio.currentTime / audio.duration) * 100;
        }
        if (elements.mpCurrent) elements.mpCurrent.textContent = utils.formatTime(audio.currentTime);
    });
    audio.addEventListener('loadedmetadata', () => {
        if (elements.mpDuration) elements.mpDuration.textContent = utils.formatTime(audio.duration);
    });
    audio.addEventListener('ended', nextTrack);
    
    document.addEventListener('keydown', handleKeyboard);
    window.addEventListener('scroll', utils.throttle(handleScroll, 100));
    setupMobileMenu();
    document.addEventListener('click', handleClickOutside);
}

function handleBuscar() {
    if (elements.searchInput) state.filtros.busca = elements.searchInput.value;
    aplicarFiltros();
}

function handleKeyboard(e) {
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;
    switch(e.code) {
        case 'Space': e.preventDefault(); togglePlay(); break;
        case 'ArrowRight': e.preventDefault(); nextTrack(); break;
        case 'ArrowLeft': e.preventDefault(); prevTrack(); break;
        case 'Escape': closeOrderHub(); closePlayer(); fecharModalVisualizacao(); break;
    }
}

function handleScroll() {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    }
}

function setupMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    if (!menuBtn || !navLinks) return;
    menuBtn.addEventListener('click', () => {
        menuBtn.classList.toggle('active');
        navLinks.classList.toggle('active');
        menuBtn.setAttribute('aria-expanded', navLinks.classList.contains('active'));
    });
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            menuBtn.classList.remove('active');
            navLinks.classList.remove('active');
            menuBtn.setAttribute('aria-expanded', 'false');
        });
    });
}

function handleClickOutside(e) {
    if (elements.mpContent && !elements.mpContent.hidden) {
        const isInside = elements.mpContent.contains(e.target) || elements.mpToggle.contains(e.target);
        if (!isInside) closePlayer();
    }
    if (elements.orderContent && !elements.orderContent.hidden) {
        const isInside = elements.orderContent.contains(e.target) || elements.orderToggle.contains(e.target);
        if (!isInside) closeOrderHub();
    }
}

// ============================================
// INICIALIZAÇÃO
// ============================================
function init() {
    initLanguageSelector();
    carregarPedidos();
    setupEventListeners();
    carregarDados();
    alternarCatalogo('base');
    console.log('Fire Owl Collectibles - Sistema inicializado com sucesso! 🦅');
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

window.abrirPedido = abrirPedido;
window.abrirVisualizacao = abrirVisualizacao;
window.fecharModalVisualizacao = fecharModalVisualizacao;
window.moverSlider = moverSlider;
window.alternarCatalogo = alternarCatalogo;