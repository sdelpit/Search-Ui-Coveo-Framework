///<reference path="Omnibox.ts"/>
import { Omnibox, IOmniboxSuggestion } from './Omnibox';
import { $$, Dom } from '../../utils/Dom';
import { IQuerySuggestCompletion, IQuerySuggestRequest } from '../../rest/QuerySuggest';
import { ComponentOptionsModel } from '../../models/ComponentOptionsModel';
import {
  OmniboxEvents,
  IPopulateOmniboxSuggestionsEventArgs,
  IBuildingQuerySuggestArgs,
  IQuerySuggestSuccessArgs
} from '../../events/OmniboxEvents';
import { StringUtils } from '../../utils/StringUtils';
import { SuggestionsCache } from '../../misc/SuggestionsCache';
import { map, every, last, indexOf, find } from 'underscore';
import { QUERY_STATE_ATTRIBUTES } from '../../models/QueryStateModel';
import { history } from 'coveo.analytics';
import { Cookie } from '../../utils/CookieUtils';
import { Utils } from '../../utils/Utils';

export interface IQuerySuggestAddon {
  getSuggestion(): Promise<IOmniboxSuggestion[]>;
}

export class QuerySuggestAddon implements IQuerySuggestAddon {
  static INDEX = 60;

  private static suggestiontHtml(suggestion: IQuerySuggestCompletion) {
    return suggestion.highlighted.replace(/\[(.*?)\]|\{(.*?)\}|\((.*?)\)/g, (part, notMatched, matched, corrected) => {
      var className = '';
      if (matched) {
        className = 'coveo-omnibox-hightlight';
      }
      if (corrected) {
        className = 'coveo-omnibox-hightlight2';
      }

      let ret: Dom;
      if (className) {
        ret = $$('span', {
          className: className
        });
      } else {
        ret = $$('span');
      }
      ret.text(notMatched || matched || corrected);
      return ret.el.outerHTML;
    });
  }

  private static isPartialMatch(suggestion: IQuerySuggestCompletion) {
    // groups : 1=notMatched, 2=matched, 3=corrected
    var parts = StringUtils.match(suggestion.highlighted, /\[(.*?)\]|\{(.*?)\}|\((.*?)\)/g);
    var firstFail = find(parts, (part: string[]) => part[1] != null);
    // if no fail found, this is a partial or a full match
    if (firstFail == null) {
      return true;
    }
    // if all right parts are notMatched, the right parts is autocomplete
    return every(last(parts, indexOf(parts, firstFail) - parts.length), (part: string[]) => part[1] != null);
  }

  private cache: SuggestionsCache<IOmniboxSuggestion[]> = new SuggestionsCache();

  constructor(public omnibox: Omnibox) {
    $$(this.omnibox.element).on(OmniboxEvents.populateOmniboxSuggestions, (e: Event, args: IPopulateOmniboxSuggestionsEventArgs) => {
      args.suggestions.push(this.getSuggestion());
    });
  }

  public getSuggestion(): Promise<IOmniboxSuggestion[]> {
    const text = this.omnibox.magicBox.getText();

    return this.cache.getSuggestions(text, () => this.getQuerySuggest(text));
  }

  private async getQuerySuggest(text: string): Promise<IOmniboxSuggestion[]> {
    const payload: IQuerySuggestRequest = {
      q: text,
      locale: this.locale,
      searchHub: this.searchHub,
      pipeline: this.pipeline,
      enableWordCompletion: this.enableWordCompletion,
      context: this.context,
      count: this.count,
      tab: this.tab,
      referrer: document.referrer,
      actionsHistory: this.actionsHistory,
      timezone: this.timezone,
      visitorId: this.visitorId,
      isGuestUser: this.isGuestUser
    };

    $$(this.omnibox.getBindings().searchInterface.element).trigger(OmniboxEvents.buildingQuerySuggest, <IBuildingQuerySuggestArgs>{
      payload
    });

    const results = await this.omnibox.queryController.getEndpoint().getQuerySuggest(payload);
    const completions = results.completions;

    $$(this.omnibox.getBindings().searchInterface.element).trigger(OmniboxEvents.querySuggestSuccess, <IQuerySuggestSuccessArgs>{
      completions
    });

    return map(completions, (completion, i) => {
      return {
        html: QuerySuggestAddon.suggestiontHtml(completion),
        text: completion.expression,
        index: QuerySuggestAddon.INDEX - i / completions.length,
        partial: QuerySuggestAddon.isPartialMatch(completion),
        executableConfidence: completion.executableConfidence
      };
    });
  }

  private get tab() {
    const tab = this.omnibox.getBindings().queryStateModel.get(QUERY_STATE_ATTRIBUTES.T) as string;

    if (Utils.isNonEmptyString(tab)) {
      return tab;
    }

    return undefined;
  }

  private get locale() {
    return String['locale'];
  }

  private get searchHub() {
    return this.omnibox.getBindings().componentOptionsModel.get(ComponentOptionsModel.attributesEnum.searchHub);
  }

  private get pipeline() {
    return this.omnibox.getBindings().searchInterface.options.pipeline;
  }

  private get enableWordCompletion() {
    return this.omnibox.options.enableSearchAsYouType;
  }

  private get context() {
    return this.omnibox.getBindings().searchInterface.getQueryContext();
  }

  private get count() {
    return this.omnibox.options.numberOfSuggestions;
  }

  private get actionsHistory() {
    const historyStore = new history.HistoryStore();
    const historyFromStore = historyStore.getHistory();
    if (historyFromStore == null) {
      return [];
    }
    return historyFromStore;
  }

  private get timezone() {
    return this.omnibox.getBindings().searchInterface.options.timezone;
  }

  private get visitorId() {
    return Cookie.get('visitorId');
  }

  private get isGuestUser() {
    return this.omnibox.getBindings().queryController.getEndpoint().options.isGuestUser;
  }
}

export class VoidQuerySuggestAddon implements IQuerySuggestAddon {
  getSuggestion(): Promise<IOmniboxSuggestion[]> {
    return Promise.resolve([]);
  }
}
