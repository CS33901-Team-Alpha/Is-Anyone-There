class InventoryItem {
    constructor(name, spriteName) {
        this.name = name;
        this.spriteName = spriteName;
        this.sprite = SM.get(spriteName);
    }

    getSprite() {
        return this.sprite;
    }
}

class InventoryManager {
    constructor(baseZIndex = 900) {

    }

    update(dt) {
        const m = VM.mouse();

        // Use the bar's *visible* Y position for hover detection
        const barLeft   = this.startX;
        const barRight  = this.startX + this.barWidth;
        const barTop    = this.visibleY;
        const barBottom = this.visibleY + this.barHeight;

        const hovering = (
            m.x >= barLeft &&
            m.x <= barRight &&
            m.y >= barTop &&
            m.y <= barBottom
        );

        const targetY = hovering ? this.visibleY : this.hiddenY;
        this.baseY += (targetY - this.baseY) * 0.2;
    }

    mousePressed(p) {
        const m = p ?? VM.mouse();
        const u = VM.u(), v = VM.v();

        for (let i = 0; i < this.maxSlots; i++) {
            const x = this.startX + this.barPadding + i * (this.slotSize + this.margin);
            const y = this.baseY + this.barPadding;

            const inBounds = (
                m.x >= x &&
                m.x <= x + this.slotSize &&
                m.y >= y &&
                m.y <= y + this.slotSize
            );

            if (inBounds && this.items[i]) {
                this.draggingItem = this.items[i];
                this.dragOffset.x = m.x - x;
                this.dragOffset.y = m.y - y;
                this.items[i] = null; // remove from slot
                break;
            }
        }
    }

    reinsertItem(item) {
    const emptyIndex = this.items.findIndex(i => i === null);
    if (emptyIndex !== -1) {
        this.items[emptyIndex] = item;
    } else {
        console.warn("Inventory full, cannot reinsert:", item.name);
    }
    }

    draw() {
    
    }
}