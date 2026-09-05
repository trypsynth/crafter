import { RESOURCES } from "../content/resources.ts";
import { BUILDINGS } from "../content/buildings.ts";
import { state } from "../core/state.ts";
import { currentPrice, nextSlotCost, nextStorageMax, slotRefund, storageMax, storageUpgradeCost, totalItems, unlockCost } from "../core/economy.ts";
import { formatInputs, formatProductOutput } from "../core/format.ts";
import { entries, getOrInsert, keys } from "../core/util.ts";
import type { ResourceKey } from "../core/types.ts";

function setDatasetMany(els: Iterable<HTMLElement>, key: string, value: string): void {
	for (const el of els) el.dataset[key] = value;
}

// Mirrors the original guard: an attribute may be set once, and later writes that
// disagree are reverted rather than applied.
function claimAttribute(current: string | null, next: string | null): "adopt" | "revert" | "ignore" {
	if (current === null) return "adopt";
	if (current !== next) return "revert";
	return "ignore";
}

export class BuildingProductCard extends HTMLElement {
	#bld: string | null = null;
	#product: string | null = null;
	#label!: HTMLHeadingElement;
	#status!: HTMLSpanElement;
	#inputDesc!: HTMLParagraphElement;
	#inputs!: Text;
	#singular!: Text;
	#toggleProduction!: HTMLButtonElement;
	#summary!: HTMLParagraphElement;
	#slotCost!: Text;
	#addSlot!: HTMLButtonElement;
	#saleAmt!: Text;
	#sellSlot!: HTMLButtonElement;
	#wantsBldAndProduct = new Set<HTMLElement>();
	#wantsCycleFmt = new Set<Text>();
	#paused: boolean | undefined;

