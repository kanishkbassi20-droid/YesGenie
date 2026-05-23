(() => {
	"use strict";

	document.documentElement.classList.remove("no-js");

	const $ = (selector, root = document) => root.querySelector(selector);
	const year = $("#year");
	if (year) year.textContent = new Date().getFullYear();

	const statusEl = $("#dashboardStatus");
	const statusText = $("#dashboardStatusText");
	const authRequired = $("#authRequired");
	const signedInDashboard = $("#signedInDashboard");
	const profileDetails = $("#profileDetails");
	const wishDetails = $("#wishDetails");
	const signOutBtn = $("#signOutBtn");
	const toast = $("#toast");
	let toastTimer = 0;
	let auth = null;
	let db = null;

	const showToast = (message) => {
		if (!toast) return;
		window.clearTimeout(toastTimer);
		toast.textContent = message;
		toast.classList.add("is-open");
		toastTimer = window.setTimeout(() => toast.classList.remove("is-open"), 4200);
	};

	const setStatus = (message, type = "idle") => {
		if (!statusEl) return;
		if (statusText) statusText.textContent = message;
		statusEl.classList.toggle("is-success", type === "success");
		statusEl.classList.toggle("is-error", type === "error");
	};

	const escapeHtml = (value) =>
		String(value ?? "")
			.replaceAll("&", "&amp;")
			.replaceAll("<", "&lt;")
			.replaceAll(">", "&gt;")
			.replaceAll('"', "&quot;");

	const formatDate = (value) => {
		if (!value) return "Not available";
		const date = typeof value.toDate === "function" ? value.toDate() : new Date(value);
		if (Number.isNaN(date.getTime())) return "Not available";
		return new Intl.DateTimeFormat("en-IN", {
			dateStyle: "medium",
			timeStyle: "short",
		}).format(date);
	};

	const detailRows = (rows) =>
		rows
			.map(
				([label, value]) => `
					<div class="detail-row">
						<span>${escapeHtml(label)}</span>
						<strong>${escapeHtml(value || "Not provided")}</strong>
					</div>
				`
			)
			.join("");

	const renderProfile = (user, profile = {}) => {
		if (!profileDetails) return;
		profileDetails.innerHTML = detailRows([
			["Name", profile.displayName || user.displayName],
			["Email", user.email],
			["Last profile sync", formatDate(profile.lastSeenAt)],
			["Consent version", profile.legalConsent?.policyVersion || "Not recorded"],
		]);
	};

	const renderWish = (wish = null) => {
		if (!wishDetails) return;
		if (!wish) {
			wishDetails.innerHTML = `
				<div class="empty-state">
					<strong>No saved wish yet.</strong>
					Complete the Make a Wish form so YesGenie can understand your travel profile and plan with better context.
				</div>
			`;
			return;
		}

		wishDetails.innerHTML = `<div class="detail-list">${detailRows([
			["Name", wish.name],
			["Age", wish.age ? `${wish.age} years` : ""],
			["Year of birth", wish.yearOfBirth],
			["Gender", wish.gender],
			["Mobile number", wish.phoneNumber],
			["Instagram ID", wish.instagramId],
			["City of work", wish.cityOfWork],
			["Occupation", wish.occupation],
			["Email from login", wish.email],
			["Submitted", formatDate(wish.createdAt)],
		])}</div>`;
	};

	const syncProfile = async (user) => {
		if (!db || !user) return {};
		const userRef = db.collection("users").doc(user.uid);
		await userRef.set(
			{
				email: user.email || "",
				displayName: user.displayName || "",
				lastSeenAt: firebase.firestore.FieldValue.serverTimestamp(),
				source: "yesgenie-dashboard",
			},
			{ merge: true }
		);
		const profileSnap = await userRef.get();
		return profileSnap.exists ? profileSnap.data() : {};
	};

	const loadDashboard = async (user) => {
		authRequired?.classList.add("is-hidden");
		signedInDashboard?.classList.remove("is-hidden");
		setStatus("Loading profile and wish details...");

		try {
			const profile = await syncProfile(user);
			const wishSnap = await db.collection("users").doc(user.uid).collection("wishQuiz").doc("current").get();
			renderProfile(user, profile);
			renderWish(wishSnap.exists ? wishSnap.data() : null);
			setStatus("Dashboard loaded.", "success");
		} catch (error) {
			setStatus("Could not load saved details. Please refresh and try again.", "error");
			showToast(error?.message || "Dashboard load failed.");
		}
	};

	const initFirebase = () => {
		if (!window.firebase?.initializeApp || !window.firebase?.auth || !window.firebase?.firestore) {
			setStatus("Firebase did not load. Refresh the page and try again.", "error");
			return;
		}

		if (!firebase.apps.length) firebase.initializeApp(window.YESGENIE_FIREBASE_CONFIG);
		auth = firebase.auth();
		db = firebase.firestore();

		auth.onAuthStateChanged((user) => {
			if (!user) {
				authRequired?.classList.remove("is-hidden");
				signedInDashboard?.classList.add("is-hidden");
				setStatus("Sign in to view your dashboard.", "error");
				return;
			}
			loadDashboard(user);
		});
	};

	signOutBtn?.addEventListener("click", async () => {
		try {
			signOutBtn.disabled = true;
			await auth?.signOut();
			showToast("Signed out of YesGenie.");
		} catch {
			showToast("Could not sign out. Please try again.");
		} finally {
			signOutBtn.disabled = false;
		}
	});

	initFirebase();
})();
