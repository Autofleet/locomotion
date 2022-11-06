const defaultValueHandler = {
  get(target: any, name: string) {
    // eslint-disable-next-line no-prototype-builtins
    return target.hasOwnProperty(name) ? target[name] : target.defaultValue;
  },
};

export default (baseObj: any) => new Proxy(baseObj, defaultValueHandler);
