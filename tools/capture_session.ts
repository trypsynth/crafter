// Plays a session in a real browser through real button clicks, then exports the journal
// the game recorded. Feed the result to `deno task sim --replay=<file>` to check that the
// headless core reproduces what the browser actually did.
//
//   deno task capture                 (expects `deno task dev` serving on :8080)
//   deno task capture --out=s.json --url=https://trypsynth.github.io/crafter/
//
// This is not a stand-in for a human anchor. It proves the pipeline carries a session
// faithfully; it says nothing about how a person would choose to play.

const BROWSERS = [
	`${Deno.env.get("ProgramFiles")}\\Google\\Chrome\\Application\\chrome.exe`,
	`${Deno.env.get("ProgramFiles(x86)")}\\Google\\Chrome\\Application\\chrome.exe`,
	`${Deno.env.get("LOCALAPPDATA")}\\Google\\Chrome\\Application\\chrome.exe`,
	`${Deno.env.get("ProgramFiles(x86)")}\\Microsoft\\Edge\\Application\\msedge.exe`,
	`${Deno.env.get("ProgramFiles")}\\Microsoft\\Edge\\Application\\msedge.exe`,
	"/usr/bin/google-chrome",
	"/usr/bin/chromium",
];

const PORT = 9335;

function arg(name: string, fallback: string): string {
	const hit = Deno.args.find((a) => a.startsWith(`--${name}=`));
	return hit ? hit.slice(name.length + 3) : fallback;
}

const URL_UNDER_TEST = arg("url", "http://localhost:8080/");
const OUT = arg("out", "session.json");
const SEED_GOLD = Number(arg("gold", "40000"));

function findBrowser(): string {
	for (const p of BROWSERS) {
		try {
			if (Deno.statSync(p).isFile) return p;
		} catch { /* not installed here */ }
	}
	throw new Error("No Chrome or Edge found.");
}

class Cdp {
	#ws: WebSocket;
	#id = 0;
	#pending = new Map<number, { resolve: (v: any) => void; reject: (e: Error) => void }>();

	constructor(ws: WebSocket) {
		this.#ws = ws;
		ws.onmessage = (ev) => {
			const msg = JSON.parse(ev.data);
			if (msg.id === undefined) return;
			const p = this.#pending.get(msg.id);
			this.#pending.delete(msg.id);
			if (msg.error) p?.reject(new Error(JSON.stringify(msg.error)));
			else p?.resolve(msg.result);
		};
	}

	static async connect(url: string): Promise<Cdp> {
		const ws = new WebSocket(url);
		await new Promise<void>((res, rej) => {
			ws.onopen = () => res();
			ws.onerror = () => rej(new Error("CDP socket failed"));
		});
		return new Cdp(ws);
	}

	send(method: string, params: Record<string, unknown> = {}): Promise<any> {
		const id = ++this.#id;
		return new Promise((resolve, reject) => {
			this.#pending.set(id, { resolve, reject });
			this.#ws.send(JSON.stringify({ id, method, params }));
		});
	}

	async evaluate<T>(expression: string): Promise<T> {
		const r = await this.send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
		if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description ?? "evaluate threw");
		return r.result.value as T;
	}

	close(): void {
		this.#ws.close();
	}
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const browser = findBrowser();
const profile = await Deno.makeTempDir({ prefix: "crafter-capture-" });
console.log(`browser: ${browser}`);
console.log(`url:     ${URL_UNDER_TEST}`);

const proc = new Deno.Command(browser, {
	args: [
		"--headless=new",
		`--remote-debugging-port=${PORT}`,
		`--user-data-dir=${profile}`,
		"--no-first-run",
		"--no-default-browser-check",
		"--disable-gpu",
		"--window-size=1280,1600",
		"about:blank",
	],
	stdout: "null",
	stderr: "null",
}).spawn();

