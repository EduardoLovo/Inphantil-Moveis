import React from 'react'
import { useNavigate } from 'react-router-dom';
import '../../style/style.css'
import { JwtHandler } from '../../jwt.handler/jwt_handler';

export const Card = (props) => {
    const aplique = props.aplique
    const type = props.type;
    // const display = props.display
    const navigate = useNavigate();

    const log = JwtHandler.isJwtValid();

    if(type === 'adm') {
      return (
          <div className=''>
            <div className="card border-dark mb-3">
              <div className='card-background'>
                <img src={aplique.img} className="card-img-top" alt="..."/>
                <div className="card-body text">
                  <h5 className="card-title">{aplique.number} </h5>
                  <p className={`card-text ${log === false ? 'display' : ''}`} >
                    Estoque: {aplique.quantidade}
                    {type === "adm" ? (
                    <button
                            type="button" 
                            className="btnPadrao "
                            onClick={() => {
                              navigate(`/aplique/${aplique._id}`);
                            }}
                          >
                            Editar
                          </button>
                  ): ""}
                    </p>
                </div>
              </div>
            </div> 
          </div>         
      )
    }else{
      return (
      
      <div className={aplique.quantidade === 0 && aplique.estoque === 'Nao' ? 'display': ''}>
        <div className="card border-dark mb-3">
          <div className='card-background'>
            <img src={aplique.img} className="card-img-top" alt="..."/>
            <div className="card-body text">
              <h5 className="card-title">{aplique.number} </h5>
              <p className={`card-text ${log === false ? 'display' : ''}`} >
                Estoque: {aplique.quantidade}
                </p>
            </div>
          </div>
        </div> 
      </div>
    
      )
    } 
  // return (
  //   <div className=''>
  //     <div className=''>
  //       <div className="card border-dark mb-3">
  //         <div className='card-background'>
  //           <img src={aplique.img} className="card-img-top" alt="..."/>
  //           <div className="card-body text">
  //             <h5 className="card-title">{aplique.number} </h5>
  //             <p className={`card-text ${log === false ? 'display' : ''}`} >
  //               Estoque: {aplique.quantidade}
  //               {type === "adm" ? (
  //               <button
  //                       type="button" 
  //                       className="btnPadrao "
  //                       onClick={() => {
  //                         navigate(`/aplique/${aplique._id}`);
  //                       }}
  //                     >
  //                       Editar
  //                     </button>
  //             ): ""}
  //               </p>
  //           </div>
  //         </div>
  //       </div> 
  //     </div>
  //   </div>
      
                    
  // )
}
