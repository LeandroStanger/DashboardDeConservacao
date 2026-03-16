// ============================================================================
// Variável global que armazenará os dados carregados do JSON
// ============================================================================
let animaisExtincao = [];
let chartInstance = null;

// ============================================================================
// Função para carregar os dados do arquivo JSON
// ============================================================================
async function carregarDados() {
    try {
        const response = await fetch('dados.json');
        if (!response.ok) throw new Error('Erro ao carregar dados');
        animaisExtincao = await response.json();
        // Após carregar, inicializa o sistema
        init();
    } catch (error) {
        console.error('Falha ao carregar dados:', error);
        document.getElementById('conteudo').innerHTML = '<p style="color: var(--risk-6);">Erro ao carregar dados. Verifique o console.</p>';
    }
}

// ============================================================================
// UTILITÁRIOS
// ============================================================================
function formatNumber(value) {
    const num = Number(value);
    return isNaN(num) ? '0' : num.toLocaleString();
}

// Função que retorna nível de risco de 0 a 10 baseado em anos restantes
function getRiskLevel(anos) {
    const a = parseInt(anos);
    if (a >= 10) return 0;
    if (a >= 9) return 1;
    if (a >= 8) return 2;
    if (a >= 7) return 3;
    if (a >= 6) return 4;
    if (a >= 5) return 5;
    if (a >= 4) return 6;
    if (a >= 3) return 7;
    if (a >= 2) return 8;
    if (a >= 1) return 9;
    return 10;
}

// Mantém getStatus para compatibilidade com filtros e exibição textual
function getStatus(anos) {
    const a = parseInt(anos);
    if (a <= 3) return { text: 'Crítico', class: 'status-critico' };
    if (a <= 5) return { text: 'Alto', class: 'status-alto' };
    if (a <= 8) return { text: 'Moderado', class: 'status-moderado' };
    return { text: 'Baixo', class: 'status-baixo' };
}

// ============================================================================
// ATUALIZAÇÃO DE INDICADORES E ALERTA CRÍTICO
// ============================================================================
function updateIndicators() {
    document.getElementById('totalSpecies').textContent = animaisExtincao.length;
    const totalPop = animaisExtincao.reduce((acc, cur) => acc + cur.quantidade, 0);
    document.getElementById('totalPopulation').textContent = formatNumber(totalPop);
    const avg = animaisExtincao.reduce((acc, cur) => acc + parseInt(cur.anosRestantes || 0), 0) / animaisExtincao.length;
    document.getElementById('avgYears').textContent = avg.toFixed(1);
    const critical = animaisExtincao.filter(a => parseInt(a.anosRestantes) <= 3).length;
    document.getElementById('criticalCount').textContent = critical;
}

function updateCriticalAlert() {
    const criticalAnimals = animaisExtincao.filter(a => a.quantidade < 1000);
    const container = document.getElementById('criticalList');
    if (criticalAnimals.length) {
        container.innerHTML = criticalAnimals.map(a => `<span class="critical-item">${a.nome} (${a.quantidade})</span>`).join('');
    } else {
        container.innerHTML = '<p>Nenhuma espécie com população abaixo de 1000.</p>';
    }
}

// ============================================================================
// GRÁFICO DE DISTRIBUIÇÃO DE RISCO
// ============================================================================
function criarGraficoRisco() {
    const ctx = document.getElementById('riskChart').getContext('2d');
    if (chartInstance) chartInstance.destroy();

    const categorias = {
        'Crítico (0-3 anos)': animaisExtincao.filter(a => parseInt(a.anosRestantes) <= 3).length,
        'Alto (4-5 anos)': animaisExtincao.filter(a => parseInt(a.anosRestantes) >= 4 && parseInt(a.anosRestantes) <= 5).length,
        'Moderado (6-8 anos)': animaisExtincao.filter(a => parseInt(a.anosRestantes) >= 6 && parseInt(a.anosRestantes) <= 8).length,
        'Baixo (9-10 anos)': animaisExtincao.filter(a => parseInt(a.anosRestantes) >= 9).length,
    };

    chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(categorias),
            datasets: [{
                data: Object.values(categorias),
                backgroundColor: ['#b91c1c', '#f97316', '#fbbf24', '#059669'],
                borderColor: 'transparent',
                hoverOffset: 8,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { labels: { color: 'white', font: { size: 12 } } },
                tooltip: { backgroundColor: '#1f2830', titleColor: 'white', bodyColor: '#cbd5e1' }
            }
        }
    });
}

