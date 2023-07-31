function Eduardo(props){
    const textoInserido = props.children
    const textoEmCapsLock = textoInserido.toUpperCase()
    if(textoEmCapsLock === 'EDUARDO') {
        return <div>{textoInserido}</div>
    } else {
        return <div></div>
    }
  }

export default Eduardo