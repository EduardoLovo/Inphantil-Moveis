// backend/src/payment/dto/create-payment.dto.ts
import { IsString, IsNumber, IsObject, IsNotEmpty } from 'class-validator';

export class CardDataDto {
    @IsString()
    @IsNotEmpty()
    holderName!: string;

    @IsString()
    @IsNotEmpty()
    number!: string;

    @IsString()
    @IsNotEmpty()
    expMonth!: string;

    @IsString()
    @IsNotEmpty()
    expYear!: string;

    @IsString()
    @IsNotEmpty()
    cvv!: string;
}

export class CreateCreditCardPaymentDto {
    @IsString()
    @IsNotEmpty()
    orderId!: string;

    @IsNumber()
    @IsNotEmpty()
    amount!: number;

    @IsObject()
    @IsNotEmpty()
    cardData!: CardDataDto;
}
