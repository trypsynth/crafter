// Dev server. Runs the exact deploy build, then reruns it on any change under src/.
// One process, one build command, so what you test locally is byte for byte what ships.
import { contentType } from "@std/media-types/content-type";
import { extname, join, normalize, resolve } from "@std/path";

const ROOT = resolve(new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"));
const PORT = Number(Deno.env.get("PORT") ?? 8080);

async function build(): Promise<boolean> {
	const started = performance.now();
	const cmd = new Deno.Command(Deno.execPath(), {
		// Runs the deploy build, not a variant of it. Two commands writing to the same
		// dist/ with different flags means whichever ran last is what gets committed, which
		// is the drift this was supposed to prevent. The linked sourcemap keeps the
		// original TypeScript visible in devtools, so minified output costs nothing here.
		args: ["task", "build"],
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
