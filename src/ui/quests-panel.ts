import { state } from "../core/state.ts";
import { getQuestProgress, questBaseline, questById, rerollCost } from "../core/quests.ts";
import { computePrestigeSummary } from "../core/prestige.ts";
import { formatNum } from "../core/format.ts";

let renderKey = "";

export function invalidateQuestsPanel(): void {
	renderKey = "";
}

export function renderQuestsSection(): void {
	const panel = document.getElementById("panel-quests");
	if (!panel) return;
	const summaryH2 = document.querySelector("#section-quests > summary h2");
	if (summaryH2) summaryH2.textContent = `Quests : Run ${(state.prestige.runs + 1).toLocaleString()}`;
	const structKey = state.quests.active.join(",") + ":" + state.quests.completed.map(Number).join(",") + ":" + state.prestige.runs;
	if (structKey === renderKey && panel.firstChild) {
		updateQuestBars(panel);
		return;
	}
	renderKey = structKey;
	const completedCount = state.quests.completed.filter(Boolean).length;
	const canReset = completedCount >= 1;
	const buildCard = (id: string, i: number): string => {
		const def = questById(id);
		if (!def) return "";
		const { current, target } = getQuestProgress(def, questBaseline(id, def));
		const done = state.quests.completed[i];
		const isBoolean = def.type === "build" || def.type === "unlock";
		const pct = isBoolean ? (done ? 100 : 0) : Math.min(100, Math.floor(current / target * 100));
		const progressRow = done
			? ""
			: isBoolean
			? `<div class="quest-progress-row"><span class="quest-prog-text">Not yet</span></div>`
			: `<div class="quest-progress-row">
				<div class="quest-bar-wrap" role="progressbar" data-quest-bar="${id}" aria-label="quest progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pct}">
					<div class="quest-bar-fill" style="width:${pct}%"></div>
				</div>
				<span class="quest-prog-text" data-quest-text="${id}">${formatNum(current)} / ${formatNum(target)}</span>
			</div>`;
		const rerollBtn = done ? "" : (() => {
			const cost = rerollCost();
			return `<button class="reroll-quest-btn" data-action="reroll-quest" data-index="${i}" ${
				state.gold >= cost ? "" : "disabled"
			}>Reroll (${cost.toLocaleString()} gold)</button>`;
		})();
		return `<div class="quest-card${done ? " quest-done" : ""}">
			<h4 class="quest-title">${def.label}</h4>
			<p class="quest-reward-label">Reward: ${def.rewardLabel}</p>
			${progressRow}
			${rerollBtn}
		</div>`;
	};
	const inProgressHtml = state.quests.active.map((id, i) => state.quests.completed[i] ? "" : buildCard(id, i)).join("");
	const completedHtml = state.quests.active.map((id, i) => state.quests.completed[i] ? buildCard(id, i) : "").join("");
	const bonuses = computePrestigeSummary();
	const bonusesHtml = bonuses.length === 0
		? `<p class="quest-no-bonuses">No bonuses yet. Complete quests and reset to earn permanent upgrades.</p>`
		: `<ul class="prestige-bonus-list">${bonuses.map((b) => `<li>${b}</li>`).join("")}</ul>`;
	const resetLabel = completedCount === state.quests.active.length
		? "Reset & Collect All Rewards"
		: `Reset & Collect Rewards (${completedCount} / ${state.quests.active.length} complete)`;
	const warningHtml = canReset && completedCount < state.quests.active.length
		? `<p class="reset-warning">${state.quests.active.length - completedCount} quest${
			state.quests.active.length - completedCount === 1 ? "" : "s"
		} still incomplete. You will miss those rewards.</p>`
		: "";
	panel.innerHTML = `
		${inProgressHtml ? `<section class="quest-group"><h3>In Progress</h3><div class="quest-grid">${inProgressHtml}</div></section>` : ""}
		${completedHtml ? `<section class="quest-group"><h3>Completed</h3><div class="quest-grid">${completedHtml}</div></section>` : ""}
		<section class="prestige-section">
			<h3>Permanent Rewards</h3>
			${bonusesHtml}
		</section>
		<div class="prestige-reset-row">
			${warningHtml}
			<button class="prestige-reset-btn" data-action="prestige-reset" ${canReset ? "" : "disabled"}>
				${resetLabel}
			</button>
		</div>`;
}

function updateQuestBars(panel: HTMLElement): void {
	for (let i = 0; i < state.quests.active.length; i++) {
		if (state.quests.completed[i]) continue;
		const id = state.quests.active[i];
		const def = questById(id);
		if (!def || def.type === "build" || def.type === "unlock") continue;
		const { current, target } = getQuestProgress(def, questBaseline(id, def));
		const pct = Math.min(100, Math.floor(current / target * 100));
		const barEl = panel.querySelector(`[data-quest-bar="${def.id}"]`);
		const txtEl = panel.querySelector(`[data-quest-text="${def.id}"]`);
		if (barEl) {
			barEl.setAttribute("aria-valuenow", String(pct));
			const fill = barEl.querySelector<HTMLElement>(".quest-bar-fill");
			if (fill) fill.style.width = `${pct}%`;
		}
		if (txtEl) txtEl.textContent = `${formatNum(current)} / ${formatNum(target)}`;
	}
	const cost = rerollCost();
	const canAfford = state.gold >= cost;
	for (const btn of panel.querySelectorAll<HTMLButtonElement>(".reroll-quest-btn")) btn.disabled = !canAfford;
}
