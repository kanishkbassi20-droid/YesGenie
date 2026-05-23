const http = require("http");
const fs = require("fs");
const path = require("path");

const publicDir = path.resolve(__dirname, "..", "public");
const port = Number(process.argv[2] || process.env.PORT || 4173);
const host = "127.0.0.1";

const contentType = (filePath) => {
	const ext = path.extname(filePath).toLowerCase();
	switch (ext) {
		case ".html":
			return "text/html; charset=utf-8";
		case ".css":
			return "text/css; charset=utf-8";
		case ".js":
			return "text/javascript; charset=utf-8";
		case ".png":
			return "image/png";
		case ".jpg":
		case ".jpeg":
			return "image/jpeg";
		case ".webp":
			return "image/webp";
		case ".mp4":
			return "video/mp4";
		default:
			return "application/octet-stream";
	}
};

const resolveRequest = (url = "/") => {
	const cleanPath = decodeURIComponent(url.split("?")[0] || "/");
	const routes = {
		"/": "index.html",
		"/active-itineraries": "active-itineraries.html",
		"/bir-experience": "bir-experience.html",
		"/dashboard": "dashboard.html",
		"/login": "login.html",
		"/privacy-policy": "privacy-policy.html",
		"/terms-and-conditions": "terms-and-conditions.html",
		"/refund-cancellation-policy": "refund-cancellation-policy.html",
		"/cookie-policy": "cookie-policy.html",
		"/contact-grievance-officer": "contact-grievance-officer.html",
	};
	const rel = routes[cleanPath] || cleanPath.replace(/^[/\\]+/, "");
	const requested = path.resolve(publicDir, rel);
	if (!requested.startsWith(publicDir + path.sep) && requested !== publicDir) return null;
	return requested;
};

const server = http.createServer((req, res) => {
	const filePath = resolveRequest(req.url);
	if (!filePath) {
		res.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
		res.end("Bad request");
		return;
	}

	fs.readFile(filePath, (error, data) => {
		if (error) {
			res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
			res.end("Not found");
			return;
		}
		res.writeHead(200, { "Content-Type": contentType(filePath) });
		res.end(data);
	});
});

server.listen(port, host, () => {
	console.log(`YesGenie site running at http://${host}:${port}/`);
});
