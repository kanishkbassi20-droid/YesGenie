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
	const editModal = $("#editModal");
	const editForm = $("#editForm");
	const editFieldSlot = $("#editFieldSlot");
	const editModalTitle = $("#editModalTitle");
	const editModalEyebrow = $("#editModalEyebrow");
	const editSaveBtn = $("#editSaveBtn");
	let toastTimer = 0;
	let auth = null;
	let db = null;
	let currentUser = null;
	let currentProfile = {};
	let currentWish = null;
	let activeEditKey = "";

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

	const normalizePhoneNumber = (value) => String(value || "").trim().replace(/\s+/g, " ");

	const isValidPhoneNumber = (value) => /^\+?[0-9][0-9\s-]{6,19}$/.test(String(value || "").trim());

	const normalizeInstagram = (value) => {
		const clean = String(value || "").trim().replace(/^@+/, "");
		return clean ? `@${clean}` : "";
	};

	const editConfigs = {
		"profile.displayName": { label: "Name", type: "text", scope: "profile", field: "displayName", required: true },
		"profile.phoneNumber": { label: "Mobile number", type: "tel", scope: "profile", field: "phoneNumber", required: true },
		"wish.name": { label: "Name", type: "text", scope: "wish", field: "name", required: true },
		"wish.yearOfBirth": { label: "Year of birth", type: "number", scope: "wish", field: "yearOfBirth", required: true },
		"wish.gender": {
			label: "Gender",
			type: "select",
			scope: "wish",
			field: "gender",
			required: true,
			options: ["Female", "Male", "Non-binary", "Prefer not to say"],
		},
		"wish.phoneNumber": { label: "Mobile number", type: "tel", scope: "wish", field: "phoneNumber", required: true },
		"wish.instagramId": { label: "Instagram ID", type: "text", scope: "wish", field: "instagramId", required: true },
		"wish.cityOfWork": { label: "City of work", type: "text", scope: "wish", field: "cityOfWork", required: true },
		"wish.occupation": { label: "Occupation", type: "text", scope: "wish", field: "occupation", required: true },
	};

	const detailRows = (rows) =>
		rows
			.map((row) => {
				const value = row.value || "Not provided";
				const editControl = row.editKey
					? `<button class="detail-edit" type="button" data-edit-field="${escapeHtml(row.editKey)}">Edit</button>`
					: `<span class="detail-note">${escapeHtml(row.note || "Auto")}</span>`;
				return `
					<div class="detail-row">
						<span>${escapeHtml(row.label)}</span>
						<strong>${escapeHtml(value)}</strong>
						${editControl}
					</div>
				`;
			})
			.join("");

	const renderProfile = (user, profile = {}) => {
		if (!profileDetails) return;
		profileDetails.innerHTML = detailRows([
			{ label: "Name", value: profile.displayName || user.displayName, editKey: "profile.displayName" },
			{ label: "Mobile number", value: profile.phoneNumber, editKey: "profile.phoneNumber" },
			{ label: "Email", value: user.email, note: "Login" },
			{ label: "Last profile sync", value: formatDate(profile.lastSeenAt), note: "Auto" },
			{ label: "Consent version", value: profile.legalConsent?.policyVersion || "Not recorded", note: "Policy" },
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
			{ label: "Name", value: wish.name, editKey: "wish.name" },
			{ label: "Age", value: wish.age ? `${wish.age} years` : "", editKey: "wish.yearOfBirth" },
			{ label: "Year of birth", value: wish.yearOfBirth, editKey: "wish.yearOfBirth" },
			{ label: "Gender", value: wish.gender, editKey: "wish.gender" },
			{ label: "Mobile number", value: wish.phoneNumber, editKey: "wish.phoneNumber" },
			{ label: "Instagram ID", value: wish.instagramId, editKey: "wish.instagramId" },
			{ label: "City of work", value: wish.cityOfWork, editKey: "wish.cityOfWork" },
			{ label: "Occupation", value: wish.occupation, editKey: "wish.occupation" },
			{ label: "Email from login", value: wish.email, note: "Login" },
			{ label: "Submitted", value: formatDate(wish.createdAt), note: "Auto" },
		])}</div>`;
	};

	const getEditValue = (config) => {
		if (config.scope === "profile") return currentProfile?.[config.field] || currentUser?.displayName || "";
		if (config.scope === "wish") return currentWish?.[config.field] || "";
		return "";
	};

	const closeEditModal = () => {
		activeEditKey = "";
		editModal?.classList.add("is-hidden");
		document.body.removeAttribute("data-edit-modal-open");
		if (editFieldSlot) editFieldSlot.innerHTML = "";
	};

	const openEditModal = (editKey) => {
		const config = editConfigs[editKey];
		if (!config || !editModal || !editFieldSlot) return;
		activeEditKey = editKey;
		if (editModalEyebrow) editModalEyebrow.textContent = config.scope === "profile" ? "Edit Profile" : "Edit Wish";
		if (editModalTitle) editModalTitle.textContent = `Update ${config.label}`;
		const currentValue = getEditValue(config);
		if (config.type === "select") {
			editFieldSlot.innerHTML = `
				<label for="editValue">
					<span>${escapeHtml(config.label)}</span>
					<select id="editValue" name="value" required>
						<option value="">Select ${escapeHtml(config.label.toLowerCase())}</option>
						${config.options
							.map((option) => `<option ${option === currentValue ? "selected" : ""}>${escapeHtml(option)}</option>`)
							.join("")}
					</select>
				</label>
			`;
		} else {
			const attrs = config.type === "number" ? 'inputmode="numeric" min="1900"' : "";
			editFieldSlot.innerHTML = `
				<label for="editValue">
					<span>${escapeHtml(config.label)}</span>
					<input id="editValue" name="value" type="${escapeHtml(config.type)}" value="${escapeHtml(currentValue)}" ${attrs} ${config.required ? "required" : ""} />
				</label>
			`;
		}
		editModal.classList.remove("is-hidden");
		document.body.dataset.editModalOpen = "true";
		window.setTimeout(() => $("#editValue")?.focus(), 40);
	};

	const normalizeEditValue = (config, rawValue) => {
		let value = String(rawValue || "").trim();
		if (config.field === "phoneNumber") {
			value = normalizePhoneNumber(value);
			if (!isValidPhoneNumber(value)) throw new Error("Please enter a valid mobile number.");
			return value;
		}
		if (config.field === "instagramId") return normalizeInstagram(value);
		if (config.field === "yearOfBirth") {
			const year = Number(value);
			const currentYear = new Date().getFullYear();
			if (!Number.isInteger(year) || year < 1900 || year > currentYear) throw new Error("Please enter a valid year of birth.");
			return year;
		}
		if (config.required && !value) throw new Error(`Please enter ${config.label.toLowerCase()}.`);
		return value;
	};

	const saveEditedValue = async () => {
		const config = editConfigs[activeEditKey];
		if (!config || !currentUser || !db) return;
		const value = normalizeEditValue(config, new FormData(editForm).get("value"));
		const userRef = db.collection("users").doc(currentUser.uid);

		if (config.scope === "profile") {
			const payload = {
				[config.field]: value,
				lastSeenAt: firebase.firestore.FieldValue.serverTimestamp(),
				updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
			};
			if (config.field === "displayName") {
				payload.name = value;
				await currentUser.updateProfile({ displayName: value });
			}
			await userRef.set(payload, { merge: true });
			currentProfile = { ...currentProfile, ...payload };
			return;
		}

		const currentYear = new Date().getFullYear();
		const wishUpdate = {
			[config.field]: value,
			email: currentUser.email || "",
			uid: currentUser.uid,
			recordType: "current",
			updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
		};
		if (config.field === "yearOfBirth") wishUpdate.age = currentYear - value;
		await userRef.collection("wishQuiz").doc("current").set(wishUpdate, { merge: true });

		const profileUpdate = {
			wishQuizUpdatedAt: firebase.firestore.FieldValue.serverTimestamp(),
			lastSeenAt: firebase.firestore.FieldValue.serverTimestamp(),
		};
		if (config.field === "name") {
			profileUpdate.name = value;
			profileUpdate.displayName = value;
		}
		if (["phoneNumber", "cityOfWork", "occupation"].includes(config.field)) profileUpdate[config.field] = value;
		await userRef.set(profileUpdate, { merge: true });
	};

	const syncProfile = async (user) => {
		if (!db || !user) return {};
		const userRef = db.collection("users").doc(user.uid);
		const payload = {
			email: user.email || "",
			lastSeenAt: firebase.firestore.FieldValue.serverTimestamp(),
			source: "yesgenie-dashboard",
		};
		if (user.displayName) payload.displayName = user.displayName;
		await userRef.set(payload, { merge: true });
		const profileSnap = await userRef.get();
		return profileSnap.exists ? profileSnap.data() : {};
	};

	const loadDashboard = async (user) => {
		currentUser = user;
		authRequired?.classList.add("is-hidden");
		signedInDashboard?.classList.remove("is-hidden");
		setStatus("Loading profile and wish details...");

		try {
			const profile = await syncProfile(user);
			const wishSnap = await db.collection("users").doc(user.uid).collection("wishQuiz").doc("current").get();
			currentProfile = profile || {};
			currentWish = wishSnap.exists ? wishSnap.data() || {} : null;
			renderProfile(user, profile);
			renderWish(currentWish);
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
				currentUser = null;
				currentProfile = {};
				currentWish = null;
				authRequired?.classList.remove("is-hidden");
				signedInDashboard?.classList.add("is-hidden");
				setStatus("Sign in to view your dashboard.", "error");
				return;
			}
			if (isAdminEmail(user.email)) {
				setStatus("Admin account detected. Opening admin dashboard...", "success");
				window.location.replace("/admin");
				return;
			}
			loadDashboard(user);
		});
	};

	document.addEventListener("click", (event) => {
		const editButton = event.target instanceof Element ? event.target.closest("[data-edit-field]") : null;
		if (!(editButton instanceof HTMLButtonElement)) return;
		openEditModal(editButton.dataset.editField || "");
	});

	editModal?.addEventListener("click", (event) => {
		const cancelButton = event.target instanceof Element ? event.target.closest("[data-edit-cancel]") : null;
		if (cancelButton) closeEditModal();
	});

	window.addEventListener("keydown", (event) => {
		if (event.key === "Escape" && !editModal?.classList.contains("is-hidden")) closeEditModal();
	});

	editForm?.addEventListener("submit", async (event) => {
		event.preventDefault();
		try {
			if (editSaveBtn) editSaveBtn.disabled = true;
			setStatus("Saving updated detail...");
			await saveEditedValue();
			closeEditModal();
			if (currentUser) await loadDashboard(currentUser);
			setStatus("Detail updated.", "success");
			showToast("Saved successfully.");
		} catch (error) {
			const message = error?.message || "Could not save this detail.";
			setStatus(message, "error");
			showToast(message);
		} finally {
			if (editSaveBtn) editSaveBtn.disabled = false;
		}
	});

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
