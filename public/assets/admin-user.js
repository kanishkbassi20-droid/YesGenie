(() => {
	"use strict";

	document.documentElement.classList.remove("no-js");

	const $ = (selector, root = document) => root.querySelector(selector);
	const year = $("#year");
	if (year) year.textContent = new Date().getFullYear();

	const adminStatus = $("#adminStatus");
	const adminStatusText = $("#adminStatusText");
	const detailContent = $("#adminDetailContent");
	const toast = $("#toast");
	const userId = new URLSearchParams(window.location.search).get("id");

	let auth = null;
	let db = null;
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

	const detailGrid = (rows) => `<div class="detail-grid detail-grid--detail">${rows.map(([label, value]) => detailItem(label, value)).join("")}</div>`;

	const initialsFor = (name, email) => {
		const source = String(name || email || "YG").trim();
		const parts = source.includes("@") ? [source[0], source.split("@")[0]?.[1]] : source.split(/\s+/);
		return parts
			.filter(Boolean)
			.slice(0, 2)
			.map((part) => part[0])
			.join("")
			.toUpperCase();
	};

	const renderMessage = (title, message, action = "") => {
		if (!detailContent) return;
		detailContent.innerHTML = `
			<div class="empty-state">
				<strong>${escapeHtml(title)}</strong>
				${escapeHtml(message)}
				${action}
			</div>
		`;
	};

	const assertAdmin = async (user) => {
		if (!user) return false;
		const token = await user.getIdTokenResult(true);
		return Boolean(token.claims.admin) || isAdminEmail(user.email);
	};

	const renderUser = (profile, wishes, inviteRequests = []) => {
		const latestWish =
			wishes.find((wish) => wish.id === "current") ||
			[...wishes].sort((a, b) => timestampMs(b.createdAt) - timestampMs(a.createdAt))[0] ||
			null;
		const name = latestWish?.name || profile.name || profile.displayName || "Unnamed user";
		const email = latestWish?.email || profile.email || "No email";
		const history = [...wishes].sort((a, b) => timestampMs(b.createdAt) - timestampMs(a.createdAt));
		const invites = [...inviteRequests].sort((a, b) => timestampMs(b.createdAt || b.updatedAt) - timestampMs(a.createdAt || a.updatedAt));
		const queueLabel = (status) => {
			const value = String(status || "").trim();
			if (value === "queued") return "Email queued";
			if (value === "queue_failed") return "Email queue failed";
			return "Email pending";
		};

		detailContent.innerHTML = `
			<div class="detail-toolbar">
				<a class="btn btn--ghost" href="/admin">Back to users</a>
			</div>

			<section class="detail-identity">
				<div class="detail-identity__avatar" aria-hidden="true">${escapeHtml(initialsFor(name, email))}</div>
				<div>
					<div class="badge ${latestWish ? "" : "badge--empty"}">${latestWish ? "Wish saved" : "No wish yet"}</div>
					<h2>${escapeHtml(name)}</h2>
					<p>${escapeHtml(email)}</p>
				</div>
			</section>

			<section class="detail-panel">
				<div class="card-head">
					<div>
						<span>Profile</span>
						<h2>Account details</h2>
					</div>
				</div>
				${detailGrid([
					["User ID", userId],
					["Name", profile.displayName || profile.name],
					["Email", profile.email || email],
					["Phone", profile.phoneNumber],
					["City of work", profile.cityOfWork],
					["Occupation", profile.occupation],
					["Source", profile.source],
					["Last profile sync", formatDate(profile.lastSeenAt)],
					["Consent version", profile.legalConsent?.policyVersion],
				])}
			</section>

			<section class="detail-panel">
				<div class="card-head">
					<div>
						<span>Latest Wish</span>
						<h2>Make a Wish details</h2>
					</div>
				</div>
				${
					latestWish
						? detailGrid([
								["Name", latestWish.name],
								["Age", latestWish.age ? `${latestWish.age} years` : ""],
								["Year of birth", latestWish.yearOfBirth],
								["Gender", latestWish.gender],
								["Phone", latestWish.phoneNumber],
								["Instagram", latestWish.instagramId],
								["City of work", latestWish.cityOfWork],
								["Occupation", latestWish.occupation],
								["Email from login", latestWish.email],
								["Submitted", formatDate(latestWish.createdAt)],
							])
						: `<div class="empty-state"><strong>No wish saved.</strong>This member has not completed the Make a Wish form yet.</div>`
				}
			</section>

			<section class="detail-panel">
				<div class="card-head">
					<div>
						<span>History</span>
						<h2>Saved submissions</h2>
					</div>
				</div>
				${
					history.length
						? `<div class="history-list">${history
								.map(
									(wish) => `
										<article class="history-item">
											<div>
												<strong>${escapeHtml(wish.id || "submission")}</strong>
												<span>${escapeHtml(formatDate(wish.createdAt))}</span>
											</div>
											<p>${escapeHtml([wish.cityOfWork, wish.occupation, wish.phoneNumber].filter(Boolean).join(" | ") || "No extra snapshot")}</p>
										</article>
									`
								)
								.join("")}</div>`
						: `<div class="empty-state"><strong>No history yet.</strong>Saved wish records will appear here.</div>`
				}
			</section>

			<section class="detail-panel">
				<div class="card-head">
					<div>
						<span>Invite Requests</span>
						<h2>Trip invite interest</h2>
					</div>
				</div>
				${
					invites.length
						? `<div class="history-list">${invites
								.map(
									(invite) => `
										<article class="history-item">
											<div>
												<strong>${escapeHtml(invite.tripName || invite.id || "Invite request")}</strong>
												<span>${escapeHtml(formatDate(invite.createdAt || invite.updatedAt))}</span>
											</div>
											<p>${escapeHtml([invite.status || "requested", invite.tripDuration, invite.tripRoute, invite.phoneNumber ? `Phone: ${invite.phoneNumber}` : ""].filter(Boolean).join(" | "))}</p>
											<p>${escapeHtml(
												[
													queueLabel(invite.emailQueueStatus),
													invite.emailQueueAttempts ? `${invite.emailQueueAttempts} email queue attempt${invite.emailQueueAttempts === 1 ? "" : "s"}` : "",
													invite.lastMailJobIds?.length ? `Mail jobs: ${invite.lastMailJobIds.join(", ")}` : "",
													invite.lastEmailQueueError ? `Last error: ${invite.lastEmailQueueError}` : "",
												]
													.filter(Boolean)
													.join(" | ")
											)}</p>
										</article>
									`
								)
								.join("")}</div>`
						: `<div class="empty-state"><strong>No invite requests yet.</strong>Trip invite requests will appear here after the member requests one.</div>`
				}
			</section>
		`;
	};

	const loadUser = async () => {
		if (!userId) {
			setStatus("No user was selected.", "error");
			renderMessage("No user selected.", "Open this page from a user tile on the secure users dashboard.");
			return;
		}

		setStatus("Loading selected user...");
		try {
			const userRef = db.collection("users").doc(userId);
			const [profileSnap, wishSnap, inviteSnap] = await Promise.all([
				userRef.get(),
				userRef.collection("wishQuiz").get(),
				userRef.collection("inviteRequests").get(),
			]);
			if (!profileSnap.exists) {
				setStatus("User profile was not found.", "error");
				renderMessage("User not found.", "The selected profile no longer exists or cannot be read.");
				return;
			}
			const wishes = wishSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
			const inviteRequests = inviteSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
			renderUser(profileSnap.data() || {}, wishes, inviteRequests);
			setStatus("User profile loaded.", "success");
		} catch (error) {
			const message = error?.code === "permission-denied" ? "This account is not permitted to read user details." : "Could not load this user.";
			setStatus(message, "error");
			renderMessage("Could not load user.", message);
			showToast(message);
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

		auth.onAuthStateChanged(async (user) => {
			if (!user) {
				setStatus("Sign in to view user details.", "error");
				renderMessage(
					"Login required.",
					"Sign in with an approved account to view this secure user profile.",
					`<div class="empty-state__actions"><a class="btn btn--primary" href="/login">Login</a></div>`
				);
				return;
			}

			const allowed = await assertAdmin(user);
			if (!allowed) {
				await auth.signOut();
				setStatus("This account is not approved for secure user access.", "error");
				renderMessage("Access denied.", "Use an approved secure account to open user details.");
				return;
			}

			await loadUser();
		});
	};

	initFirebase();
})();
