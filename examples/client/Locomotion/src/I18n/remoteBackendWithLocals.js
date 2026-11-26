function createBackend(ClassOrObject) {
  if (!ClassOrObject) return null;
  if (typeof ClassOrObject === 'function') return new ClassOrObject();
  return ClassOrObject;
}

class Backend {
  constructor(services, options, i18nextOptions) {
    this.services = services;
    this.options = options || {};
    this.type = 'backend';
    this.init(services, this.options, i18nextOptions);
  }

  init(services, options, i18nextOptions) {
    const opts = options || {};
    this.services = services;
    this.options = opts;
    this.fallbackLng = i18nextOptions && i18nextOptions.fallbackLng;
    this.localResources = opts.localResources || {};
    if (opts.remoteBackend && opts.remoteBackend.type) {
      this.remoteBackend = createBackend(opts.remoteBackend.type);
      this.remoteBackend.init(services, opts.remoteBackend.options, i18nextOptions);
    }
  }

  read(language, namespace, callback) {
    const localResource = this.localResources[language]
      ? this.localResources[language]
      : this.localResources[this.fallbackLng];

    if (!localResource) {
      callback(new Error(`Could not find local resource for language - ${language}`), null);
    } else {
      callback(null, localResource);
    }

    if (this.remoteBackend && typeof this.remoteBackend.read === 'function') {
      this.remoteBackend.read(language, namespace, callback);
    } else {
      callback(new Error('Remote backend is not initialized.'), null);
    }
  }

  create(languages, namespace, key, fallbackValue) {
    if (this.remoteBackend && typeof this.remoteBackend.create === 'function') {
      this.remoteBackend.create(languages, namespace, key, fallbackValue);
    }
  }
}

Backend.type = 'backend';

export default Backend;
