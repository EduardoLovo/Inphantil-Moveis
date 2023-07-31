import React, { useState } from "react";

export const Calculadora6040 = () => {
  const [resultado, setResultado] = useState("");
  const [valorEntrada, setValorEntrada] = useState("");
  const [valorTotal, setValorTotal] = useState("");

  const calcular = (event) => {
    event.preventDefault();
    const ve = event.target.ve.value;
    const vt = event.target.vt.value;

    const ve6 = ve * (6 / 100);
    const result = vt - ve - ve6;

    setResultado(result.toFixed(2).replace(".", ","));
    setValorEntrada(ve.replace(".", ","));
    setValorTotal(vt.replace(".", ","));
  };

  return (
    <div className="text-center">

      <div className="p-5">
        <h1>Calculadora Á Vista / Prazo</h1>
      </div>

      <div className="row align-items-start p-5">
        <div className="row col">
          <form onSubmit={calcular} className="col"> 
            <div className="mb-3">
              <label for="exampleInputNumber1" className="form-label">Valor da entrada</label>
              <input 
                type="number" 
                className="form-control" 
                id="ve" 
                step="0.01" 
                min="0.01"
              />
            </div>
            <div className="mb-3">
              <label for="exampleInputNumber1" className="form-label">Valor total (sem o valor do frete)</label>
              <input 
                type="number" 
                className="form-control" 
                id="vt" 
                step="0.01" 
                min="0.01"
              />
            </div>
            
            <input className="btnPadrao" type="submit" value="Calcular"></input>
          </form>
          
          <div className=" col">
            <div>
              <h3>Resultado:</h3>
            </div>
            {!resultado ? (
              ""
            ) : (
              <div className="text-amarelo">
                <p>
                  O valor da entrada é: R${" "}
                  <span>
                    {valorEntrada.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")}
                  </span>
                </p>
                <p>
                  O valor total é: R${" "}
                  <span>
                    {valorTotal.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")}
                  </span>
                </p>
                <p>
                  O valor que ficará para o cliente pagar a prazo é: R${" "}
                  <span className="numberResult">
                    {resultado.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")}
                  </span>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>   

    </div>
  );
};
