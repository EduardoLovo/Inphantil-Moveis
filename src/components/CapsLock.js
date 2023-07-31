function CapsLock(props){
    const textoInserido = props.children
    const textoEmCapsLock = textoInserido.toUpperCase()
    return textoEmCapsLock
  }

export default CapsLock