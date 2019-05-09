import { backOff as originalBackOff, IBackOffRequest } from 'exponential-backoff';

let backOff = originalBackOff;

export function setBackOffModule(newModule?: (request: IBackOffRequest<any>) => Promise<any>) {
  backOff = newModule || originalBackOff;
}

export class BackOffRequest {
  private static queue: (() => Promise<any>)[] = [];
  private static clearingQueue = false;

  public static enqueue<T>(request: IBackOffRequest<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      BackOffRequest.enqueueRequest<T>(request, resolve, reject);
      BackOffRequest.clearQueueIfNotAlready();
    });
  }

  private static enqueueRequest<T>(request: IBackOffRequest<T>, resolve, reject) {
    const req = () =>
      backOff<T>(request)
        .then(resolve)
        .catch(reject);
    BackOffRequest.queue.push(req);
  }

  private static async clearQueueIfNotAlready() {
    if (BackOffRequest.clearingQueue) {
      return;
    }

    BackOffRequest.clearingQueue = true;

    while (BackOffRequest.queue.length) {
      const request = BackOffRequest.queue.shift();
      await request();
    }

    BackOffRequest.clearingQueue = false;
  }
}
