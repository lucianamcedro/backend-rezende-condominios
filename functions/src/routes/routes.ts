import { Router } from 'express';
import { UserController } from 'controllers/userController';
import { VisitorController } from 'controllers/visitorController';

export const routes = Router();

routes.post('/register', UserController.register);
routes.post('/login', UserController.login);
routes.get('/user/:cpf', UserController.getUser);
routes.put('/user/:cpf', UserController.updateUser);
routes.delete('/user/:cpf', UserController.deleteUser);

routes.post('/visitor', VisitorController.register);
routes.get('/visitor/:visitorId', VisitorController.getVisitor);
routes.put('/visitor/:visitorId', VisitorController.updateVisitor);
routes.delete('/visitor/:visitorId', VisitorController.deleteVisitor);
