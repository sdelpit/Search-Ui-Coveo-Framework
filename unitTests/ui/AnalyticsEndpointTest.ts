import { AccessToken } from '../../src/rest/AccessToken';
import { AnalyticsEndpoint } from '../../src/rest/AnalyticsEndpoint';
import { IAPIAnalyticsSearchEventsResponse } from '../../src/rest/APIAnalyticsSearchEventsResponse';
import { IErrorResponse } from '../../src/rest/EndpointCaller';
import { Cookie } from '../../src/utils/CookieUtils';
import { FakeResults } from '../Fake';

export function AnalyticsEndpointTest() {
  function buildUrl(endpoint: AnalyticsEndpoint, path: string) {
    return endpoint.options.serviceUrl + '/rest/' + AnalyticsEndpoint.DEFAULT_ANALYTICS_VERSION + path;
  }

  describe('AnalyticsEndpoint', () => {
    let endpoint: AnalyticsEndpoint;

    beforeEach(() => {
      endpoint = new AnalyticsEndpoint({
        serviceUrl: 'foo.com',
        accessToken: new AccessToken('token'),
        organization: 'organization'
      });
      jasmine.Ajax.install();
    });

    afterEach(() => {
      endpoint = null;
      AnalyticsEndpoint.pendingRequest = null;
      jasmine.Ajax.uninstall();
    });

    it('allow to get the current visit id', done => {
      endpoint
        .getCurrentVisitIdPromise()
        .then((res: string) => {
          expect(res).toBe('visitid');
          // Here, the current visit id is already set, so it should return immediately.
          expect(endpoint.getCurrentVisitId()).toBe('visitid');
        })
        .catch((e: IErrorResponse) => {
          fail(e);
          return e;
        })
        .then(() => done());
      expect(jasmine.Ajax.requests.mostRecent().url).toBe(buildUrl(endpoint, '/analytics/visit?org=organization&access_token=token'));
      expect(jasmine.Ajax.requests.mostRecent().method).toBe('GET');

      jasmine.Ajax.requests.mostRecent().respondWith({
        status: '200',
        response: { id: 'visitid' }
      });
    });

    it('allow to sendSearchEvents', done => {
      let fakeSearchEvent = FakeResults.createFakeSearchEvent();
      endpoint
        .sendSearchEvents([fakeSearchEvent])
        .then((res: IAPIAnalyticsSearchEventsResponse) => {
          expect(res.searchEventResponses[0].visitId).toBe('visitid');
          // Here, the current visit id is already set, so it should return immediately.
          expect(endpoint.getCurrentVisitId()).toBe('visitid');
        })
        .catch((e: IErrorResponse) => {
          fail(e);
          return e;
        })
        .then(() => done());

      // Here, the current visit id should be undefined
      expect(endpoint.getCurrentVisitId()).toBeUndefined();
      expect(jasmine.Ajax.requests.mostRecent().method).toBe('POST');
      expect(jasmine.Ajax.requests.mostRecent().requestHeaders['Authorization']).toBe('Bearer token');
      expect(jasmine.Ajax.requests.mostRecent().requestHeaders['Content-Type']).toBe('application/json; charset="UTF-8"');
      expect(JSON.parse(jasmine.Ajax.requests.mostRecent().params)[0]['actionCause']).toBe(fakeSearchEvent.actionCause);
      expect(JSON.parse(jasmine.Ajax.requests.mostRecent().params)[0]['queryPipeline']).toBe(fakeSearchEvent.queryPipeline);
      jasmine.Ajax.requests.mostRecent().respondWith({
        status: 200,
        responseText: JSON.stringify({ searchEventResponses: [{ visitId: 'visitid' }] })
      });
    });

    it('sends organization as parameter when sending a search event', () => {
      let fakeSearchEvent = FakeResults.createFakeSearchEvent();
      endpoint.sendSearchEvents([fakeSearchEvent]);

      expect(jasmine.Ajax.requests.mostRecent().url.indexOf('org=organization') != -1).toBe(true);
    });

    it('sends visitor as parameter when sending a search event and there is a cookie value', () => {
      const fakeSearchEvent = FakeResults.createFakeSearchEvent();
      Cookie.set('visitorId', 'omNomNomNom');
      endpoint.sendSearchEvents([fakeSearchEvent]);

      expect(jasmine.Ajax.requests.mostRecent().url.indexOf('visitor=omNomNomNom') != -1).toBe(true);
    });

    it('does not send visitor as parameter when sending a search event and there is no cookie value', () => {
      const fakeSearchEvent = FakeResults.createFakeSearchEvent();
      Cookie.erase('visitorId');
      endpoint.sendSearchEvents([fakeSearchEvent]);

      expect(jasmine.Ajax.requests.mostRecent().url.indexOf('visitor=') == -1).toBe(true);
    });

    it('allow to getTopQueries', done => {
      endpoint
        .getTopQueries({ pageSize: 10, queryText: 'foobar' })
        .then((res: string[]) => {
          expect(res.length).toBe(3);
          expect(res[0]).toBe('foo');
        })
        .catch((e: IErrorResponse) => {
          fail(e);
          return e;
        })
        .then(() => done());

      const mostRecentRequest = jasmine.Ajax.requests.mostRecent();
      const mostRecentUrl = mostRecentRequest.url;

      expect(mostRecentUrl).toContain('/topQueries');
      expect(mostRecentUrl).toContain('org=organization');
      expect(mostRecentUrl).toContain('access_token=token');
      expect(mostRecentUrl).toContain('pageSize=10');
      expect(mostRecentUrl).toContain('queryText=foobar');

      expect(mostRecentRequest.method).toBe('GET');

      mostRecentRequest.respondWith({
        status: 200,
        response: ['foo', 'bar', 'foobar']
      });
    });
  });
}
