import * as Mock from '../MockEnvironment';
import { Pager } from '../../src/ui/Pager/Pager';
import { registerCustomMatcher } from '../CustomMatchers';
import { $$ } from '../../src/utils/Dom';
import { IBuildingQueryEventArgs } from '../../src/events/QueryEvents';
import { Simulate } from '../Simulate';
import { FakeResults } from '../Fake';
import { QueryBuilder } from '../../src/ui/Base/QueryBuilder';
import { QueryEvents, INoResultsEventArgs } from '../../src/events/QueryEvents';
import { analyticsActionCauseList } from '../../src/ui/Analytics/AnalyticsActionListMeta';
import { IPagerOptions } from '../../src/ui/Pager/Pager';
import { Defer } from '../../src/misc/Defer';

export function PagerTest() {
  describe('Pager', () => {
    let test: Mock.IBasicComponentSetup<Pager>;

    beforeEach(() => {
      registerCustomMatcher();
      test = Mock.basicComponentSetup<Pager>(Pager);
    });

    afterEach(() => {
      test = null;
    });

    it('should set the correct result number when changing page', () => {
      let currentPage = 1;
      $$(test.env.root).on('buildingQuery', (e, args: IBuildingQueryEventArgs) => {
        expect(args.queryBuilder.build().firstResult).toBe(currentPage * 10);
      });
      test.cmp.setPage(++currentPage);
      test.cmp.setPage(++currentPage);
      currentPage--;
      test.cmp.previousPage();
      currentPage++;
      test.cmp.nextPage();
      expect(test.env.queryController.executeQuery).toHaveBeenCalledTimes(4);
    });

    it('should not be possible to set current page to an invalid value', () => {
      test.cmp.setPage('a' as any);
      expect(test.cmp.currentPage).toBe(1);
      test.cmp.setPage('1' as any);
      expect(test.cmp.currentPage).toBe(1);
      test.cmp.setPage(2 as any);
      expect(test.cmp.currentPage).toBe(2);
      test.cmp.setPage(1.7 as any);
      expect(test.cmp.currentPage).toBe(1);
      test.cmp.setPage(1.5 as any);
      expect(test.cmp.currentPage).toBe(1);
      test.cmp.setPage(1.499999 as any);
      expect(test.cmp.currentPage).toBe(1);
      test.cmp.setPage('1.599999' as any);
      expect(test.cmp.currentPage).toBe(1);
      test.cmp.setPage('2.00000' as any);
      expect(test.cmp.currentPage).toBe(2);
      test.cmp.setPage({} as any);
      expect(test.cmp.currentPage).toBe(1);
      test.cmp.setPage(true as any);
      expect(test.cmp.currentPage).toBe(1);
      test.cmp.setPage(false as any);
      expect(test.cmp.currentPage).toBe(1);
      test.cmp.setPage(0 as any);
      expect(test.cmp.currentPage).toBe(1);
    });

    it('should update the state when changing page', () => {
      let currentPage = 1;
      test.cmp.setPage(++currentPage);
      expect(test.env.queryStateModel.set).toHaveBeenCalledWith('first', (currentPage - 1) * 10);
      test.cmp.setPage(++currentPage);
      expect(test.env.queryStateModel.set).toHaveBeenCalledWith('first', (currentPage - 1) * 10);
      currentPage--;
      test.cmp.previousPage();
      expect(test.env.queryStateModel.set).toHaveBeenCalledWith('first', (currentPage - 1) * 10);
      currentPage++;
      test.cmp.nextPage();
      expect(test.env.queryStateModel.set).toHaveBeenCalledWith('first', (currentPage - 1) * 10);
    });

    it('should update page when state is changed', () => {
      test = Mock.advancedComponentSetup<Pager>(
        Pager,
        new Mock.AdvancedComponentSetupOptions(undefined, undefined, env => {
          return env.withLiveQueryStateModel();
        })
      );
      test.cmp.setPage(7);
      expect(test.cmp.currentPage).toBe(7);
      test.env.queryStateModel.set('first', 30);
      expect(test.cmp.currentPage).toBe(4);
    });

    it('should not render anything if only one page of result is returned', () => {
      Simulate.query(test.env, { results: FakeResults.createFakeResults(5) });
      expect(test.cmp.element.querySelectorAll('li').length).toBe(0);
    });

    it('should render the pager boundary correctly', () => {
      // First results start at 70.
      // Pager displays 10 pages by default, and 10 results per page.
      // So the total range should be from results 20 to results 110 (page #3 to page #12)

      const builder = new QueryBuilder();
      builder.firstResult = 70;

      Simulate.query(test.env, {
        query: builder.build(),
        results: FakeResults.createFakeResults(1000)
      });

      const anchors = $$(test.cmp.element).findAll('a.coveo-pager-list-item-text');
      expect($$(anchors[0]).text()).toBe('6');
      expect(anchors[0].parentElement.getAttribute('tabindex')).toBe('0');
      expect($$(anchors[anchors.length - 1]).text()).toBe('10');
    });

    it('should set the aria-label on elements correctly', () => {
      const builder = new QueryBuilder();
      Simulate.query(test.env, {
        query: builder.build(),
        results: FakeResults.createFakeResults(100)
      });

      const anchors = $$(test.cmp.element).findAll('a.coveo-pager-list-item-text');
      expect($$(anchors[0]).text()).toBe('1');
      expect(anchors[0].parentElement.getAttribute('aria-label')).toBe('Page 1');
    });

    it('should not reset page number on a new query if the origin is a pager', () => {
      test.cmp.setPage(6);
      expect(test.cmp.currentPage).toBe(6);
      $$(test.env.root).trigger(QueryEvents.newQuery, {
        origin: test.cmp
      });
      expect(test.cmp.currentPage).toBe(6);
    });

    it('should not reset page number on a new query if the origin is a debug panel', () => {
      test.cmp.setPage(10);
      expect(test.cmp.currentPage).toBe(10);
      $$(test.env.root).trigger(QueryEvents.newQuery, {
        origin: { type: 'Debug' }
      });
      expect(test.cmp.currentPage).toBe(10);
    });

    it('should reset the page number on a new query if the origin is not set', () => {
      test.cmp.setPage(5);
      expect(test.cmp.currentPage).toBe(5);
      $$(test.env.root).trigger(QueryEvents.newQuery, {});
      expect(test.cmp.currentPage).toBe(1);
    });

    it('should reset the page number on a new query if the origin is something not recognized', () => {
      test.cmp.setPage(10);
      expect(test.cmp.currentPage).toBe(10);
      $$(test.env.root).trigger(QueryEvents.newQuery, {
        origin: 'nope not the pager'
      });
      expect(test.cmp.currentPage).toBe(1);
    });

    describe('when queries are performed', () => {
      const execQuery = (
        test: Mock.IBasicComponentSetup<Pager>,
        resultsPerPage: number,
        firstResult: number,
        numberOfResults: number,
        origin?
      ) => {
        test.env.searchInterface.resultsPerPage = resultsPerPage;
        const queryBuilder = new QueryBuilder();
        queryBuilder.numberOfResults = resultsPerPage;
        queryBuilder.firstResult = firstResult;
        const simulation = Simulate.query(test.env, {
          query: queryBuilder.build(),
          queryBuilder,
          results: FakeResults.createFakeResults(numberOfResults),
          origin
        });

        return {
          test,
          simulation
        };
      };

      it('should adapt itself to the number of results on each new query', () => {
        // 10 results per page : show full pager
        // Page 1 to 5
        execQuery(test, 10, 0, 1000);

        let anchors = $$(test.cmp.element).findAll('a.coveo-pager-list-item-text');
        expect($$(anchors[0]).text()).toBe('1');
        expect($$(anchors[anchors.length - 1]).text()).toBe('5');

        // 500 results per page : only 2 page available
        // Page 1 to 2
        execQuery(test, 500, 0, 1000);

        anchors = $$(test.cmp.element).findAll('a.coveo-pager-list-item-text');
        expect($$(anchors[0]).text()).toBe('1');
        expect($$(anchors[anchors.length - 1]).text()).toBe('2');
      });

      it('should return to the last valid page when there is no results and the numberOfResults per page is no standard', () => {
        $$(test.env.root).on(QueryEvents.noResults, (e, args: INoResultsEventArgs) => {
          expect(args.retryTheQuery).toBe(true);
        });
        test.cmp.currentPage = 11;
        execQuery(test, 100, 1000, 0, test.cmp);

        expect(test.cmp.currentPage).toBe(10);
      });

      it('should return to the last valid page when there are less results than expected', done => {
        const { simulation } = execQuery(test, 10, 30, 0, test.cmp);
        simulation.results.totalCountFiltered = 29;
        simulation.results.totalCount = 29;

        Simulate.query(test.env, {
          query: simulation.query,
          queryBuilder: simulation.queryBuilder,
          results: simulation.results,
          origin: test.cmp
        });
        Defer.defer(() => {
          // started at page 4
          // expected to receive more than 30 results in total but received only 29
          // Should go back to last valid page, which is page 3
          expect(test.cmp.currentPage).toBe(3);
          done();
        });
      });
    });

    describe('analytics', () => {
      it('should log the proper event when selecting a page directly', () => {
        test.cmp.setPage(15);
        expect(test.env.usageAnalytics.logCustomEvent).toHaveBeenCalledWith(
          analyticsActionCauseList.pagerNumber,
          { pagerNumber: 15 },
          test.cmp.element
        );
      });

      it('should log the proper event when hitting next page', () => {
        test.cmp.nextPage();
        expect(test.env.usageAnalytics.logCustomEvent).toHaveBeenCalledWith(
          analyticsActionCauseList.pagerNext,
          { pagerNumber: 2 },
          test.cmp.element
        );
      });

      it('should log the proper event when hitting previous page', () => {
        test.cmp.setPage(3);
        test.cmp.previousPage();
        expect(test.env.usageAnalytics.logCustomEvent).toHaveBeenCalledWith(
          analyticsActionCauseList.pagerPrevious,
          { pagerNumber: 2 },
          test.cmp.element
        );
      });
    });

    describe('exposes options', () => {
      it('numberOfPages allow to specify the number of pages to render', () => {
        test = Mock.optionsComponentSetup<Pager, IPagerOptions>(Pager, <IPagerOptions>{
          numberOfPages: 22
        });
        Simulate.query(test.env, {
          results: FakeResults.createFakeResults(1000)
        });
        expect($$(test.cmp.element).findAll('a.coveo-pager-list-item-text').length).toBe(22);
      });

      it('enableNavigationButton can enable or disable nav buttons', () => {
        test = Mock.optionsComponentSetup<Pager, IPagerOptions>(Pager, <IPagerOptions>{
          enableNavigationButton: true
        });
        const builder = new QueryBuilder();
        builder.firstResult = 70;

        Simulate.query(test.env, {
          query: builder.build(),
          results: FakeResults.createFakeResults(1000)
        });
        expect($$(test.cmp.element).findAll('.coveo-pager-previous').length).toBe(1);
        expect($$(test.cmp.element).findAll('.coveo-pager-next').length).toBe(1);

        test = Mock.optionsComponentSetup<Pager, IPagerOptions>(Pager, <IPagerOptions>{
          enableNavigationButton: false
        });

        Simulate.query(test.env, {
          query: builder.build(),
          results: FakeResults.createFakeResults(1000)
        });
        expect($$(test.cmp.element).findAll('.coveo-pager-previous').length).toBe(0);
        expect($$(test.cmp.element).findAll('.coveo-pager-next').length).toBe(0);
      });

      it('maximumNumberOfResultsFromIndex allow to specify the maximum last possible result from the index', () => {
        test = Mock.optionsComponentSetup<Pager, IPagerOptions>(Pager, <IPagerOptions>{
          maximumNumberOfResultsFromIndex: 31
        });
        const builder = new QueryBuilder();
        builder.firstResult = 30;

        Simulate.query(test.env, {
          query: builder.build(),
          results: FakeResults.createFakeResults(1000) // return much more results than 31, but the option should still work properly
        });

        const anchors = $$(test.cmp.element).findAll('a.coveo-pager-list-item-text');
        // 31 results max from the index
        // divided by 10 results per page
        // means 4 pages
        expect($$(anchors[anchors.length - 1]).text()).toBe('4');
      });
    });
  });
}
