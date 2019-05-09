/// <reference path="../bin/ts/CoveoJsSearch.d.ts" />
/// <reference path="./CustomMatcher.d.ts" />
import { $$ } from 'coveo-search-ui';
import { AccessibilityAdvancedSearch } from './AccessibilityAdvancedSearch';
import { AccessibilityAggregate } from './AccessibilityAggregate';
import { AccessibilityBackdrop } from './AccessibilityBackdrop';
import { AccessibilityBadge } from './AccessibilityBadge';
import { AccessibilityBreadcrumb } from './AccessibilityBreadcrumb';
import { AccessibilityCardActionBar } from './AccessibilityCardActionBar';
import { AccessibilityCardOverlay } from './AccessibilityCardOverlay';
import { AccessibilityChatterLikedBy } from './AccessibilityChatterLikedBy';
import { AccessibilityChatterPostAttachment } from './AccessibilityChatterPostAttachment';
import { AccessibilityChatterPostedBy } from './AccessibilityChatterPostedBy';
import { AccessibilityChatterTopic } from './AccessibilityChatterTopic';
import { AccessibilityDidYouMean } from './AccessibilityDidYouMean';
import { AccessibilityErrorReport } from './AccessibilityErrorReport';
import { AccessibilityExcerpt } from './AccessibilityExcerpt';
import { AccessibilityExportToExcel } from './AccessibilityExportToExcel';
import { AccessibilityFacet } from './AccessibilityFacet';
import { AccessibilityFacetRange } from './AccessibilityFacetRange';
import { AccessibilityFacetSlider } from './AccessibilityFacetSlider';
import { AccessibilityFieldTable } from './AccessibilityFieldTable';
import { AccessibilityFieldValue } from './AccessibilityFieldValue';
import { AccessibilityIcon } from './AccessibilityIcon';
import { AccessibilityLogo } from './AccessibilityLogo';
import { AccessibilityMatrix } from './AccessibilityMatrix';
import { AccessibilityPager } from './AccessibilityPager';
import { AccessibilityQuerybox } from './AccessibilityQuerybox';
import { customMatcher } from './CustomMatcher';
import { defaultPage } from './DefaultTestPage';
import { AccessibilityOmnibox } from './AccessibilityOmnibox';
import { AccessibilityPreferencesPanel } from './AccessibilityPreferencesPanel';
import { AccessibilityPrintableUri } from './AccessibilityPrintableUri';
import { AccessibilityQueryDuration } from './AccessibilityQueryDuration';
import { AccessibilityQuickview } from './AccessibilityQuickview';
import { AccessibilityRecommendation } from './AccessibilityRecommendation';
import { AccessibilityResultActionMenu } from './AccessibilityResultActionMenu';
import { AccessibilityResultLayoutSelector } from './AccessibilityResultLayoutSelector';
import { AccessibilityResultLink } from './AccessibilityResultLink';
import { AccessibilityResultsPerPage } from './AccessibilityResultsPerPage';
import { AccessibilitySearchbox } from './AccessibilitySearchbox';
import { AccessibilitySearchButton } from './AccessibilitySearchbutton';
import { AccessibilityShareQuery } from './AccessibilityShareQuery';
import { AccessibilitySimpleFilter } from './AccessibilitySimpleFilter';
import { AccessibilityResultList } from './AccessibilityResultList';
import { AccessibilitySort } from './AccessibilitySort';
import { AccessibilityTab } from './AccessibilityTab';
import { AccessibilityTimespanFacet } from './AccessibilityTimespanFacet';
import { AccessibilityYouTubeThumbnail } from './AccessibilityYouTubeThumbnail';

const initialHTMLSetup = () => {
  const body = jasmine['getGlobal']().document.body;

  if (!$$(body).find('#jasmine-report')) {
    const jasmineReport = $$('div', { id: 'jasmine-report' });
    $$(body).append(jasmineReport.el);
  }

  if (!$$(body).find('#search-page')) {
    const searchPage = $$('div', { id: 'search-page' });
    $$(body).append(searchPage.el);
  }
};

export const setupPageBetweenTest = () => {
  jasmine.addMatchers(customMatcher);
  document.querySelector('#search-page').innerHTML = defaultPage;
};

export const teardownPageBetweenTest = () => {
  Coveo.nuke($$(document.body).find('.CoveoSearchInterface'));
  $$($$(document.body).find('#search-page')).empty();
  const everything = $$(document.body).children();
  everything.forEach(element => {
    if (element.id != 'jasmine-report' && element.id != 'search-page') {
      element.remove();
    }
  });
};

describe('Testing ...', () => {
  beforeAll(done => {
    initialHTMLSetup();
    Coveo.Logger.disable();
    Coveo.SearchEndpoint.configureSampleEndpointV2();
    done();
  });

  beforeEach(() => {
    setupPageBetweenTest();
  });

  afterEach(() => {
    teardownPageBetweenTest();
  });

  AccessibilityAdvancedSearch();
  AccessibilityAggregate();
  AccessibilityBackdrop();
  AccessibilityBadge();
  AccessibilityBreadcrumb();
  AccessibilityCardActionBar();
  AccessibilityCardOverlay();
  AccessibilityChatterLikedBy();
  AccessibilityChatterPostAttachment();
  AccessibilityChatterPostedBy();
  AccessibilityChatterTopic();
  AccessibilityDidYouMean();
  AccessibilityErrorReport();
  AccessibilityExcerpt();
  AccessibilityExportToExcel();
  AccessibilityFacet();
  AccessibilityFacetRange();
  AccessibilityFacetSlider();
  AccessibilityFieldTable();
  AccessibilityFieldValue();
  AccessibilityIcon();
  AccessibilityLogo();
  AccessibilityMatrix();
  AccessibilityOmnibox();
  AccessibilityPager();
  AccessibilityPreferencesPanel();
  AccessibilityPrintableUri();
  AccessibilityQuerybox();
  AccessibilityQueryDuration();
  AccessibilityQuickview();
  AccessibilityRecommendation();
  AccessibilityResultActionMenu();
  AccessibilityResultLayoutSelector();
  AccessibilityResultLink();
  AccessibilityResultList();
  AccessibilityResultsPerPage();
  AccessibilitySearchbox();
  AccessibilitySearchButton();
  AccessibilityShareQuery();
  AccessibilitySimpleFilter();
  AccessibilitySort();
  AccessibilityTab();
  AccessibilityTimespanFacet();
  AccessibilityYouTubeThumbnail();
});
