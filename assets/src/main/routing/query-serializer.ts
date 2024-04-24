import {parse, stringify} from 'qs';

type Window = {
  location: Location;
};

export class QuerySerializer {
  constructor(private strategy: 'search' | 'hash' = 'search') {}

  parseQueryParams(_window: Window = window) {
    return parse(this.getUrlToParse(_window), { ignoreQueryPrefix: true });
  }

  private getUrlToParse(_window: Window) {
    if (this.strategy === 'search') {
      return _window.location.search;
    }

    if (!_window.location.hash.includes('?')) {
      return '';
    }

    return _window.location.hash.replace(/#\/.+\?/, '');
  }

  stringifyParams(params: object) {
    return stringify(params);
  }
}
