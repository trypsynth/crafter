import { RESOURCES } from "../content/resources.ts";
import { BUILDINGS } from "../content/buildings.ts";
import { runtime, state } from "../core/state.ts";
import { bestNextPurchase, buildCost, getProductionOverview, nextBuildableBuilding, storageMax, totalItems } from "../core/economy.ts";
import { formatResourceName } from "../core/format.ts";
import { now } from "../core/clock.ts";
import { entries } from "../core/util.ts";
import { type BuildingSection, MarketSection } from "./components.ts";
import { renderQuestsSection } from "./quests-panel.ts";

interface HudCache {
	gold: HTMLElement | null;
	storage: HTMLElement | null;
	chain: HTMLElement | null;
	inventory: HTMLElement | null;
}

interface ProductionCache {
	panel: HTMLElement | null;
	unlockSection: HTMLDivElement | null;
	productSection: BuildingSection | null;
	chainSection: HTMLDivElement | null;
}

interface MarketCache {
	panel: HTMLElement | null;
	marketSection: MarketSection | null;
}

interface GuiState {
	hud: HudCache;
	production: ProductionCache;
	market: MarketCache;
}

export const guiState: GuiState = {
	hud: { gold: null, storage: null, chain: null, inventory: null },
	production: { panel: null, unlockSection: null, productSection: null, chainSection: null },
	market: { panel: null, marketSection: null },
};

export function announceToDom(msg: string): void {
	const el = document.getElementById("live-announcer");
	if (!el) return;
	el.textContent = msg;
}

export function addBuildingOption(bldKey: string): void {
	const sel = document.getElementById("building-select") as HTMLSelectElement | null;
	if (!sel || sel.querySelector(`option[value="${bldKey}"]`)) return;
	const opt = document.createElement("option");
	opt.value = bldKey;
	opt.textContent = BUILDINGS[bldKey].label;
	sel.appendChild(opt);
}

export function renderAll(): void {
	renderTreasure();
	renderHUD();
	renderBuildingSection();
	renderMarketSection();
	renderQuestsSection();
}

export function renderHUD(): void {
	const hud = guiState.hud;
	const goldText = `${Math.floor(state.gold).toLocaleString()} gold`;
	const goldEl = hud.gold ??= document.getElementById("hud-gold");
	if (goldEl && goldEl.textContent !== goldText) goldEl.textContent = goldText;
	const storageText = `${totalItems().toLocaleString()}/${storageMax().toLocaleString()} items`;
	const storageEl = hud.storage ??= document.getElementById("hud-storage");
	if (storageEl && storageEl.textContent !== storageText) storageEl.textContent = storageText;
	const inventoryEl = hud.inventory ??= document.getElementById("hud-inventory");
	if (inventoryEl) {
		const invText = entries(state.inventory)
			.filter(([, v]) => v > 0)
			.map(([k, v]) => `${v.toLocaleString()} ${formatResourceName(k, v)}`)
			.join(", ");
		if (inventoryEl.textContent !== invText) inventoryEl.textContent = invText;
	}
	const chainEl = hud.chain ??= document.getElementById("hud-chain");
	if (chainEl) {
		const { hasChain, deficits, efficiencyPct } = getProductionOverview();
		let chainText = "";
		let chainClass = "";
		if (hasChain) {
			if (deficits.length > 0) {
				const names = deficits.slice(0, 2).map((e) => RESOURCES[e.resourceKey].label).join(", ");
				chainText = `Bottleneck: ${names}`;
				chainClass = "hud-warn";
			} else if (efficiencyPct !== null) {
				chainText = efficiencyPct === 100 ? "Chain: OK" : `Chain: ${efficiencyPct}%`;
				chainClass = efficiencyPct === 100 ? "hud-ok" : "";
			}
		}
		if (chainEl.textContent !== chainText) chainEl.textContent = chainText;
		if (chainEl.className !== chainClass) chainEl.className = chainClass;
	}
}

