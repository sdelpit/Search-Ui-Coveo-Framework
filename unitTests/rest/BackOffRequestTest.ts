import { IBackOffRequest } from 'exponential-backoff';
import { BackOffRequest, setBackOffModule } from '../../src/rest/BackOffRequest';

export function BackOffRequestTest() {
  describe('BackOffRequest', () => {
    const mockSuccessResponse = { success: true } as any;

    beforeAll(() => stubBackOffDependency());
    afterAll(() => restoreBackOffDependency());

    function stubBackOffDependency() {
      setBackOffModule((request: IBackOffRequest<{}>) => request.fn());
    }

    function restoreBackOffDependency() {
      setBackOffModule();
    }

    function timeUnitsToResolveIn(num: number): Promise<any> {
      const oneTimeUnit = 10;
      return new Promise(resolve => setTimeout(() => resolve(mockSuccessResponse), num * oneTimeUnit));
    }

    it(`when calling #enqueue with a request that resolves successfully,
    it returns the successful response`, done => {
      const request = BackOffRequest.enqueue({ fn: () => Promise.resolve(mockSuccessResponse) });

      request.then(response => {
        expect(response).toBe(mockSuccessResponse);
        done();
      });
    });

    it(`when calling #enqueue with two requests that resolve in one time unit each,
    it processes the requests in series`, done => {
      let firstRequestEnded = false;

      const firstRequest = BackOffRequest.enqueue({ fn: () => timeUnitsToResolveIn(2) });
      const secondRequest = BackOffRequest.enqueue({ fn: () => timeUnitsToResolveIn(1) });

      firstRequest.then(() => (firstRequestEnded = true));
      secondRequest.then(() => {
        expect(firstRequestEnded).toBe(true);
        done();
      });
    });

    it(`when calling #enqueue with a request that returns an error,
    it returns a rejected promise with the error`, done => {
      const error = { error: true };
      const request = BackOffRequest.enqueue({ fn: () => Promise.reject(error) });

      request.catch(e => {
        expect(e).toBe(error);
        done();
      });
    });
  });
}