// ============================================================================
// RENDERIZAÇÃO DOS CARDS E FILTROS
// ============================================================================
function createCard(animal) {
    const card = document.createElement('article');
    card.className = 'card';
    const riskLevel = getRiskLevel(animal.anosRestantes);
    const riskClass = `risk-level-${riskLevel}`;
    
    card.innerHTML = `
        <div class="card-header">
            <h3>${animal.nome}</h3>
            <span class="bioma">${animal.bioma}</span>
        </div>
        <div class="card-body">
            <div class="info-row"><span class="info-label">População</span><span class="info-value">${formatNumber(animal.quantidade)}</span></div>
            <div class="info-row"><span class="info-label">Perda por ano</span><span class="info-value">${formatNumber(animal.percaPorAno)}</span></div>
            <div class="info-row"><span class="info-label">Restante da espécie</span><span class="info-value">${formatNumber(animal.quantosRestam)}</span></div>
            <div class="info-row"><span class="info-label">Anos restantes</span><span class="risk-badge ${riskClass}">${animal.anosRestantes}</span></div>
        </div>
        <div class="card-footer"><span>Análise: ${animal.anoAnalise}</span></div>
    `;
    return card;
}

function renderCards(filteredArray) {
    const container = document.getElementById('cardsContainer');
    container.innerHTML = '';
    if (!filteredArray.length) {
        container.innerHTML = '<p class="no-results">Nenhum animal encontrado.</p>';
    } else {
        const fragment = document.createDocumentFragment();
        filteredArray.forEach(animal => fragment.appendChild(createCard(animal)));
        container.appendChild(fragment);
    }
    document.getElementById('totalCount').textContent = animaisExtincao.length;
    document.getElementById('displayedCount').textContent = filteredArray.length;
}

let filteredData = [];

function getSelectedStatuses() {
    const checkboxes = document.querySelectorAll('.status-filter input[type="checkbox"]:checked');
    return Array.from(checkboxes).map(cb => cb.value);
}

function applyFilters() {
    const searchTerm = document.getElementById('search').value.trim().toLowerCase();
    const bioma = document.getElementById('biomaFilter').value;
    const selectedStatuses = getSelectedStatuses();

    return animaisExtincao.filter(animal => {
        const matchesName = animal.nome.toLowerCase().includes(searchTerm);
        const matchesBioma = bioma === 'todos' || animal.bioma === bioma;
        const status = getStatus(animal.anosRestantes).text;
        const matchesStatus = selectedStatuses.length === 0 ? false : selectedStatuses.includes(status);
        return matchesName && matchesBioma && matchesStatus;
    });
}

let searchTimeout;
function filterAnimals() {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        filteredData = applyFilters();
        renderCards(filteredData);
        renderTableWithData(filteredData);
    }, 300);
}

function clearFilters() {
    document.getElementById('search').value = '';
    document.getElementById('biomaFilter').value = 'todos';
    document.querySelectorAll('.status-filter input[type="checkbox"]').forEach(cb => cb.checked = true);
    filteredData = animaisExtincao;
    renderCards(filteredData);
    renderTableWithData(filteredData);
}

function populateBiomaFilter() {
    const biomas = [...new Set(animaisExtincao.map(a => a.bioma))].sort();
    const select = document.getElementById('biomaFilter');
    biomas.forEach(bioma => {
        const option = document.createElement('option');
        option.value = bioma;
        option.textContent = bioma;
        select.appendChild(option);
    });
}

// ============================================================================
// ANÁLISES ORIGINAIS E ADICIONAIS (interface)
// ============================================================================
function renderOriginalAnalysis() {
    let maisDe2000 = animaisExtincao.filter(x => x.quantidade < 2000);
    let busca = animaisExtincao.filter(x => x.nome.toUpperCase() === "PANDA-GIGANTE");
    let anos = animaisExtincao.map(x => x.anoAnalise);

    const container = document.getElementById('originalAnalysis');
    container.innerHTML = `
        <div class="analysis-card">
            <h3>Menos de 2000 indivíduos</h3>
            <div class="analysis-content">${maisDe2000.length ? maisDe2000.map(a => a.nome).join(', ') : 'Nenhum'}</div>
        </div>
        <div class="analysis-card">
            <h3>Panda-gigante</h3>
            <div class="analysis-content">${busca.length ? '<span class="badge-found">✓ Encontrado</span>' : '<span class="badge-notfound">✗ Não encontrado</span>'}</div>
        </div>
        <div class="analysis-card">
            <h3>Novos animais adicionados</h3>
            <div class="analysis-content">${animaisExtincao.slice(-13).map(a => a.nome).join(', ')}</div>
        </div>
        <div class="analysis-card">
            <h3>Ano da análise</h3>
            <div class="analysis-content">${anos[0] || '2025'}</div>
        </div>
    `;
}

