const http = require("http");
const fs = require("fs");
const path = require("path");

const publicDir = path.resolve(__dirname, "..", "public");

const contentType = (filePath) => {
	const ext = path.extname(filePath).toLowerCase();
	switch (ext) {
		case ".html":
			return "text/html; charset=utf-8";
		case ".css":
			return "text/css; charset=utf-8";
		case ".js":
			return "text/javascript; charset=utf-8";
		case ".svg":
			return "image/svg+xml";
		case ".png":
			return "image/png";
		case ".jpg":
		case ".jpeg":
			return "image/jpeg";
		case ".webp":
			return "image/webp";
		case ".json":
			return "application/json; charset=utf-8";
		default:
			return "application/octet-stream";
	}
};

const safeJoin = (root, reqPath) => {
	const cleanPath = decodeURIComponent(reqPath.split("?")[0] || "/");
	const rel = cleanPath === "/" ? "/index.html" : cleanPath;
	const normalized = path.normalize(rel).replace(/^([/\\\\])+/, "");
	const joined = path.resolve(root, normalized);
	if (!joined.startsWith(root + path.sep)) return null;
	return joined;
};

const server = http.createServer((req, res) => {
	try {
		const filePath = safeJoin(publicDir, req.url || "/");
		if (!filePath) {
			res.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
			res.end("Bad request");
			return;
		}

		fs.readFile(filePath, (err, data) => {
			if (err) {
				res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
				res.end("Not found");
				return;
			}
			res.writeHead(200, { "Content-Type": contentType(filePath) });
			res.end(data);
		});
	} catch {
		res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
		res.end("Server error");
	}
});

const get = (url) =>
	new Promise((resolve, reject) => {
		http
			.get(url, (res) => {
				const chunks = [];
				res.on("data", (c) => chunks.push(c));
				res.on("end", () => resolve({ status: res.statusCode || 0, body: Buffer.concat(chunks) }));
			})
			.on("error", reject);
	});

server.listen(0, "127.0.0.1", async () => {
	const addr = server.address();
	const port = addr && typeof addr === "object" ? addr.port : null;
	if (!port) {
		console.error("Could not get bound port");
		server.close(() => process.exit(1));
		return;
	}

	try {
		const base = `http://127.0.0.1:${port}`;
		const checks = [
			"/",
			"/assets/styles.css",
			"/assets/consent.css",
			"/assets/firebase-config.js",
			"/assets/consent.js",
			"/assets/app.js",
			"/active-itineraries.html",
			"/login.html",
			"/assets/active-itineraries.css",
			"/assets/auth.css",
			"/assets/auth.js",
			"/dashboard.html",
			"/assets/dashboard.css",
			"/assets/dashboard.js",
			"/bir-experience.html",
			"/assets/bir-experience.css",
			"/assets/bir-experience.js",
			"/privacy-policy.html",
			"/terms-and-conditions.html",
			"/refund-cancellation-policy.html",
			"/cookie-policy.html",
			"/contact-grievance-officer.html",
			"/assets/legal.css",
		];

		for (const p of checks) {
			const r = await get(base + p);
			if (r.status !== 200 || !r.body.length) {
				throw new Error(`GET ${p} failed (status=${r.status}, bytes=${r.body.length})`);
			}
		}

		console.log("OK: Static site serves HTML/CSS/JS");
		server.close(() => process.exit(0));
	} catch (e) {
		console.error(String(e && e.message ? e.message : e));
		server.close(() => process.exit(1));
	}
});
