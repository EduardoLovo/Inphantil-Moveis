import React from 'react'
import CapsLock from './CapsLock';

export const Idade = (props) => {
    const idd = props.objeto.idade
    const nome = props.objeto.nome

    if(idd === 25) {
        return (
            <CapsLock>{nome}</CapsLock>
        )
    } else {
        return (
            <div></div>
        )
    }
}
