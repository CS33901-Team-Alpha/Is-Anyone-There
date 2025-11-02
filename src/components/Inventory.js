class InventoryItem {
    constructor(name, spriteName, description = "", options = {}) {
        this.id = options.id ?? `${Date.now()}_${Math.floor(Math.random()*10000)}`;
        this.name = name;
        this.spriteName = spriteName;
        this.description = description;
        this.count = options.count ?? 1;
        this.stackable = options.stackable ?? true;
        this.source = options.source ?? null; // reference to world/source object (optional)
        this._claimed = false; // internal flag if this item is currently held in inventory
        this.sprite = SM.get(spriteName) ?? SM.get("defaultIcon");
    }

    increment(n = 1) {
        this.count = (this.count || 0) + n;
    }

    getSprite() {
        return this.sprite;
    }
}

class InventoryManager {
  constructor(baseZIndex = 900) {
    // ...existing constructor code...
    this.maxSlots = 9; // or however many slots you want visible
    
    this.items = Array(this.maxSlots).fill(null);

    this.baseZIndex = baseZIndex;

    this.baseY = -3; // Start hidden above screen
    this.visibleY = 0.5; // Slide to this Y when visible
    this.hiddenY = -2.6;

    this.innerSpriteScale = 1; // scale relative to slot size

    this.slotSize = 1.2;           // size of each slot box
    this.spriteSize = 1.2;         // size of the item sprite inside
    this.innerSpriteScale = 1.0;   // keep full spriteSize for now
    this.margin = 0.1;

    const slotAreaWidth = this.maxSlots * (this.slotSize + this.margin) - this.margin;
    const barPadding = 0.3;
    this.barWidth = slotAreaWidth + barPadding * 2;
    this.barHeight = this.slotSize + barPadding * 2;
    this.startX = (16 - this.barWidth) / 2;
    this.barPadding = barPadding;

    const totalWidth = this.maxSlots * (this.spriteSize + this.margin) - this.margin;

    this.hoverZoneWidth = 2;

    this.hoverZone = {
        x: this.startX + this.barWidth / 2 - this.hoverZoneWidth / 2,
        y: 0.5,
        width: this.hoverZoneWidth,
        height: 0.5
        };

    this.draggingItem = null;
    this.dragOffset = { x: 0, y: 0 };

    this.COMBINATION_RULES = {
        "Ascorbic Acid+Chionodoxa siehei": "Hormone Stabilizer",
        "Ascorbic Acid+Erythroxylum coca": "Cytoprotection Agent",
        "Cytoprotection Agent+Inferon Alpha Protein": "NeuroShield Complex",
        "Chionodoxa siehei+Erythroxylum coca": "NeuroEnhancer",
        "Chionodoxa siehei+Inferon Alpha Protein": "Immune Modulator",
        // Add more as needed
    };


    this.promptActive = false;
    this.promptOptions = ["Combine", "Use", "Drop", "Cancel"];
    this.promptSelectedIndex = 0;
    this.promptItemA = null;
    this.promptItemB = null;
    this.promptSlotIndex = -1;

    this.promptBounds = {
        x: 6,
        y: 2,
        width: 4,
        height: this.promptOptions.length * 0.6 + 0.4
    };

    this.dragOriginIndex = -1;
    this.promptItemReinserted = false;
    this.promptHoveredIndex = -1;
    this.feedbackMessage = "";
    this.feedbackTimer = 0;

    this.usableItems = ["NeuroShield Complex"]; // Add more as needed

    this.promptItemWasDragged = false; // NEW: track whether prompt item was removed from inventory (drag flow)
    this.promptOriginalSlotForDragged = -1; // store origin slot when dragging -> prompt
  }

