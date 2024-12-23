import { Request, Response } from 'express';
import { UserService } from '../services/userService';

export class UserController {
    static async register(req: Request, res: Response) {
        try {
            const response = await UserService.register(req.body);
            res.status(200).json(response);
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(500).send(error.message);
            } else {
                res.status(500).send('Erro desconhecido');
            }
        }
    }

    static async login(req: Request, res: Response) {
        try {
            const response = await UserService.login(req.body);
            res.status(200).json(response);
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(500).send(error.message);
            } else {
                res.status(500).send('Erro desconhecido');
            }
        }
    }

    static async getUser(req: Request, res: Response) {
        try {
            const response = await UserService.getUser(req.params.cpf);
            res.status(200).json(response);
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(500).send(error.message);
            } else {
                res.status(500).send('Erro desconhecido');
            }
        }
    }

    static async updateUser(req: Request, res: Response) {
        try {
            const response = await UserService.updateUser(req.params.cpf, req.body);
            res.status(200).send(response);
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(500).send(error.message);
            } else {
                res.status(500).send('Erro desconhecido');
            }
        }
    }

    static async deleteUser(req: Request, res: Response) {
        try {
            const response = await UserService.deleteUser(req.params.cpf);
            res.status(200).send(response);
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(500).send(error.message);
            } else {
                res.status(500).send('Erro desconhecido');
            }
        }
    }
}