function renderAdditionalAnalysis() {
    const biomaFloresta = animaisExtincao.filter(a => a.bioma.toUpperCase() === 'FLORESTA');
    const especiesMenos1000 = animaisExtincao.filter(a => a.quantidade < 1000);
    const mediaPop = animaux => animaux.reduce((acc, a) => acc + a.quantidade, 0) / animaux.length;
    const micoPresente = animaisExtincao.some(a => a.nome.toUpperCase() === 'MICO-LEÃO-DOURADO');

    const container = document.getElementById('additionalAnalysis');
    container.innerHTML = `
        <div class="analysis-card">
            <h3>Bioma Floresta</h3>
            <div class="analysis-content">${biomaFloresta.length ? biomaFloresta.map(a => a.nome).join(', ') : 'Nenhum'}</div>
        </div>
        <div class="analysis-card">
            <h3>Menos de 1000 indivíduos</h3>
            <div class="analysis-content">
                ${especiesMenos1000.length ? especiesMenos1000.map(a => a.nome).join(', ') : 'Nenhuma espécie'}
            </div>
        </div>
        <div class="analysis-card">
            <h3>Média populacional</h3>
            <div class="analysis-content">${formatNumber(mediaPop(animaisExtincao))}</div>
        </div>
        <div class="analysis-card">
            <h3>Mico-leão-dourado</h3>
            <div class="analysis-content">${micoPresente ? '<span class="badge-found">✓ Presente</span>' : '<span class="badge-notfound">✗ Ausente</span>'}</div>
        </div>
    `;
}

// ============================================================================
// SISTEMA DE EXEMPLOS INTERATIVOS
// ============================================================================
function createMethodCard(method) {
    const card = document.createElement('div');
    card.className = 'method-card';
    card.innerHTML = `
        <h4>${method}()</h4>
        <button class="example-toggle" data-method="${method}"><i class="fas fa-code"></i> Mostrar exemplo</button>
        <div class="example-content" id="example-${method}" style="display: none;"></div>
    `;
    return card;
}

function renderMethodExamples() {
    const methods = ['map', 'filter', 'reduce', 'push', 'slice', 'forEach', 'some', 'includes'];
    const container = document.getElementById('methodsContainer');
    container.innerHTML = '';
    methods.forEach(method => {
        container.appendChild(createMethodCard(method));
    });

    document.querySelectorAll('.example-toggle').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const method = e.currentTarget.dataset.method;
            const contentDiv = document.getElementById(`example-${method}`);
            if (contentDiv.style.display === 'none' || contentDiv.style.display === '') {
                contentDiv.style.display = 'block';
                contentDiv.innerHTML = generateExampleContent(method);
                e.currentTarget.innerHTML = '<i class="fas fa-eye-slash"></i> Ocultar exemplo';
            } else {
                contentDiv.style.display = 'none';
                e.currentTarget.innerHTML = '<i class="fas fa-code"></i> Mostrar exemplo';
            }
        });
    });
}

