// script.js

function showModal() {
    document.getElementById('keyModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('keyModal').style.display = 'none';
}

function updateGrid() {
    const gridContainer = document.getElementById('grid-container');
    const field = document.getElementById('field').value;
    const loading = document.getElementById('loading');
    let rows, cols;

    switch (field) {
        case '3x4':
            rows = 3;
            cols = 4;
            break;
        case '4x7':
            rows = 4;
            cols = 7;
            break;
        case '5x11':
            rows = 5;
            cols = 11;
            break;
        default:
            rows = 3;
            cols = 4;
    }

    gridContainer.className = `grid grid-cols-${cols} gap-6 mb-4`;
    gridContainer.innerHTML = '';

    loading.style.display = 'flex';

    setTimeout(() => {
        for (let i = 0; i < rows * cols; i++) {
            const gridItem = document.createElement('div');
            gridItem.className = 'bg-green-500 h-20 w-20 rounded grid-item neon-border';
            gridContainer.appendChild(gridItem);
        }
        loading.style.display = 'none';
    }, 1000);
}

function reloadGrid() {
    updateGrid();
}

function preencherGrade() {
    const serverKey = document.getElementById('server-key').value;
    const clientKey = document.getElementById('client-key').value;
    const gridContainer = document.getElementById('grid-container');
    const field = document.getElementById('field').value;
    let rows, cols;

    switch (field) {
        case '3x4':
            rows = 3;
            cols = 4;
            break;
        case '4x7':
            rows = 4;
            cols = 7;
            break;
        case '5x11':
            rows = 5;
            cols = 11;
            break;
        default:
            rows = 3;
            cols = 4;
    }

    // Clear existing mines
    for (let i = 0; i < gridContainer.children.length; i++) {
        gridContainer.children[i].innerHTML = '';
    }

    const coordenadas = gerarCoordenadasMinas(serverKey, clientKey, 42, cols, rows, cols);
    coordenadas.forEach((coord, index) => {
        setTimeout(() => {
            const gridItem = gridContainer.children[coord.y * cols + coord.x];
            if (gridItem) {
                gridItem.innerHTML = '??'; // Emoji for bomb
                gridItem.style.fontSize = '3rem'; // Adjust as needed
                gridItem.style.animation = 'neonFlow 2s infinite';
            }
        }, index * 350); // 0.35 seconds interval
    });

    closeModal();
}

function gerarCoordenadasMinas(serverKey, clientKey, numeroDecimal, larguraGrade, alturaGrade, numMinas) {
    const chaveCombinada = serverKey + clientKey;
    const hash = sha512(chaveCombinada);
    const decimais = [];

    for (let i = 0; i < hash.length; i += 4) {
        const bloco = hash.substr(i, 4);
        const decimal = parseInt(bloco, 16);
        decimais.push(decimal);
    }

    const decimaisAjustados = decimais.map(d => d + numeroDecimal);
    const coordenadas = [];
    const colunasUsadas = new Set();

    let tentativas = 0;
    const maxTentativas = larguraGrade * 2;

    while (coordenadas.length < numMinas && tentativas < maxTentativas) {
        if (coordenadas.length * 2 + 1 < decimaisAjustados.length) {
            let x = decimaisAjustados[coordenadas.length * 2] % larguraGrade;
            if (!colunasUsadas.has(x)) {
                const y = decimaisAjustados[coordenadas.length * 2 + 1] % alturaGrade;
                coordenadas.push({ x, y });
                colunasUsadas.add(x);
            }
        }
        tentativas++;
    }

    return coordenadas;
}

// Initialize the grid on page load
document.addEventListener('DOMContentLoaded', updateGrid);