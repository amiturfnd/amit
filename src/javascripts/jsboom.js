const bindAttr = "b-text",
  bindAttrSelector = `[${bindAttr}]`;

class JsBoom {

  #signals = {};
  #Dep = {
    // Name of the currently evaluated computed value
    target: null
  };
  constructor(dataObj) {
    this.data = dataObj;
    this.observeData();
  }

  observe (property, signalHandler) {
    if(!this.#signals[property]) this.#signals[property] = []
    this.#signals[property].push(signalHandler)
  }

  notify (signal) {
    if(!this.#signals[signal] || this.#signals[signal].length < 1) return;

    this.#signals[signal].forEach((signalHandler) => signalHandler());
  }

  makeReactive (key) {
    let val = this.data[key],
      deps = [],
      self = this;
  
    Object.defineProperty(this.data, key, {
      get () {
        // Run only when called within a computed property context
        if (self.#Dep.target) {
          // Add the computed property as depending on this value, if not yet added
          if (!deps.includes(self.#Dep.target)) {
            deps.push(self.#Dep.target)
          }
        }
        return val
      },
      set (newVal) {
        val = newVal;
        // If there are computed properties
        // that depend on this value
        if (deps.length) {
          // Notify each computed property observers
          deps.forEach(self.notify.bind(self));
        }
        self.notify(key);
      }
    })
  }

  makeComputed (key) {
    let computeFunc = this.data[key],
      self = this;
    Object.defineProperty(this.data, key, {
      get () {
        // If there is no target set
        if (!self.#Dep.target) {
          // Set the currently evaluated property as the target
          self.#Dep.target = key
        }

        const value = computeFunc.call(self.data);
        self.#Dep.target = null
        return value
      },
      set () {
        // Do nothing!
      }
    })
  }

  observeData () {
    for (let key in this.data) {
      if (this.data.hasOwnProperty(key)) {
        if (typeof this.data[key] === 'function') {
          this.makeComputed(key)
        } else {
          this.makeReactive(key)
        }
      }
    }
    this.parseDOM(document.body)
  }

  syncNode (node, observable, property) {
    node.textContent = observable[property]
    // We remove the `Seer.` as it is now available for us in our scope.
    this.observe(property, () => node.textContent = observable[property])
  }

  parseDOM (node) {
    const nodes = document.querySelectorAll(bindAttrSelector)

    for (const node of nodes) {
      this.syncNode(node, this.data, node.attributes[bindAttr].value)
    }
  }
}

export default JsBoom;