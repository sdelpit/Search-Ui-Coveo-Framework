import { IStringMap } from '../../../src/rest/GenericParam';
import { $$, Dom } from '../../../src/utils/Dom';
import { SearchEndpoint } from '../../../src/rest/SearchEndpoint';
import { SearchSectionBuilder } from './SearchSectionBuilder';
import { SectionBuilder } from './SectionBuilder';
export interface IComponentPlaygroundConfiguration {
  show: boolean; // should we show a preview for this component. False is assumed if not specified.
  isResultComponent?: boolean; // is this component supposed to be inserted inside a result template ? False is assumed if not specified
  options?: any; // The options to specify for this component.
  basicExpression?: string; // A basic expression that should be executed for the preview of this component. If not provided, a blank query will be used.
  advancedExpression?: string; // The advanced expression that should be executed for the preview of this component. If not provided, a blank query will be used.
  element?: Dom; // The Dom that should be generated for this component. If not provided, a generic one will be generated.
  toExecute?: Function;
}

declare const Coveo;

const getComponentContainerElement = () => {
  return $$(document.body).find('.component-container');
};

const getSearchInterfaceElement = () => {
  return $$(getComponentContainerElement()).find('.CoveoSearchInterface');
};

const getSearchInterfaceInstance = () => {
  return Coveo.get(getSearchInterfaceElement(), Coveo.SearchInterface);
};

const setMinHeightOnSearchInterface = (minHeight: string) => {
  getSearchInterfaceElement().style.minHeight = minHeight;
};

