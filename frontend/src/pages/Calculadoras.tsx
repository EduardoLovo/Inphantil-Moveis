import CalculadoraPagamento6040 from '../components/Calculadora6040';
import CalculadoraSobMedida from '../components/CalculadoraSobMedida';
import CalculadoraSobMedidaColchao from '../components/CalculadoraSobMedidaColchao';

export const Calculadoras = () => {
    return (
        <>
            <CalculadoraSobMedida />
            <CalculadoraSobMedidaColchao />
            <CalculadoraPagamento6040 />
        </>
    );
};
