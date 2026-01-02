import { Router } from 'express';
import { PaymentIntentsController } from '../controllers/paymentItents.controller';

const PaymentIntentsRouter = Router();

PaymentIntentsRouter.post('/create-payment-intent', PaymentIntentsController.createPaymentIntent);

export default PaymentIntentsRouter;
