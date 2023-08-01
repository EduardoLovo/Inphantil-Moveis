import React, { useEffect, useState } from 'react'
import { Api } from '../../Api/Api';

export const CatalogoDeTecidos = () => {
    const [tecidos, setTecidos] = useState([]);


    const loadData = async () => {
        const response = await Api.buildApiGetRequest(Api.readAllTecidolUrl());
        const results = await response.json();
            
        setTecidos(results);
      };
    
    useEffect(() => {
        loadData();
    }, []);

    function compare(a, b) {
      if (a.cor < b.cor) return -1;
      if (a.cor > b.cor) return 1;
      return 0;
    }
  
    tecidos.sort(compare)

    

  return (
    <div > 
      <h1 className='ms-3'>Links</h1>
      <div className='ms-2'>
          <p className='glassYellow'>
            <a href='./catalogo-junior'>Junior:</a>
            <p>https://inphantil-moveis.vercel.app/tecidosjunior</p>
          </p>
          <p className='glassYellow'>
            <a href='./catalogo-solteiro-solteirao'>Solteiro / Solteirão</a>
            <p>https://inphantil-moveis.vercel.app/tecidosSolteiro</p>
          </p>
          <p className='glassYellow'>
            <a href='./catalogo-viuva'>Viuva</a>
            <p>https://inphantil-moveis.vercel.app/tecidosViuva</p>
          </p>
          <p className='glassYellow'>
            <a href='./catalogo-casal'>Casal</a>
            <p>https://inphantil-moveis.vercel.app/tecidosCasal</p>
          </p>
          <p className='glassYellow'>
            <a href='./catalogo-bqk'>Demais tamanhos</a>
            <p>https://inphantil-moveis.vercel.app/tecidosDemaisTamanhos</p>
          </p>
      </div>
    </div>
  )
}