  // Add an InventoryItem or raw data. options may include { source: <object>, preferredIndex }
  addItem(newItem, options = {}) {
      let item;
      if (newItem instanceof InventoryItem) {
          item = newItem;

         // If caller passed a source in options but the InventoryItem instance doesn't have it,
         // attach it here so callers that construct InventoryItem themselves still link to the source.
         if (options.source && !item.source) {
             item.source = options.source;
         }
      } else {
          item = new InventoryItem(newItem.name, newItem.spriteName, newItem.description ?? "", options);
      }

      // If the source requires single-use, respect its claim flag.  Otherwise allow multiple pickups.
      if (item.source && item.source.singleUse === true) {
          if (item.source._inventoryClaimed) {
              console.warn("Source already claimed (single-use), skipping add:", item.name);
              return false;
          }
      }

      // Try stacking
      if (item.stackable) {
          for (let i = 0; i < this.items.length; i++) {
              const s = this.items[i];
              if (s && s.name === item.name && s.stackable) {
                  s.increment(item.count);
                  if (item.source) {
                      s.source = item.source;
                      if (s.source.singleUse === true) { s.source._inventoryClaimed = true; s._claimed = true; }
                  }
                  return true;
              }
          }
      }

      // Preferred slot?
      const preferred = Number.isInteger(options.preferredIndex) ? options.preferredIndex : -1;
      if (preferred >= 0 && preferred < this.items.length && this.items[preferred] === null) {
          this.items[preferred] = item;
          if (item.source && item.source.singleUse === true) { item.source._inventoryClaimed = true; item._claimed = true; }
          return true;
      }

      // first empty non-action slot
      const emptyIndex = this.items.findIndex((i, idx) => i === null && idx !== this.maxSlots - 1);
      if (emptyIndex !== -1) {
          this.items[emptyIndex] = item;
          if (item.source && item.source.singleUse === true) { item.source._inventoryClaimed = true; item._claimed = true; }
          return true;
      }

      console.warn("Inventory full, cannot add:", item.name);
      return false;
  }

  // Right-click inspect now opens the action prompt for that slot instead of creating a standalone InspectComponent.
  inspectItemBySlotIndex(slotIndex) {
    const item = this.items[slotIndex];
    if (!item) return false;

    this.promptActive = true;
    this.promptItemA = item;
    this.promptItemB = null;
    this.promptSlotIndex = slotIndex;
    this.promptSelectedIndex = 0;
    this.promptItemReinserted = false;

    // this prompt was opened from the slot (not a drag) so mark as not-dragged
    this.promptItemWasDragged = false;
    this.promptOriginalSlotForDragged = -1;

    const isUsable = this.usableItems.includes(item.name);
    // Build prompt options based on context (include Inspect)
    this.promptOptions = isUsable ? ["Use", "Inspect", "Drop", "Cancel"] : ["Inspect", "Drop", "Cancel"];
    this.updatePromptBounds();
    return true;
  }

  update(dt) {
    // ...existing update code...
    const m = VM.mouse();
    const u = VM.u(), v = VM.v();


    // Inventory hover logic...
    const barLeft = this.startX;
    const barRight = this.startX + this.barWidth;
    const barTop = this.visibleY;
    const barBottom = this.visibleY + this.barHeight;

    const hoveringInventory = (
        m.x >= barLeft &&
        m.x <= barRight &&
        m.y >= barTop &&
        m.y <= barBottom
    );

    if (this.promptActive) {
        const m = VM.mouse();
        this.promptHoveredIndex = -1;

        for (let i = 0; i < this.promptOptions.length; i++) {
            const ox = this.promptBounds.x + 0.3;
            const oy = this.promptBounds.y + 0.3 + i * 0.6;
            const ow = this.promptBounds.width - 0.6;
            const oh = 0.5;

            if (this.isInBounds(ox, oy, ow, oh, m)) {
                this.promptHoveredIndex = i;
                break;
            }
        }
    }

    const targetY = (hoveringInventory || this.promptActive) ? this.visibleY : this.hiddenY;
    this.baseY += (targetY - this.baseY) * 0.2;
  }

  combineItems(items) {
      // items: array of InventoryItem objects
      const names = items.map(i => i.name).sort();
      const key = names.join("+");
      const resultName = this.COMBINATION_RULES[key];
      if (resultName) {
          return new InventoryItem(resultName, resultName + "Sprite", `Synthesized compound of ${names.join(", ")}`, { stackable: false });
      } else {
          this.showFeedback(`No known reaction between ${names.join(" + ")}`);
          return null;
      }
  }

  updatePromptBounds() {
      const optionHeight = 0.6;
      const padding = 0.4;
      this.promptBounds.height = this.promptOptions.length * optionHeight + padding;
  }

