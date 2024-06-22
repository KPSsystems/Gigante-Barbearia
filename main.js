document.addEventListener('DOMContentLoaded', () => {
  const agendamentoForm = document.getElementById('form-agendamento');
  const dataInput = document.getElementById('data');

  agendamentoForm.addEventListener('submit', function(event) {
    event.preventDefault();
    agendarHorario();
  });

  dataInput.addEventListener('change', () => {
    const dataSelecionada = new Date(dataInput.value);
    const dia = dataSelecionada.getDate();
    const mes = dataSelecionada.getMonth() + 1; // Janeiro é 0
    const ano = dataSelecionada.getFullYear();

    marcarDiaNoCalendario(ano, mes, dia);

    if (ehDomingo(dataSelecionada)) {
      alertaFechadoDomingos(dataSelecionada); // Chamada da função para verificar se é domingo
    } else {
      mostrarHorariosDisponiveis(dataSelecionada);
    }
  });

  function agendarHorario() {
    const nome = document.getElementById('nome').value;
    const telefone = document.getElementById('telefone').value;
    const dataSelecionada = new Date(dataInput.value); // Convertendo para objeto Date
    const horario = document.getElementById('horario').value;
    const tipo = document.getElementById('escolha').value;

    // Verificar se é um domingo
    if (ehDomingo(dataSelecionada)) {
      alert('A barbearia está fechada aos domingos.');
      return;
    }

    // Verificar se é horário de almoço
    if (ehHorarioDeAlmoco(horario)) {
      alert('A barbearia está fechada para almoço das 12:00 às 13:00.');
      return;
    }

    let agendamentos = JSON.parse(localStorage.getItem('agendamentos')) || [];

    // Verificar se já existe agendamento para o mesmo dia e horário
    if (agendamentos.some(agendamento => agendamento.data === dataSelecionada.toISOString() && agendamento.horario === horario)) {
      alert(`O horário das ${horario} no dia ${formatarData(dataSelecionada)} já está agendado. Por favor, escolha outro horário.`);
      mostrarHorariosDisponiveis(dataSelecionada);
      return;
    }

    // Salvando o agendamento
    agendamentos.push({ data: dataSelecionada.toISOString(), horario });
    localStorage.setItem('agendamentos', JSON.stringify(agendamentos));

    // Enviando para o WhatsApp
    enviarParaWhatsApp(nome, telefone, dataSelecionada, horario, tipo);

    // Alerta de agendamento realizado
    alert(`Agendamento feito para o dia ${formatarData(dataSelecionada)} às ${horario}.`);

    // Atualizando o calendário visualmente
    marcarDiasNoCalendario();
  }

  function enviarParaWhatsApp(nome, telefone, data, horario, tipo) {
    const mensagem = `Olá, gostaria de marcar um corte:
Nome: ${nome}
Telefone: ${telefone}
Data: ${formatarData(data)} 
Horário: ${horario}
Tipo de Corte: ${tipo}`;

    const numeroWhatsApp = '5534999064875'; // Insira o número da barbearia aqui
    const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, '_blank');
  }

  function mostrarHorariosDisponiveis(data) {
    const horarios = ['9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];

    let agendamentos = JSON.parse(localStorage.getItem('agendamentos')) || [];

    // Filtrar os horários disponíveis para o dia específico
    const horariosDisponiveis = horarios.filter(hora => {
      // Verificar se há algum agendamento para o mesmo dia e horário
      return !agendamentos.some(agendamento => agendamento.data === data.toISOString() && agendamento.horario === hora);
    });

    alert(`Horários disponíveis para o dia ${formatarData(data)}:\n${horariosDisponiveis.join(', ')}`);
  }

  function marcarDiasNoCalendario() {
    const agendamentos = JSON.parse(localStorage.getItem('agendamentos')) || [];
    const diasAmarelos = document.querySelectorAll('.calendar-day[data-date]');

    // Remover a marcação amarela existente
    diasAmarelos.forEach(dia => {
      dia.style.backgroundColor = '';
    });

    // Marcar os novos dias agendados
    agendamentos.forEach(agendamento => {
      const data = new Date(agendamento.data);
      const dia = data.getDate();
      const mes = data.getMonth() + 1; // Janeiro é 0
      const ano = data.getFullYear();

      marcarDiaNoCalendario(ano, mes, dia);
    });
  }

  function marcarDiaNoCalendario(ano, mes, dia) {
    const diaElement = document.querySelector(`.calendar-day[data-date="${ano}-${mes}-${dia}"]`);
    if (diaElement) {
      diaElement.style.backgroundColor = 'yellow';
    }
  }

  function formatarData(data) {
    const partes = data.toISOString().split('T')[0].split('-');
    return `${partes[2]}/${partes[1]}/${partes[0]}`; // Formatando para dd/mm/aaaa
  }

  function ehDomingo(data) {
    const diaSemana = data.getUTCDay(); // 0 = domingo, 1 = segunda, ..., 6 = sábado
    return diaSemana === 0;
  }

  function ehHorarioDeAlmoco(horario) {
    return horario === '12:00';
  }

  function alertaFechadoDomingos(data) {
    if (ehDomingo(data)) {
      alert('A barbearia está fechada aos domingos.');
    }
  }
});

function comprarProduto(produto) {
  const mensagem = `Gostaria de comprar o produto: ${produto}`;
  const numeroWhatsApp = '5534999064875'; // Insira o número da barbearia aqui
  const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;
  window.open(url, '_blank');
}
