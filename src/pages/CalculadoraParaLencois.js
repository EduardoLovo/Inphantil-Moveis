import React from 'react'
import { useState } from 'react';
import '../style/style.css'

export const CalculadoraParaLencois = () => {

    const [resultadoPhant, setResultadoPhant] = useState("");
    const [resultado, setResultado] = useState("");


    const calcularPhant = (e) => {
        e.preventDefault();

        const lar = +e.target.largura.value
        const comp = +e.target.comprimento.value
        const acessorio = e.target.acessorio.value


        //Externo
        const exlar = lar + 2 
        const excomp = comp + 2        

        //Interno
        const inlar = exlar - 14
        const incomp = excomp - 14

        //Colcão
        const collar = inlar - 3
        const colcomp = incomp - 3

        const lenlar = collar + 40        
        
        const lencomp = () => {
            if (acessorio === 'lencol') {
                const lencomp = colcomp + 40
                return lencomp
            } else {
                const lencomp = colcomp + 70
                return lencomp
            }
        }
       

        setResultadoPhant(<div className='fs-5 text text-amarelo'>
            <div>
                <label>Cama Completa: </label>
                <span> {lar} x {comp}</span>
            </div>
            <div className='mt-2'>
                <label>Externo: </label>
                <span> {exlar} x {excomp}</span>
            </div>
            <div className='mt-2'>
                <label>Interno: </label>
                <span> {inlar} x {incomp}</span>
            </div>
            <div className='mt-2'>
                <label>Colchão: </label>
                <span> {collar} x {colcomp}</span>
            </div>
          
            <div className='mt-2'>
                {acessorio === 'lencol'? <label>Lençol: </label>: <label>Virol:</label>}
                
                <span> {lenlar} x {lencomp()}</span>
            </div>

            {acessorio === 'lencol'? 
            <div className='mt-2'>
                <label>Quadrado: </label>
                <span> Padrão</span>
            </div>
            : ''
            }
            
        </div>)
    }

    const calcular = (e) => {
        e.preventDefault();

        const lar = +e.target.largura.value
        const comp = +e.target.comprimento.value
        const alt = +e.target.altura.value
        const acessorio = e.target.acessorio.value

        //Interno
        const inlar = lar + 3
        const incomp = comp + 3

        //Externo
        const exlar = inlar + 14
        const excomp = incomp + 14

        //Altura 
        const dif = alt - 10
        const exalt = dif + 23
        const inalt = dif + 21

        //Lençol
        // const lenlar = lar + 40

        const lenlar = () => {
            if (acessorio === 'lencol') {
                const lenlar = lar + ((alt + 10) * 2)
                return lenlar
            } else {
                const lenlar = lar + 40
                return lenlar
            }
        }

        
        const lencomp = () => {
            if (acessorio === 'lencol') {
                const lencomp = comp + ((alt + 10) * 2)
                return (lencomp)
            } else { 
                const lencomp = comp + 70
                return lencomp
            }
        }

        // const lencomp = colcomp + 40

        setResultado(
        <div className='fs-5 text text-amarelo'>
            <div>
                <label>Colchão: </label>
                <span> {lar} x {comp} x {alt}</span>
            </div>
            <div className='mt-2'>
                <label>Externo: </label>
                <span> {exlar} x {excomp} x {exalt}</span>
            </div>

            <div className='mt-2'>
                <label>Interno: </label>
                <span> {inlar} x {incomp} x {inalt}</span>
            </div>
            
            {acessorio === 'virolLiso'?
            <div className='mt-2'>
                <label>Retangulo: </label>
                <span> {lenlar()} x 50</span>
            </div>: ''}
            <div className='mt-2'>
                {acessorio === 'lencol'? <label>Lençol: </label> : <label>Virol:</label>}
                <span> {lenlar()} x {lencomp()}</span>
            </div>

            {acessorio === 'lencol'? 
            <div className='mt-2'>
                <label>Quadrado: </label>
                <span> {alt + 10} x {alt + 10}</span>
            </div>
            : ''
            }
        </div>
        )

    }

  return (
    <div>
        <div className='p-5 glass2'>
            <h2 className='text-decoration-underline'>Sob Medida com colchão Phant:</h2>
            <div className="row align-items-center ">
                <div className="col">
                    <form onSubmit={calcularPhant}>
                        <div className="mb-3">
                            <label for="exampleInputEmail1" className="form-label">Largura</label>
                            <input type="number" className="form-control" id="largura" aria-describedby="emailHelp"/>
                        </div>
                        <div className="mb-3">
                            <label for="exampleInputPassword1" className="form-label">Comprimento</label>
                            <input type="number" className="form-control" id="comprimento"/>
                        </div>
                        <div className="form-check">
                            <input type="radio" className="form-check-input" id="acessorio" value='lencol' name="radio-stacked" />
                            <label className="form-check-label" for="acessorio">Lençol</label>
                        </div>
                        <div className="form-check mb-3">
                            <input type="radio" className="form-check-input" id="acessorio" value='viral' name="radio-stacked" />
                            <label className="form-check-label" for="acessorio">Virol</label>
                        </div>
                        <button type="submit" className="btnPadrao">Calcular</button>
                    </form>
                </div>
                <div className="col ms-5">
                    <h3>Resultado:</h3>
                    {resultadoPhant}
                </div>
            </div>
        </div>
        <hr className='hr'/>
        <div className='p-5 mt-4'>
            <h2 className='text-decoration-underline'>Sob Medida com colchão do cliente:</h2>
            <div className="row align-items-center ">
                <div className="col">
                    <form onSubmit={calcular}>
                        <div className="mb-3">
                            <label for="exampleInputEmail1" className="form-label">Largura</label>
                            <input type="number" className="form-control" id="largura" aria-describedby="emailHelp"/>
                        </div>
                        <div className="mb-3">
                            <label for="exampleInputPassword1" className="form-label">Comprimento</label>
                            <input type="number" className="form-control" id="comprimento"/>
                        </div>
                        <div className="mb-3">
                            <label for="exampleInputPassword1" className="form-label">Altura</label>
                            <input type="number" className="form-control" id="altura"/>
                        </div>
                        <div className="form-check">
                            <input type="radio" className="form-check-input" id="acessorio" value='lencol' name="radio-stacked" />
                            <label className="form-check-label" for="acessorio">Lençol</label>
                        </div>
                        <div className="form-check ">
                            <input type="radio" className="form-check-input" id="acessorio" value='virolLiso' name="radio-stacked" />
                            <label className="form-check-label" for="acessorio">Virol Liso</label>
                        </div>
                        <div className="form-check mb-3">
                            <input type="radio" className="form-check-input" id="acessorio" value='virol' name="radio-stacked" />
                            <label className="form-check-label" for="acessorio">Virol com Aplique</label>
                        </div>
            
                        <button type="submit" className="btnPadrao">Calcular</button>
                    </form>
                </div>
                <div className="col ms-5">
                    <h3>Resultado:</h3>
                    {resultado}   
                </div>
            </div>
        </div>
    </div>
  )
}
