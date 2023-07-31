import React, { useEffect, useState } from 'react'
// import { Api } from '../Api/Api';
import { useNavigate } from 'react-router-dom';

export const Filtro = (props) => {
    const apliques = props.apliques
    const navigate = useNavigate()
    const [filtrado, setFiltrado] = useState([]);
    const texto = props.texto
    useEffect(() => {
        const results = apliques.filter((resp) =>
          resp.number.toLowerCase().includes(texto)
        );
        setFiltrado(results);
        // eslint-disable-next-line
      }, [texto]); 


    function compare(a, b) {
        if (a.number < b.number) return -1;
        if (a.number > b.number) return 1;
        return 0;
    }

    filtrado.sort(compare)

    

    return (
        <div>
            {texto === '' ? '' :
            <div className='container'>
                {filtrado.map((aplique, index) => (
                <div className="col alingListCards" key={index}>
                    <div className="card">
                        <img src={aplique.img} className="card-img-top" alt="..."/>
                        <div className={aplique.estoque === "Nao" ? "card-body text-danger" : "card-body text-success"}>
                        <h5 className="card-title">{aplique.number} </h5>
                        <p className="card-text">
                            Estoque = {aplique.quantidade}
                            
                            <button
                            type="button" 
                            className="btn btn-outline-warning"
                            onClick={() => {
                                navigate(`/aplique/${aplique._id}`);
                            }}>
                                Editar
                            </button>
                    
                            </p>
                        </div>
                    </div>
                </div>  
                ))}  
            </div>
             }
    </div>
    )
}