function generateExampleContent(method) {
    const animais = animaisExtincao;
    switch (method) {
        case 'map': {
            const original = animais.map(a => a.nome).slice(0, 5);
            const transformed = animais.map(a => `O animal ${a.nome} vive no bioma ${a.bioma}.`).slice(0, 5);
            return `
                <p><strong>Código:</strong> <code>animais.map(a => \`O animal \${a.nome} vive no bioma \${a.bioma}.\`)</code></p>
                <div class="data-comparison">
                    <div class="data-box">
                        <h5>Nomes originais (5 primeiros):</h5>
                        <pre>${JSON.stringify(original, null, 2)}</pre>
                    </div>
                    <div class="data-box">
                        <h5>Frases geradas (5 primeiras):</h5>
                        <pre>${JSON.stringify(transformed, null, 2)}</pre>
                    </div>
                </div>
                <p><i class="fas fa-info-circle"></i> O método <code>map()</code> cria um novo array aplicando uma função a cada elemento.</p>
            `;
        }
        case 'filter': {
            const filtered = animais.filter(a => a.bioma.toUpperCase() === 'OCEANO');
            return `
                <p><strong>Código:</strong> <code>animais.filter(a => a.bioma.toUpperCase() === 'OCEANO')</code></p>
                <p><strong>Espécies no bioma Oceano:</strong> ${filtered.map(a => a.nome).join(', ') || 'Nenhuma'}</p>
                <p><i class="fas fa-info-circle"></i> <code>filter()</code> retorna apenas elementos que satisfazem a condição.</p>
            `;
        }
        case 'reduce': {
            const soma = animais.reduce((acc, a) => acc + a.quantidade, 0);
            const media = soma / animais.length;
            return `
                <p><strong>Código (soma):</strong> <code>animais.reduce((acc, a) => acc + a.quantidade, 0)</code></p>
                <p><strong>Soma total da população:</strong> ${soma.toLocaleString()}</p>
                <p><strong>Média populacional:</strong> ${media.toFixed(2).toLocaleString()}</p>
                <p><i class="fas fa-info-circle"></i> <code>reduce()</code> acumula valores e retorna um único resultado.</p>
            `;
        }
        case 'push': {
            const copia = [...animais];
            const novo = { nome: 'Exemplo (simulação)', bioma: 'Teste', quantidade: 100, anosRestantes: '5' };
            copia.push(novo);
            return `
                <p><strong>Código:</strong> <code>array.push(novoElemento)</code></p>
                <p><strong>Antes:</strong> ${animais.length} elementos</p>
                <p><strong>Depois:</strong> ${copia.length} elementos (adicionado "${novo.nome}")</p>
                <p><i class="fas fa-info-circle"></i> <code>push()</code> adiciona um elemento ao final do array (simulação).</p>
            `;
        }
        case 'slice': {
            const sliced = animais.slice(0, 3).map(a => a.nome);
            return `
                <p><strong>Código:</strong> <code>animais.slice(0, 3).map(a => a.nome)</code></p>
                <p><strong>Primeiras 3 espécies:</strong> ${sliced.join(', ')}</p>
                <p><i class="fas fa-info-circle"></i> <code>slice()</code> extrai uma parte do array sem modificar o original.</p>
            `;
        }
        case 'forEach': {
            let nomes = [];
            animais.forEach(a => nomes.push(a.nome));
            return `
                <p><strong>Código:</strong> <code>animais.forEach(a => nomes.push(a.nome))</code></p>
                <p><strong>Nomes coletados (primeiros 5):</strong> ${nomes.slice(0,5).join(', ')}...</p>
                <p><i class="fas fa-info-circle"></i> <code>forEach()</code> executa uma função para cada elemento.</p>
            `;
        }
        case 'some': {
            const temMenos1000 = animais.some(a => a.quantidade < 1000);
            return `
                <p><strong>Código:</strong> <code>animais.some(a => a.quantidade < 1000)</code></p>
                <p><strong>Resultado:</strong> ${temMenos1000 ? 'Existem espécies com menos de 1000 indivíduos' : 'Nenhuma espécie com menos de 1000'}</p>
                <p><i class="fas fa-info-circle"></i> <code>some()</code> verifica se pelo menos um elemento satisfaz a condição.</p>
            `;
        }
        case 'includes': {
            const nomes = animais.map(a => a.nome.toUpperCase());
            const temPanda = nomes.includes('PANDA-GIGANTE');
            return `
                <p><strong>Código:</strong> <code>nomes.includes('PANDA-GIGANTE')</code></p>
                <p><strong>Resultado:</strong> ${temPanda ? 'Panda-gigante está na lista' : 'Panda-gigante não está'}</p>
                <p><i class="fas fa-info-circle"></i> <code>includes()</code> verifica se um elemento existe no array.</p>
            `;
        }
        default:
            return '<p>Exemplo não disponível.</p>';
    }
}

// ============================================================================
// TABELA DE ANÁLISE COM ORDENAÇÃO E RESUMO
// ============================================================================

let currentSort = { column: null, direction: 'none' };

