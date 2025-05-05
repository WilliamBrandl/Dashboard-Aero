const fragrancias = [
  { nome: "CITRICO FRESCO", atual: 2000, minimo: 1000, maximo: 4000, ultimaProducao: "2025-04-01" },
  { nome: "CAPRI", atual: 350, minimo: 150, maximo: 300, ultimaProducao: "2025-02-15" },
  { nome: "PARIS WOOD", atual: 120, minimo: 250, maximo: 500, ultimaProducao: "2025-01-10" },
  { nome: "MADEIRAS NOBRES", atual: 20, minimo: 15, maximo: 50, ultimaProducao: "2025-01-10" },
  { nome: "CITRICO MALONE", atual: 20, minimo: 10, maximo: 20, ultimaProducao: "2025-01-10" },
  { nome: "ALECRIM SILVESTRE", atual: 50, minimo: 140, maximo: 300, ultimaProducao: "2025-01-10" },
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
  // ...adicione mais fragrâncias
];

const container = document.getElementById("fragranciasContainer");

fragrancias.forEach((frag, index) => {
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
    <p>Quantidade mínima: ${frag.minimo}</p> <!-- Exibindo a quantidade mínima -->
    <p>Última produção: ${ultima.toLocaleDateString()}</p>
    <p>Próxima produção: ${proxima.toLocaleDateString()}</p>
  `;
  container.appendChild(card);

  // Gráfico
  const ctx = document.getElementById(canvasId).getContext("2d");
  const perc = (frag.atual / frag.maximo) * 100;
  let cor = perc < (frag.minimo / frag.maximo) * 100 ? "#ff5555" :
            perc < 90 ? "#ffff00" : "#00FF00";

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
          },
          // Adicionando linha de mínima
          grid: {
            borderColor: frag.minimo / frag.maximo * 100, // cor da linha de mínima
            borderWidth: 1,
            lineWidth: 1
          }
        }
      },
      plugins: {
        legend: { display: false },
        annotation: { // Linha para mostrar o valor mínimo no gráfico
          annotations: {
            line1: {
              type: 'line',
              yMin: (frag.minimo / frag.maximo) * 100,
              yMax: (frag.minimo / frag.maximo) * 100,
              borderColor: '#ff5555', // Cor da linha
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
});
