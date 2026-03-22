# 🌿 Dashboard de Conservação

[![GitHub Pages](https://img.shields.io/badge/🌐-Site%20Online-blue?style=for-the-badge)](https://leandrostanger.github.io/DashboardDeConservacao/)
[![GitHub](https://img.shields.io/badge/📂-Repositório-black?style=for-the-badge)](https://github.com/LeandroStanger/DashboardDeConservacao)

Um painel interativo para análise populacional de espécies ameaçadas, com projeções de tempo restante para extinção baseadas em taxas anuais de perda populacional.

## 📝 Descrição

O **Dashboard de Conservação** é uma aplicação web que apresenta dados detalhados sobre espécies em risco de extinção, permitindo visualizar estatísticas populacionais, taxas de perda anual e o tempo estimado para extinção caso as tendências atuais se mantenham. Desenvolvido com foco educacional e de conscientização ambiental, o projeto combina visualização de dados com exemplos interativos de métodos JavaScript.

## 🚀 Acesso Online

Explore o dashboard diretamente no navegador:  
**[https://leandrostanger.github.io/DashboardDeConservacao/](https://leandrostanger.github.io/DashboardDeConservacao/)**

## 🚀 Tecnologias Utilizadas

- **HTML5**: Estrutura semântica da página e organização dos componentes.
- **CSS3**: Estilização visual, cards, tabelas responsivas e design temático.
- **JavaScript (ES6+)**: Lógica de manipulação de dados, filtros, cálculos estatísticos e exemplos interativos.
- **JSON (`dados.json`)**: Fonte de dados contendo informações detalhadas de cada espécie.

## 📂 Estrutura do Projeto

```
DashboardDeConservacao/
├── index.html          # Página principal com toda a interface
├── style.css           # Estilos visuais e layout responsivo
├── script.js           # Lógica de carregamento, filtros e cálculos
├── dados.json          # Base de dados com informações das espécies
└── README.md           # Documentação
```

## ⚙️ Funcionalidades

Com base na análise da aplicação, as funcionalidades implementadas são:

### 📊 Visão Geral Estatística
- **Cards de métricas principais**: Espécies monitoradas (26), população total (2.025.987), média de anos restantes (7,8), espécies críticas (2)
- **Distribuição de risco**: Visualização gráfica do status de conservação

### 🌍 Análises por Critérios
- **Espécies com menos de 2.000 indivíduos**
- **Espécies com menos de 1.000 indivíduos** (população crítica)
- **Espécies por bioma** (Floresta, Pantanal, Amazônia, etc.)
- **Animais adicionados recentemente** (12 novas espécies incluídas)

### 🧩 Exemplos Interativos de Métodos JavaScript
- Demonstração prática de métodos de array:
  - `map()` | `filter()` | `reduce()` | `push()`
  - `slice()` | `forEach()` | `some()` | `includes()`
- **Filtro interativo por nível de risco** (Baixo, Moderado, Alto, Crítico)
- Contador dinâmico de espécies exibidas

### 🃏 Cards de Espécies
Cada espécie é apresentada em um card individual contendo:
- Nome da espécie
- Bioma de ocorrência
- População atual
- Perda anual estimada
- População restante após um ano
- Anos restantes até extinção (projeção)

### 📋 Tabela de Análise Completa
Tabela detalhada com todas as 26 espécies, incluindo:
- Espécie | Bioma | População | Anos restantes | Status | Observações

### 🔍 Dados Cobertos
O dashboard monitora 26 espécies distribuídas em diversos biomas brasileiros e globais, incluindo:
- **Mata Atlântica**: Mico-leão-dourado, Muriqui-do-norte, Macaco-prego
- **Amazônia**: Onça-pintada, Harpia, Boto-cor-de-rosa, Sauim-de-coleira
- **Pantanal**: Arara-azul, Ariranha, Jacaré-do-pantanal, Cervo-do-pantanal
- **Cerrado**: Lobo-guará, Tamanduá-bandeira, Tucano-toco
- **Biomas globais**: Gorila-da-montanha, Tigre-de-bengala, Panda-gigante, etc.

## 🔧 Como Executar o Projeto

### Pré-requisitos
- Navegador web moderno (Chrome, Firefox, Edge, Safari)
- Conexão com internet (para carregar fontes e estilos, se houver)

### Passo a Passo

1. **Clone o repositório**:
   ```bash
   git clone https://github.com/LeandroStanger/DashboardDeConservacao.git
   cd DashboardDeConservacao
   ```

2. **Execute a aplicação**:
   - **Método 1**: Abra o arquivo `index.html` diretamente no navegador (duplo clique)
   - **Método 2 (recomendado)**: Utilize um servidor local:
     ```bash
     # Com Python
     python -m http.server 8000
     
     # Com Node.js
     npx http-server
     ```
   - Acesse `http://localhost:8000` no navegador

## 🌐 Configurações Importantes

- **Fonte de Dados**: Os dados estão no arquivo `dados.json` e são carregados dinamicamente via `fetch()`.
- **CORS**: Por questões de segurança, ao abrir o arquivo diretamente (`file://`), alguns navegadores podem bloquear o carregamento do JSON. Utilize um servidor local para evitar esse problema.
- **Hospedagem**: O projeto está otimizado para GitHub Pages.

## 👤 Autor

**Leandro Stanger**

- GitHub: [@LeandroStanger](https://github.com/LeandroStanger)
- Projeto: [Dashboard de Conservação](https://github.com/LeandroStanger/DashboardDeConservacao)
- Demonstração Online: [https://leandrostanger.github.io/DashboardDeConservacao/](https://leandrostanger.github.io/DashboardDeConservacao/)
