
import { Request, Response } from 'express';
import { UserService } from './service';
import { Ctx } from './dto/ctx';

export class UserController {

    private userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    async addUser(req: Request, res: Response) {
        const ctx: Ctx = res.locals.ctx;
        const requestBody = req.body;
        const returnVal = await this.userService.addUser(res.locals.ctx, requestBody);
        res.status(200).json(returnVal);
    }
}
