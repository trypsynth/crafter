// Loads the real page in a headless Chromium over the DevTools protocol, then checks
// that the game booted, rendered, and reacts to clicks. The core tests cannot see any
// of that, because they run with no DOM at all.
//
//   deno task smoke        (expects `deno task dev` to be serving on :8080)

const BROWSERS = [
	`${Deno.env.get("ProgramFiles")}\\Google\\Chrome\\Application\\chrome.exe`,
	`${Deno.env.get("ProgramFiles(x86)")}\\Google\\Chrome\\Application\\chrome.exe`,
	`${Deno.env.get("LOCALAPPDATA")}\\Google\\Chrome\\Application\\chrome.exe`,
	`${Deno.env.get("ProgramFiles(x86)")}\\Microsoft\\Edge\\Application\\msedge.exe`,
	`${Deno.env.get("ProgramFiles")}\\Microsoft\\Edge\\Application\\msedge.exe`,
	"/usr/bin/google-chrome",
	"/usr/bin/chromium",
];

const URL_UNDER_TEST = Deno.env.get("SMOKE_URL") ?? "http://localhost:8080/";
const PORT = 9333;

function findBrowser(): string {
	for (const p of BROWSERS) {
		try {
			if (Deno.statSync(p).isFile) return p;
		} catch { /* not installed here */ }
	}
	throw new Error("No Chrome or Edge found. Set one of the paths in tools/browser_smoke.ts.");
}

class Cdp {
	#ws: WebSocket;
	#id = 0;
	#pending = new Map<number, { resolve: (v: any) => void; reject: (e: Error) => void }>();
	events: { method: string; params: any }[] = [];

	constructor(ws: WebSocket) {
		this.#ws = ws;
		ws.onmessage = (ev) => {
			const msg = JSON.parse(ev.data);
			if (msg.id !== undefined) {
				const p = this.#pending.get(msg.id);
				this.#pending.delete(msg.id);
				if (msg.error) p?.reject(new Error(JSON.stringify(msg.error)));
				else p?.resolve(msg.result);
			} else {
				this.events.push({ method: msg.method, params: msg.params });
			}
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

let failures = 0;
function check(name: string, ok: boolean, detail = ""): void {
	if (ok) console.log(`  ok   ${name}`);
	else {
		failures++;
		console.log(`  FAIL ${name}${detail ? " :: " + detail : ""}`);
	}
}

const browser = findBrowser();
const profile = await Deno.makeTempDir({ prefix: "crafter-smoke-" });
console.log(`browser: ${browser}`);

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
		} catch { /* browser still starting */ }
		await sleep(250);
	}
	throw new Error("Browser never exposed a page target");
}

try {
	const cdp = await Cdp.connect(await targetWs());
	await cdp.send("Runtime.enable");
	await cdp.send("Log.enable");
	await cdp.send("Page.enable");
	await cdp.send("Page.navigate", { url: URL_UNDER_TEST });
	await sleep(2500);

	const errors = cdp.events
		.filter((e) => e.method === "Runtime.exceptionThrown" || (e.method === "Log.entryAdded" && e.params.entry.level === "error"))
		.map((e) => e.params.exceptionDetails?.exception?.description ?? e.params.entry?.text ?? "unknown error");

	console.log("boot");
	check("no console errors", errors.length === 0, errors.join(" | "));
	check("title is Crafter", (await cdp.evaluate<string>("document.title")) === "Crafter");
	check("hud shows gold", /gold/.test(await cdp.evaluate<string>("document.getElementById('hud-gold').textContent")));
	check("custom elements registered", await cdp.evaluate<boolean>("!!customElements.get('building-section') && !!customElements.get('market-section')"));

	console.log("render");
	check("building select has the lumber yard", (await cdp.evaluate<string>("document.getElementById('building-select').value")) === "lumber_yard");
	check("product card rendered", await cdp.evaluate<boolean>("!!document.querySelector('.add-slot-btn')"));
	check("market storage bar rendered", await cdp.evaluate<boolean>("!!document.querySelector('.storage-bar-wrap')"));
	check("quest cards rendered", (await cdp.evaluate<number>("document.querySelectorAll('.quest-card').length")) === 5);
	check("build button offers the sawmill", /Sawmill/.test(await cdp.evaluate<string>("document.querySelector('[data-action=\"build\"]')?.textContent ?? ''")));

	console.log("interaction");
	await cdp.evaluate("localStorage.clear()");
	// Grant gold through the save file, reload, then play with the real buttons only.
	await cdp.evaluate(`
		const raw = JSON.parse(localStorage.getItem('crafter') ?? '{}');
		raw.gold = 50000;
		localStorage.setItem('crafter', JSON.stringify(raw));
	`);
	await cdp.send("Page.navigate", { url: URL_UNDER_TEST });
	await sleep(1500);
	const goldBefore = await cdp.evaluate<number>("Number(document.getElementById('hud-gold').textContent.replace(/[^0-9]/g,''))");
	check("gold loaded from save", goldBefore >= 49000, String(goldBefore));

	await cdp.evaluate("document.querySelector('.add-slot-btn').click()");
	await sleep(300);
	check(
		"buying a slot spends gold",
		(await cdp.evaluate<number>("Number(document.getElementById('hud-gold').textContent.replace(/[^0-9]/g,''))")) < goldBefore,
	);
	check("slot summary updated", /slot/.test(await cdp.evaluate<string>("document.querySelector('.slot-summary')?.textContent ?? ''")));

	await sleep(3000);
	const stock = await cdp.evaluate<number>("Number(document.getElementById('hud-storage').textContent.split('/')[0])");
	check("production accrues over time", stock > 0, `storage=${stock}`);

	await cdp.evaluate("document.querySelector('.sell-all-btn')?.click()");
	await sleep(300);
	check("selling empties storage", (await cdp.evaluate<number>("Number(document.getElementById('hud-storage').textContent.split('/')[0])")) === 0);

	await cdp.evaluate("document.querySelector('[data-action=\"storage-upgrade\"]').click()");
	await sleep(300);
	check("storage upgrade raises the cap", (await cdp.evaluate<string>("document.getElementById('hud-storage').textContent")).includes("/100"));

	await cdp.evaluate("document.querySelector('[data-action=\"settings-open\"]').click()");
	await sleep(300);
	check(
		"settings panel opens",
		await cdp.evaluate<boolean>("document.getElementById('app').classList.contains('settings-open') && !!document.getElementById('save-textarea')"),
	);
	await cdp.evaluate("document.querySelector('[data-action=\"settings-back\"]').click()");
	await sleep(200);
	check("settings panel closes", !(await cdp.evaluate<boolean>("document.getElementById('app').classList.contains('settings-open')")));

	const lateErrors = cdp.events
		.filter((e) => e.method === "Runtime.exceptionThrown")
		.map((e) => e.params.exceptionDetails?.exception?.description ?? "unknown");
	check("no exceptions during play", lateErrors.length === 0, lateErrors.join(" | "));

	cdp.close();
} finally {
	try {
		proc.kill();
	} catch { /* already gone */ }
	await proc.status;
	await Deno.remove(profile, { recursive: true }).catch(() => {});
}

console.log(failures === 0 ? "\nBrowser smoke passed." : `\n${failures} browser check(s) failed.`);
Deno.exit(failures === 0 ? 0 : 1);
