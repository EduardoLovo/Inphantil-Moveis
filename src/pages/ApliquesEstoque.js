import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Api } from "../Api/Api";
import { Filtro } from "../components/Filtro";

export const ApliquesEstoque = () => {
    const [apliques, setApliques] = useState([]);
    const [texto, setTexto] = useState("");

    const loadData = async () => {
    const response = await Api.buildApiGetRequest(Api.readAllApliquesUrl());
    const results = await response.json();
        
    setApliques(results);
  };
    useEffect(() => {
        loadData();
    }, []);

    const navigate = useNavigate();
    
  function compare(a, b) {
    if (a.number < b.number) return -1;
    if (a.number > b.number) return 1;
    return 0;
  }
  apliques.sort(compare);

  const onChange = (e) => {
    setTexto(e.target.value);
};

  return (
    <div>
        <div>
        <div className="position-relative d-flex justify-content-center p-5">
                <div className="input-group mb-3 w-25" >
                <span className="input-group-text bg-black text-white" id="inputGroup-sizing-default">Procurar</span>
                <input 
                    type="text" 
                    className="form-control --bs-primary-bg-subtle" 
                    aria-label="Sizing example input" 
                    aria-describedby="inputGroup-sizing-default"
                    onChange={onChange}
                    value={texto}
                    />
                </div>
            </div>
        </div>

        {!texto ? 
        <div className="container">
        {apliques.map((aplique, index) => (
            <div className="col" key={index}>
                <div className="card border-dark mb-3">
                <img src={aplique.img} className="card-img-top" alt="..."/>
                <div className={aplique.estoque === "Nao" ? "card-body text-danger " : "card-body text-success"}>
                    <h5 className="card-title">{aplique.number} </h5>
                    <p className="card-text ">
                        Estoque: {aplique.quantidade}
                        <button
                            type="button" 
                            className="btn btn-outline-warning "
                            onClick={() => {
                            navigate(`/editar-aplique/${aplique._id}`);
                            }}
                        >
                        Editar
                        </button>
                    </p>
                </div>
                </div>
            </div>  
        ))}
        </div>
        :
        <Filtro apliques={apliques} texto={texto}/>
        }  
    </div>
  )
};