export function renderChainOverview(): string {
	const { hasChain, balances } = getProductionOverview();
	if (!hasChain) return "";
	const shortages = balances.filter((b) => b.net < -0.05).sort((a, b) => a.net - b.net);
	const surpluses = balances.filter((b) => b.net > 0.05).sort((a, b) => b.net - a.net);
	const sentences: string[] = [];
	if (shortages.length > 0) {
		const items = shortages.map((b) => `<li>${RESOURCES[b.resourceKey].label} (need ${Math.abs(b.net).toFixed(1)}/min more)</li>`).join("");
		sentences.push(`<p class="chain-item-neg">Bottleneck:</p><ul class="chain-item-neg">${items}</ul>`);
	}
	if (surpluses.length > 0) {
		const items = surpluses.map((b) => `<li>${RESOURCES[b.resourceKey].label} (+${b.net.toFixed(1)}/min)</li>`).join("");
		sentences.push(`<p class="chain-item-pos">Surplus:</p><ul class="chain-item-pos">${items}</ul>`);
	}
	if (shortages.length === 0 && surpluses.length === 0) sentences.push(`<p>Your production chain is perfectly balanced.</p>`);
	const fixBtn = shortages.length > 0 ? `<button class="chain-fix-btn" data-action="fix-bottleneck">Buy slots to fix bottleneck</button>` : "";
	const suggestion = bestNextPurchase();
	const suggestionHtml = suggestion
		? `<p class="chain-suggestion ${suggestion.isDeficit ? "chain-item-neg" : "chain-item-muted"}">${
			suggestion.isDeficit ? "Suggested fix" : "Best value"
		}: add a ${suggestion.label} slot (${suggestion.cost.toLocaleString()} gold)</p>`
		: "";
	return `
		<h3>Production Summary</h3>
		<div class="chain-prose">
			${sentences.join("")}
			${suggestionHtml}
		</div>
		${fixBtn}
	`;
}

export function renderBuildingSection(): void {
	const production = guiState.production;
	const panel = production.panel ??= document.getElementById("panel-production");
	if (!panel) return;
	const bldKey = runtime.selectedBuilding;
	const nextBldKey = nextBuildableBuilding();
	const unlockSection = production.unlockSection ??= (() => {
		const el = document.createElement("div");
		el.className = "unlock-section";
		el.style.marginTop = "0";
		el.style.marginBottom = "var(--space-md)";
		panel.appendChild(el);
		return el;
	})();
	let nextHtml = "No next building";
	if (nextBldKey) {
		const ncfg = BUILDINGS[nextBldKey];
		const ncost = buildCost(nextBldKey);
		nextHtml = `<button class="unlock-product-btn" data-action="build" data-bld="${nextBldKey}" ${state.gold >= ncost ? "" : "disabled"}>
			Build ${ncfg.label} (${ncost === 0 ? "Free" : ncost.toLocaleString() + " gold"})
		</button>`;
	}
	unlockSection.innerHTML = nextHtml;
	const productSection = production.productSection ??= (() => {
		const el = document.createElement("building-section") as BuildingSection;
		panel.appendChild(el);
		return el;
	})();
	if (bldKey !== null && productSection.getAttribute("bld") !== bldKey) productSection.bld = bldKey;
	productSection.refresh();
	const chainSection = production.chainSection ??= (() => {
		const el = document.createElement("div");
		el.className = "chain-overview";
		panel.appendChild(el);
		return el;
	})();
	chainSection.innerHTML = renderChainOverview();
}

export function renderMarketSection(): void {
	const market = guiState.market;
	const marketSection = market.marketSection ??= (() => {
		const panel = market.panel ??= document.getElementById("panel-market");
		if (!panel) return null;
		const section = new MarketSection();
		panel.replaceChildren(section);
		return section;
	})();
	if (!marketSection) return;
	marketSection.refresh();
}

export function renderTreasure(): void {
	const container = document.getElementById("treasure-container");
	if (!container) return;
	if (state.treasure.activeUntil > now()) {
		if (!container.querySelector("button")) {
			const btn = document.createElement("button");
			btn.className = "treasure-btn";
			btn.dataset.action = "open-treasure";
			btn.textContent = "Open Treasure Chest!";
			container.appendChild(btn);
		}
	} else container.innerHTML = "";
}

// Called after a prestige reset or a new game. The cached nodes are detached at that
// point, so they have to be dropped or the production panel renders into nothing.
export function resetProductionPanel(): void {
	const sel = document.getElementById("building-select") as HTMLSelectElement | null;
	if (sel) {
		sel.innerHTML = "";
		addBuildingOption("lumber_yard");
		sel.value = "lumber_yard";
	}
	const panel = guiState.production.panel ?? document.getElementById("panel-production");
	if (panel) panel.innerHTML = "";
	guiState.production = { panel: null, unlockSection: null, productSection: null, chainSection: null };
}
