document.addEventListener('DOMContentLoaded', () => {
  const agendamentoForm = document.getElementById('form-agendamento');
  const dataInput = document.getElementById('data');

  agendamentoForm.addEventListener('submit', function(event) {
    event.preventDefault();
    agendarHorario();
  });

  function agendarHorario() {
    const nome = document.getElementById('nome').value;
    const telefone = document.getElementById('telefone').value;
    const data = formatarData(document.getElementById('data').value); // Formatando a data
    const horario = document.getElementById('horario').value;
    const tipo = document.getElementById('escolha').value;

    let agendamentos = JSON.parse(localStorage.getItem('agendamentos')) || [];

    if (agendamentos.some(agendamento => agendamento.data === data && agendamento.horario === horario)) {
      alert(`O horário das ${horario} no dia ${data} já está agendado. Por favor, escolha outro horário.`);
      mostrarHorariosDisponiveis(data);
      return;
    }

    agendamentos.push({ data, horario });
    localStorage.setItem('agendamentos', JSON.stringify(agendamentos));

    enviarParaWhatsApp(nome, telefone, data, horario, tipo);
    alert(`Agendamento feito para o dia ${data} às ${horario}.`);
    marcarDiasNoCalendario();
  }

  function enviarParaWhatsApp(nome, telefone, data, horario, tipo) {
    const mensagem = `Olá, gostaria de marcar um corte:` +
                     `\nNome: ${nome}` +
                     `\nTelefone: ${telefone}` +
                     `\nData: ${data}` +
                     `\nHorário: ${horario}` +
                     `\nTipo de Corte: ${tipo}`;

    const numeroWhatsApp = '5534999064875'; // Insira o número da barbearia aqui
    const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, '_blank');
  }

  function mostrarHorariosDisponiveis(data) {
    const horarios = ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];

    let agendamentos = JSON.parse(localStorage.getItem('agendamentos')) || [];

    // Filtrar os horários disponíveis
    const horariosDisponiveis = horarios.filter(hora => {
      // Verificar se há algum agendamento para o mesmo dia e horário
      return !agendamentos.some(agendamento => agendamento.data === data && agendamento.horario === hora);
    });

    alert(`Horários disponíveis para o dia ${data}:\n${horariosDisponiveis.join(', ')}`);
  }

  function marcarDiasNoCalendario() {
    const agendamentos = JSON.parse(localStorage.getItem('agendamentos')) || [];
    const diasAmarelos = document.querySelectorAll('.calendar-day[data-date]');

    // Remove a marcação amarela existente
    diasAmarelos.forEach(dia => {
      dia.style.backgroundColor = '';
    });

    // Marca os novos dias agendados
    agendamentos.forEach(agendamento => {
      const data = new Date(agendamento.data);
      const dia = data.getDate();
      const mes = data.getMonth() + 1; // Janeiro é 0
      const ano = data.getFullYear();

      const diaElement = document.querySelector(`.calendar-day[data-date="${ano}-${mes}-${dia}"]`);
      if (diaElement) {
        diaElement.style.backgroundColor = 'yellow';
      }
    });
  }

  // Verificar e marcar os dias no calendário quando a página carregar
  marcarDiasNoCalendario();

  dataInput.addEventListener('change', () => {
    const data = new Date(dataInput.value);
    const dia = data.getDate();
    const mes = data.getMonth() + 1; // Janeiro é 0
    const ano = data.getFullYear();

    const diaElement = document.querySelector(`.calendar-day[data-date="${ano}-${mes}-${dia}"]`);
    if (diaElement) {
      diaElement.style.backgroundColor = 'yellow';
    }

    // Mostrar os horários disponíveis para a data selecionada
    mostrarHorariosDisponiveis(formatarData(dataInput.value));
  });

  function formatarData(data) {
    const partes = data.split('-');
    return `${partes[2]}/${partes[1]}/${partes[0]}`; // Formatando para dd/mm/aaaa
  }
});

function comprarProduto(produto) {
  const mensagem = `Gostaria de comprar o produto: ${produto}`;
  const numeroWhatsApp = '5534999064875'; // Insira o número da barbearia aqui
  const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;
  window.open(url, '_blank');
}
