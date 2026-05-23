(() => {
	"use strict";

	const storageKey = "yesgenieCookieConsent";
	const nowIso = () => new Date().toISOString();
	const readConsent = () => {
		try {
			return JSON.parse(window.localStorage.getItem(storageKey) || "null");
		} catch {
			return null;
		}
	};

	const writeConsent = (preferences) => {
		const payload = {
			version: window.YESGENIE_POLICY_VERSION || "2026-05-23",
			updatedAt: nowIso(),
			necessary: true,
			analytics: Boolean(preferences.analytics),
			marketing: Boolean(preferences.marketing),
		};
		window.localStorage.setItem(storageKey, JSON.stringify(payload));
		window.dispatchEvent(new CustomEvent("yesgenie:cookie-consent", { detail: payload }));
		return payload;
	};

	if (readConsent()) return;

	const banner = document.createElement("section");
	banner.className = "cookie-consent is-open";
	banner.setAttribute("aria-label", "Cookie consent");
	banner.innerHTML = `
		<div class="cookie-consent__panel" role="dialog" aria-modal="false" aria-labelledby="cookieConsentTitle">
			<div class="cookie-consent__header">
				<div>
					<h2 id="cookieConsentTitle">Cookie Preferences</h2>
					<p>
						We use essential cookies for secure login and site operation. Optional analytics or marketing cookies
						will only be used if you allow them.
					</p>
				</div>
			</div>
			<div class="cookie-consent__actions">
				<button class="cookie-consent__button cookie-consent__button--primary" type="button" data-cookie-action="accept">
					Accept
				</button>
				<button class="cookie-consent__button" type="button" data-cookie-action="reject">Reject</button>
				<button class="cookie-consent__button" type="button" data-cookie-action="manage">Manage Preferences</button>
			</div>
			<div class="cookie-consent__prefs">
				<label class="cookie-consent__choice">
					<input type="checkbox" checked disabled />
					<span><strong>Essential</strong><span>Required for login, session security, and basic website features.</span></span>
				</label>
				<label class="cookie-consent__choice">
					<input type="checkbox" id="cookieAnalytics" />
					<span><strong>Analytics</strong><span>Helps us understand site usage and improve trip planning journeys.</span></span>
				</label>
				<label class="cookie-consent__choice">
					<input type="checkbox" id="cookieMarketing" />
					<span><strong>Marketing</strong><span>Used only for consent-based remarketing, pixels, or campaign measurement.</span></span>
				</label>
				<div class="cookie-consent__manage-actions">
					<button class="cookie-consent__button cookie-consent__button--primary" type="button" data-cookie-action="save">
						Save Preferences
					</button>
					<a class="cookie-consent__button" href="/cookie-policy">Cookie Policy</a>
				</div>
			</div>
		</div>
	`;

	const close = (preferences) => {
		writeConsent(preferences);
		banner.classList.remove("is-open");
		window.setTimeout(() => banner.remove(), 220);
	};

	banner.addEventListener("click", (event) => {
		const target = event.target instanceof Element ? event.target.closest("[data-cookie-action]") : null;
		if (!target) return;
		const action = target.getAttribute("data-cookie-action");
		if (action === "manage") {
			banner.classList.add("is-managing");
			return;
		}
		if (action === "accept") close({ analytics: true, marketing: true });
		if (action === "reject") close({ analytics: false, marketing: false });
		if (action === "save") {
			close({
				analytics: document.querySelector("#cookieAnalytics")?.checked,
				marketing: document.querySelector("#cookieMarketing")?.checked,
			});
		}
	});

	document.addEventListener("DOMContentLoaded", () => document.body.appendChild(banner));
})();