function renderTableWithData(data) {
    const tbody = document.getElementById('tableBody');
    const tfoot = document.getElementById('tableFooter');

    tbody.innerHTML = data.map(animal => {
        const status = getStatus(animal.anosRestantes);
        const observacoes = animal.quantidade < 1000 ? 'População crítica' : 
                            (parseInt(animal.anosRestantes) <= 3 ? 'Risco iminente' : 'Monitoramento contínuo');
        const statusIcon = `<span class="status-icon" style="background-color: ${status.class === 'status-critico' ? 'var(--risk-8)' : status.class === 'status-alto' ? 'var(--risk-5)' : status.class === 'status-moderado' ? 'var(--risk-3)' : 'var(--risk-0)'};"></span>`;
        return `
            <tr>
                <td>${animal.nome}</td>
                <td>${animal.bioma}</td>
                <td>${formatNumber(animal.quantidade)}</td>
                <td>${animal.anosRestantes}</td>
                <td class="${status.class}">${statusIcon} ${status.text}</td>
                <td>${observacoes}</td>
            </tr>
        `;
    }).join('');

    const totalEspecies = data.length;
    const totalPopulacao = data.reduce((acc, a) => acc + a.quantidade, 0);
    const mediaAnos = data.reduce((acc, a) => acc + parseInt(a.anosRestantes), 0) / totalEspecies;

    tfoot.innerHTML = `
        <tr>
            <td colspan="2"><strong>Totais (exibidos)</strong></td>
            <td><strong>${formatNumber(totalPopulacao)}</strong></td>
            <td><strong>${mediaAnos.toFixed(1)}</strong></td>
            <td colspan="2">Espécies: ${totalEspecies}</td>
        </tr>
    `;

    updateSortIcons();
}

function sortTable(column) {
    if (currentSort.column === column) {
        if (currentSort.direction === 'none') currentSort.direction = 'ascending';
        else if (currentSort.direction === 'ascending') currentSort.direction = 'descending';
        else if (currentSort.direction === 'descending') currentSort.direction = 'none';
    } else {
        currentSort.column = column;
        currentSort.direction = 'ascending';
    }

    if (currentSort.direction !== 'none') {
        const sorted = [...filteredData].sort((a, b) => {
            let valA, valB;
            if (column === 'nome') { valA = a.nome; valB = b.nome; }
            else if (column === 'bioma') { valA = a.bioma; valB = b.bioma; }
            else if (column === 'quantidade') { valA = a.quantidade; valB = b.quantidade; }
            else if (column === 'anosRestantes') { valA = parseInt(a.anosRestantes); valB = parseInt(b.anosRestantes); }
            else if (column === 'status') {
                const ordem = { 'Crítico': 4, 'Alto': 3, 'Moderado': 2, 'Baixo': 1 };
                valA = ordem[getStatus(a.anosRestantes).text];
                valB = ordem[getStatus(b.anosRestantes).text];
            }
            else if (column === 'observacoes') {
                valA = (a.quantidade < 1000 ? 'A' : (parseInt(a.anosRestantes) <= 3 ? 'B' : 'C'));
                valB = (b.quantidade < 1000 ? 'A' : (parseInt(b.anosRestantes) <= 3 ? 'B' : 'C'));
            }
            if (valA < valB) return currentSort.direction === 'ascending' ? -1 : 1;
            if (valA > valB) return currentSort.direction === 'ascending' ? 1 : -1;
            return 0;
        });
        renderTableWithData(sorted);
    } else {
        renderTableWithData(filteredData);
    }
}

function updateSortIcons() {
    document.querySelectorAll('#analysisTable th[data-sort]').forEach(th => {
        const col = th.dataset.sort;
        th.setAttribute('aria-sort', (currentSort.column === col) ? currentSort.direction : 'none');
    });
}

function initTableSort() {
    document.querySelectorAll('#analysisTable th[data-sort]').forEach(th => {
        th.addEventListener('click', () => {
            sortTable(th.dataset.sort);
        });
    });
}

// ============================================================================
// INICIALIZAÇÃO
// ============================================================================
function init() {
    renderOriginalAnalysis();
    renderAdditionalAnalysis();
    updateIndicators();
    updateCriticalAlert();
    populateBiomaFilter();

    filteredData = animaisExtincao;
    renderCards(filteredData);
    renderTableWithData(filteredData);
    criarGraficoRisco();
    renderMethodExamples();
    initTableSort();

    document.getElementById('search').addEventListener('input', filterAnimals);
    document.getElementById('biomaFilter').addEventListener('change', filterAnimals);
    document.querySelectorAll('.status-filter input[type="checkbox"]').forEach(cb => {
        cb.addEventListener('change', filterAnimals);
    });
    document.getElementById('clearFilters').addEventListener('click', clearFilters);
}

document.addEventListener('DOMContentLoaded', carregarDados);