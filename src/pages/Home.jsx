import axios from "axios";
import { useEffect } from "react";

function Home() {
  useEffect(() => {
    axios.get("/api/teste")
      .then(res => console.log("RESPOSTA DO BACK:", res.data))
      .catch(err => console.error("ERRO:", err));
  }, []);

  return <div>Home</div>;
}

export default Home;
