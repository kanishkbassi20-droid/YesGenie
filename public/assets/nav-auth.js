(() => {
	"use strict";

	const profileLabel = (user) => {
		const fallback = String(user?.email || "Profile").split("@")[0];
		const name = String(user?.displayName || fallback).trim();
		return name ? `Profile: ${name}` : "Profile";
	};

	const adminEmails = () =>
		(window.YESGENIE_ADMIN_EMAILS || []).map((email) => String(email || "").trim().toLowerCase()).filter(Boolean);

	const isAdminEmail = (email) => adminEmails().includes(String(email || "").trim().toLowerCase());

	const updateLinks = (user) => {
		const signedIn = Boolean(user);
		document.querySelectorAll('a[href="/login"], [data-auth-link]').forEach((link) => {
			if (!(link instanceof HTMLAnchorElement)) return;
			if (signedIn) {
				link.href = "/dashboard";
				link.textContent = profileLabel(user);
				link.classList.add("is-profile-link");
				link.setAttribute("aria-label", "Open your YesGenie dashboard");
			} else {
				link.href = "/login";
				link.textContent = "Login";
				link.classList.remove("is-profile-link");
				link.removeAttribute("aria-label");
			}
		});

		document.querySelectorAll("[data-admin-link]").forEach((link) => {
			link.toggleAttribute("hidden", !signedIn || !isAdminEmail(user?.email));
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
