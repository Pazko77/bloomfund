import { Router } from 'express';
import { PaymentIntentsController } from '../controllers/paymentItents.controller';
import { authenticateToken } from '../middlewares/Utilisateur.middleware';

const PaymentIntentsRouter = Router();

PaymentIntentsRouter.post('/create-payment-intent', authenticateToken, PaymentIntentsController.createPaymentIntent);

export default PaymentIntentsRouter;
