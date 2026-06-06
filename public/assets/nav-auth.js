(() => {
	"use strict";

	const adminEmails = () =>
		(window.YESGENIE_ADMIN_EMAILS || []).map((email) => String(email || "").trim().toLowerCase()).filter(Boolean);

	const isAdminEmail = (email) => adminEmails().includes(String(email || "").trim().toLowerCase());

	const rememberOriginal = (link) => {
		if (!link.dataset.originalHref) link.dataset.originalHref = link.getAttribute("href") || "";
		if (!link.dataset.originalText) link.dataset.originalText = link.textContent || "";
	};

	const updateLinks = (user) => {
		const signedIn = Boolean(user);
		const admin = signedIn && isAdminEmail(user?.email);
		let adminLinkClaimed = false;

		document.querySelectorAll('a[href="/login"], a[href="/dashboard"], a[href="/admin"], [data-auth-link]').forEach((link) => {
			if (!(link instanceof HTMLAnchorElement)) return;
			rememberOriginal(link);
			const originalHref = link.dataset.originalHref || "";
			const startedAsLogin = originalHref === "/login" || link.hasAttribute("data-auth-link");
			const startedAsDashboard = originalHref === "/dashboard";
			const startedAsAdmin = originalHref === "/admin";
			link.hidden = false;

			if (signedIn) {
				if (admin && (startedAsLogin || startedAsAdmin) && !adminLinkClaimed) {
					link.href = "/admin";
					link.textContent = "Admin";
					link.setAttribute("aria-label", "Open YesGenie admin dashboard");
					adminLinkClaimed = true;
				} else if (admin && (startedAsLogin || startedAsAdmin)) {
					link.hidden = true;
				} else if (startedAsDashboard) {
					link.href = "/dashboard";
					link.textContent = "Dashboard";
					link.setAttribute("aria-label", "Open your YesGenie dashboard");
				} else {
					link.href = "/dashboard";
					link.textContent = startedAsLogin ? "Profile" : "Dashboard";
					link.setAttribute("aria-label", "Open your YesGenie dashboard");
				}
				link.classList.add("is-profile-link");
			} else {
				link.href = originalHref || "/login";
				link.textContent = link.dataset.originalText || "Login";
				link.classList.remove("is-profile-link");
				link.removeAttribute("aria-label");
				link.hidden = link.hasAttribute("data-admin-link");
			}
		});

		document.querySelectorAll("[data-admin-link]").forEach((link) => {
			const showStandaloneAdmin = signedIn && admin && !adminLinkClaimed;
			link.toggleAttribute("hidden", !showStandaloneAdmin);
			if (showStandaloneAdmin) adminLinkClaimed = true;
		});
	};

	const init = () => {
		if (!window.firebase?.initializeApp || !window.firebase?.auth || !window.YESGENIE_FIREBASE_CONFIG) return;
		if (!firebase.apps.length) firebase.initializeApp(window.YESGENIE_FIREBASE_CONFIG);
		firebase.auth().onAuthStateChanged(updateLinks);
	};

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", init, { once: true });
	} else {
		init();
	}
})();
