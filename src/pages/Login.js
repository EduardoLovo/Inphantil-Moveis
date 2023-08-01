import React from "react";
import { Api }from "../Api/Api";
import { useNavigate } from "react-router-dom";
import { JwtHandler } from "../jwt.handler/jwt_handler";
import { useState } from "react";
import { useEffect } from "react";

export const Login = () => {
  const navigate = useNavigate();

  const [isLogged, setIsLogged] = useState(JwtHandler.isJwtValid);

  useEffect(() => {
    if(isLogged === true){
      navigate("/")
      console.log(setIsLogged);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
}, [isLogged]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const usuario = e.target.usuario.value;
    const password = e.target.password.value;

    const payload = {
      usuario,
      password,
    };

    const response = await Api.buildApiPostRequest(Api.loginUrl(), payload);
    const body = await response.json();
    localStorage.setItem("user", body.userType);

    if (response.status === 200) {
        const accessToken = body.accessToken;
        JwtHandler.setJwt(accessToken);
        navigate("/");
        window.location.reload();
    } else {
        alert("Usuario ou senha incorreto");
    }
  };

  return (
    <div className="">
      <form onSubmit={handleSubmit} className="formLogin">
        <div className="mb-3">
          <label for="exampleInputEmail1" className="form-label">Usuario</label>
          <input type="text" className="form-control" id="usuario" name="usuario" aria-describedby="emailHelp"/>
        </div>
        <div className="mb-3">
          <label for="exampleInputPassword1" className="form-label">Password</label>
          <input type="password" className="form-control" id="password" name="password" />
        </div> 
        <button type="submit" className=" btnPadrao">Entrar</button>      
      </form>
    </div>
  );
};