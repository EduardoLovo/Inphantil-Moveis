import React from 'react'
import { useNavigate } from 'react-router-dom';
import { Api } from "../Api/Api";
import { toast } from 'react-toastify';



export const ApliquesCreate = () => {
 const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    const number = e.target.number.value;
    const img = e.target.img.value;
    const quantidade = +e.target.quantidade.value;
    const estoque = e.target.estoque.value;

    const payload = {
      number: number,
      img: img,
      quantidade: quantidade,
      estoque: estoque
    };

    const response = await Api.buildApiPostRequest(
      Api.addApliquesUrl(),
      payload,
      true
    );
    
    if (response.status === 200) {
      // Product created successfully
      toast.success("Aplique adicionada com sucesso!")
      navigate("/apliques");
    } else {
      // Error
      toast.error("Erro ao adicionar Aplique!")
    }
  };
  return (
    <div className="contentCreate">
      <div className="text-center m-4">
        <h1>Adicionar novo aplique</h1>
      </div>
      <form className="d-flex flex-column align-items-center scale" onSubmit={handleSubmit}>
        <div className="input-group mb-3 w-50 scale">
          <span className="input-group-text" id="inputGroup-sizing-default">Numero</span>
          <input 
            id="number"
            name="number"
            type="text" 
            className="form-control scale" 
            aria-label="Sizing example input" 
            aria-describedby="inputGroup-sizing-default"/>
        </div>
        <div className="input-group mb-3 w-50">
          <span className="input-group-text" id="inputGroup-sizing-default">Imagem</span>
          <input 
            id="img"
            name="img"
            type="text" 
            className="form-control" 
            aria-label="Sizing example input" 
            aria-describedby="inputGroup-sizing-default"/>
        </div>
        <div className="input-group mb-3 w-50">
          <span className="input-group-text" id="inputGroup-sizing-default">Quantidade</span>
          <input 
          id="quantidade"
          name="quantidade"
          type="text" 
          className="form-control" 
          aria-label="Sizing example input" 
          aria-describedby="inputGroup-sizing-default"/>
        </div>

        <label>Estoque: </label>
        <div className="input-group mb-3 w-50">
          <select id="estoque" name="estoque" className="form-control"  placeholder="Estoque">
            <option>Sim</option>
            <option>Nao</option>
          </select> 

        </div>
        <button className="btnAtu btnBack" type="submit" >
          Adicionar
        </button>   
      </form>
    </div>
  );
}
