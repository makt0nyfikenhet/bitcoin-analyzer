// Services
import { SentryService } from "@/services";

/**
 * target = class
 * memberName = method
 * reference: https://www.digitalocean.com/community/tutorials/how-to-use-decorators-in-typescript
 * @returns Decorated method
 */
const sendErrorHandler = (): Function => {
  return (target: any, memberName: string) => {
    target[memberName]().catch(SentryService.sendError);
  };
};

export { sendErrorHandler };