export const PlaygroundConfiguration: IStringMap<IComponentPlaygroundConfiguration> = {
  SearchInterface: {
    show: false,
    options: {
      autoTriggerQuery: false
    }
  },
  Facet: {
    show: true,
    options: {
      field: '@objecttype',
      title: 'Type'
    }
  },
  Searchbox: {
    show: true,
    options: {
      enableOmnibox: true,
      enableRevealQuerySuggestAddon: true,
      inline: true
    }
  },
  SearchButton: {
    show: true
  },
  Omnibox: {
    show: true,
    options: {
      enableQuerySuggestAddon: true,
      inline: true
    }
  },
  Excerpt: {
    show: true,
    isResultComponent: true,
    basicExpression: 'technology'
  },
  Icon: {
    show: true,
    isResultComponent: true,
    basicExpression: 'getting started pdf'
  },
  Tab: {
    show: true,
    element: new SectionBuilder($$('div', { className: 'coveo-tab-section' }))
      .withComponent('CoveoTab', {
        'data-caption': 'All content',
        'data-id': 'All'
      })
      .withComponent('CoveoTab', {
        'data-caption': 'YouTube videos',
        'data-id': 'YouTube'
      })
      .withComponent('CoveoTab', {
        'data-caption': 'Google Drive',
        'data-id': 'GoogleDrive'
      })
      .withComponent('CoveoTab', {
        'data-caption': 'Emails',
        'data-id': 'Emails'
      })
      .withComponent('CoveoTab', {
        'data-caption': 'Salesforce content',
        'data-id': 'Salesforce'
      })
      .build()
  },
  FacetSlider: {
    show: true,
    options: {
      field: '@date',
      dateField: true,
      queryOverride: '@date>2010/01/01',
      graph: {
        steps: 20
      },
      rangeSlider: true,
      title: 'Date distribution'
    }
  },
  Badge: {
    show: true,
    options: {
      field: '@author'
    },
    isResultComponent: true,
    advancedExpression: '@author=="BBC News"'
  },
  Breadcrumb: {
    show: true,
    element: new SectionBuilder()
      .withComponent('CoveoBreadcrumb')
      .withDomElement($$('p', {}, 'Interact with the facet to modify the breadcrumb'))
      .withComponent('CoveoFacet', {
        'data-field': '@objecttype',
        'data-title': 'Type'
      })
      .build()
  },
  DidYouMean: {
    show: true,
    basicExpression: 'testt',
    element: new SearchSectionBuilder().withComponent('CoveoDidYouMean').build()
  },
  ErrorReport: {
    show: true,
    toExecute: () => {
      Coveo['SearchEndpoint'].endpoints['default'].options.accessToken = 'invalid';
    }
  },
  ExportToExcel: {
    show: true,
    element: new SearchSectionBuilder().withComponent('CoveoExportToExcel').build(),
    toExecute: () => {
      setMinHeightOnSearchInterface('300px');
    }
  },
  FacetRange: {
    show: true,
    options: {
      field: '@size',
      title: 'Documents size',
      ranges: [
        {
          start: 0,
          end: 100,
          label: '0 - 100 KB',
          endInclusive: false
        },
        {
          start: 100,
          end: 200,
          label: '100 - 200 KB',
          endInclusive: false
        },
        {
          start: 200,
          end: 300,
          label: '200 - 300 KB',
          endInclusive: false
        },
        {
          start: 300,
          end: 400,
          label: '300 - 400 KB',
          endInclusive: false
        }
      ],
      sortCriteria: 'alphaascending'
    }
  },
  FieldSuggestions: {
    options: {
      field: '@author',
      headerTitle: 'Authors'
    },
    show: true,
    element: new SearchSectionBuilder()
      .withDomElement(
        $$('div', { className: 'preview-info' }, "Showing suggestions on the field <span class='preview-info-emphasis'>@author</span>")
      )
      .withComponent('CoveoFieldSuggestions')
      .withoutQuerySuggest()
      .build(),
    toExecute: () => {
      setMinHeightOnSearchInterface('500px');
    }
  },
  FieldTable: {
    show: true,
    options: {
      minimizedByDefault: false
    },
    isResultComponent: true,
    advancedExpression: '@connectortype==DropboxCrawler AND @objecttype==File',
    element: new SectionBuilder()
      .withDomElement(
        $$(
          'table',
          { className: 'CoveoFieldTable' },
          `<tbody>
    <tr data-field="@size" data-caption="Document size" data-helper="size"></tr>
     <tr data-field="@source" data-caption="Source"></tr>
     <tr data-field="@date" data-caption="Date" date-helper="dateTime"></tr>
   </tbody>`
        )
      )
      .build()
  },
  FieldValue: {
    show: true,
    options: {
      field: '@date',
      helper: 'dateTime'
    },
    isResultComponent: true,
    advancedExpression: '@date'
  },
  HiddenQuery: {
    show: true,
    options: {
      title: 'This is the filter title'
    },
    toExecute: () => {
      const searchInterface = getSearchInterfaceElement();
      Coveo.$$(searchInterface).on('afterInitialization', () => {
        Coveo.state(searchInterface, 'hd', 'This is the filter description');
        Coveo.state(searchInterface, 'hq', '@uri');
      });
    },
    element: new SectionBuilder()
      .withComponent('CoveoBreadcrumb')
      .withComponent('CoveoHiddenQuery')
      .build()
  },
  HierarchicalFacet: {
    show: true,
    options: {
      field: '@hierarchicfield',
      title: 'Hierarchical Facet with random values'
    },
    toExecute: () => {
      // `@hierarchicfield` does not exist in the sample Coveo Cloud V2 organization.
      $$(getSearchInterfaceElement()).on('newQuery', function(e, args) {
        SearchEndpoint.configureSampleEndpoint();
        Coveo.get($$(getSearchInterfaceElement()).find('.CoveoHierarchicalFacet')).queryController.setEndpoint(
          SearchEndpoint.endpoints['default']
        );
      });
    },
    advancedExpression: '@hierarchicfield'
  },
  Logo: {
    show: true,
    toExecute: () => {
      getSearchInterfaceElement().style.padding = '20px';
    }
  },
  Matrix: {
    show: true,
    options: {
      title: 'Size of documents by Author',
      rowField: '@author',
      columnField: '@filetype',
      columnFieldValues: ['pdf', 'YouTubeVideo', 'xls'],
      computedField: '@size',
      computedFieldFormat: 'n0 bytes',
      columnLabels: ['PDF', 'YouTube Videos', 'Excel documents']
    },
    element: new SectionBuilder().withComponent('CoveoMatrix').build()
  },
  MLFacet: {
    show: true,
    options: {
      field: '@author',
      title: 'Author'
    }
  },
  OmniboxResultList: {
    show: true,
    element: new SearchSectionBuilder()
      .withDomElement(
        $$(
          'div',
          {
            className: 'CoveoOmniboxResultList'
          },
          $$(
            'script',
            {
              className: 'result-template',
              type: 'text/underscore'
            },
            new SectionBuilder()
              .withComponent(
                'CoveoIcon',
                {
                  'data-small': 'true',
                  'data-with-label': 'false',
                  style: 'display:inline-block; vertical-align:middle; margin-right:5px;'
                },
                'span'
              )
              .withComponent('CoveoResultLink', {}, 'a')
              .build()
          )
        )
      )
      .withoutQuerySuggest()
      .build(),
    options: {
      headerTitle: ''
    },
    toExecute: () => {
      setMinHeightOnSearchInterface('500px');
      getSearchInterfaceInstance().options.resultsPerPage = 5;
    }
  },
  Pager: {
    show: true,
    toExecute: () => {
      getSearchInterfaceElement().style.padding = '20px';
    }
  },
  PreferencesPanel: {
    show: true,
    element: new SearchSectionBuilder()
      .withDomElement(
        $$(
          'div',
          {
            className: 'CoveoPreferencesPanel'
          },
          $$('div', { className: 'CoveoResultsPreferences' }),
          $$('div', { className: 'CoveoResultsFiltersPreferences' })
        )
      )
      .build(),
    toExecute: () => {
      setMinHeightOnSearchInterface('300px');
    }
  },
  PrintableUri: {
    show: true,
    isResultComponent: true,
    advancedExpression: '@litopicid @filetype==lithiummessage'
  },
  QueryDuration: {
    show: true
  },
  QuerySummary: {
    show: true
  },
  Querybox: {
    show: true
  },
  Quickview: {
    show: true,
    isResultComponent: true,
    advancedExpression: '@filetype=="youtubevideo"'
  },
  ResultLink: {
    show: true,
    isResultComponent: true,
    advancedExpression: '@filetype=="youtubevideo"'
  },
  ResultList: {
    show: true
  },
  ResultRating: {
    show: true,
    isResultComponent: true,
    toExecute: () => {
      getSearchInterfaceInstance().options.enableCollaborativeRating = true;
    }
  },
  ResultsFiltersPreferences: {
    show: true,
    element: new SearchSectionBuilder()
      .withDomElement(
        $$(
          'div',
          {
            className: 'CoveoPreferencesPanel'
          },
          $$('div', { className: 'CoveoResultsFiltersPreferences' })
        )
      )
      .build(),
    toExecute: () => {
      setMinHeightOnSearchInterface('300px');
    }
  },
  ResultsPerPage: {
    show: true,
    toExecute: () => {
      getSearchInterfaceElement().style.padding = '20px';
    }
  },
  ResultsPreferences: {
    element: new SearchSectionBuilder()
      .withDomElement(
        $$(
          'div',
          {
            className: 'CoveoPreferencesPanel'
          },
          $$('div', { className: 'CoveoResultsPreferences' })
        )
      )
      .build(),
    show: true,
    toExecute: () => {
      setMinHeightOnSearchInterface('300px');
    }
  },
  Settings: {
    show: true,
    element: new SearchSectionBuilder()
      .withComponent('CoveoShareQuery')
      .withComponent('CoveoExportToExcel')
      .withComponent('CoveoAdvancedSearch')
      .build(),
    toExecute: () => {
      setMinHeightOnSearchInterface('300px');
    }
  },
  ShareQuery: {
    show: true,
    element: new SearchSectionBuilder().withComponent('CoveoShareQuery').build(),
    toExecute: () => {
      setMinHeightOnSearchInterface('300px');
    }
  },
  SimpleFilter: {
    show: true,
    options: {
      field: '@filetype',
      title: 'File Type'
    },
    element: new SectionBuilder()
      .withComponent('CoveoSimpleFilter')
      .withComponent('CoveoResultList')
      .build()
  },
  Sort: {
    show: true,
    element: new SectionBuilder()
      .withDomElement(
        new SectionBuilder($$('div', { className: 'coveo-sort-section' }))
          .withComponent(
            'CoveoSort',
            {
              'data-sort-criteria': 'relevancy',
              'data-caption': 'relevancy'
            },
            'span'
          )
          .withComponent(
            'CoveoSort',
            {
              'data-sort-criteria': 'date descending,date ascending',
              'data-caption': 'Date'
            },
            'span'
          )
          .build()
      )
      .withComponent('CoveoResultList')
      .build(),
    toExecute: () => {
      getSearchInterfaceElement().style.padding = '20px';
      $$(getSearchInterfaceElement()).on('buildingQuery', function(e, args) {
        args.queryBuilder.numberOfResults = 3;
      });
    }
  },
  Thumbnail: {
    show: true,
    isResultComponent: true,
    advancedExpression: '@filetype=="youtubevideo"'
  },
  YouTubeThumbnail: {
    show: true,
    isResultComponent: true,
    advancedExpression: '@filetype=="youtubevideo"'
  },
  AdvancedSearch: {
    show: true,
    element: new SearchSectionBuilder().withComponent('CoveoAdvancedSearch').build(),
    toExecute: () => {
      setMinHeightOnSearchInterface('300px');
    }
  },
  TimespanFacet: {
    show: true
  },
  PromotedResultsBadge: {
    show: true,
    element: new SearchSectionBuilder()
      .withComponent('CoveoResultList', {
        'data-layout': 'list'
      })
      .withComponent('CoveoPromotedResultsBadge', {
        'data-show-badge-for-featured-results': true,
        'data-show-badge-for-recommended-results': true
      })
      .build()
  }
};
