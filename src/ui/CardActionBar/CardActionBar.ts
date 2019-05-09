import { Component } from '../Base/Component';
import { ComponentOptions } from '../Base/ComponentOptions';
import { IComponentBindings } from '../Base/ComponentBindings';
import { Initialization } from '../Base/Initialization';
import { IQueryResult } from '../../rest/QueryResult';
import { Assert } from '../../misc/Assert';
import { $$ } from '../../utils/Dom';
import { KeyboardUtils, KEYBOARD } from '../../utils/KeyboardUtils';
import * as _ from 'underscore';
import { exportGlobally } from '../../GlobalExports';

import 'styling/_CardActionBar';
import { SVGIcons } from '../../utils/SVGIcons';
import { SVGDom } from '../../utils/SVGDom';

export interface ICardActionBarOptions {
  hidden?: boolean;
  openOnMouseOver?: boolean;
}

/**
 * The `CardActionBar` component displays an action bar at the bottom of a card result (see
 * [Result Layouts](https://developers.coveo.com/x/yQUvAg)). It is a simple container for buttons or complementary
 * information.
 *
 * You should place this component at the bottom of a card result template (i.e., as the last child of the surrounding
 * `coveo-result-frame` div).
 *
 * See [Result Layouts - Using the CardActionBar Component](https://developers.coveo.com/x/yQUvAg#ResultLayouts-UsingtheCardActionBarComponent)
 */
export class CardActionBar extends Component {
  static ID = 'CardActionBar';

  static doExport = () => {
    exportGlobally({
      CardActionBar: CardActionBar
    });
  };

  parentResult: HTMLElement;
  arrowContainer: HTMLElement;
  removedTabIndexElements: HTMLElement[] = [];

  /**
   * @componentOptions
   */
  static options: ICardActionBarOptions = {
    /**
     * Whether to hide the component by default and append a visual indicator to its parent query result.
     *
     * If this option is set to `true`, the component will show itself when the user clicks its parent query result.
     *
     * Default value is `true`.
     */
    hidden: ComponentOptions.buildBooleanOption({ defaultValue: true }),

    /**
     * Whether to open the `CardActionBar` when the cursor hovers over it.
     *
     * This option is only meaningful when [`hidden`]{@link CardActionBar.options.hidden} is set to `true`.
     *
     * Default value is `true`.
     */
    openOnMouseOver: ComponentOptions.buildBooleanOption({ defaultValue: true, depend: 'hidden' })
  };

  /**
   * Creates a new `CardActionBar` component.
   * @param element The HTMLElement on which to instantiate the component.
   * @param options The options for the component.
   * @param bindings The bindings that the component requires to function normally. If not set, these will be
   * automatically resolved (with a slower execution time).
   * @param result The parent [query result]{@link IQueryResult}..
   */
  constructor(
    public element: HTMLElement,
    public options?: ICardActionBarOptions,
    bindings?: IComponentBindings,
    public result?: IQueryResult
  ) {
    super(element, CardActionBar.ID, bindings);
    this.options = ComponentOptions.initComponentOptions(element, CardActionBar, options);

    this.parentResult = $$(this.element).closest('CoveoResult');
    Assert.check(this.parentResult !== undefined, 'ActionBar needs to be a child of a Result');

    if (this.options.hidden) {
      $$(this.parentResult).addClass('coveo-clickable');
      this.appendArrow();
      this.bindEvents();

      _.forEach($$(this.element).findAll('*'), (elem: HTMLElement) => {
        if (elem.hasAttribute('tabindex') && elem.getAttribute('tabindex') == '0') {
          this.removedTabIndexElements.push(elem);
          elem.removeAttribute('tabindex');
        }
      });
    } else {
      this.element.style.transition = 'none';
      this.element.style.transform = 'none';
    }
  }

  /**
   * Shows the component.
   */
  public show() {
    $$(this.element).addClass('coveo-opened');
    _.forEach(this.removedTabIndexElements, (e: Element) => {
      e.setAttribute('tabindex', '0');
    });
  }

  /**
   * Hides the component.
   */
  public hide() {
    $$(this.element).removeClass('coveo-opened');
    _.forEach(this.removedTabIndexElements, (e: Element) => {
      e.removeAttribute('tabindex');
    });
  }

  private bindEvents() {
    $$(this.parentResult).on('click', () => this.show());
    $$(this.parentResult).on('mouseleave', () => this.hide());
    if (this.options.openOnMouseOver) {
      $$(this.arrowContainer).on('mouseenter', () => this.show());
    }
  }

  private appendArrow() {
    this.arrowContainer = $$('div', { className: 'coveo-card-action-bar-arrow-container', tabindex: 0 }).el;
    this.bind.on(this.arrowContainer, 'keyup', KeyboardUtils.keypressAction(KEYBOARD.ENTER, () => this.show()));
    const arrowUp = $$('span', { className: 'coveo-icon coveo-card-action-bar-arrow-icon' }, SVGIcons.icons.arrowUp);
    SVGDom.addClassToSVGInContainer(arrowUp.el, 'coveo-card-action-bar-arrow-svg');
    this.arrowContainer.appendChild(arrowUp.el);
    this.parentResult.appendChild(this.arrowContainer);
  }
}

Initialization.registerAutoCreateComponent(CardActionBar);
