class Renderer {
    /**
     * Access this via the global R object in your views/objects. 
     * For explanation and help see DOCUMENTATION.md in the root directory of the project.
     */
    constructor() {
        // layers: map of layer index -> array of objects
        this.layers = new Map();

        // objects queued to delete
        this._toRemove = new Set();
    }

    // gets (or creates) array for a layer
    _getLayer(z = 0) {
        if (!this.layers.has(z)) this.layers.set(z, []);
        return this.layers.get(z);
    }

    // adds an object to a specific layer (default 0)
    add(obj, z = 0) {
        obj.__layer = z;
        this._getLayer(z).push(obj);
        return obj;
    }

    // removes an object immediately
    remove(obj) {
        this._toRemove.add(obj);
        this._deleteObjects();
    }

    // safely self removes
    selfRemove(obj) {
        this._toRemove.add(obj);
    }

    // checks if there’s anything to delete and deletes them
    _deleteObjects() {
        if (this._toRemove.size === 0) 
            return;
        for (const [z, arr] of this.layers) {
            this.layers.set(z, arr.filter(o => !this._toRemove.has(o)));
        }
        this._toRemove.clear();
    }

    update(dt) {
        // updates each object in ascending layer order
        for (const z of [...this.layers.keys()].sort((a,b)=>a-b)) {
            for (const o of this.layers.get(z)) {
                if (typeof o.update === "function") o.update(dt);
            }
        }
        // deletes objects on update
        this._deleteObjects();
    }

    draw() {
        // draws each object in ascending layer order
        for (const z of [...this.layers.keys()].sort((a,b)=>a-b)) {
            for (const o of this.layers.get(z)) {
                if (typeof o.draw === "function") o.draw();
            }
        }
    }

    // used for capturing mousePresses or Keyboard Events
    dispatch(methodName, ...args) {
        // top-down so higher layers get events first
        for (const z of [...this.layers.keys()].sort((a,b)=>b-a)) {
            for (const o of this.layers.get(z)) {
                const fn = o[methodName];
                if (typeof fn === "function") fn.apply(o, args);
            }
        }
        this._deleteObjects();
    }

    // clears everything in the renderer
    clear() {
        this.layers.clear();
        this._toRemove.clear();
    }
}
