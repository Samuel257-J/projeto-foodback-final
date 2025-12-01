import { Payment } from 'mercadopago';
import client from '../config/mercadopago.js';

const payment = new Payment(client);

// Gerar PIX
export const createPixPayment = async (req, res) => {
  try {
    console.log('📥 Dados recebidos:', req.body);
    
    const { transaction_amount, description, payer } = req.body;

    // Validação dos dados
    if (!transaction_amount || !payer?.email || !payer?.cpf) {
      return res.status(400).json({ 
        error: 'Dados incompletos',
        required: ['transaction_amount', 'payer.email', 'payer.cpf']
      });
    }

    const body = {
      transaction_amount: Number(transaction_amount),
      description: description || 'Pagamento PIX',
      payment_method_id: 'pix',
      payer: {
        email: payer.email,
        first_name: payer.first_name || payer.nome || 'Cliente',
        last_name: payer.last_name || payer.sobrenome || '',
        identification: {
          type: 'CPF',
          number: payer.cpf.replace(/\D/g, '')
        }
      }
    };

    console.log('📤 Enviando para Mercado Pago:', JSON.stringify(body, null, 2));

    const result = await payment.create({ body });

    console.log('✅ Resposta do Mercado Pago:', result);

    return res.json({
      id: result.id,
      status: result.status,
      qr_code: result.point_of_interaction.transaction_data.qr_code,
      qr_code_base64: result.point_of_interaction.transaction_data.qr_code_base64,
      ticket_url: result.point_of_interaction.transaction_data.ticket_url
    });

  } catch (error) {
    console.error("❌ Erro completo ao gerar PIX:", {
      message: error.message,
      cause: error.cause,
      status: error.status,
      apiResponse: error.apiResponse
    });

    // Extrair informações detalhadas do erro
    const errorDetails = error.apiResponse?.body || error.cause || {};
    
    return res.status(error.status || 500).json({ 
      error: error.message,
      status: error.status,
      details: errorDetails,
      // Informações úteis para debug
      message: errorDetails.message || 'Erro ao processar pagamento',
      cause: errorDetails.cause
    });
  }
};

// Processar pagamento com cartão
export const processPayment = async (req, res) => {
  try {
    console.log('📥 Dados do pagamento com cartão:', req.body);
    
    const { 
      transaction_amount, 
      description, 
      payment_method_id, 
      payer,
      token,
      installments 
    } = req.body;

    // Validação
    if (!token) {
      return res.status(400).json({ 
        error: 'Token do cartão é obrigatório'
      });
    }

    const body = {
      transaction_amount: Number(transaction_amount),
      description: description || 'Pagamento',
      payment_method_id,
      payer: {
        email: payer.email,
        identification: {
          type: payer.identification.type,
          number: payer.identification.number
        }
      },
      token,
      installments: Number(installments)
    };

    console.log('📤 Enviando pagamento cartão para MP:', JSON.stringify(body, null, 2));

    const result = await payment.create({ body });

    console.log('✅ Pagamento processado:', result);

    return res.json({
      status: result.status,
      status_detail: result.status_detail,
      id: result.id
    });

  } catch (error) {
    console.error("❌ Erro ao processar pagamento:", {
      message: error.message,
      status: error.status,
      apiResponse: error.apiResponse
    });

    const errorDetails = error.apiResponse?.body || error.cause || {};
    
    return res.status(error.status || 500).json({ 
      error: error.message,
      status: error.status,
      details: errorDetails,
      message: errorDetails.message || 'Erro ao processar pagamento'
    });
  }
};

// Verificar status do pagamento
export const checkPaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log('🔍 Verificando status do pagamento:', id);
    
    const result = await payment.get({ id });

    console.log('✅ Status obtido:', result);

    return res.json({
      id: result.id,
      status: result.status,
      status_detail: result.status_detail
    });

  } catch (error) {
    console.error("❌ Erro ao verificar status:", {
      message: error.message,
      status: error.status
    });
    
    return res.status(error.status || 500).json({ 
      error: error.message,
      status: error.status
    });
  }
};