  isInBounds(x, y, w, h, m) {
      return m && m.x >= x && m.x <= x + w && m.y >= y && m.y <= y + h;
  }

  mousePressed(p) {
      const m = p ?? VM.mouse();

      if (mouseButton === RIGHT) {
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
              // open prompt for that slot (allows Drop from prompt)
              this.inspectItemBySlotIndex(i);
              return;
          }
          }
      }

      // ...rest of existing mousePressed logic (drag/prompt handling)...
      if (this.promptActive) {
          const m = p ?? VM.mouse();

          // If clicked on a prompt option
          if (this.promptHoveredIndex !== -1) {
              const choice = this.promptOptions[this.promptHoveredIndex];
              this.executePromptChoice(choice);
              this.promptActive = false;
              this.promptItemA = null;
              this.promptItemB = null;
              this.promptSlotIndex = -1;
              this.promptItemReinserted = false;
              this.promptHoveredIndex = -1;
              return;
          }

          // If clicked outside prompt and inventory, cancel
          const inPrompt = this.isInBounds(
              this.promptBounds.x,
              this.promptBounds.y,
              this.promptBounds.width,
              this.promptBounds.height,
              m
          );

          const barLeft = this.startX;
          const barRight = this.startX + this.barWidth;
          const barTop = this.baseY;
          const barBottom = this.baseY + this.barHeight;

          const inInventory = (
              m.x >= barLeft &&
              m.x <= barRight &&
              m.y >= barTop &&
              m.y <= barBottom
          );

          if (!inPrompt && !inInventory) {
              if (!this.promptItemReinserted && this.promptItemA && this.dragOriginIndex !== -1) {
                  this.reinsertItem(this.promptItemA, this.dragOriginIndex);
              }

              this.promptActive = false;
              this.promptItemA = null;
              this.promptItemB = null;
              this.promptSlotIndex = -1;
              this.promptItemReinserted = false;
              this.promptHoveredIndex = -1;
          }

          return; // Block drag logic while prompt is active
      }

      // Drag logic continues (keeps original behaviour)
      const barLeft = this.startX;
      const barRight = this.startX + this.barWidth;
      const barTop = this.baseY;
      const barBottom = this.baseY + this.barHeight;

      const inInventory = (
          m.x >= barLeft &&
          m.x <= barRight &&
          m.y >= barTop &&
          m.y <= barBottom
      );

      // If prompt is active and click is outside both prompt and inventory, close it
      if (this.promptActive && !inPrompt && !inInventory) {
          this.reinsertItem(this.promptItemA);
          this.promptActive = false;
          this.promptItemA = null;
          this.promptItemB = null;
          this.promptSlotIndex = -1;
          return;
      }

      // If prompt is active and click is inside, do nothing (let Enter handle selection)
      if (this.promptActive) return;

      // Drag logic
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
              this.items[i] = null;
              this.dragOriginIndex = i;
              break;
          }
      }   
  }

  // Ensure we don't reinsert the same object if it's already present
  reinsertItem(item, preferredIndex = -1) {
    if (!item) return;
    // If item reference is already in inventory, do nothing
    if (this.items.some(it => it === item)) return;

    if (preferredIndex !== -1 && this.items[preferredIndex] === null) {
      this.items[preferredIndex] = item;
      if (item.source && item.source.singleUse === true) { item.source._inventoryClaimed = true; item._claimed = true; }
      return;
    }

    const emptyIndex = this.items.findIndex(i => i === null);
    if (emptyIndex !== -1) {
      this.items[emptyIndex] = item;
      if (item.source && item.source.singleUse === true) { item.source._inventoryClaimed = true; item._claimed = true; }
    } else {
      console.warn("Inventory full, cannot reinsert:", item.name);
    }
  }

  mouseReleased(p) {
    // Get current mouse position, or use provided one
    const m = p ?? VM.mouse();

    // Exit early if no item is being dragged
    if (!this.draggingItem) return;

    // Loop through all inventory slots
    for (let i = 0; i < this.maxSlots; i++) {
      // Calculate slot position
      const x = this.startX + this.barPadding + i * (this.slotSize + this.margin);
      const y = this.baseY + this.barPadding;

      // Check if mouse is within this slot's bounds
      const inBounds = (
        m.x >= x &&
        m.x <= x + this.slotSize &&
        m.y >= y &&
        m.y <= y + this.slotSize
      );

      // If mouse is over this slot
      if (inBounds) {
        // Check if it's the last slot (action slot)
        const isLastSlot = i === this.maxSlots - 1;

        // Get item currently in this slot
        const targetItem = this.items[i];

        if (isLastSlot) {
          // Action slot: never stores items, triggers prompt
          this.promptActive = true; // Show prompt
          this.promptItemA = this.draggingItem; // Store dragged item
          this.promptItemB = null; // No target item
          this.promptSlotIndex = i; // Track slot index
          this.promptSelectedIndex = 0; // Default prompt selection
          this.promptItemReinserted = true; // Mark item as reinserted

          // Mark that the prompt item came from a drag so we can reinsert on cancel/failure
          this.promptItemWasDragged = true;
          this.promptOriginalSlotForDragged = this.dragOriginIndex;

          // Determine if item is usable (final product)
          const isUsable = this.usableItems.includes(this.draggingItem.name);

          // Set prompt options based on item type (include Inspect)
          this.promptOptions = isUsable
            ? ["Use", "Inspect", "Drop", "Cancel"] // Final products can be used
            : ["Inspect", "Drop", "Cancel"]; // Molecules can be inspected or dropped

          this.updatePromptBounds(); // Resize prompt box
        } else if (targetItem) {
          // Dropped onto another item: trigger combination prompt
          this.promptActive = true; // Show prompt
          this.promptItemA = this.draggingItem; // Store dragged item
          this.promptItemB = targetItem; // Store target item
          this.promptSlotIndex = i; // Track slot index
          this.promptSelectedIndex = 0; // Default prompt selection
          this.promptItemReinserted = true; // Mark item as reinserted

          // dragged -> remember original slot for reinsertion if needed
          this.promptItemWasDragged = true;
          this.promptOriginalSlotForDragged = this.dragOriginIndex;

          this.promptOptions = ["Combine", "Cancel"]; // Only allow combination or cancel
          this.updatePromptBounds(); // Resize prompt box
        } else {
          // Dropped into empty slot: store item
          this.items[i] = this.draggingItem;
        }

        // Clear drag state
        this.draggingItem = null;
        this.dragOriginIndex = -1;

        // Exit after handling drop
        return;
      }
    }
    // If not over a slot, drop into world (or cancel)
    // If the dragged item had a source, mark source available again
    if (this.draggingItem && this.draggingItem.source) {
      // Always notify the source that the item was dropped; if the source is reusable, it should remain available.
      if (typeof this.draggingItem.source.onDroppedToWorld === "function") {
        this.draggingItem.source.onDroppedToWorld(this.draggingItem, p);
      }
      if (this.draggingItem.source.singleUse === true) {
        this.draggingItem.source._inventoryClaimed = false;
      }
    }
    this.draggingItem = null;
    this.dragOriginIndex = -1;
  }

  // Open the InspectComponent for an inventory item (used from prompt Inspect option)
  openInspectForItem(item, slotIndex = -1) {
    if (!item) return;
    const inspect = new InspectComponent(
      item.name,
      item.description,
      item.spriteName,
      "Drop",
      () => {
        // action callback from the inspect UI -> drop this item
        this._dropItemFromInspect(item);
        // remove inspect UI
        R.remove(inspect);
      },
      {}
    );
    R.add(inspect, 999);
    inspect.onEnter?.();

    // If the item came from a drag prompt (we removed it from inventory) we consider it still "held out"
    // don't change inventory until drop happens or inspect closed by its own mechanics.
  }

  // helper used by Inspect action to drop item
  _dropItemFromInspect(item) {
    // find in inventory, remove and notify source/world; if not found assume held out
    const index = this.items.findIndex(i => i === item);
    if (index !== -1) {
      const it = this.items[index];
      if (it.source) {
        if (typeof it.source.onDroppedToWorld === "function") {
          it.source.onDroppedToWorld(it, null);
        } else if (typeof it.source.onReturn === "function") {
          it.source.onReturn(it, null);
        }
        if (it.source.singleUse === true) it.source._inventoryClaimed = false;
      } else if (typeof window.spawnDroppedItem === "function") {
        window.spawnDroppedItem(it, null);
      }
      this.items[index] = null;
      this.showFeedback(`Dropped ${item.name}.`);
      return true;
    }

    // if not present (maybe was dragged-out), notify source and finish
    if (item && item.source) {
      if (typeof item.source.onDroppedToWorld === "function") {
        item.source.onDroppedToWorld(item, null);
      } else if (typeof item.source.onReturn === "function") {
        item.source.onReturn(item, null);
      }
      if (item.source.singleUse === true) item.source._inventoryClaimed = false;
      this.showFeedback(`Dropped ${item.name}.`);
      return true;
    }

    // fallback
    if (typeof window.spawnDroppedItem === "function") {
      window.spawnDroppedItem(item, null);
      this.showFeedback(`Dropped ${item.name}.`);
      return true;
    }

    this.showFeedback(`Could not drop ${item.name}.`);
    return false;
  }

  // ...existing code...

  executePromptChoice(choice, overrideItemA = null) {
    // Optional override lets tests / external callers provide an item directly
    const itemA = overrideItemA ?? this.promptItemA ?? (this.promptSlotIndex !== -1 ? this.items[this.promptSlotIndex] : null);
    const itemB = this.promptItemB ?? null;

    if (!itemA && choice !== "Cancel") {
      this.showFeedback("No item selected.");
      // clear prompt state safely
      this.promptItemA = null;
      this.promptItemB = null;
      this.promptSlotIndex = -1;
      this.promptItemReinserted = false;
      this.promptItemWasDragged = false;
      this.promptOriginalSlotForDragged = -1;
      this.promptActive = false;
      return;
    }

    switch (choice) {
      case "Combine": {
        if (!itemA || !itemB) {
          this.showFeedback("Both items required to combine.");
          break;
        }
        const result = this.combineItems([itemA, itemB]);

        if (result) {
          // Remove originals wherever they are (only after success)
          for (let i = 0; i < this.items.length; i++) {
            if (this.items[i] === itemA || this.items[i] === itemB) {
              if (this.items[i].source && this.items[i].source.singleUse === true) this.items[i].source._inventoryClaimed = false;
              this.items[i] = null;
            }
          }
          this.addItem(result);
          this.showFeedback(`Created ${result.name}!`);
        } else {
          if (this.promptItemWasDragged) {
            if (itemA) this.reinsertItem(itemA, this.promptOriginalSlotForDragged);
            if (itemB) this.reinsertItem(itemB, this.promptSlotIndex);
          }
          this.showFeedback("Cannot combine these items.");
        }
        break;
      }

      case "Use": {
        const itemName = itemA?.name;
        const isUsable = this.usableItems.includes(itemName);

        if (isUsable) {
          this.showFeedback(`You used ${itemName}.`);
          if (itemName === "NeuroShield Complex") this._onCureComplete(itemName);

          const index = this.items.findIndex(i => i === itemA);
          if (index !== -1) {
            if (this.items[index].source && this.items[index].source.singleUse === true) this.items[index].source._inventoryClaimed = false;
            this.items[index] = null;
          }
        } else {
          this.showFeedback(`${itemName} cannot be used directly.`);
        }
        break;
      }

      case "Inspect": {
        this.openInspectForItem(itemA, this.promptSlotIndex);
        break;
      }

      case "Drop": {
        this.showFeedback(`Dropped ${itemA.name}.`);
        const index = this.items.findIndex(i => i === itemA);
        if (index !== -1) {
          const it = this.items[index];
          if (it.source) {
            if (typeof it.source.onDroppedToWorld === "function") it.source.onDroppedToWorld(it, null);
            else if (typeof it.source.onReturn === "function") it.source.onReturn(it, null);
            if (it.source.singleUse === true) it.source._inventoryClaimed = false;
          } else if (typeof window.spawnDroppedItem === "function") {
            window.spawnDroppedItem(it, null);
          }
          this.items[index] = null;
        } else {
          // item not in slots (maybe dragged); still notify its source
          const it = itemA;
          if (it && it.source) {
            if (typeof it.source.onDroppedToWorld === "function") it.source.onDroppedToWorld(it, null);
            else if (typeof it.source.onReturn === "function") it.source.onReturn(it, null);
            if (it.source.singleUse === true) it.source._inventoryClaimed = false;
          } else if (it && typeof window.spawnDroppedItem === "function") {
            window.spawnDroppedItem(it, null);
          }
        }
        break;
      }

      case "Cancel": {
        if (!this.promptItemReinserted && this.promptItemA) {
          if (this.promptItemWasDragged) {
            this.reinsertItem(this.promptItemA, this.promptOriginalSlotForDragged);
          }
        }
        this.showFeedback("Action cancelled.");
        break;
      }
    }

    // clear prompt state
    this.promptItemA = null;
    this.promptItemB = null;
    this.promptSlotIndex = -1;
    this.promptItemReinserted = false;
    this.promptItemWasDragged = false;
    this.promptOriginalSlotForDragged = -1;
    this.promptActive = false;
  }

  // Convenience: drop an item programmatically (uses executePromptChoice under the hood)
  dropItem(item) {
    if (!item) return false;
    this.executePromptChoice('Drop', item);
    return true;
  }

  // Convenience: add an item using a world source without needing to build InventoryItem manually
  addItemFromSource(data, source, options = {}) {
    const opts = Object.assign({}, options, { source });
    return this.addItem(data, opts);
  }
  
  showFeedback(msg) {
    this.feedbackMessage = msg;
    this.feedbackTimer = 120; // show for 2 seconds at 60fps
  }

  draw() {
    // ...existing draw implementation unchanged...
    const u = VM.u(), v = VM.v();
    const totalWidth = this.maxSlots * (this.spriteSize + this.margin) - this.margin;
    const slotAreaWidth = this.maxSlots * (this.slotSize + this.margin) - this.margin;
    const barPadding = 0.3; // padding around the slot area
    const barWidth = slotAreaWidth + barPadding * 2;
    const barHeight = this.slotSize + barPadding * 2;
    const startX = this.startX;

    // Draw inventory background bar
    push();
    fill(10, 10, 10, 220); // darker background
    stroke(255);
    strokeWeight(2);
    rect(startX * u, this.baseY * v, barWidth * u, barHeight * v);
    pop();

    push();
    fill(255, 255, 0, 200);
    stroke(0);
    strokeWeight(2);
    triangle(
    this.hoverZone.x * u, this.hoverZone.y * v,
    (this.hoverZone.x + this.hoverZone.width) * u, this.hoverZone.y * v,
    (this.hoverZone.x + this.hoverZone.width / 2) * u, (this.hoverZone.y + 0.3) * v
    );
    pop();

    // Draw each slot
    for (let i = 0; i < this.maxSlots; i++) {
        const x = startX + this.barPadding + i * (this.slotSize + this.margin);
        const y = this.baseY + this.barPadding;

        const isLastSlot = i === this.maxSlots - 1;

        // Draw slot box
        if (isLastSlot) {
            push();
            fill(100, 0, 0, 180); // red tint for action slot
            stroke(255);
            strokeWeight(2);
            rect(x * u, y * v, this.slotSize * u, this.slotSize * v);
            pop();

            push();
            fill(255);
            textAlign(CENTER, CENTER);
            textFont(terminusFont);
            textSize(0.4 * v);
            text("Action", (x + this.slotSize / 2) * u, (y + this.slotSize / 2) * v);
            pop();
        } else {
            const bgSprite = SM.get("inventorySlotBackground");
            if (bgSprite) {
                bgSprite.setSize(this.slotSize, this.slotSize);
                bgSprite.setPos(x, y);
                bgSprite.draw();
            } else {
                push();
                fill(60, 60, 60, 220);
                stroke(255);
                strokeWeight(2);
                rect(x * u, y * v, this.slotSize * u, this.slotSize * v);
                pop();
            }
        }

        // Draw item if present
        const item = this.items[i];
        if (item && !isLastSlot) {
            const offset = (this.slotSize - this.spriteSize) / 2;
            // Defensive: sprite may be undefined or not implement expected API
            if (item.sprite && typeof item.sprite.setSize === 'function' && typeof item.sprite.setPos === 'function' && typeof item.sprite.draw === 'function') {
                item.sprite.setSize(this.spriteSize, this.spriteSize);
                item.sprite.setPos(x + offset, y + offset);
                item.sprite.draw();
            } else {
                // Fallback: draw a simple placeholder box + name if sprite missing
                push();
                fill(120, 120, 120);
                stroke(255);
                rect((x + offset) * u, (y + offset) * v, this.spriteSize * u, this.spriteSize * v);
                fill(255);
                textAlign(CENTER, CENTER);
                textFont(terminusFont);
                textSize(0.28 * v);
                text(item.name || "item", (x + offset + this.spriteSize / 2) * u, (y + offset + this.spriteSize / 2) * v);
                pop();
            }

            if (item.count > 1) {
                push();
                fill(255);
                stroke(0);
                strokeWeight(2);
                textAlign(RIGHT, BOTTOM);
                textFont(terminusFont);
                textSize(0.4 * v);
                text(`${item.count}`, (x + this.slotSize) * u - 4, (y + this.slotSize) * v - 4);
                pop();
            }
        }
    }


    if (this.draggingItem) {
        const m = VM.mouse();
        if (this.draggingItem.sprite && typeof this.draggingItem.sprite.setSize === 'function' && typeof this.draggingItem.sprite.setPos === 'function' && typeof this.draggingItem.sprite.draw === 'function') {
            this.draggingItem.sprite.setSize(this.spriteSize, this.spriteSize);
            this.draggingItem.sprite.setPos(m.x - this.dragOffset.x, m.y - this.dragOffset.y);
            this.draggingItem.sprite.draw();
        } else {
            // simple fallback for dragged item
            push();
            fill(180);
            stroke(255);
            rect((m.x - this.dragOffset.x) * u, (m.y - this.dragOffset.y) * v, this.spriteSize * u, this.spriteSize * v);
            pop();
        }
    }

    if (this.promptActive) {
        const u = VM.u(), v = VM.v();
        const px = this.promptBounds.x;
        const py = this.promptBounds.y;
       const pw = this.promptBounds.width;
       const ph = this.promptBounds.height;
        
       // Draw prompt background
        push();
        fill(30, 30, 30, 240);
        stroke(255);
        strokeWeight(2);
        rect(px * u, py * v, pw * u, ph * v);
        pop();

        // Draw each option
        for (let i = 0; i < this.promptOptions.length; i++) {
            const option = this.promptOptions[i];
            const isHovered = i === this.promptHoveredIndex;

            const ox = px + 0.3;
            const oy = py + 0.3 + i * 0.6;

            push();
            fill(isHovered ? [255, 255, 0] : [255]);
            textAlign(LEFT, TOP);
            textFont(terminusFont);
            textSize(0.4 * v);
            text(option, ox * u, oy * v);
            pop();
        }
    }

    if (this.feedbackTimer > 0 && this.feedbackMessage) {
        const u = VM.u(), v = VM.v();
        push();
        fill(255, 255, 0);
        textAlign(CENTER, TOP);
        textFont(terminusFont);
        textSize(0.5 * v);
        text(this.feedbackMessage, 8 * u, 1 * v);
        pop();
        this.feedbackTimer--;
    }
}

checkCombinationWinCondition(itemNames) {
  // Sort and join item names to match rule format
  const key = itemNames.sort().join('+');

  // Look up the result in the combination rules
  const resultName = COMBINATION_RULES[key];

  // If the result is the winning compound, trigger win
  if (resultName === "NeuroShield Complex") {
    this._onCureComplete(resultName);
    return true;
  }

  return false;
}

_onCureComplete(compoundName) {
  // Prevent duplicate triggers
  if (this.cureTriggered) return;

  this.cureTriggered = true;

  // Update game state to reflect cure
  GS.set("Pathogen Neutralized");

  // Show cure completion message
  this.textNotificationHandler.addText(`${compoundName} synthesized. Super pathogen neutralized.`);

  // Exit interface mode if relevant
  window.activeInterface = null;

  // Optional: unlock next room or trigger scene transition
  // GS.set(");
}
}