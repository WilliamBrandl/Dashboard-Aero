const fragrancias = [
  { nome: "CITRICO FRESCO", atual: 2000, minimo: 1000, maximo: 4000, ultimaProducao: "2025-02-15" },
  { nome: "CAPRI", atual: 350, minimo: 150, maximo: 300, ultimaProducao: "2025-02-15" },
  { nome: "PARIS WOOD", atual: 120, minimo: 250, maximo: 500, ultimaProducao: "2025-01-10" },
  { nome: "MADEIRAS NOBRES", atual: 20, minimo: 15, maximo: 50, ultimaProducao: "2025-01-10" },
  { nome: "CITRICO MALONE", atual: 20, minimo: 10, maximo: 20, ultimaProducao: "2025-01-10" },
  { nome: "ALECRIM SILVESTRE", atual: 500, minimo: 50, maximo: 300, ultimaProducao: "2025-01-10" },
  { nome: "BAMBOO NATURAL", atual: 85, minimo: 100, maximo: 300, ultimaProducao: "2025-01-10" },
  { nome: "CHÁ BRANCO", atual: 120, minimo: 80, maximo: 200, ultimaProducao: "2025-01-10" },
  { nome: "CHÁ VERDE COM BAMBOO", atual: 80, minimo: 130, maximo: 280, ultimaProducao: "2025-01-10" },
  { nome: "INTENSE FORCE", atual: 124, minimo: 100, maximo: 300, ultimaProducao: "2025-01-10" },
  { nome: "JARDIM MONET", atual: 65, minimo: 100, maximo: 200, ultimaProducao: "2025-01-10" },
  { nome: "LUXURY", atual: 70, minimo: 100, maximo: 200, ultimaProducao: "2025-01-10" },
  { nome: "MELANCIA", atual: 30, minimo: 20, maximo: 100, ultimaProducao: "2025-01-10" },
  { nome: "VANILA GOLD", atual: 40, minimo: 50, maximo: 120, ultimaProducao: "2025-01-10" },
  { nome: "VENTO", atual: 90, minimo: 50, maximo: 100, ultimaProducao: "2025-01-10" },
  { nome: "CIDADE JARDIM", atual: 20, minimo: 10, maximo: 100, ultimaProducao: "2025-01-10" },
  { nome: "FLORAL PROVANCE", atual: 20, minimo: 10, maximo: 20, ultimaProducao: "2025-01-10" },
  { nome: "NÉCTAR DO FIGO", atual: 20, minimo: 10, maximo: 100, ultimaProducao: "2025-01-10" },
  { nome: "JASMIM", atual: 20, minimo: 10, maximo: 20, ultimaProducao: "2025-01-10" },
  { nome: "ROSAS", atual: 20, minimo: 10, maximo: 20, ultimaProducao: "2025-01-10" },
  // ... outras fragrâncias
];

const container = document.getElementById("fragranciasContainer");

// Função para renderizar um card de fragrância
function renderFragrancia(frag, index) {
  const card = document.createElement("div");
  card.className = "card";

  const ultima = new Date(frag.ultimaProducao);
  const proxima = new Date(ultima);
  proxima.setMonth(proxima.getMonth() + 3);
  const diasRestantes = Math.floor((proxima - new Date()) / (1000 * 60 * 60 * 24));

  const alerta = diasRestantes <= 7
    ? `<div class="alerta">⚠️ Produção em ${diasRestantes} dia(s)</div>` : "";

  const canvasId = `grafico-${index}`;
  card.innerHTML = `
    ${alerta}
    <h3>${frag.nome}</h3>
    <canvas id="${canvasId}"></canvas>
    <p>Estoque: ${frag.atual} / ${frag.maximo}</p>
    <p>Quantidade mínima: ${frag.minimo}</p>
    <p>Última produção: ${ultima.toLocaleDateString()}</p>
    <p>Próxima produção: ${proxima.toLocaleDateString()}</p>
  `;
  container.appendChild(card);

  const ctx = document.getElementById(canvasId).getContext("2d");
  const perc = (frag.atual / frag.maximo) * 100;
  const minimoPerc = (frag.minimo / frag.maximo) * 100;

  const cor = perc < minimoPerc ? "#ff5555" : perc < 90 ? "#ffff00" : "#00FF00";

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: [frag.nome],
      datasets: [{
        label: "% Estoque",
        data: [perc],
        backgroundColor: cor,
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          ticks: {
            callback: val => val + "%"
          }
        }
      },
      plugins: {
        legend: { display: false },
        annotation: {
          annotations: {
            line1: {
              type: 'line',
              yMin: minimoPerc,
              yMax: minimoPerc,
              borderColor: '#ff5555',
              borderWidth: 2,
              label: {
                enabled: true,
                content: 'Mínimo',
                position: 'right'
              }
            }
          }
        }
      }
    }
  });
}

