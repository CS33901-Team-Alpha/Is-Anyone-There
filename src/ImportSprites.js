// importSprites.js
// Manager for loading and creating OBJ-based sprites in p5.js (WEBGL)


class ModelSprite {
    constructor(model, opts = {}) {
        this.model = model;

        // Transform defaults
        this.x = opts.x ?? 0;
        this.y = opts.y ?? 0;
        this.z = opts.z ?? 0;

        this.rx = opts.rx ?? 0; // rotation radians
        this.ry = opts.ry ?? 0;
        this.rz = opts.rz ?? 0;

        this.s = opts.scale ?? 1;
        this.layer = opts.layer ?? 0;

        this.spinX = opts.spinX ?? 0; // radians/sec
        this.spinY = opts.spinY ?? 0;
        this.spinZ = opts.spinZ ?? 0;

        this.noStroke = opts.noStroke ?? true;
        this.fillColor = opts.fillColor ?? null; // [r,g,b] or null
    }

    update(dt) {
        this.rx += this.spinX * dt;
        this.ry += this.spinY * dt;
        this.rz += this.spinZ * dt;
    }

    draw() {
        if (!this.model) return;
        push();
        translate(this.x, this.y, this.z);
        rotateX(this.rx);
        rotateY(this.ry);
        rotateZ(this.rz);
        scale(this.s);

        if (this.noStroke) noStroke();
        if (this.fillColor) fill(...this.fillColor);

        model(this.model);
        pop();
    }
}

const importSprites = {
    _defs: [],
    _assets: new Map(),

    // Register asset definitions before preload()
    define(defs) {
        this._defs.push(...defs);
    },

    // Load all defined assets (call from sketch preload())
    preloadAll() {
        this._defs.forEach(def => {
            if (def.type === "model") {
                const normalize = def.normalize !== undefined ? def.normalize : true;
                const m = loadModel(def.path, normalize);
                this._assets.set(def.name, m);
            }
        });
    },

    // Create a new sprite instance from a loaded asset
    create(name, opts = {}) {
        const m = this._assets.get(name);
        if (!m) {
            console.error(`[importSprites] Asset "${name}" not loaded.`);
            return null;
        }
        return new ModelSprite(m, opts);
    }
};

window.importSprites = importSprites;
window.ModelSprite = ModelSprite;
