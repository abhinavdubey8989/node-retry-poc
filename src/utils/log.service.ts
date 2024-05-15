

import winston, { createLogger, transports, format } from 'winston';
import { Ctx } from '../dto/ctx';
const { combine, timestamp, label, printf, errors, metadata, splat } = format;
import os from 'os';


export class LogService {
    private static instance: LogService;

    private logger: winston.Logger;

    private constructor() {
        const serverId = process.env.SERVER_ID || `server_${os.hostname()}`;

        // create log format
        const logFormat = printf((data: any) => {
            return `[${data.timestamp}] [${data.level}] [${data.metadata.logId}] [${data.label}] [${data.message}]`;
        });

        const sharedLogFileTransport = new transports.File({
            filename: `${process.env.LOG_PATH}/local-app-logs.log`
        });
        const serverSpecificLogFileTransport = new transports.File({
            filename: `${process.env.LOG_PATH}/${serverId}.log`
        });

        // if local env , all instance will put logs into 1 file only
        // if container env , all instances will put logs into seperate conatiner level file
        const finalListOfTransports = (process.env.ENV === 'local') ? [sharedLogFileTransport] : [serverSpecificLogFileTransport];

        // Create a Winston logger instance
        this.logger = createLogger({
            format: combine(
                timestamp(),
                label({ label: serverId }),
                splat(), // Enables string interpolation (%s, %d, etc.)
                metadata({ fillExcept: ['message', 'level', 'timestamp', 'label'] }),
                errors({ stack: true }),
                logFormat
            ),
            transports: finalListOfTransports
        });
    }

    public static getInstance() {
        if (!LogService.instance) {
            LogService.instance = new LogService();
        }
        return LogService.instance;
    }

    // Log methods
    error(ctx: Ctx, message: string): void {
        const { logId } = ctx;
        this.logger.error({ logId, message });
    }

    info(ctx: Ctx, message: string): void {
        const { logId = 'n/a' } = ctx;
        this.logger.info({ logId, message });
    }
}