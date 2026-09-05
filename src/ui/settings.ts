import { freshState, setState, state } from "../core/state.ts";
import { clearSave, save, writeRawSave } from "../core/save.ts";
import { announce } from "../core/events.ts";

export function renderSettingsSection(): void {
	const panel = document.getElementById("panel-settings");
	if (!panel) return;
	const saveText = btoa(JSON.stringify(state));
	if (panel.firstChild) {
		const ta = panel.querySelector<HTMLTextAreaElement>("#save-textarea");
		if (ta && document.activeElement !== ta) ta.value = saveText;
		return;
	}
	panel.innerHTML = `<section class="settings-section">
		<h3>Save</h3>
		<button data-action="save-now" style="margin-bottom:var(--space-sm)">Save Now</button>
		<textarea id="save-textarea" class="save-textarea" rows="5" spellcheck="false" autocomplete="off" aria-label="Save data">${saveText}</textarea>
		<div class="settings-row" style="margin-top:var(--space-sm)">
			<button data-action="import-save-text">Import</button>
			<button data-action="clear-save">Clear Save</button>
		</div>
	</section>`;
}

export function saveNow(): void {
	save();
	announce("Game saved.");
}

export function clearSaveData(): void {
	if (!confirm("Clear all save data and start over? This will reset everything, including prestige rewards.")) return;
	clearSave();
	setState(freshState());
	location.reload();
}

export function importSaveFromText(): void {
	const text = (document.getElementById("save-textarea") as HTMLTextAreaElement | null)?.value?.trim();
	if (!text) {
		announce("Nothing to import.");
		return;
	}
	try {
		const json = atob(text);
		const parsed = JSON.parse(json);
		if (parsed && parsed.state && parsed.prestige) {
			const merged = { ...parsed.state, prestige: parsed.prestige };
			writeRawSave(JSON.stringify(merged));
		} else {
			writeRawSave(json);
		}
		announce("Save imported. Reloading...");
		setTimeout(() => location.reload(), 800);
	} catch {
		announce("Invalid save data.");
	}
}
