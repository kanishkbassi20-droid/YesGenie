(() => {
	"use strict";

	const ADMIN_EMAIL = "infoyesgenie@gmail.com";
	const MAIL_COLLECTION = "mail";
	const PENDING_KEY = "yesgenie.pendingInviteTrip";

	const trips = {
		"bir-experience": {
			name: "Bir Experience",
			duration: "4 Days",
			route: "Bir Billing, Himachal",
			url: "/bir-experience",
		},
		"himachal-expedition": {
			name: "Ultimate High-Altitude Himachal Expedition",
			duration: "5 Nights / 6 Days",
			route: "Delhi -> Raison -> Jispa -> Shinku La -> Keylong -> Solang Valley -> Manali -> Delhi",
			url: "/himachal-expedition",
		},
		"kasauli-himachal": {
			name: "Kasauli, Himachal",
			duration: "3 Days",
			route: "Kasauli, Himachal",
			url: "/kasauli-himachal",
		},
		"patnitop-jammu": {
			name: "Patnitop, Jammu",
			duration: "3 Days",
			route: "Patnitop, Jammu",
			url: "/patnitop-jammu",
		},
	};

	let auth = null;
	let db = null;
	let currentUser = null;
	let busyTrip = "";
	let toastTimer = 0;
	let pendingHandled = false;
	const requestedTrips = new Set();
	const requestMeta = new Map();

	const buttons = () => Array.from(document.querySelectorAll("[data-invite-trip]"));

	const escapeHtml = (value) =>
		String(value ?? "")
			.replaceAll("&", "&amp;")
			.replaceAll("<", "&lt;")
			.replaceAll(">", "&gt;")
			.replaceAll('"', "&quot;");

	const showToast = (message) => {
		let toast = document.querySelector("#inviteToast");
		if (!toast) {
			toast = document.createElement("div");
			toast.className = "invite-toast";
			toast.id = "inviteToast";
			toast.setAttribute("role", "status");
			toast.setAttribute("aria-live", "polite");
			document.body.appendChild(toast);
		}
		window.clearTimeout(toastTimer);
		toast.textContent = message;
		toast.classList.add("is-open");
		toastTimer = window.setTimeout(() => toast.classList.remove("is-open"), 4400);
	};

	const setButtonState = () => {
		buttons().forEach((button) => {
			const slug = button.getAttribute("data-invite-trip") || "";
			const requested = requestedTrips.has(slug);
			const busy = busyTrip === slug;
			const label = busy ? "Requesting..." : requested ? "Invite Requested" : currentUser ? "Request Invite" : "Login to Request Invite";
			button.disabled = busy;
			button.classList.toggle("is-requested", requested);
			if (button.textContent !== label) button.textContent = label;
			button.setAttribute(
				"aria-label",
				requested ? `Invite requested for ${trips[slug]?.name || "this trip"}. Click to resend email.` : `${label} for ${trips[slug]?.name || "this trip"}`
			);
		});
	};

	const ensureFirebase = () => {
		if (!window.firebase?.initializeApp || !window.firebase?.auth || !window.firebase?.firestore) {
			showToast("Invite requests need Firebase Auth and Firestore. Refresh and try again.");
			return false;
		}
		if (!firebase.apps.length) firebase.initializeApp(window.YESGENIE_FIREBASE_CONFIG);
		auth = firebase.auth();
		db = firebase.firestore();
		return true;
	};

	const loadExistingRequests = async (user) => {
		requestedTrips.clear();
		requestMeta.clear();
		if (!db || !user) {
			setButtonState();
			return;
		}
		try {
			const snap = await db.collection("users").doc(user.uid).collection("inviteRequests").get();
			snap.docs.forEach((doc) => {
				requestedTrips.add(doc.id);
				requestMeta.set(doc.id, doc.data() || {});
			});
		} catch {
			// Existing requests are a convenience for labels; request submission still handles permissions.
		}
		setButtonState();
	};

	const formatDisplayDate = (date = new Date()) =>
		new Intl.DateTimeFormat("en-IN", {
			dateStyle: "medium",
			timeStyle: "short",
			timeZone: "Asia/Kolkata",
		}).format(date);

	const getProfileName = (user) => user.displayName || user.email?.split("@")[0] || "traveller";

	const normalizePhoneNumber = (value) => String(value || "").trim().replace(/\s+/g, " ");
	const isValidPhoneNumber = (value) => /^\+?[0-9\s-]{7,18}$/.test(normalizePhoneNumber(value));

	const getProfilePhone = async (user) => {
		try {
			const snap = await db.collection("users").doc(user.uid).get();
			const profile = snap.exists ? snap.data() || {} : {};
			if (isValidPhoneNumber(profile.phoneNumber)) return normalizePhoneNumber(profile.phoneNumber);
			const wishSnap = await db.collection("users").doc(user.uid).collection("wishQuiz").doc("current").get();
			const wish = wishSnap.exists ? wishSnap.data() || {} : {};
			return isValidPhoneNumber(wish.phoneNumber) ? normalizePhoneNumber(wish.phoneNumber) : "";
		} catch {
			return "";
		}
	};

	const askForPhoneNumber = (tripName) =>
		new Promise((resolve, reject) => {
			const existing = document.querySelector("#invitePhoneModal");
			if (existing) existing.remove();

			const modal = document.createElement("div");
			modal.className = "invite-phone-modal";
			modal.id = "invitePhoneModal";
			modal.innerHTML = `
				<div class="invite-phone-modal__screen" data-phone-close></div>
				<form class="invite-phone-modal__card" aria-labelledby="invitePhoneTitle">
					<button class="invite-phone-modal__close" type="button" aria-label="Close" data-phone-close></button>
					<span>Invite request</span>
					<h2 id="invitePhoneTitle">Where should the Genie call you?</h2>
					<p>
						Add your mobile number so the team can coordinate your ${escapeHtml(tripName || "trip")} invite quickly.
					</p>
					<label for="invitePhoneInput">Mobile number</label>
					<input id="invitePhoneInput" name="phoneNumber" type="tel" autocomplete="tel" placeholder="+91 98765 43210" required />
					<div class="invite-phone-modal__error" role="alert"></div>
					<div class="invite-phone-modal__actions">
						<button class="invite-phone-modal__submit" type="submit">Continue</button>
						<button class="invite-phone-modal__secondary" type="button" data-phone-close>Not now</button>
					</div>
				</form>
			`;
			document.body.appendChild(modal);
			document.body.dataset.invitePhoneOpen = "true";

			const input = modal.querySelector("#invitePhoneInput");
			const error = modal.querySelector(".invite-phone-modal__error");
			const close = () => {
				document.body.dataset.invitePhoneOpen = "false";
				modal.remove();
			};
			const cancel = () => {
				close();
				reject(new Error("Phone number is required to request an invite."));
			};

			modal.querySelectorAll("[data-phone-close]").forEach((button) => {
				button.addEventListener("click", cancel);
			});

			modal.addEventListener("submit", (event) => {
				event.preventDefault();
				const phoneNumber = normalizePhoneNumber(new FormData(modal.querySelector("form")).get("phoneNumber"));
				if (!isValidPhoneNumber(phoneNumber)) {
					error.textContent = "Please enter a valid mobile number.";
					input?.focus();
					return;
				}
				close();
				resolve(phoneNumber);
			});

			window.setTimeout(() => input?.focus(), 40);
		});

	const ensureProfilePhone = async (user, tripName) => {
		const existingPhone = await getProfilePhone(user);
		if (existingPhone) return existingPhone;
		const phoneNumber = await askForPhoneNumber(tripName);
		await db.collection("users").doc(user.uid).set(
			{
				phoneNumber,
				invitePhoneCapturedAt: firebase.firestore.FieldValue.serverTimestamp(),
				lastSeenAt: firebase.firestore.FieldValue.serverTimestamp(),
			},
			{ merge: true }
		);
		return phoneNumber;
	};

	const legacyUserEmailHtml = ({ userName, tripTitle, tripUrl }) => `
		<div style="margin:0;padding:0;background:#0f172a;font-family:Arial,Helvetica,sans-serif;">
			<div style="max-width:640px;margin:0 auto;padding:32px 16px;">
				<div style="background:linear-gradient(135deg,#0f172a,#1e293b 55%,#f59e0b);padding:34px 28px;border-radius:24px 24px 0 0;color:#ffffff;">
					<div style="font-size:14px;letter-spacing:2px;text-transform:uppercase;color:#fde68a;">
						YesGenie Invite
					</div>
					<h1 style="margin:12px 0 8px;font-size:30px;line-height:1.2;">
						Your wish has reached the Genie ✨
					</h1>
					<p style="margin:0;color:#e5e7eb;font-size:16px;">
						Your invite request has been received successfully.
					</p>
				</div>

				<div style="background:#ffffff;padding:30px 28px;border-radius:0 0 24px 24px;color:#111827;">
					<h2 style="margin:0 0 14px;font-size:22px;">
						Hi ${escapeHtml(userName || "traveller")},
					</h2>
					<p style="font-size:16px;line-height:1.7;margin:0 0 18px;">
						Thank you for requesting an invite for
						<b>${escapeHtml(tripTitle || "your selected trip")}</b>.
						Our team will review your request and contact you soon.
					</p>
					<div style="background:#fff7ed;border:1px solid #fed7aa;border-left:5px solid #f59e0b;border-radius:14px;padding:18px;margin:24px 0;">
						<p style="margin:0 0 8px;">
							<b>Trip:</b> ${escapeHtml(tripTitle || "Selected trip")}
						</p>
						<p style="margin:0 0 8px;">
							<b>Status:</b> Invite request received
						</p>
						<p style="margin:0;">
							<b>Next step:</b> YesGenie team will contact you shortly.
						</p>
					</div>
					<a href="${escapeHtml(tripUrl || "https://www.yesgenie.in/active-itineraries")}"
						style="display:inline-block;background:#f59e0b;color:#111827;text-decoration:none;font-weight:bold;padding:13px 22px;border-radius:999px;margin:8px 0 22px;box-shadow:0 0 28px rgba(245,158,11,0.38);">
						Explore More Trips
					</a>
					<p style="font-size:15px;line-height:1.7;color:#374151;">
						Until then, keep your bags half-packed.
						The Genie may call anytime.
					</p>
					<p style="margin:24px 0 0;font-size:15px;line-height:1.6;">
						Warmly,<br/>
						<b>Team YesGenie</b><br/>
						<span style="color:#6b7280;">
							infoyesgenie@gmail.com
						</span>
					</p>
				</div>

				<p style="text-align:center;color:#94a3b8;font-size:12px;margin:18px 0 0;">
					© YesGenie. Premium curated travel experiences.
				</p>
			</div>
		</div>
	`;

	const userEmailHtml = ({ userName, tripTitle, tripUrl }) => `
		<div style="margin:0;padding:0;background:#0f172a;font-family:Arial,Helvetica,sans-serif;">
			<div style="max-width:640px;margin:0 auto;padding:32px 16px;">
				<div style="background:linear-gradient(135deg,#0f172a,#1e293b 55%,#f59e0b);padding:34px 28px;border-radius:24px 24px 0 0;color:#ffffff;">
					<div style="font-size:14px;letter-spacing:2px;text-transform:uppercase;color:#fde68a;">YesGenie Invite</div>
					<h1 style="margin:12px 0 8px;font-size:30px;line-height:1.2;">Your wish has reached the Genie &#10024;</h1>
					<p style="margin:0;color:#e5e7eb;font-size:16px;">Your invite request has been received successfully.</p>
				</div>
				<div style="background:#ffffff;padding:30px 28px;border-radius:0 0 24px 24px;color:#111827;">
					<h2 style="margin:0 0 14px;font-size:22px;">Hi ${escapeHtml(userName || "traveller")},</h2>
					<p style="font-size:16px;line-height:1.7;margin:0 0 18px;">
						Thank you for requesting an invite for <b>${escapeHtml(tripTitle || "your selected trip")}</b>.
						Our team will review your request and contact you soon.
					</p>
					<div style="background:#fff7ed;border:1px solid #fed7aa;border-left:5px solid #f59e0b;border-radius:14px;padding:18px;margin:24px 0;">
						<p style="margin:0 0 8px;"><b>Trip:</b> ${escapeHtml(tripTitle || "Selected trip")}</p>
						<p style="margin:0 0 8px;"><b>Status:</b> Invite request received</p>
						<p style="margin:0;"><b>Next step:</b> YesGenie team will contact you shortly.</p>
					</div>
					<a href="${escapeHtml(tripUrl || "https://www.yesgenie.in/active-itineraries")}"
						style="display:inline-block;background:#f59e0b;color:#111827;text-decoration:none;font-weight:bold;padding:13px 22px;border-radius:999px;margin:8px 0 22px;box-shadow:0 0 28px rgba(245,158,11,0.38);">
						Explore More Trips
					</a>
					<p style="font-size:15px;line-height:1.7;color:#374151;">
						Until then, keep your bags half-packed. The Genie may call anytime.
					</p>
					<p style="margin:24px 0 0;font-size:15px;line-height:1.6;">
						Warmly,<br/>
						<b>Team YesGenie</b><br/>
						<span style="color:#6b7280;">infoyesgenie@gmail.com</span>
					</p>
				</div>
				<p style="text-align:center;color:#94a3b8;font-size:12px;margin:18px 0 0;">
					&copy; YesGenie. Premium curated travel experiences.
				</p>
			</div>
		</div>
	`;

	const adminEmailHtml = ({ userName, email, phone, tripTitle, tripSlug, timestamp }) => `
		<div style="margin:0;padding:0;background:#eef3f8;font-family:Arial,Helvetica,sans-serif;color:#142238;">
			<div style="max-width:680px;margin:0 auto;padding:28px 16px;">
				<div style="background:#0b1b34;color:#ffffff;border-radius:18px 18px 0 0;padding:24px 26px;">
					<div style="font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#f8d07a;font-weight:bold;">
						YesGenie Admin Alert
					</div>
					<h1 style="margin:10px 0 0;font-size:26px;line-height:1.25;">
						New Invite Request Received
					</h1>
				</div>
				<div style="background:#ffffff;border:1px solid #dce4ee;border-top:0;border-radius:0 0 18px 18px;padding:24px 26px;">
					<table style="border-collapse:collapse;width:100%;font-size:15px;">
						<tr>
							<td style="border:1px solid #dce4ee;padding:12px;background:#f8fafc;font-weight:bold;width:36%;">User name</td>
							<td style="border:1px solid #dce4ee;padding:12px;">${escapeHtml(userName || "traveller")}</td>
						</tr>
						<tr>
							<td style="border:1px solid #dce4ee;padding:12px;background:#f8fafc;font-weight:bold;">Email</td>
							<td style="border:1px solid #dce4ee;padding:12px;">${escapeHtml(email || "Not available")}</td>
						</tr>
						<tr>
							<td style="border:1px solid #dce4ee;padding:12px;background:#f8fafc;font-weight:bold;">Phone</td>
							<td style="border:1px solid #dce4ee;padding:12px;">${escapeHtml(phone || "Not provided")}</td>
						</tr>
						<tr>
							<td style="border:1px solid #dce4ee;padding:12px;background:#f8fafc;font-weight:bold;">Trip name</td>
							<td style="border:1px solid #dce4ee;padding:12px;">${escapeHtml(tripTitle || "Selected trip")}</td>
						</tr>
						<tr>
							<td style="border:1px solid #dce4ee;padding:12px;background:#f8fafc;font-weight:bold;">Trip slug</td>
							<td style="border:1px solid #dce4ee;padding:12px;">${escapeHtml(tripSlug || "Not available")}</td>
						</tr>
						<tr>
							<td style="border:1px solid #dce4ee;padding:12px;background:#f8fafc;font-weight:bold;">Timestamp</td>
							<td style="border:1px solid #dce4ee;padding:12px;">${escapeHtml(timestamp || "Not available")}</td>
						</tr>
						<tr>
							<td style="border:1px solid #dce4ee;padding:12px;background:#f8fafc;font-weight:bold;">Status</td>
							<td style="border:1px solid #dce4ee;padding:12px;">
								<span style="display:inline-block;background:#fff7ed;color:#9a5b00;border:1px solid #fed7aa;border-radius:999px;padding:6px 10px;font-weight:bold;">Pending</span>
							</td>
						</tr>
					</table>
					<p style="margin:18px 0 0;color:#69778a;font-size:13px;line-height:1.6;">
						Open the YesGenie admin dashboard to view the full profile and saved wish context.
					</p>
				</div>
			</div>
		</div>
	`;

	const queueEmails = async ({ trip, user, requestId, phoneNumber }) => {
		const userName = getProfileName(user);
		const phone = phoneNumber || (await getProfilePhone(user)) || "Not provided";
		const timestamp = formatDisplayDate();
		const tripTitle = trip.name || "Selected trip";
		const tripUrl = "https://www.yesgenie.in/active-itineraries";
		const mailJobIds = [];

		const adminJob = await db.collection(MAIL_COLLECTION).add({
			to: ADMIN_EMAIL,
			message: {
				subject: `New Invite Request Received - ${tripTitle}`,
				html: adminEmailHtml({
					userName,
					email: user.email || "Not available",
					phone,
					tripTitle,
					tripSlug: requestId,
					timestamp,
				}),
			},
		});
		mailJobIds.push(adminJob.id);

		if (user.email) {
			const userJob = await db.collection(MAIL_COLLECTION).add({
				to: user.email,
				message: {
					subject: "Your YesGenie Invite Request is Confirmed \u2728",
					html: userEmailHtml({ userName, tripTitle, tripUrl }),
				},
			});
			mailJobIds.push(userJob.id);
		}

		return mailJobIds;
	};

	const saveRequest = async (slug) => {
		if (!currentUser || !db) return;
		const trip = trips[slug];
		if (!trip) throw new Error("This trip is not configured for invite requests.");

		busyTrip = slug;
		setButtonState();

		const userRef = db.collection("users").doc(currentUser.uid);
		const requestRef = userRef.collection("inviteRequests").doc(slug);
		const existing = await requestRef.get();
		const now = firebase.firestore.FieldValue.serverTimestamp();
		const phoneNumber = await ensureProfilePhone(currentUser, trip.name);

		await userRef.set(
			{
				email: currentUser.email || "",
				displayName: currentUser.displayName || "",
				phoneNumber,
				inviteRequested: true,
				latestInviteTripSlug: slug,
				latestInviteTripName: trip.name,
				inviteRequestUpdatedAt: now,
				lastSeenAt: now,
			},
			{ merge: true }
		);

		await requestRef.set(
			{
				uid: currentUser.uid,
				email: currentUser.email || "",
				displayName: currentUser.displayName || "",
				tripSlug: slug,
				tripName: trip.name,
				tripDuration: trip.duration,
				tripRoute: trip.route,
				tripUrl: trip.url,
				phoneNumber,
				status: "requested",
				sourcePath: window.location.pathname,
				updatedAt: now,
				...(existing.exists ? {} : { createdAt: now }),
			},
			{ merge: true }
		);

		let emailQueued = false;
		let emailError = "";
		let mailJobIds = [];
		try {
			mailJobIds = await queueEmails({ trip, user: currentUser, requestId: slug, phoneNumber });
			emailQueued = true;
		} catch (error) {
			emailError = error?.message || error?.code || "Email queue failed";
			emailQueued = false;
		}

		await requestRef.set(
			{
				emailQueueStatus: emailQueued ? "queued" : "queue_failed",
				emailQueueUpdatedAt: firebase.firestore.FieldValue.serverTimestamp(),
				emailQueueAttempts: firebase.firestore.FieldValue.increment(1),
				lastMailJobIds: mailJobIds,
				lastEmailQueueError: emailQueued ? firebase.firestore.FieldValue.delete() : emailError.slice(0, 240),
			},
			{ merge: true }
		);

		requestedTrips.add(slug);
		requestMeta.set(slug, {
			...(requestMeta.get(slug) || {}),
			emailQueueStatus: emailQueued ? "queued" : "queue_failed",
			lastMailJobIds: mailJobIds,
			lastEmailQueueError: emailQueued ? "" : emailError,
		});
		showToast(emailQueued ? "Invite requested. Confirmation emails are on the way." : "Invite saved, but email could not be queued. Admin can still see your request.");
	};

	const resendInviteEmail = async (slug) => {
		if (!currentUser || !db) return;
		const trip = trips[slug];
		if (!trip) throw new Error("This trip is not configured for invite requests.");

		busyTrip = slug;
		setButtonState();

		const requestRef = db.collection("users").doc(currentUser.uid).collection("inviteRequests").doc(slug);
		try {
			const existing = await requestRef.get();
			if (!existing.exists) {
				await saveRequest(slug);
				return;
			}

			const phoneNumber = await ensureProfilePhone(currentUser, trip.name);
			const mailJobIds = await queueEmails({ trip, user: currentUser, requestId: slug, phoneNumber });
			await requestRef.set(
				{
					phoneNumber,
					emailQueueStatus: "queued",
					emailQueueUpdatedAt: firebase.firestore.FieldValue.serverTimestamp(),
					emailQueueAttempts: firebase.firestore.FieldValue.increment(1),
					lastMailJobIds: mailJobIds,
					lastEmailQueueError: firebase.firestore.FieldValue.delete(),
				},
				{ merge: true }
			);
			requestMeta.set(slug, {
				...(requestMeta.get(slug) || {}),
				emailQueueStatus: "queued",
				lastMailJobIds: mailJobIds,
				lastEmailQueueError: "",
			});
			showToast("Confirmation email has been queued again.");
		} catch (error) {
			const message = error?.message || "Could not re-queue the invite email.";
			await requestRef.set(
				{
					emailQueueStatus: "queue_failed",
					emailQueueUpdatedAt: firebase.firestore.FieldValue.serverTimestamp(),
					emailQueueAttempts: firebase.firestore.FieldValue.increment(1),
					lastEmailQueueError: message.slice(0, 240),
				},
				{ merge: true }
			);
			throw new Error("Invite is saved, but the email could not be queued. Please try again.");
		}
	};

	const requestInvite = async (slug) => {
		if (!auth || !db) {
			if (!ensureFirebase()) return;
		}
		if (!currentUser) {
			try {
				localStorage.setItem(PENDING_KEY, slug);
			} catch {
				// Local storage is optional; login can still continue.
			}
			const next = encodeURIComponent(`${window.location.pathname}${window.location.search}${window.location.hash}`);
			window.location.href = `/login?mode=create&next=${next}`;
			return;
		}
		if (requestedTrips.has(slug)) {
			try {
				await resendInviteEmail(slug);
			} catch (error) {
				showToast(error?.message || "Invite is saved, but email could not be queued.");
			} finally {
				busyTrip = "";
				setButtonState();
			}
			return;
		}

		try {
			await saveRequest(slug);
		} catch (error) {
			showToast(error?.message || "Could not request invite. Please try again.");
		} finally {
			busyTrip = "";
			setButtonState();
		}
	};

	const handlePending = async () => {
		if (pendingHandled || !currentUser) return;
		let slug = "";
		try {
			slug = localStorage.getItem(PENDING_KEY) || "";
			if (slug) localStorage.removeItem(PENDING_KEY);
		} catch {
			slug = "";
		}
		if (!slug || !trips[slug]) return;
		pendingHandled = true;
		await requestInvite(slug);
	};

	document.addEventListener("click", (event) => {
		const target = event.target;
		if (!(target instanceof Element)) return;
		const button = target.closest("[data-invite-trip]");
		if (!(button instanceof HTMLElement)) return;
		event.preventDefault();
		requestInvite(button.getAttribute("data-invite-trip") || "");
	});

	const observer = new MutationObserver(setButtonState);
	observer.observe(document.documentElement, { childList: true, subtree: true });

	if (ensureFirebase()) {
		auth.onAuthStateChanged(async (user) => {
			currentUser = user;
			await loadExistingRequests(user);
			await handlePending();
		});
	} else {
		setButtonState();
	}
})();
