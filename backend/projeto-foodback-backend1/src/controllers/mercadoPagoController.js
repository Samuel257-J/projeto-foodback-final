import { Payment } from 'mercadopago';
import client from '../config/mercadopago.js';

const payment = new Payment(client);

// Processar pagamento com cartão
export const processPayment = async (req, res) => {
  try {
    const { 
      transaction_amount, 
      description, 
      payment_method_id, 
      payer,
      token,
      installments 
    } = req.body;

    const body = {
      transaction_amount: Number(transaction_amount),
      description,
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

    const result = await payment.create({ body });

    return res.json({
      status: result.status,
      status_detail: result.status_detail,
      id: result.id
    });

  } catch (error) {
    console.error("Erro ao processar pagamento:", error);
    return res.status(500).json({ 
      error: error.message,
      details: error 
    });
  }
};

// Gerar PIX
export const createPixPayment = async (req, res) => {
  try {
    const { transaction_amount, description, payer } = req.body;

    const body = {
      transaction_amount: Number(transaction_amount),
      description,
      payment_method_id: 'pix',
      payer: {
        email: payer.email,
        identification: {
          type: 'CPF',
          number: payer.cpf.replace(/\D/g, '')
        }
      }
    };

    const result = await payment.create({ body });

    return res.json({
      id: result.id,
      status: result.status,
      qr_code: result.point_of_interaction.transaction_data.qr_code,
      qr_code_base64: result.point_of_interaction.transaction_data.qr_code_base64,
      ticket_url: result.point_of_interaction.transaction_data.ticket_url
    });

  } catch (error) {
    console.error("Erro ao gerar PIX:", error);
    return res.status(500).json({ 
      error: error.message,
      details: error 
    });
  }
};

// Verificar status do pagamento
export const checkPaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await payment.get({ id });

    return res.json({
      id: result.id,
      status: result.status,
      status_detail: result.status_detail
    });

  } catch (error) {
    console.error("Erro ao verificar status:", error);
    return res.status(500).json({ 
      error: error.message 
    });
  }
};