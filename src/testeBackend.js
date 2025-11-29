import axios from "axios";

export async function testarBackend() {
  try {
    const resposta = await axios.get("/teste");
    console.log("Resposta do backend:", resposta.data);
  } catch (error) {
    console.error("Erro ao conectar no backend:", error);
  }
}