async function targetWs(): Promise<string> {
	for (let i = 0; i < 60; i++) {
		try {
			const list = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
			const page = list.find((t: any) => t.type === "page");
			if (page?.webSocketDebuggerUrl) return page.webSocketDebuggerUrl;
		} catch { /* still starting */ }
		await sleep(250);
	}
	throw new Error("Browser never exposed a page target");
}

// Every step goes through the page's own click handler, so the journal sees exactly what
// it would see from a person pressing the same buttons.
async function click(cdp: Cdp, selector: string, label: string): Promise<boolean> {
	const ok = await cdp.evaluate<boolean>(`
		(() => {
			const el = document.querySelector(${JSON.stringify(selector)});
			if (!el || el.disabled) return false;
			el.click();
			return true;
		})()
	`);
	console.log(`  ${ok ? "click" : "skip "} ${label}`);
	return ok;
}

try {
	const cdp = await Cdp.connect(await targetWs());
	await cdp.send("Runtime.enable");
	await cdp.send("Page.enable");
	await cdp.send("Page.navigate", { url: URL_UNDER_TEST });
	await sleep(2000);

	// Start from a save with some gold, the way a returning player would. Recording begins
	// on the reload, so this setup is outside the journal.
	await cdp.evaluate(`
		const raw = JSON.parse(localStorage.getItem('crafter') ?? '{}');
		raw.gold = ${SEED_GOLD};
		localStorage.setItem('crafter', JSON.stringify(raw));
	`);
	await cdp.send("Page.navigate", { url: URL_UNDER_TEST });
	await sleep(2000);
	console.log("\nplaying");

	const addLogs = '[data-action="add-slot"][data-bld="lumber_yard"][data-product="logs"]';
	const addTimber = '[data-action="add-slot"][data-bld="lumber_yard"][data-product="timber"]';
	const unlockTimber = '[data-action="unlock-product"][data-bld="lumber_yard"][data-product="timber"]';

	for (let i = 0; i < 4; i++) {
		await click(cdp, addLogs, `add a logs slot (${i + 1})`);
		await sleep(1200);
	}
	await sleep(8000);
	await click(cdp, '[data-action="sell-all"]', "sell everything");
	await sleep(1000);
	await click(cdp, '[data-action="storage-upgrade"]', "expand storage");
	await sleep(1000);
	await click(cdp, unlockTimber, "unlock timber");
	await sleep(1000);
	for (let i = 0; i < 3; i++) {
		await click(cdp, addTimber, `add a timber slot (${i + 1})`);
		await sleep(1200);
	}
	await sleep(12000);
	await click(cdp, '[data-action="sell-all"]', "sell everything");
	await sleep(1500);
	await click(cdp, '[data-action="manual-produce"]', "hand craft one");
	await sleep(4000);
	for (let i = 0; i < 3; i++) {
		await click(cdp, addLogs, `add a logs slot (${i + 5})`);
		await sleep(1200);
	}
	await sleep(10000);
	await click(cdp, '[data-action="sell-all"]', "sell everything");
	await sleep(2000);

	console.log("\nexporting");
	await click(cdp, '[data-action="settings-open"]', "open settings");
	await sleep(600);
	await click(cdp, '[data-action="export-recording"]', "export recording");
	await sleep(600);
	const text = await cdp.evaluate<string>("document.getElementById('save-textarea').value");
	if (!text || !text.startsWith("{")) throw new Error("Export produced nothing usable");
	const recording = JSON.parse(text);
	await Deno.writeTextFile(OUT, JSON.stringify(recording, null, "\t"));
	console.log(`  ${recording.entries.length} actions over ${((recording.endedAt - recording.startedAt) / 1000).toFixed(0)}s`);
	console.log(`  written to ${OUT}`);
	console.log(`\nNow run:  deno task sim --replay=${OUT}`);
	cdp.close();
} finally {
	try {
		proc.kill();
	} catch { /* already gone */ }
	await proc.status;
	await Deno.remove(profile, { recursive: true }).catch(() => {});
}
