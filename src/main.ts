import { BUILDINGS } from "./content/buildings.ts";
import { QUEST_POOL } from "./content/quests.ts";
import { runtime, state } from "./core/state.ts";
import { on } from "./core/events.ts";
import { setBackend } from "./core/storage.ts";
import { now } from "./core/clock.ts";
import { load, save } from "./core/save.ts";
import { startRecording } from "./core/journal.ts";
import { rngState } from "./core/rng.ts";
import { drawQuests, isGameComplete } from "./core/quests.ts";
import { tick } from "./core/tick.ts";
import { BuildingProductCard, BuildingSection, MarketProductCard, MarketSection, UnlockProductButton } from "./ui/components.ts";
import {
	addBuildingOption,
	announceToDom,
	renderAll,
	renderBuildingSection,
	renderHUD,
	renderMarketSection,
	renderTreasure,
	resetProductionPanel,
} from "./ui/render.ts";
import { invalidateQuestsPanel, renderQuestsSection } from "./ui/quests-panel.ts";
import { hideVictoryScreen, showVictoryScreen } from "./ui/victory.ts";
import { handleClick } from "./ui/handlers.ts";

const TICK_MS = 100;
const AUTOSAVE_MS = 5000;

function wireEvents(): void {
	on("announce", announceToDom as (p?: unknown) => void);
	on("render", renderAll);
	on("treasure:change", renderTreasure);
	on("tick", () => {
		renderHUD();
		renderMarketSection();
		renderQuestsSection();
	});
	on("quests:invalidate", invalidateQuestsPanel);
	on("victory", showVictoryScreen);
	on("building:built", (bldKey: string) => {
		addBuildingOption(bldKey);
		runtime.selectedBuilding = bldKey;
		const sel = document.getElementById("building-select") as HTMLSelectElement | null;
		if (sel) sel.value = bldKey;
		document.getElementById("section-production")?.setAttribute("open", "");
		renderAll();
		document.getElementById("building-select")?.focus();
	});
	on("product:unlocked", ({ bldKey, productKey }: { bldKey: string; productKey: string }) => {
		renderAll();
		const addBtn = document.querySelector<HTMLButtonElement>(`[data-action="add-slot"][data-bld="${bldKey}"][data-product="${productKey}"]`);
		if (addBtn && !addBtn.disabled) addBtn.focus();
		else document.getElementById("building-select")?.focus();
	});
	on("prestige:reset", () => {
		resetProductionPanel();
		invalidateQuestsPanel();
	});
	on("victory:newgame", () => {
		resetProductionPanel();
		hideVictoryScreen();
		invalidateQuestsPanel();
	});
}

function defineComponents(): void {
	customElements.define("building-product-card", BuildingProductCard);
	customElements.define("building-section", BuildingSection);
	customElements.define("unlock-product-button", UnlockProductButton);
	customElements.define("market-product-card", MarketProductCard);
	customElements.define("market-section", MarketSection);
}

function init(): void {
	defineComponents();
	wireEvents();
	setBackend(localStorage);
	load();
	const questPoolIds = new Set(QUEST_POOL.map((q) => q.id));
	const hasStaleIds = state.quests.active.some((id) => !questPoolIds.has(id));
	if (state.quests.active.length === 0 || hasStaleIds) drawQuests();
	state.lastTick = now();
	// Persist straight away so a migrated save is written in the new shape even if the
	// tab is closed before the first autosave.
	save();
	// From here every action is journalled, so a real session can be replayed through the
	// headless core and checked against what actually happened.
	startRecording(JSON.parse(JSON.stringify(state)), rngState());
	for (const bldKey of Object.keys(BUILDINGS)) if (state.buildings[bldKey].unlocked) addBuildingOption(bldKey);
	const firstBuilt = Object.keys(BUILDINGS).find((k) => state.buildings[k].unlocked);
	runtime.selectedBuilding = firstBuilt ?? null;
	const sel = document.getElementById("building-select") as HTMLSelectElement | null;
	if (sel && firstBuilt) sel.value = firstBuilt;
	sel?.addEventListener("change", () => {
		runtime.selectedBuilding = sel.value || null;
		renderBuildingSection();
	});
	renderAll();
	document.addEventListener("click", handleClick as EventListener);
	setInterval(tick, TICK_MS);
	setInterval(save, AUTOSAVE_MS);
	if (isGameComplete() && !state.prestige.victoryShown) showVictoryScreen();
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
else init();
