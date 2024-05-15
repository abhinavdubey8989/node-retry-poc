

import { LogService } from './utils/log.service';
import { Ctx } from './dto/ctx';

// load configs
import { config } from 'dotenv';
import ENV_DIR from './config/envDir';
import { RetryUtil } from './utils/retry.util';
const path = require('path')
config({ path: path.resolve(__dirname, ENV_DIR) });


export class UserService {

    private logService: LogService;

    constructor() {
        this.logService = LogService.getInstance();
    }

    async addUser(ctx: Ctx, requestBody: any): Promise<any> {

        const sleepSeq = [1000, 2000, 3000];
        try {
            const { min, max, modBody , modFailurePred } = requestBody;
            const result = await RetryUtil.withRetry(
                this.functionWhichNeedsRetry,
                this.failurePred,
                [ctx, this.logService, min, max, modBody],
                [ctx, this.logService, min, max, modFailurePred],
                sleepSeq
            );
            return { logId : ctx.logId , result, status: "success" };
        } catch (error) {
            return { logId : ctx.logId , result : null, status: "failure" };
        }
    }


    async functionWhichNeedsRetry(ctx: Ctx, logServiceArg: LogService, min: number, max: number, mod: number) {
        const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
        logServiceArg.info(ctx, `[functionWhichNeedsRetry] , randomNum=[${randomNum}] , mod=[${mod}]`)
        if (mod > 0 && ((randomNum % mod) === 0)) {
            return randomNum;
        } else {
            throw new Error(`error in [functionWhichNeedsRetry]`)
        }
    }

    failurePred(ctx: Ctx, logServiceArg: LogService, min: number, max: number, mod: number) {
        const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
        logServiceArg.info(ctx, `[failurePred] , randomNum=[${randomNum}] , mod=[${mod}]`)
        return (mod > 0 && (randomNum % mod) === 0);
    }



}



