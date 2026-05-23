(() => {
	"use strict";

	document.documentElement.classList.remove("no-js");

	const $ = (selector, root = document) => root.querySelector(selector);
	const year = $("#year");
	if (year) year.textContent = new Date().getFullYear();

	const adminStatus = $("#adminStatus");
	const adminStatusText = $("#adminStatusText");
	const loginCard = $("#adminLoginCard");
	const loginForm = $("#adminLoginForm");
	const loginBtn = $("#adminLoginBtn");
	const adminContent = $("#adminContent");
	const userList = $("#adminUserList");
	const totalUsers = $("#totalUsers");
	const totalWishes = $("#totalWishes");
	const latestWish = $("#latestWish");
	const searchInput = $("#adminSearch");
	const refreshBtn = $("#refreshAdminData");
	const signOutBtn = $("#adminSignOut");
	const toast = $("#toast");

	let auth = null;
	let db = null;
	let allRows = [];
	let toastTimer = 0;

	const adminEmails = () =>
		(window.YESGENIE_ADMIN_EMAILS || []).map((email) => String(email || "").trim().toLowerCase()).filter(Boolean);

	const isAdminEmail = (email) => adminEmails().includes(String(email || "").trim().toLowerCase());

	const showToast = (message) => {
		if (!toast) return;
		window.clearTimeout(toastTimer);
		toast.textContent = message;
		toast.classList.add("is-open");
		toastTimer = window.setTimeout(() => toast.classList.remove("is-open"), 4200);
	};

	const setStatus = (message, type = "idle") => {
		if (adminStatusText) adminStatusText.textContent = message;
		adminStatus?.classList.toggle("is-success", type === "success");
		adminStatus?.classList.toggle("is-error", type === "error");
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
		return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(date);
	};

	const timestampMs = (value) => {
		if (!value) return 0;
		const date = typeof value.toDate === "function" ? value.toDate() : new Date(value);
		return Number.isNaN(date.getTime()) ? 0 : date.getTime();
	};

	const detailItem = (label, value) => `
		<div class="detail-item">
			<span>${escapeHtml(label)}</span>
			<strong>${escapeHtml(value || "Not provided")}</strong>
		</div>
	`;

	const searchableText = (row) =>
		[
			row.profile.displayName,
			row.profile.name,
			row.profile.email,
			row.wish?.name,
			row.wish?.email,
			row.wish?.phoneNumber,
			row.wish?.instagramId,
			row.wish?.cityOfWork,
			row.wish?.occupation,
			row.wish?.gender,
		]
			.join(" ")
			.toLowerCase();

	const renderRows = () => {
		if (!userList) return;
		const query = String(searchInput?.value || "").trim().toLowerCase();
		const rows = query ? allRows.filter((row) => row.search.includes(query)) : allRows;

		if (!rows.length) {
			userList.innerHTML = `
				<div class="empty-state">
					<strong>No matching users found.</strong>
					Try a different search term or refresh the admin dashboard.
				</div>
			`;
			return;
		}

		userList.innerHTML = rows
			.map((row) => {
				const profile = row.profile || {};
				const wish = row.wish || {};
				const name = wish.name || profile.name || profile.displayName || "Unnamed user";
				const email = wish.email || profile.email || "No email";
				const hasWish = Boolean(row.wish);
				return `
					<article class="user-card">
						<div class="user-card__head">
							<div>
								<span>${escapeHtml(email)}</span>
								<h3>${escapeHtml(name)}</h3>
								<p>${escapeHtml(profile.source || "YesGenie member")}</p>
							</div>
							<div class="badge ${hasWish ? "" : "badge--empty"}">${hasWish ? "Wish saved" : "No wish yet"}</div>
						</div>
						<div class="detail-grid">
							${detailItem("Age", wish.age ? `${wish.age} years` : "")}
							${detailItem("Gender", wish.gender)}
							${detailItem("Phone", wish.phoneNumber || profile.phoneNumber)}
							${detailItem("Instagram", wish.instagramId)}
							${detailItem("City of work", wish.cityOfWork || profile.cityOfWork)}
							${detailItem("Occupation", wish.occupation || profile.occupation)}
							${detailItem("Submitted", formatDate(wish.createdAt))}
							${detailItem("Last profile sync", formatDate(profile.lastSeenAt))}
						</div>
					</article>
				`;
			})
			.join("");
	};

	const setBusy = (busy) => {
		[loginBtn, refreshBtn, signOutBtn].forEach((button) => {
			if (button) button.disabled = busy;
		});
	};

	const assertAdmin = async (user) => {
		if (!user) return false;
		const token = await user.getIdTokenResult(true);
		return Boolean(token.claims.admin) || isAdminEmail(user.email);
	};

	const loadAdminData = async () => {
		if (!db) return;
		setBusy(true);
		setStatus("Loading users and wish submissions...");

		try {
			const usersSnap = await db.collection("users").get();
			const rows = await Promise.all(
				usersSnap.docs.map(async (doc) => {
					const profile = doc.data() || {};
					const wishSnap = await doc.ref.collection("wishQuiz").get();
					const current = wishSnap.docs.find((item) => item.id === "current")?.data() || null;
					const latest =
						current ||
						wishSnap.docs
							.map((item) => item.data())
							.sort((a, b) => timestampMs(b.createdAt) - timestampMs(a.createdAt))[0] ||
						null;
					return {
						id: doc.id,
						profile,
						wish: latest,
						wishCount: wishSnap.docs.length,
						search: "",
					};
				})
			);

			allRows = rows
				.map((row) => ({ ...row, search: searchableText(row) }))
				.sort((a, b) => timestampMs(b.wish?.createdAt || b.profile.lastSeenAt) - timestampMs(a.wish?.createdAt || a.profile.lastSeenAt));

			const wishRows = allRows.filter((row) => row.wish);
			if (totalUsers) totalUsers.textContent = String(allRows.length);
			if (totalWishes) totalWishes.textContent = String(wishRows.length);
			if (latestWish) latestWish.textContent = wishRows.length ? formatDate(wishRows[0].wish.createdAt) : "Not available";
			renderRows();
			setStatus("Admin dashboard loaded.", "success");
		} catch (error) {
			const message = error?.code === "permission-denied" ? "This admin account is not permitted by Firestore rules." : "Could not load admin data.";
			setStatus(message, "error");
			showToast(message);
		} finally {
			setBusy(false);
		}
	};

	const showAdmin = async (user) => {
		const allowed = await assertAdmin(user);
		if (!allowed) {
			await auth?.signOut();
			loginCard?.classList.remove("is-hidden");
			adminContent?.classList.add("is-hidden");
			setStatus("This account is not approved for admin access.", "error");
			return;
		}
		loginCard?.classList.add("is-hidden");
		adminContent?.classList.remove("is-hidden");
		await loadAdminData();
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
				loginCard?.classList.remove("is-hidden");
				adminContent?.classList.add("is-hidden");
				setStatus("Sign in with an admin account.");
				return;
			}
			showAdmin(user);
		});
	};

	loginForm?.addEventListener("submit", async (event) => {
		event.preventDefault();
		const email = String(loginForm.elements.email.value || "").trim();
		const password = String(loginForm.elements.password.value || "");
		try {
			setBusy(true);
			setStatus("Checking admin credentials...");
			await auth.signInWithEmailAndPassword(email, password);
			loginForm.reset();
		} catch (error) {
			const message =
				error?.code === "auth/invalid-credential"
					? "The admin email or password is incorrect."
					: "Could not sign in. Check the admin account and try again.";
			setStatus(message, "error");
			showToast(message);
		} finally {
			setBusy(false);
		}
	});

	searchInput?.addEventListener("input", renderRows);
	refreshBtn?.addEventListener("click", loadAdminData);
	signOutBtn?.addEventListener("click", async () => {
		await auth?.signOut();
		showToast("Signed out of admin dashboard.");
	});

	initFirebase();
})();