// Inicializa todos os cards
fragrancias.forEach((frag, index) => renderFragrancia(frag, index));

// Função para exportar para Excel
function exportarExcel() {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(fragrancias);
  XLSX.utils.book_append_sheet(wb, ws, "Fragrâncias");
  XLSX.writeFile(wb, "fragrancias.xlsx");
}

// Função para exportar para PDF
function exportarPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // Definir o logo (use o caminho da sua imagem)
  const logo = new Image();
  logo.src = 'assets/Logo La Belle.png';  // Altere para o caminho correto do seu logo

  // Inserir o logo no PDF (posicionamento e tamanho)
  logo.onload = () => {
    doc.addImage(logo, 'PNG', 10, 10, 50, 20); // Logo na posição (10,10) e tamanho 50x20 mm

    // Adicionar título
    doc.setFontSize(20);
    doc.text('Relatório de Produção de Aerossóis', 70, 15); // Título abaixo do logo


    const dataAtual = new Date().toLocaleDateString('pt-BR');
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Data da exportação: ${dataAtual}`, 150, 40); // x, y ajustado para canto direito



    // Ajustar a posição para as tabelas
    doc.setFontSize(12);
    doc.text('Detalhes das Fragrâncias:', 10, 50);

    // Tabela de dados
    let startY = 58;  // Posição inicial da tabela

    // Títulos das colunas
    doc.setFont('helvetica', 'bold');
    doc.text('Nome', 10, startY);
    doc.text('Estoque Atual', 60, startY);
    doc.text('Mínimo', 120, startY);
    doc.text('Máximo', 170, startY);
    doc.text('Última Produção', 210, startY);
    startY += 8; // Desloca para a próxima linha

    // Corpo da tabela com dados
    doc.setFont('helvetica', 'normal');
    fragrancias.forEach((frag, index) => {
      doc.text(frag.nome, 10, startY);
      doc.text(frag.atual.toString(), 70, startY);
      doc.text(frag.minimo.toString(), 120, startY);
      doc.text(frag.maximo.toString(), 170, startY);
      doc.text(frag.ultimaProducao, 210, startY);
      startY += 8;

      // Quebra de página se necessário
      if (startY > 270) {
        doc.addPage();
        startY = 15; // Reinicia a posição da tabela
      }
    });

    // Salvar o PDF
    doc.save('relatorio_producao_aerossol.pdf');
  };
}


// Importação de planilha

document.getElementById("importarPlanilha").addEventListener("change", function (e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (event) {
    const data = new Uint8Array(event.target.result);
    const workbook = XLSX.read(data, { type: "array" });
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(firstSheet);

    fragrancias.length = 0;

    jsonData.forEach(row => {
      // Pegando o valor da última produção e tentando tratá-la corretamente
      const dataProducao = row.ultimaProducao || row["Última Produção"];
      let ultimaProducao = "";

      // Verificando se a data é um número (série de data no Excel)
      if (typeof dataProducao === "number") {
        ultimaProducao = XLSX.SSF.format("YYYY-MM-DD", dataProducao); // Formata a data no padrão ISO
      } else if (dataProducao) {
        // Caso não seja um número, tentamos converter como string
        ultimaProducao = new Date(dataProducao).toLocaleDateString();
      }

      fragrancias.push({
        nome: row.nome || row.Nome,
        atual: Number(row.atual || row.Atual),
        minimo: Number(row.minimo || row.Mínimo),
        maximo: Number(row.maximo || row.Máximo),
        ultimaProducao: ultimaProducao
      });
    });

    container.innerHTML = "";
    fragrancias.forEach((f, i) => renderFragrancia(f, i));
  };

  reader.readAsArrayBuffer(file);
});
