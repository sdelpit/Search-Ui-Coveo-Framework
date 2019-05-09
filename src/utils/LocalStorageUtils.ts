var localStorage;

// This check must be made in a try/catch. If cookies are disabled for a
// browser then window.localStorage will throw an undefined exception.
try {
  localStorage = window.localStorage;
} catch (error) {
  localStorage = null;
}

export class LocalStorageUtils<T> {
  constructor(public id: string) {}

  public save(data: T) {
    try {
      if (localStorage != null) {
        localStorage.setItem(this.getLocalStorageKey(), JSON.stringify(data));
      }
    } catch (error) {}
  }

  public load(): T {
    try {
      if (localStorage == null) {
        return null;
      }
      var value = localStorage.getItem(this.getLocalStorageKey());
      return value && JSON.parse(value);
    } catch (error) {
      return null;
    }
  }

  public remove(key?: string) {
    try {
      if (localStorage != null) {
        if (key == undefined) {
          localStorage.removeItem(this.getLocalStorageKey());
        } else {
          var oldObj = this.load();
          delete oldObj[key];
          this.save(oldObj);
        }
      }
    } catch (error) {}
  }

  private getLocalStorageKey() {
    return 'coveo-' + this.id;
  }
}
