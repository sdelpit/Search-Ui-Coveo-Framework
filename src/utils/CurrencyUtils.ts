import { Assert } from '../misc/Assert';
import { Options } from '../misc/Options';
import { Utils } from '../utils/Utils';
import * as Globalize from 'globalize';

export interface ICurrencyToStringOptions {
  decimals?: number;
  symbol?: string;
}

class DefaultCurrencyToStringOptions extends Options implements ICurrencyToStringOptions {
  decimals: number = 0;
  symbol: string;
}

export class CurrencyUtils {
  static currencyToString(value: number, options?: ICurrencyToStringOptions): string {
    if (Utils.isNullOrUndefined(value)) {
      return '';
    }
    value = Number(value);

    Assert.isNumber(value);

    options = new DefaultCurrencyToStringOptions().merge(options);

    var currency = Globalize.culture().numberFormat.currency;
    var backup = currency.symbol;

    if (Utils.isNonEmptyString(options.symbol)) {
      currency.symbol = options.symbol;
    }

    var str = Globalize.format(value, 'c' + options.decimals.toString());
    currency.symbol = backup;

    return str;
  }
}
