import { Request, Response } from 'express';
import { VisitorService } from '../services/visitorService';

export class VisitorController {
    static async register(req: Request, res: Response) {
        try {
            const response = await VisitorService.register(req.body);
            res.status(200).json(response);
        } catch (error: any) { 
            res.status(500).send(error.message);
        }
    }

    static async getVisitor(req: Request, res: Response) {
        try {
            const response = await VisitorService.getVisitor(req.params.visitorId);
            res.status(200).json(response);
        } catch (error: any) { 
            res.status(500).send(error.message);
        }
    }

    static async updateVisitor(req: Request, res: Response) {
        try {
            const response = await VisitorService.updateVisitor(req.params.visitorId, req.body);
            res.status(200).send(response);
        } catch (error: any) { 
            res.status(500).send(error.message);
        }
    }

    static async deleteVisitor(req: Request, res: Response) {
        try {
            const response = await VisitorService.deleteVisitor(req.params.visitorId);
            res.status(200).send(response);
        } catch (error: any) {
            res.status(500).send(error.message);
        }
    }
}
