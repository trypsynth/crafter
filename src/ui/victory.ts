import { state } from "../core/state.ts";
import { computePrestigeSummary } from "../core/prestige.ts";
import { announce } from "../core/events.ts";

export function showVictoryScreen(): void {
	const el = document.getElementById("victory-overlay");
	if (!el) return;
	const runs = state.prestige.runs;
	const totalGold = Math.floor(state.prestige.accumulatedStats.goldEarned + state.stats.goldEarned);
	const victories = state.prestige.victoryCount ?? 0;
	const bonuses = computePrestigeSummary();
	const statsLines: (string | null)[] = [
		`Prestige Runs: ${runs.toLocaleString()}`,
		`Total Gold Earned: ${totalGold.toLocaleString()}`,
		victories > 0 ? `Times Conquered: ${victories.toLocaleString()}` : null,
	].filter(Boolean);
	const bonusesHtml = bonuses.length > 0
		? `<div>
			<p class="victory-bonuses-title">Permanent Bonuses Earned</p>
			<ul class="victory-bonus-list">${bonuses.map((b) => `<li>${b}</li>`).join("")}</ul>
		</div>`
		: "";
	el.innerHTML = `
		<div id="victory-content">
			<h2 id="victory-title">Empire Complete!</h2>
			<p class="victory-subtitle">From humble logs to mighty dreadnoughts, you have forged an industrial legacy that spans the ages. The world bows to your craft.</p>
			<div class="victory-stats">${statsLines.map((s) => `<p>${s}</p>`).join("")}</div>
			${bonusesHtml}
			<div class="victory-actions">
				<button class="victory-keep-btn" data-action="victory-keep-playing">Keep Playing</button>
				<button class="victory-new-game-btn" data-action="victory-new-game">New Legacy</button>
			</div>
		</div>
	`;
	el.hidden = false;
	el.querySelector<HTMLElement>("[data-action='victory-new-game']")?.focus();
	announce("Victory! You have conquered all challenges and built the mightiest empire!");
}

export function hideVictoryScreen(): void {
	const el = document.getElementById("victory-overlay");
	if (el) el.hidden = true;
}
