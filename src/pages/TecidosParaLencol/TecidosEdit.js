import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { Api } from '../../Api/Api';
import { toast } from 'react-toastify';

export const TecidosEdit = () => {
    const params = useParams();
    const id = params.id;
    const navigate = useNavigate();

    const sucesso = () => toast.success("Atualizado com Sucesso!"); 
    const erro = () => toast.error("Erro ao atualizar!");

    const [tecido, setTecido] = useState("");

    useEffect(() => {
        const loadProduct = async () => {
        const response = await Api.buildApiGetRequest(Api.readByIdTecidoUrl(id), true);
        const results = await response.json();
        setTecido(results);
        };

        loadProduct();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const img = e.target.img.value;
        const quantidade = +e.target.quantidade.value;
        const tamanho = e.target.tamanho.value;
        const cor = e.target.cor.value;
        const estoque = e.target.estoque.value;
    
        const payload = {
          img,
          quantidade,
          tamanho,
          cor,
          estoque
        };
    
        const response = await Api.buildApiPatchRequest(
          Api.updateTecidoUrl(id),
          payload,
          true
        );
        if (response.status === 200) {
          // Product updated successfully
          sucesso()
          navigate("/tecidos");
        } else {
          // Error
          erro()
        }
      };
    
      const deleteAplic = async (e) => {
        e.preventDefault();
        const response = await Api.buildApiDeleteRequest(
          Api.deleteTecidoUrl(id),
          true
        );
    
        if (response.status === 200) {
          // Product updated successfully
          navigate("/tecidos");
        } else {
          // Error
          console.log("Erro ao deletar");
        }
      };

    return (
        <div className="contentCreate">
        <div className="text-center m-4">
          <h1>Editar tecido</h1>
        </div>
        <form className="d-flex flex-column align-items-center" onSubmit={handleSubmit}>
          
          <div className="input-group mb-3 w-50">
            <span className="input-group-text" id="inputGroup-sizing-default">Imagem</span>
            <input 
              id="img"
              name="img"
              defaultValue={tecido.img}
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
            defaultValue={tecido.quantidade}
            type="text" 
            className="form-control" 
            aria-label="Sizing example input" 
            aria-describedby="inputGroup-sizing-default"/>
          </div>
  
          <label>Cor: </label>
              <div className="input-group mb-3 w-50">
                  <select id="cor" name="cor" className="form-control"  placeholder="cor">
                  <option>{tecido.cor}</option>
                  <option>Azul</option>
                  <option>Bege</option>
                  <option>Branco</option>
                  <option>Cinza</option>
                  <option>Palha</option>
                  <option>Prata</option>
                  <option>Rosa</option>
                  <option>Rosa Bebe</option>
                  </select> 
              </div>
  
              <label>Tamanho: </label>
              <div className="input-group mb-3 w-50">
                  <select id="tamanho" name="tamanho" className="form-control"  placeholder="cor">
                  <option>{tecido.tamanho}</option>
                  <option>Junior - M</option>
                  <option>Solteiro / Solteirão - G</option>
                  <option>Viuva - GG</option>
                  <option>Casal</option>
                  <option>BQK</option>
                  </select> 
              </div>

              <label>Estoque: </label>
                <div className="input-group mb-3 w-50">
                    <select id="estoque" name="estoque" className="form-control"  placeholder="estoque">
                    <option>{tecido.estoque}</option>
                    <option>Sim</option>
                    <option>Nao</option>
                    </select> 
                </div>
  
          <button className="btnAtu btnBack" type="submit" >
            Atualizar
          </button>   
        </form>
        <div className='text-center m-4'>
            <button className="btnBack btnDel" onClick={deleteAplic}>
                Deletar
            </button>
        </div>
      </div>
    )
}
