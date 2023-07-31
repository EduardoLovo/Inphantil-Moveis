import React, { useEffect, useState } from 'react'
import { Api } from '../Api/Api';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const ApliquesEdit = () => {
    const params = useParams();
    const id = params.id;

    const navigate = useNavigate();

    const [aplique, setAplique] = useState("");

    useEffect(() => {
        const loadProduct = async () => {
        const response = await Api.buildApiGetRequest(Api.readByIdUrl(id), true);
        const results = await response.json();
        setAplique(results);
        };

        loadProduct();
    }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const number = e.target.number.value;
    const img = e.target.img.value;
    const quantidade = e.target.quantidade.value;
    const estoque = e.target.estoque.value;

    const payload = {
      number,
      img,
      quantidade,
      estoque
    };

    const response = await Api.buildApiPatchRequest(
      Api.updateUrl(id),
      payload,
      true
    );
    if (response.status === 200) {
      // Product updated successfully
      toast.success("Atualizado com Sucesso!")
      navigate("/apliques-adm");
    

    } else {
      // Error
      toast.error("Erro ao atualizar!")
    }
  };


  const deleteAplic = async (e) => {
    e.preventDefault();
    const response = await Api.buildApiDeleteRequest(
      Api.deleteAplicUrl(id),
      true
    );

    if (response.status === 200) {
      // Product updated successfully
      toast.success("Deletado com Sucesso!")
      navigate("/apliques");
    } else {
      // Error
      toast.error("Erro ao deletar!")
    }
  };

  return (
    <div className="containerEdit">
        <div className="row align-items-center">

          <div className="col d-flex flex-column mb-3 align-items-center">
            <p>{aplique.number}</p>
            <img src={aplique.img} className="w-100  h-auto  p-3" alt='foto do aplique'/>
            <p>Quantidade: {aplique.quantidade}</p>
            <button className="btnBack btnDel" onClick={deleteAplic}>
              Deletar
            </button>
          </div>

          <div className="col">
            <form className="d-flex flex-column align-items-center" onSubmit={handleSubmit}>
              <h3>Editar</h3>
              <div className="input-group mb-3 w-50">
                <span className="input-group-text" id="inputGroup-sizing-default">Nmero</span>
                <input 
                  id="number"
                  name="number"
                  defaultValue={aplique.number} 
                  type="text" 
                  className="form-control" 
                  aria-label="Sizing example input" 
                  aria-describedby="inputGroup-sizing-default"/>
              </div>
              <div className="input-group mb-3 w-50">
                <span className="input-group-text" id="inputGroup-sizing-default">Imagem</span>
                <input 
                  id="img"
                  name="img"
                  defaultValue={aplique.img} 
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
                defaultValue={aplique.quantidade} 
                type="text" 
                className="form-control" 
                aria-label="Sizing example input" 
                aria-describedby="inputGroup-sizing-default"/>
              </div>

              <label>Estoque: </label>
              {aplique.estoque} 
              <div className="input-group mb-3 w-50">
                <select id="estoque" name="estoque" className="form-control" s defaultValue={aplique.estoque} placeholder="Estoque">
                  <option >{aplique.estoque}</option>
                  <option>Sim</option>
                  <option>Nao</option>
                </select> 

              </div>
              <button className="btnAtu btnBack" type="submit" >
                atualizar
              </button>   
            </form>
          </div>

        </div>
    </div>
  );
}
