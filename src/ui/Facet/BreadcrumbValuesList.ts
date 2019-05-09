import * as Globalize from 'globalize';
import { each, filter, first, map, rest } from 'underscore';
import { Assert } from '../../misc/Assert';
import { l } from '../../strings/Strings';
import { $$ } from '../../utils/Dom';
import { IBreadcrumbValueElementKlass } from './BreadcrumbValueElement';
import { Facet } from './Facet';
import { FacetValue } from './FacetValues';

export class BreadcrumbValueList {
  private expanded: FacetValue[];
  private collapsed: FacetValue[];
  protected elem: HTMLElement;
  private valueContainer: HTMLElement;

  constructor(public facet: Facet, public facetValues: FacetValue[], public breadcrumbValueElementKlass: IBreadcrumbValueElementKlass) {
    this.setExpandedAndCollapsed();
    this.elem = $$('div', {
      className: 'coveo-facet-breadcrumb'
    }).el;

    const title = $$('span');
    title.addClass('coveo-facet-breadcrumb-title');
    title.text(this.facet.options.title + ':');
    this.elem.appendChild(title.el);

    this.valueContainer = $$('span', {
      className: 'coveo-facet-breadcrumb-values'
    }).el;

    this.elem.appendChild(this.valueContainer);
  }

  public build(): HTMLElement {
    this.buildExpanded();
    if (this.collapsed.length != 0) {
      this.buildCollapsed();
    }
    return this.elem;
  }

  public buildAsString(): string {
    this.build();
    if (this.elem) {
      return (
        `${this.facet.options.title}: ` +
        map($$(this.elem).findAll('.coveo-facet-breadcrumb-value'), (value: HTMLElement) => {
          return $$(value).text();
        }).join(', ')
      );
    }
    return '';
  }

  private buildExpanded() {
    each(this.expanded, (value: FacetValue, index?: number) => {
      const elementBreadcrumb = new this.breadcrumbValueElementKlass(this.facet, value).build();
      this.valueContainer.appendChild(elementBreadcrumb.el);
    });
  }

  private buildCollapsed() {
    const numberOfSelected = filter(this.collapsed, (value: FacetValue) => value.selected).length;
    const numberOfExcluded = filter(this.collapsed, (value: FacetValue) => value.excluded).length;
    Assert.check(numberOfSelected + numberOfExcluded == this.collapsed.length);

    const elem = $$('div', {
      className: 'coveo-facet-breadcrumb-value'
    });

    const multiCount = $$('span', {
      className: 'coveo-facet-breadcrumb-multi-count'
    });

    multiCount.text(l('NMore', Globalize.format(numberOfSelected + numberOfExcluded, 'n0')));
    elem.append(multiCount.el);

    const valueElements = map(this.collapsed, facetValue => {
      return new this.breadcrumbValueElementKlass(this.facet, facetValue);
    });

    const toolTips = map(valueElements, valueElement => {
      return valueElement.getBreadcrumbTooltip();
    });

    elem.el.setAttribute('title', toolTips.join('\n'));
    elem.on('click', () => {
      const elements: HTMLElement[] = [];
      each(valueElements, valueElement => {
        elements.push(valueElement.build().el);
      });
      each(elements, el => {
        $$(el).insertBefore(elem.el);
      });
      elem.detach();
    });

    this.valueContainer.appendChild(elem.el);
  }

  private setExpandedAndCollapsed() {
    if (this.facetValues.length > this.facet.options.numberOfValuesInBreadcrumb) {
      this.collapsed = rest(this.facetValues, this.facet.options.numberOfValuesInBreadcrumb);
      this.expanded = first(this.facetValues, this.facet.options.numberOfValuesInBreadcrumb);
    } else {
      this.collapsed = [];
      this.expanded = this.facetValues;
    }
  }
}
