import React from "react";
import limpeza from '../img/limpeza.png'
import garantia from '../img/garantia.png'
import vento from '../img/vento.png'

export const Info = () => {
  return (
    <div className="contentInfo fs-6">
      <h2 className="text-center p-5">Informações Importantes!</h2>
      <div className="d-flex justify-content-center align-items-center infochild ">
        <div>
          <img src={garantia} alt='garantia' />
        </div>
        <div className="" >
          <p >
            GARANTIA ⌛ Nossos produtos possuem 1 ano de garantia nas espumas e 180 dias no revestimento. Esta garantia é fornecida pelas indústrias das matérias primas.
          </p>
          <p >
            Em caso de defeito de fabricação ou problemas advindos do transporte entre em contato imediatamente com o setor de atendimento! (Em prazo máximo de 7 dias) 
          </p>
          <p >
            🗓️ ATENÇÃO!!! Trocas e devolução devem ser feitas em até 7 dias do recebimento, o produto não pode ter sido usado e a embalagem deve ser a mesma do envio!
          </p>
        </div>
      </div>
      <hr className="hr"/>
      <div className="d-flex justify-content-center align-items-center infochild">
        <div className="">
          <h2>Limpeza</h2>
          <p>Limpeza da Cama, Tapete e Protetor de parede 🚰 </p>
          <p>
            Para limpar seu produto você deve usar sabão de coco em barra ou sabonete neutro ou infantil e uma esponja macia. 🧼🧽🪣 
          </p>
          <p>
            Coloque água em um recipiente pequeno com o sabão dentro, umedeça a esponja na mistura e passe por toda a peça, deixe agir por 5 minutos e depois retire o sabão com um pano molhado, repita por algumas vezes até retirar todo sabão. Essa limpeza deve ser feita semanal ou quinzenalmente. No dia a dia utilize apenas um pano úmido com água.
          </p>
          <p>
            ⚠️ NÃO UTILIZAR: Veja, detergente líquido, álcool ou demais produtos químicos, pois são agressivos aos materiais utilizados e à saúde de seu filho!
          </p>
          <p>
            🚫 📣 Recomendamos retirar o colchão e colocá-lo em local arejado semanal ou quinzenalmente para evitar que haja proliferação de Mofo e Ácaro. Caso o produto fique em local de alta umidade realizar esse procedimento semanalmente. Utilizar um protetor impermeável auxilia a manter a integridade do colchão, pois evita que absorva líquidos que porventura venha a cair sobre o colchão. Em cidades muito úmidas o tapete de drenagem abaixo do colchão ajuda na ventilação🚱
          </p>
        </div>
        <div className="">
          <img src={limpeza} alt="imagem limpeza"/>
        </div>
      </div>
      <hr className="hr"/>

      <div className="d-flex justify-content-center align-items-center infochild">
          <iframe 
            width="789" 
            height="434" 
            src="https://www.youtube.com/embed/EI-uWTHEtZA" 
            title="Alinhamento de Cama Phant" 
            frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            allowfullscreen
            className="youtubeVideo"
            >
          </iframe>
          <p className="m-5">
            Esse é o vídeo de alinhamento da nossa cama. É muito importante que seja feito de tempos em tempos, pois irá conservar sua cama sempre alinhada.
          </p>
      </div>
      <hr className="hr"/>

      <div className="d-flex justify-content-center align-items-center infochild">
        <p>
          Este é o vídeo de montagem da cama, é importante seguir os passos nele descritos, não alterando a ordem de montagem!
        </p>
        <iframe 
          width="772" 
          height="434" 
          src="https://www.youtube.com/embed/TAtMg7sJZA8" 
          title="Montagem da Cama Montessoriana Phant" 
          frameborder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
          allowfullscreen
          className="youtubeVideo"
          >
        </iframe>
      </div>
      <hr className="hr"/>

      <div className="d-flex justify-content-center align-items-center infochild">
        <div className="">
          <h2>Instalação do protetor de parede</h2>
          <p>
            O mais indicado para instalação do seu protetor é ser feito em 2 pessoas, para que o mesmo fique o mais esticado possível no momento da colagem. A colagem deve ser realizada em etapas, onde o velcro deve ser colado na sequência, inferior, superior, laterais. Caso sua casa tenha rodapé a instalação deve ser feita logo acima do mesmo.
          </p>
          <p>Passo a Passo da instalação:</p>
          <p>
            1. Estique o protetor de parede no local que deseja instalá-lo com o zíper voltado para baixo, em direção ao chão.
          </p>
          <p>
            2. Retire o papel do velcro autoadesivo da parte inferior por partes e vá colando na parede com muito cuidado, pois após colado dificilmente conseguirá retirar sem estragar a parede.
          </p>
          <p>
            3. Verifique se o protetor ficou colado bem esticado e logo acima do rodapé de forma reta antes de continuar a instalação.
          </p>
          <p>
            4. Retire o papel do velcro superior, também por partes, esticar bem o protetor antes de colar para que não fique frouxo e forme uma “barriga”.
          </p>
          <p>
            5. Após colar os velcros inferior e superior retire a fita do velcro lateral de um dos lados e depois do outro e PRONTO! Sua instalação está finalizada.
          </p>
          <p>
            Tome cuidado no momento de colar, pois o velcro é de alta fixação e após colado em sua parede a remoção é muito difícil e deve ser feita com muito cuidado,pois há grandes chances de arrancar a tinta, reboco ou papel de parede. 
          </p>
        </div>
      </div>
      <hr className="hr"/>

      <div className="d-flex justify-content-center align-items-center infochild">
        <img src={vento} alt='vento' />
        <div>
          <p>
            Nós recomendamos deixar o colchão arejando por aproximadamente 48 horas, pois ele é embalado assim que produzido e é necessária a dispersão dos gases voláteis. O cheiro de produto novo pode permanecer por aproximadamente 30 dias, no entanto o nosso produto é totalmente hipoalergênico, não oferecendo risco à saúde da sua família.
          </p>
          <p>
            Sua cama já vai higienizada e pronta para uso, indicamos apenas este cuidado com o colchão!
          </p>
        </div>
      </div>
    </div>
  );
};