	connectedCallback(): void {
		this.className = "product-section";
		const header = document.createElement("div");
		header.className = "product-header";
		const title = document.createElement("h4");
		this.#label = title;
		title.className = "product-title";
		const status = document.createElement("span");
		this.#status = status;
		status.style.fontSize = "var(--font-sm)";
		header.append(title, status);
		const inputDesc = document.createElement("p");
		this.#inputDesc = inputDesc;
		inputDesc.className = "product-inputs";
		const inputs = document.createTextNode("");
		this.#inputs = inputs;
		inputDesc.append("Requires ", inputs, " per cycle");
		const manualProduceRow = document.createElement("div");
		manualProduceRow.className = "manual-produce-row";
		const manualProduce = document.createElement("button");
		this.#wantsBldAndProduct.add(manualProduce);
		manualProduce.className = "manual-produce-btn";
		manualProduce.dataset.action = "manual-produce";
		const singular = document.createTextNode("");
		this.#singular = singular;
		manualProduce.append("Produce ", singular);
		const toggleProduction = document.createElement("button");
		this.#wantsBldAndProduct.add(toggleProduction);
		this.#toggleProduction = toggleProduction;
		toggleProduction.className = "toggle-product-btn";
		toggleProduction.dataset.action = "toggle-product";
		manualProduceRow.append(manualProduce, toggleProduction);
		const summary = document.createElement("p");
		this.#summary = summary;
		summary.className = "slot-summary";
		const addSlot = document.createElement("button");
		this.#addSlot = addSlot;
		this.#wantsBldAndProduct.add(addSlot);
		addSlot.className = "add-slot-btn";
		addSlot.dataset.action = "add-slot";
		const slotCost = document.createTextNode("");
		this.#slotCost = slotCost;
		let cycleFmt = document.createTextNode("");
		this.#wantsCycleFmt.add(cycleFmt);
		addSlot.append("Add Slot for ", slotCost, " gold (+", cycleFmt, ")");
		const sellSlot = document.createElement("button");
		this.#sellSlot = sellSlot;
		this.#wantsBldAndProduct.add(sellSlot);
		sellSlot.className = "sell-slot-btn";
		sellSlot.dataset.action = "sell-slot";
		const saleAmt = document.createTextNode("");
		this.#saleAmt = saleAmt;
		cycleFmt = cycleFmt.cloneNode() as Text;
		this.#wantsCycleFmt.add(cycleFmt);
		sellSlot.append("Sell Slot for ", saleAmt, " gold (-", cycleFmt, ")");
		if (this.#bld !== null) setDatasetMany(this.#wantsBldAndProduct, "bld", this.#bld);
		if (this.#product !== null) setDatasetMany(this.#wantsBldAndProduct, "product", this.#product);
		this.#init();
		this.replaceChildren(header, inputDesc, manualProduceRow, summary, addSlot, sellSlot);
	}

	static get observedAttributes(): string[] {
		return ["bld", "product"];
	}

	attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
		if (oldValue === newValue) return;
		if (name === "bld") {
			const verdict = claimAttribute(this.#bld, newValue);
			if (verdict === "revert") return this.setAttribute("bld", this.#bld!);
			if (verdict === "ignore") return;
			this.#bld = newValue;
		} else if (name === "product") {
			const verdict = claimAttribute(this.#product, newValue);
			if (verdict === "revert") return this.setAttribute("product", this.#product!);
			if (verdict === "ignore") return;
			this.#product = newValue;
		} else return;
		if (newValue !== null) setDatasetMany(this.#wantsBldAndProduct, name, newValue);
		this.#init();
	}

	set bld(value: string) {
		this.setAttribute("bld", value);
	}
	set product(value: string) {
		this.setAttribute("product", value);
	}

	#init(): void {
		if (this.#bld === null || this.#product === null || !this.#label || !this.#singular) return;
		const res = RESOURCES[BUILDINGS[this.#bld]?.products[this.#product]?.outputKey];
		if (res === undefined) return;
		this.#label.textContent = res.label;
		this.#singular.textContent = res.singular;
	}

	refresh(): void {
		const bld = this.#bld;
		const product = this.#product;
		if (bld === null || product === null || !this.#status || !this.#addSlot) return;
		const pst = state.buildings[bld]?.products[product];
		const pcfg = BUILDINGS[bld]?.products[product];
		if (pcfg === undefined || pst === undefined) return;
		const paused = !pst.enabled;
		if (this.#paused !== paused) {
			this.#paused = paused;
			this.#status.textContent = paused ? "Paused" : "Active";
			this.#status.className = paused ? "health-warn" : "health-ok";
			this.#toggleProduction.textContent = paused ? "Resume" : "Pause";
			this.#toggleProduction.classList.toggle("paused", paused);
		}
		const slotCost = nextSlotCost(bld, product);
		this.#slotCost.textContent = String(slotCost);
		this.#addSlot.disabled = state.gold < slotCost;
		const n = pst.slots.length;
		this.#toggleProduction.hidden = n === 0;
		this.#sellSlot.disabled = n === 0;
		const scaled = Object.fromEntries(
			entries(pcfg.inputs as Record<ResourceKey, number>).map(([k, v]) => [k, v * Math.max(1, n)]),
		) as Record<ResourceKey, number>;
		const inputs = formatInputs(scaled);
		if (inputs === "") {
			this.#inputDesc.hidden = true;
		} else {
			this.#inputs.textContent = inputs;
			this.#inputDesc.hidden = false;
		}
		const cycleFmt = formatProductOutput(1, pcfg.outputAmt, pcfg.baseCycleMs, pcfg.outputKey, true);
		for (const el of this.#wantsCycleFmt) el.textContent = cycleFmt;
		this.#summary.textContent = n === 0
			? "No slots yet."
			: `${n.toLocaleString()} ${n === 1 ? "slot" : "slots"}, ${formatProductOutput(n, pcfg.outputAmt, pcfg.baseCycleMs, pcfg.outputKey)}`;
		this.#saleAmt.textContent = String(slotRefund(bld, product));
	}
}

export class UnlockProductButton extends HTMLElement {
	#bld: string | null = null;
	#product: string | null = null;
	#button!: HTMLButtonElement;
	#label!: Text;
	#cost!: Text;

	connectedCallback(): void {
		const button = document.createElement("button");
		this.#button = button;
		button.className = "unlock-product-btn";
		button.dataset.action = "unlock-product";
		if (this.#bld !== null) button.dataset.bld = this.#bld;
		if (this.#product !== null) button.dataset.product = this.#product;
		const name = document.createTextNode(this.#getLabelText());
		this.#label = name;
		const cost = document.createTextNode("");
		this.#cost = cost;
		button.append("Unlock ", name, " for ", cost, " gold");
		this.replaceChildren(button);
	}

	static get observedAttributes(): string[] {
		return ["bld", "product"];
	}

	attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
		if (newValue === oldValue) return;
		if (name === "bld") {
			const verdict = claimAttribute(this.#bld, newValue);
			if (verdict === "revert") return this.setAttribute("bld", this.#bld!);
			if (verdict === "ignore") return;
			this.#bld = newValue;
		} else if (name === "product") {
			const verdict = claimAttribute(this.#product, newValue);
			if (verdict === "revert") return this.setAttribute("product", this.#product!);
			if (verdict === "ignore") return;
			this.#product = newValue;
		} else return;
		if (this.#button !== undefined && newValue !== null) this.#button.dataset[name] = newValue;
		if (this.#bld !== null && this.#product !== null && this.#label !== undefined) this.#label.textContent = this.#getLabelText();
		this.refresh();
	}

	set bld(value: string) {
		this.setAttribute("bld", value);
	}
	set product(value: string) {
		this.setAttribute("product", value);
	}

	#getLabelText(): string {
		if (this.#bld === null || this.#product === null) return "[product]";
		return RESOURCES[BUILDINGS[this.#bld]?.products[this.#product]?.outputKey]?.label ?? "[product]";
	}

	refresh(): void {
		const bld = this.#bld;
		const product = this.#product;
		if (bld === null || product === null || !this.#button || !this.#cost) return;
		const cost = unlockCost(bld, product);
		this.#button.disabled = state.gold < cost;
		const costText = cost.toLocaleString();
		if (this.#cost.textContent !== costText) this.#cost.textContent = costText;
	}
}

export class BuildingSection extends HTMLElement {
	#productCards = new Map<string, BuildingProductCard>();
	#unlockButtons = new Map<string, UnlockProductButton>();
	#productSection: HTMLDivElement | undefined;
	#unlockGroup: HTMLElement | undefined;
	#unlockSection: HTMLDivElement | undefined;

	connectedCallback(): void {
		const productGroup = document.createElement("section");
		productGroup.className = "product-group";
		const productsH3 = document.createElement("h3");
		productsH3.textContent = "Products";
		const productSection = document.createElement("div");
		this.#productSection = productSection;
		productSection.className = "product-section";
		productGroup.append(productsH3, productSection);
		const unlockGroup = document.createElement("section");
		this.#unlockGroup = unlockGroup;
		unlockGroup.className = "unlock-group";
		unlockGroup.hidden = true;
		const unlockH3 = document.createElement("h3");
		unlockH3.textContent = "Unlockable Products";
		const unlockSection = document.createElement("div");
		this.#unlockSection = unlockSection;
		unlockSection.className = "unlock-section";
		unlockGroup.append(unlockH3, unlockSection);
		this.replaceChildren(productGroup, unlockGroup);
	}

	static get observedAttributes(): string[] {
		return ["bld"];
	}

	attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
		if (newValue === oldValue) return;
		if (name === "bld") {
			this.#productCards.clear();
			this.#unlockButtons.clear();
			this.#productSection?.replaceChildren();
			this.#unlockSection?.replaceChildren();
		}
	}

	set bld(value: string) {
		this.setAttribute("bld", value);
	}
	get bld(): string | null {
		return this.getAttribute("bld");
	}

	refresh(): void {
		const bldKey = this.bld;
		const productSection = this.#productSection;
		const unlockSection = this.#unlockSection;
		const unlockGroup = this.#unlockGroup;
		if (!bldKey || !productSection || !unlockSection || !unlockGroup) return;
		const cfg = BUILDINGS[bldKey];
		const bst = state.buildings[bldKey];
		if (!cfg || !bst) return;
		for (const [pk, pcfg] of entries(cfg.products)) {
			let unlocked = false;
			let unlockable = false;
			if (bst.products[pk].unlocked) {
				unlocked = true;
				const card = getOrInsert(this.#productCards, pk, (key) => {
					const card = new BuildingProductCard();
					card.product = key;
					card.bld = bldKey;
					return card;
				});
				if (!productSection.contains(card)) productSection.appendChild(card);
				card.refresh();
			} else if (!pcfg.prereqProduct || bst.products[pcfg.prereqProduct].unlocked) {
				unlockable = true;
				const button = getOrInsert(this.#unlockButtons, pk, (key) => {
					const button = new UnlockProductButton();
					button.product = key;
					button.bld = bldKey;
					return button;
				});
				if (!unlockSection.contains(button)) unlockSection.append(button);
				button.refresh();
			}
			if (!unlockable && this.#unlockButtons.has(pk)) {
				unlockSection.removeChild(this.#unlockButtons.get(pk)!);
				this.#unlockButtons.delete(pk);
			}
			if (!unlocked && this.#productCards.has(pk)) {
				productSection.removeChild(this.#productCards.get(pk)!);
				this.#productCards.delete(pk);
			}
		}
		unlockGroup.hidden = this.#unlockButtons.size === 0;
	}
}

export class MarketProductCard extends HTMLElement {
	#invCount!: Text;
	#unitValue!: Text;
	#totalValue!: Text;
	#sell!: HTMLButtonElement;
	#wantsLabel = new Set<Node>();
	#resource: ResourceKey | null = null;

	connectedCallback(): void {
		this.className = "market-product";
		const header = document.createElement("div");
		header.className = "market-product-header";
		const name = document.createElement("h4");
		this.#wantsLabel.add(name);
		name.className = "market-product-name";
		const stock = document.createElement("span");
		stock.className = "market-product-stock";
		const invCount = document.createTextNode("");
		this.#invCount = invCount;
		const unitValue = document.createTextNode("");
		this.#unitValue = unitValue;
		stock.append(invCount, " in stock, ", unitValue, " gold each");
		header.append(name, stock);
		const sell = document.createElement("button");
		this.#sell = sell;
		sell.className = "sell-btn";
		sell.dataset.action = "sell";
		if (this.#resource !== null) sell.dataset.resource = this.#resource;
		const label = document.createTextNode("");
		this.#wantsLabel.add(label);
		const totalValue = document.createTextNode("");
		this.#totalValue = totalValue;
		sell.append("Sell All ", label, " for ", totalValue, " gold");
		this.replaceChildren(header, sell);
		this.#init();
	}

	static get observedAttributes(): string[] {
		return ["resource"];
	}

	attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
		if (oldValue === newValue) return;
		if (name !== "resource") return;
		if (this.#resource === null) {
			this.#resource = newValue as ResourceKey;
			if (this.#sell !== undefined && newValue !== null) this.#sell.dataset.resource = newValue;
			this.#init();
		} else if (this.#resource !== newValue) return this.setAttribute("resource", this.#resource);
	}

	set resource(value: ResourceKey) {
		this.setAttribute("resource", value);
	}

	#init(): void {
		if (this.#resource === null || this.#wantsLabel.size === 0) return;
		const label = RESOURCES[this.#resource]?.label;
		if (label === undefined) return;
		for (const el of this.#wantsLabel) el.textContent = label;
	}

	refresh(): void {
		const resource = this.#resource;
		if (resource === null || !this.#invCount || !this.#sell) return;
		const inv = state.inventory[resource] || 0;
		const hasStock = inv > 0;
		const price = currentPrice(resource);
		this.#invCount.textContent = inv.toLocaleString();
		this.hidden = !hasStock;
		this.#sell.disabled = !hasStock;
		this.#unitValue.textContent = price.toLocaleString();
		this.#totalValue.textContent = (inv * price).toLocaleString();
	}
}

export class MarketSection extends HTMLElement {
	#progressBar!: HTMLDivElement;
	#progressFill!: HTMLDivElement;
	#used!: Text;
	#pct!: Text;
	#upgrade!: HTMLButtonElement;
	#next!: Text;
	#cost!: Text;
	#sellAll!: HTMLButtonElement;
	#totalValue!: Text;
	#emptyText!: HTMLParagraphElement;
	#productGroup!: HTMLDivElement;
	#productCards = new Map<string, MarketProductCard>();
	#wantsMax = new Set<Text>();

	connectedCallback(): void {
		const info = document.createElement("div");
		info.className = "storage-info";
		const progressBar = document.createElement("div");
		this.#progressBar = progressBar;
		progressBar.className = "storage-bar-wrap";
		progressBar.role = "progressbar";
		progressBar.ariaLabel = "Storage used";
		progressBar.ariaValueMin = "0";
		progressBar.ariaValueMax = "100";
		const progressFill = document.createElement("div");
		this.#progressFill = progressFill;
		progressFill.className = "storage-bar-fill";
		progressBar.appendChild(progressFill);
		const label = document.createElement("p");
		label.className = "storage-used-label";
		this.#used = document.createTextNode("");
		let max = document.createTextNode("");
		this.#wantsMax.add(max);
		this.#pct = document.createTextNode("");
		label.append(this.#used, " / ", max, " items (", this.#pct, "% full)");
		const upgrade = document.createElement("button");
		this.#upgrade = upgrade;
		upgrade.dataset.action = "storage-upgrade";
		max = max.cloneNode() as Text;
		this.#wantsMax.add(max);
		this.#next = document.createTextNode("");
		this.#cost = document.createTextNode("");
		upgrade.append("Expand Storage: ", max, " to ", this.#next, " items for ", this.#cost, " gold");
		info.append(progressBar, label, upgrade);
		const divider = document.createElement("div");
		divider.className = "market-divider";
		const sellAll = document.createElement("button");
		this.#sellAll = sellAll;
		sellAll.className = "sell-all-btn";
		sellAll.dataset.action = "sell-all";
		this.#totalValue = document.createTextNode("");
		sellAll.append("Sell Everything for ", this.#totalValue, " gold");
		const emptyText = document.createElement("p");
		this.#emptyText = emptyText;
		emptyText.className = "market-empty";
		emptyText.textContent = "Nothing to sell yet.";
		const inventorySection = document.createElement("section");
		inventorySection.className = "market-inventory-section";
		const heading = document.createElement("h3");
		heading.textContent = "Inventory";
		const productGroup = document.createElement("div");
		this.#productGroup = productGroup;
		productGroup.id = "market-products";
		inventorySection.append(heading, productGroup);
		this.replaceChildren(info, divider, sellAll, emptyText, inventorySection);
	}

	refresh(): void {
		if (!this.#used || !this.#progressBar || !this.#sellAll) return;
		const used = totalItems();
		const max = storageMax();
		const pct = Math.min(100, Math.floor(used / max * 100));
		const cost = storageUpgradeCost();
		const withStock = keys(RESOURCES).filter((k) => state.inventory[k] > 0);
		const hasStock = withStock.length > 0;
		const totalValue = withStock.reduce((sum, k) => sum + state.inventory[k] * currentPrice(k), 0);
		this.#used.textContent = used.toLocaleString();
		for (const el of this.#wantsMax) el.textContent = max.toLocaleString();
		this.#pct.textContent = pct.toLocaleString();
		this.#progressBar.ariaValueNow = String(pct);
		this.#progressFill.style.width = `${pct}%`;
		this.#cost.textContent = cost.toLocaleString();
		this.#upgrade.disabled = state.gold < cost;
		this.#next.textContent = nextStorageMax().toLocaleString();
		this.#sellAll.hidden = !hasStock;
		this.#emptyText.hidden = hasStock;
		this.#totalValue.textContent = totalValue.toLocaleString();
		for (const rk of keys(RESOURCES)) {
			const card = getOrInsert(this.#productCards, rk, (key) => {
				const card = new MarketProductCard();
				card.resource = key as ResourceKey;
				this.#productGroup.appendChild(card);
				return card;
			});
			card.refresh();
		}
	}
}
