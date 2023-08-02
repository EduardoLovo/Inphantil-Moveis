import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { LencolPECasal } from './LencolPECasal';
import { LencolPEJunior } from './LencolPEJunior';
import { LencolPESolteiro } from './LencolPESolteiro';
import { LencolPESolteiroao } from './LencolPESolteiroao';
import { LencolPEViuva } from './LencolPEViuva';
import { LencolPEQueen } from './LencolPEQueen';
import { JwtHandler } from '../../jwt.handler/jwt_handler';

export const CatalogoLencolPE = () => {
    const navigate = useNavigate();

    const [catalogoLencol, setCatalogoLencol] = useState('')

    const [isLogged] = useState(JwtHandler.isJwtValid);


    const render = (e) => {
        const tamanho = e.target.id
        if (tamanho === 'casal') {
            setCatalogoLencol(<LencolPECasal/>)
        } else if (tamanho === 'junior') {
            setCatalogoLencol(<LencolPEJunior/>)
        } else if (tamanho === 'solteiro') {
            setCatalogoLencol(<LencolPESolteiro/>)
        } else if (tamanho === 'solteiroao') {
            setCatalogoLencol(<LencolPESolteiroao/>)
        } else if (tamanho === 'viuva') {
            setCatalogoLencol(<LencolPEViuva/>)
        } else if (tamanho === 'casal') {
            setCatalogoLencol(<LencolPEJunior/>)
        } else if (tamanho === 'queen') {
            setCatalogoLencol(<LencolPEQueen/>)
        }
    }

    const type = localStorage.getItem("user");

  return (
    <div className="btn-toolbar  menuLencol" role="toolbar" aria-label="Toolbar with button groups">
      <div className="btn-group me-2" role="group" aria-label="First group">
        <button type="button" className="btn btn-secondary" id='junior' onClick={render}>junior</button>
        <button type="button" className="btn btn-secondary" id='solteiro' onClick={render}>Solteiro</button>
        <button type="button" className="btn btn-secondary" id='solteiroao' onClick={render}>Solteiro / Solteirão</button>
        <button type="button" className="btn btn-secondary" id='viuva' onClick={render}>Viuva</button>
        <button type="button" className="btn btn-secondary" id='casal' onClick={render}>Casal</button>
        <button type="button" className="btn btn-secondary" id='queen' onClick={render}>Queen</button>
        {isLogged === true ? 
          <div>
            {type === "adm" ? (
             <button type="button" className="btn btn-warning btn-sm"
             onClick={() => {
               navigate('/createlencol')}}
             >Adicionar novo lençol</button>) : ''}
          </div>
          :
          ''}
        </div>
      <div>
        {catalogoLencol}
      </div>
    </div>
  )
}
