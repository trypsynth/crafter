// Dev server. Bundles src/main.ts with the same command the Pages build uses, then
// rebuilds on any change under src/. One process, one build path, no drift between
// what you test locally and what gets deployed.
import { contentType } from "@std/media-types/content-type";
import { extname, join, normalize, resolve } from "@std/path";

const ROOT = resolve(new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"));
const PORT = Number(Deno.env.get("PORT") ?? 8080);

async function build(): Promise<boolean> {
	const started = performance.now();
	const cmd = new Deno.Command(Deno.execPath(), {
		args: ["bundle", "--platform=browser", "--sourcemap=inline", "--outdir=dist", "src/main.ts"],
		cwd: ROOT,
		stdout: "piped",
		stderr: "piped",
	});
	const { success, stderr } = await cmd.output();
	if (success) {
		console.log(`build ok in ${Math.round(performance.now() - started)}ms`);
	} else {
		console.error("build failed:\n" + new TextDecoder().decode(stderr));
	}
	return success;
}

async function watch(): Promise<void> {
	let pending: ReturnType<typeof setTimeout> | undefined;
	for await (const _event of Deno.watchFs(join(ROOT, "src"))) {
		if (pending !== undefined) clearTimeout(pending);
		pending = setTimeout(() => {
			pending = undefined;
			build();
		}, 120);
	}
}

function resolvePath(urlPath: string): string | null {
	const rel = normalize(urlPath === "/" ? "index.html" : urlPath.replace(/^\/+/, ""));
	if (rel.startsWith("..") || rel.includes("\0")) return null;
	return join(ROOT, rel);
}

await build();
watch();

Deno.serve({ port: PORT, onListen: () => console.log(`Crafter on http://localhost:${PORT}`) }, async (req) => {
	const path = resolvePath(decodeURIComponent(new URL(req.url).pathname));
	if (!path) return new Response("Forbidden", { status: 403 });
	try {
		const body = await Deno.readFile(path);
		return new Response(body, {
			headers: {
				"content-type": contentType(extname(path)) ?? "application/octet-stream",
				"cache-control": "no-store",
			},
		});
	} catch {
		return new Response("Not found", { status: 404 });
	}
});
