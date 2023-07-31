import React, { useEffect, useState } from "react";
import { Api } from "../../Api/Api";
import { Card } from "./Card";
import '../../style/style.css'
import { JwtHandler } from "../../jwt.handler/jwt_handler";

export const ListaApliques = (props) => {
    const type = props.type;
    const display = props.display
    console.log(display);
    const comprar = props.comprar
    console.log(comprar);
    const log = JwtHandler.isJwtValid();
    console.log(log);
    const [apliques, setApliques] = useState([]);
 
    const loadData = async () => {
    const response = await Api.buildApiGetRequest(Api.readAllApliquesUrl());
    const results = await response.json();
        
    setApliques(results);
  };
    useEffect(() => {
        loadData();
    }, []);

    
  function compare(a, b) {
    if (a.number < b.number) return -1;
    if (a.number > b.number) return 1;
    return 0;
  }

  apliques.sort(compare);

  console.log(apliques);

  

  return ( 
    <div className="container">   
        {apliques.map((aplique, index) => (
       
              <Card 
                aplique={aplique} 
                type={type} 
                display={display} 
                comprar={comprar}
                key={index}
              />
          
        
        ))}
      </div>
  )
}
