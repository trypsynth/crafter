import {
	addSlot,
	doFixBottleneck,
	manualProduce,
	openTreasure,
	sellAll,
	sellProduct,
	sellSlot,
	toggleProductEnabled,
	unlockBuilding,
	unlockProduct,
	upgradeStorage,
} from "../core/actions.ts";
import { rerollQuest } from "../core/quests.ts";
import { applyPrestigeReset, dismissVictory, prestigeResetSummary, victoryNewGame } from "../core/prestige.ts";
import { clearSaveData, exportRecording, importSaveFromText, renderSettingsSection, saveNow } from "./settings.ts";
import { hideVictoryScreen } from "./victory.ts";
import type { ResourceKey } from "../core/types.ts";

function confirmPrestigeReset(): boolean {
	const { totalActive, completedCount, incomplete } = prestigeResetSummary();
	if (completedCount === 0) return false;
	const msg = incomplete > 0
		? `Reset with ${completedCount}/${totalActive} quests complete?\n\nYou'll miss ${incomplete} reward${
			incomplete === 1 ? "" : "s"
		}. You can always keep playing to finish them.`
		: "All quests complete! Reset and claim your rewards?";
	return confirm(msg);
}

export function handleClick(e: MouseEvent): void {
	const btn = (e.target as Element | null)?.closest<HTMLElement>("button[data-action]");
	if (!btn) return;
	const { action } = btn.dataset;
	const bld = btn.dataset.bld;
	const product = btn.dataset.product;
	switch (action) {
		case "open-treasure":
			openTreasure();
			break;
		case "build":
			unlockBuilding(bld!);
			break;
		case "unlock-product":
			unlockProduct(bld!, product!);
			break;
		case "add-slot":
			addSlot(bld!, product!);
			break;
		case "sell-slot":
			sellSlot(bld!, product!);
			break;
		case "manual-produce":
			manualProduce(bld!, product!);
			break;
		case "storage-upgrade":
			upgradeStorage();
			break;
		case "sell":
			sellProduct(btn.dataset.resource as ResourceKey);
			break;
		case "sell-all":
			sellAll();
			break;
		case "toggle-product":
			toggleProductEnabled(bld!, product!);
			break;
		case "fix-bottleneck":
			doFixBottleneck();
			break;
		case "reroll-quest":
			rerollQuest(Number(btn.dataset.index));
			break;
		case "prestige-reset":
			if (confirmPrestigeReset()) applyPrestigeReset();
			break;
		case "save-now":
			saveNow();
			break;
		case "import-save-text":
			importSaveFromText();
			break;
		case "clear-save":
			clearSaveData();
			break;
		case "export-recording":
			exportRecording();
			break;
		case "victory-keep-playing":
			dismissVictory();
			hideVictoryScreen();
			break;
		case "victory-new-game":
			if (confirm("Start a brand new game? All progress and prestige rewards will be reset.")) victoryNewGame();
			break;
		case "settings-open":
			document.getElementById("app")?.classList.add("settings-open");
			renderSettingsSection();
			document.querySelector<HTMLElement>("#settings-back-row button")?.focus();
			break;
		case "settings-back":
			document.getElementById("app")?.classList.remove("settings-open");
			document.getElementById("settings-btn")?.focus();
			break;
	}
}
