




export class RetryUtil {

    /**
     * 
     * @param bodyFn : the fx which needs to be retried
     * @param failurePred : is a fx which tells if its a retriable failure
     * @param bodyArgs : args for bodyFn 
     * @param predArgs : args for isRetriable fx 
     * @param sleepSeqInMilliSec : the list of wait times in milli-sec 
     * @returns 
     *  -> result of bodyFn (on any successful attempt)
     *  -> error thrown by bodyFn
     */
    static async withRetry<T, BodyArgs extends any[] , PredArgs extends any[]>(
        bodyFn: (...args1: BodyArgs) => Promise<T>,
        failurePred: (...arg2: PredArgs) => boolean,
        bodyArgs: BodyArgs,
        predArgs: PredArgs,
        sleepSeqInMilliSec: number[],
    ): Promise<T> {
        try {
            const res = await bodyFn(...bodyArgs);
            return res;
        } catch (error) {
            // retry only when 
            // 1. failurePred returns true
            // 2. sleep seq is not empty
            const retryApplicable: boolean = failurePred(...predArgs) && sleepSeqInMilliSec.length > 0;
            if (retryApplicable) {
                const [timeInMillisec, ...remainingSleepSeq] = sleepSeqInMilliSec;
                await this.sleep(timeInMillisec);
                return this.withRetry(bodyFn, failurePred, bodyArgs , predArgs , remainingSleepSeq);
            }else{
                throw error;
            }
        }
    }

    private static sleep(timeInMillisec: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, timeInMillisec));
    }

}