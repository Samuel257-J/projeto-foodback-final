router.post('/agendamentos', async (req, res) => {
  try {
    console.log('📥 Dados recebidos:', req.body);
    
    const { 
      id_solicitacao, 
      responsavel_retirada, 
      tipo_transporte, 
      data_retirada, 
      horario_retirada, 
      observacoes 
    } = req.body;
    
    // Buscar informações da solicitação e doação
    const solicitacao = await Solicitacao.findByPk(id_solicitacao, {
      include: [
        { model: Doacao, include: [{ model: Empresa, include: [{ model: Usuario }] }] },
        { model: Ong, include: [{ model: Usuario }] }
      ]
    });

    console.log('📋 Solicitação encontrada:', solicitacao ? 'SIM' : 'NÃO');
    
    if (!solicitacao) {
      return res.status(404).json({ error: 'Solicitação não encontrada' });
    }

    console.log('🏢 ID da empresa:', solicitacao.Doacao?.Empresa?.id_usuario);
    console.log('🏢 Dados da empresa:', solicitacao.Doacao?.Empresa);
    
    // Criar o agendamento
    const agendamento = await Agendamento.create({
      id_solicitacao,
      responsavel_retirada,
      tipo_transporte,
      data_retirada,
      horario_retirada,
      observacoes,
      status: 'agendado'
    });
    
    console.log('✅ Agendamento criado:', agendamento.id_agendamento);
    
    // CRIAR NOTIFICAÇÃO PARA A EMPRESA
    const notificacao = await Notificacao.create({
      id_usuario: solicitacao.Doacao.Empresa.id_usuario,
      tipo: 'agendamento_retirada',
      titulo: `Retirada agendada: ${solicitacao.Doacao.titulo}`,
      mensagem: `A ONG ${solicitacao.Ong.Usuario.nome} agendou a retirada para ${new Date(data_retirada + 'T00:00:00').toLocaleDateString('pt-BR')} às ${horario_retirada}`,
      lida: false,
      dados_extras: JSON.stringify({
        id_agendamento: agendamento.id_agendamento,
        id_doacao: solicitacao.Doacao.id_doacao,
        nome_ong: solicitacao.Ong.Usuario.nome,
        responsavel_retirada,
        tipo_transporte,
        data_retirada,
        horario_retirada,
        observacoes
      })
    });
    
    console.log('🔔 Notificação criada:', notificacao.id_notificacao);
    console.log('👤 Para o usuário ID:', notificacao.id_usuario);
    
    res.status(201).json({ success: true, agendamento });
  } catch (error) {
    console.error('❌ Erro completo:', error);
    res.status(500).json({ error: error.message });
  }
});