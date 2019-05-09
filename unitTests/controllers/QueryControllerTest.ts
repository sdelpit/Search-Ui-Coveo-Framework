import { QueryController } from '../../src/controllers/QueryController';
import { IBuildingQueryEventArgs, QueryEvents } from '../../src/events/QueryEvents';
import { QueryBuilder } from '../../src/ui/Base/QueryBuilder';
import { $$ } from '../../src/utils/Dom';
import { FakeResults } from '../Fake';
import * as Mock from '../MockEnvironment';
import { Simulate } from '../Simulate';

export function QueryControllerTest() {
  describe('QueryController', () => {
    let test: Mock.IBasicComponentSetup<QueryController>;

    beforeEach(() => {
      test = <Mock.IBasicComponentSetup<QueryController>>{};
      test.env = new Mock.MockEnvironmentBuilder().build();
      test.cmp = new QueryController(test.env.root, {}, test.env.usageAnalytics, test.env.searchInterface);
      test.cmp.setEndpoint(test.env.searchEndpoint);
      test.cmp.element = test.env.root;
    });

    afterEach(() => {
      test = null;
    });

    it('should correctly raise errors from the endpoint', done => {
      const spy = <jasmine.Spy>test.env.searchEndpoint.search;
      const error = {
        statusCode: 401,
        data: {
          message: 'the message',
          type: 'the type',
          queryExecutionReport: {}
        }
      };

      spy.and.returnValue(
        new Promise((resolve, reject) => {
          reject(error);
        })
      );

      test.env.searchEndpoint.search = spy;
      expect(
        test.cmp.executeQuery().catch(data => {
          expect(data).toEqual(error);
          done();
        })
      );
    });

    it('should allow to fetchMore', () => {
      test.cmp.fetchMore(50);
      expect(test.env.searchEndpoint.search).toHaveBeenCalledWith(
        jasmine.objectContaining({
          firstResult: 10,
          numberOfResults: 50
        }),
        jasmine.any(Object)
      );
    });

    it('should allow to get the last query', done => {
      $$(test.cmp.element).on(QueryEvents.buildingQuery, (e, args: IBuildingQueryEventArgs) => {
        args.queryBuilder.expression.add('mamamia');
      });
      const search = <jasmine.Spy>test.env.searchEndpoint.search;
      const results = FakeResults.createFakeResults();
      search.and.returnValue(
        new Promise((resolve, reject) => {
          resolve(results);
        })
      );

      test.cmp.executeQuery();
      setTimeout(() => {
        expect(test.cmp.getLastQuery().q).toContain('mamamia');
        done();
      }, 10);
    });

    it('should not return undefined or null when getLastQuery is called and there is no last query', done => {
      const lastQuery = test.cmp.getLastQuery();
      expect(lastQuery).not.toBeNull();
      expect(lastQuery).not.toBeUndefined();
      done();
    });

    it('should allow to get the last query results', done => {
      const search = <jasmine.Spy>test.env.searchEndpoint.search;
      const results = FakeResults.createFakeResults();
      search.and.returnValue(
        new Promise((resolve, reject) => {
          resolve(results);
        })
      );

      test.cmp.executeQuery();
      setTimeout(() => {
        expect(test.cmp.getLastResults()).toEqual(results);
        done();
      }, 10);
    });

    describe('closeModalBox', () => {
      it('should close the modal if the closeModalBox is set to true in the executeQuery options', () => {
        let spy = jasmine.createSpy('spy');
        test.cmp.modalBox = { close: spy };
        test.cmp.executeQuery({ closeModalBox: true });
        expect(spy).toHaveBeenCalled();
      });

      it('should not close the modal if the closeModalBox is set to false in the executeQuery options', () => {
        let spy = jasmine.createSpy('spy');
        test.cmp.modalBox = { close: spy };
        test.cmp.executeQuery({ closeModalBox: false });
        expect(spy).not.toHaveBeenCalled();
      });

      it('should close the modal if the closeModalBox is set to true on the QueryController', () => {
        let spy = jasmine.createSpy('spy');
        test.cmp.modalBox = { close: spy };
        test.cmp.closeModalBox = true;
        test.cmp.executeQuery();
        expect(spy).toHaveBeenCalled();
      });

      it('should not close the modal if the closeModalBox is set to false on the QueryController', () => {
        let spy = jasmine.createSpy('spy');
        test.cmp.modalBox = { close: spy };
        test.cmp.closeModalBox = false;
        test.cmp.executeQuery();
        expect(spy).not.toHaveBeenCalled();
      });

      it('should priorize executeQuery options', () => {
        let spy = jasmine.createSpy('spy');
        test.cmp.modalBox = { close: spy };
        test.cmp.closeModalBox = false;
        test.cmp.executeQuery({ closeModalBox: true });
        expect(spy).toHaveBeenCalled();

        let spy2 = jasmine.createSpy('spy2');
        test.cmp.modalBox = { close: spy2 };
        test.cmp.closeModalBox = true;
        test.cmp.executeQuery({ closeModalBox: false });
        expect(spy2).not.toHaveBeenCalled();
      });

      it('should close the modals by default', () => {
        let spy = jasmine.createSpy('spy');
        test.cmp.modalBox = { close: spy };
        test.cmp.executeQuery();
        expect(spy).toHaveBeenCalled();
      });
    });

    describe('trigger query events', () => {
      it('should trigger newQuery', done => {
        const spy = jasmine.createSpy('spy');
        $$(test.env.root).on('newQuery', spy);
        const search = <jasmine.Spy>test.env.searchEndpoint.search;
        search.and.returnValue(
          new Promise((resolve, reject) => {
            resolve(FakeResults.createFakeResults());
          })
        );

        test.cmp.executeQuery();
        setTimeout(() => {
          expect(spy).toHaveBeenCalledWith(
            jasmine.any(Object),
            jasmine.objectContaining({
              searchAsYouType: false,
              cancel: false,
              origin: undefined
            })
          );
          done();
        }, 10);
      });

      it('should trigger buildingQuery', done => {
        const spy = jasmine.createSpy('spy');
        $$(test.env.root).on('buildingQuery', spy);
        const search = <jasmine.Spy>test.env.searchEndpoint.search;
        search.and.returnValue(
          new Promise((resolve, reject) => {
            resolve(FakeResults.createFakeResults());
          })
        );

        test.cmp.executeQuery();
        setTimeout(() => {
          expect(spy).toHaveBeenCalledWith(
            jasmine.any(Object),
            jasmine.objectContaining({
              queryBuilder: jasmine.any(QueryBuilder),
              searchAsYouType: false,
              cancel: false
            })
          );
          done();
        }, 10);
      });

      it('should trigger doneBuildingQuery', done => {
        const spy = jasmine.createSpy('spy');
        $$(test.env.root).on('doneBuildingQuery', spy);
        const search = <jasmine.Spy>test.env.searchEndpoint.search;
        search.and.returnValue(
          new Promise((resolve, reject) => {
            resolve(FakeResults.createFakeResults());
          })
        );
        test.cmp.executeQuery();
        setTimeout(() => {
          expect(spy).toHaveBeenCalledWith(
            jasmine.any(Object),
            jasmine.objectContaining({
              queryBuilder: jasmine.any(QueryBuilder),
              searchAsYouType: false,
              cancel: false
            })
          );
          done();
        }, 10);
      });

      it('should trigger querySuccess', done => {
        const spy = jasmine.createSpy('spy');
        $$(test.env.root).on('querySuccess', spy);
        const search = <jasmine.Spy>test.env.searchEndpoint.search;
        search.and.returnValue(
          new Promise((resolve, reject) => {
            resolve(FakeResults.createFakeResults());
          })
        );
        test.cmp.executeQuery();

        setTimeout(() => {
          expect(spy).toHaveBeenCalledWith(
            jasmine.any(Object),
            jasmine.objectContaining({
              queryBuilder: jasmine.any(QueryBuilder),
              query: jasmine.any(Object),
              results: jasmine.any(Object),
              searchAsYouType: false
            })
          );
          done();
        }, 10);
      });

      it('should respect the keepLastSearchUid option set to true', async done => {
        test.cmp['lastSearchUid'] = 'foo';
        (test.env.searchEndpoint.search as jasmine.Spy).and.returnValue(Promise.resolve(FakeResults.createFakeResults()));

        const response = await test.cmp.executeQuery({ keepLastSearchUid: true });
        response.results.forEach(res => expect(res.queryUid).toBe('foo'));
        done();
      });

      it('should respect the keepLastSearchUid option set to false', async done => {
        test.cmp['lastSearchUid'] = 'foo';
        (test.env.searchEndpoint.search as jasmine.Spy).and.returnValue(Promise.resolve(FakeResults.createFakeResults()));

        const response = await test.cmp.executeQuery({ keepLastSearchUid: false });
        response.results.forEach(res => expect(res.queryUid).not.toBe('foo'));
        done();
      });

      it('should trigger preprocessResults', done => {
        const spy = jasmine.createSpy('spy');
        $$(test.env.root).on('preprocessResults', spy);
        const search = <jasmine.Spy>test.env.searchEndpoint.search;
        const results = FakeResults.createFakeResults();
        search.and.returnValue(
          new Promise((resolve, reject) => {
            resolve(results);
          })
        );

        test.cmp.executeQuery();
        setTimeout(() => {
          expect(spy).toHaveBeenCalledWith(
            jasmine.any(Object),
            jasmine.objectContaining({
              queryBuilder: jasmine.any(QueryBuilder),
              query: jasmine.any(Object),
              results: results,
              searchAsYouType: false
            })
          );
          done();
        }, 10);
      });

      it('should trigger noResults', done => {
        const spy = jasmine.createSpy('spy');
        $$(test.env.root).on('noResults', spy);
        const search = <jasmine.Spy>test.env.searchEndpoint.search;
        const results = FakeResults.createFakeResults(0);
        search.and.returnValue(
          new Promise((resolve, reject) => {
            resolve(results);
          })
        );

        test.cmp.executeQuery();
        setTimeout(() => {
          expect(spy).toHaveBeenCalledWith(
            jasmine.any(Object),
            jasmine.objectContaining({
              queryBuilder: jasmine.any(QueryBuilder),
              query: jasmine.any(Object),
              results: results,
              searchAsYouType: false,
              retryTheQuery: false
            })
          );
          done();
        }, 10);
      });

      it('should cancel the query if set during an event', () => {
        $$(test.env.root).on('newQuery', (e, args) => {
          args.cancel = true;
        });
        test.cmp.executeQuery();
        expect(test.env.searchEndpoint.search).not.toHaveBeenCalled();
      });
    });

    describe('coveoanalytics', () => {
      let store: CoveoAnalytics.HistoryStore;

      beforeEach(() => {
        store = Simulate.analyticsStoreModule();
        test.cmp.historyStore = store;
        spyOn(store, 'addElement');
      });

      afterEach(() => {
        store = undefined;
        window['coveoanalytics'] = undefined;
      });

      it('should not log the query in the user history if not specified', () => {
        test.cmp.executeQuery({ logInActionsHistory: false });
        expect(store.addElement).not.toHaveBeenCalled();
      });

      it('should log the query in the user history if specified', () => {
        test.cmp.executeQuery({ logInActionsHistory: true });
        expect(store.addElement).toHaveBeenCalled();
      });
    });
  });
}
