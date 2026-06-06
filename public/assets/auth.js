(() => {
	"use strict";

	document.documentElement.classList.remove("no-js");

	const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
	const $ = (selector, root = document) => root.querySelector(selector);
	const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

	const firebaseConfig = window.YESGENIE_FIREBASE_CONFIG || {
		apiKey: "AIzaSyCY5IqUWr1udX0g7vJG2VrLsk312-_eqbA",
		authDomain: "yesgenie-c3d52.firebaseapp.com",
		projectId: "yesgenie-c3d52",
		storageBucket: "yesgenie-c3d52.firebasestorage.app",
		messagingSenderId: "293889330310",
		appId: "1:293889330310:web:b268fb7097d722db47d507",
		measurementId: "G-YRG9D40RKM",
	};

	const stateEl = $("#authState");
	const stateText = $("#authStateText");
	const form = $("#authForm");
	const displayName = $("#displayName");
	const emailInput = $("#email");
	const phoneInput = $("#phoneNumber");
	const passwordInput = $("#password");
	const confirmPasswordInput = $("#confirmPassword");
	const rememberInput = $("#remember");
	const legalConsentInput = $("#legalConsent");
	const submitBtn = $("#submitBtn");
	const googleSignInBtn = $("#googleSignInBtn");
	const authDivider = $("#authDivider");
	const inlineReset = $("#inlineReset");
	const signedInPanel = $("#signedInPanel");
	const signedInTitle = $("#signedInTitle");
	const signedInEmail = $("#signedInEmail");
	const signOutBtn = $("#signOutBtn");
	const toast = $("#toast");
	const typingText = $("#authTypingText");

	let auth = null;
	let db = null;
	let mode = new URLSearchParams(window.location.search).get("mode") === "create" ? "create" : "login";
	let toastTimer = 0;
	const pendingGoogleProfileKey = "yesgenie.pendingGoogleProfile";

	const adminEmails = () =>
		(window.YESGENIE_ADMIN_EMAILS || []).map((email) => String(email || "").trim().toLowerCase()).filter(Boolean);

	const isAdminEmail = (email) => adminEmails().includes(String(email || "").trim().toLowerCase());

	const getPostAuthUrl = () => {
		const next = new URLSearchParams(window.location.search).get("next") || "";
		if (next.startsWith("/") && !next.startsWith("//") && !next.includes("\\\\")) return next;
		return "/dashboard";
	};

	const getPostAuthUrlFor = (user) => {
		const next = getPostAuthUrl();
		if (next !== "/dashboard") return next;
		return isAdminEmail(user?.email) ? "/admin" : "/dashboard";
	};

	const normalizePhoneNumber = (value) => String(value || "").trim().replace(/\s+/g, " ");

	const isValidPhoneNumber = (value) => /^\+?[0-9][0-9\s-]{6,19}$/.test(String(value || "").trim());

	const getPhoneForAuth = ({ required = false, silent = false } = {}) => {
		const phoneNumber = normalizePhoneNumber(phoneInput?.value);
		if (!phoneNumber) {
			if (required && !silent) throw new Error("Please enter your mobile number.");
			return "";
		}
		if (!isValidPhoneNumber(phoneNumber)) {
			if (!silent) throw new Error("Please enter a valid mobile number.");
			return "";
		}
		return phoneNumber;
	};

	const getPendingGoogleProfile = () => {
		try {
			const raw = window.sessionStorage?.getItem(pendingGoogleProfileKey);
			return raw ? JSON.parse(raw) : {};
		} catch {
			return {};
		}
	};

	const setPendingGoogleProfile = (payload) => {
		try {
			window.sessionStorage?.setItem(pendingGoogleProfileKey, JSON.stringify(payload));
		} catch {
			// Session storage is a convenience for redirect sign-in, not a hard dependency.
		}
	};

	const clearPendingGoogleProfile = () => {
		try {
			window.sessionStorage?.removeItem(pendingGoogleProfileKey);
		} catch {
			// Ignore blocked storage.
		}
	};

	const showToast = (message) => {
		if (!toast) return;
		window.clearTimeout(toastTimer);
		toast.textContent = message;
		toast.classList.add("is-open");
		toastTimer = window.setTimeout(() => toast.classList.remove("is-open"), 4200);
	};

	const setMessage = (message, type = "idle") => {
		if (stateText) stateText.textContent = message;
		stateEl?.classList.toggle("is-error", type === "error");
		stateEl?.classList.toggle("is-success", type === "success");
	};

	const authMessage = (error) => {
		const code = error?.code || "";
		const messages = {
			"auth/email-already-in-use": "That email already has a YesGenie account. Switch to Login.",
			"auth/invalid-email": "Please enter a valid email address.",
			"auth/invalid-credential": "The email or password is incorrect.",
			"auth/user-not-found": "No account exists for this email. Create one first.",
			"auth/wrong-password": "The password is incorrect.",
			"auth/weak-password": "Use at least 6 characters for your password.",
			"auth/too-many-requests": "Too many attempts. Wait a moment and try again.",
			"auth/network-request-failed": "Network issue. Check your connection and try again.",
			"auth/operation-not-allowed": "Email/password sign-in is not enabled in Firebase Auth.",
			"auth/unauthorized-domain": "This domain is not authorized for Firebase Auth.",
			"auth/account-exists-with-different-credential": "This email already uses another sign-in method.",
			"auth/popup-closed-by-user": "Google sign-in was closed before it finished.",
			"auth/popup-blocked": "Google popup was blocked. Trying redirect sign-in.",
		};
		return messages[code] || "Something went wrong. Please try again.";
	};

	const setBusy = (busy) => {
		[submitBtn, googleSignInBtn, signOutBtn, ...$$(".mode-tab")].forEach((button) => {
			if (button) button.disabled = busy;
		});
	};

	const setMode = (nextMode) => {
		mode = nextMode;
		document.body.dataset.mode = mode;
		$$(".mode-tab").forEach((tab) => {
			const isActive = tab.dataset.mode === mode;
			tab.classList.toggle("is-active", isActive);
			tab.setAttribute("aria-selected", isActive ? "true" : "false");
		});

		if (mode === "login") {
			submitBtn.textContent = "Login";
			passwordInput.autocomplete = "current-password";
			setMessage("Enter your email and password. Add mobile once to prefill your wish form.");
		} else if (mode === "create") {
			submitBtn.textContent = "Create Account";
			passwordInput.autocomplete = "new-password";
			setMessage("Create your YesGenie account with email, mobile, and password.");
		} else {
			submitBtn.textContent = "Send Reset Link";
			setMessage("Enter your email and we will send a password reset link.");
		}

		if (phoneInput) phoneInput.required = mode === "create";
		if (legalConsentInput) legalConsentInput.required = mode !== "reset";
		googleSignInBtn?.classList.toggle("is-hidden", mode === "reset");
		authDivider?.classList.toggle("is-hidden", mode === "reset");
	};

	const getEmail = () => {
		const email = String(emailInput?.value || "").trim();
		if (!email) throw new Error("Please enter your email address.");
		return email;
	};

	const getPassword = () => {
		const password = String(passwordInput?.value || "").trim();
		if (!password) throw new Error("Please enter your password.");
		if (password.length < 6) throw new Error("Password must be at least 6 characters.");
		return password;
	};

	const saveProfile = async (user, options = {}) => {
		if (!db || !user) return;
		const phoneNumber = normalizePhoneNumber(options.phoneNumber || getPhoneForAuth({ silent: true }));
		const profileName = String(options.displayName || user.displayName || "").trim();
		const payload = {
			email: user.email,
			lastSeenAt: firebase.firestore.FieldValue.serverTimestamp(),
			source: "yesgenie-login-page",
		};
		if (profileName) {
			payload.displayName = profileName;
			payload.name = profileName;
		}
		if (phoneNumber) payload.phoneNumber = phoneNumber;
		if (options.legalConsentAccepted || legalConsentInput?.checked) {
			payload.legalConsent = {
				accepted: true,
				policyVersion: window.YESGENIE_POLICY_VERSION || "2026-05-23",
				acceptedAt: firebase.firestore.FieldValue.serverTimestamp(),
				source: options.source || (mode === "create" ? "signup" : "login"),
			};
		}
		await db
			.collection("users")
			.doc(user.uid)
			.set(payload, { merge: true });
	};

	const requireLegalConsent = () => {
		if (mode === "reset") return;
		if (!legalConsentInput?.checked) {
			throw new Error(
				"Please accept the Privacy Policy, Terms & Conditions, Refund & Cancellation Policy, and Cookie Policy to continue."
			);
		}
	};

	const syncUserPanel = (user) => {
		const signedIn = Boolean(user);
		form?.classList.toggle("is-hidden", signedIn);
		googleSignInBtn?.classList.toggle("is-hidden", signedIn || mode === "reset");
		authDivider?.classList.toggle("is-hidden", signedIn || mode === "reset");
		signedInPanel?.classList.toggle("is-hidden", !signedIn);

		if (!user) return;
		if (signedInTitle) signedInTitle.textContent = user.displayName ? `Welcome, ${user.displayName}.` : "Welcome back.";
		if (signedInEmail) {
			signedInEmail.textContent = isAdminEmail(user.email)
				? `${user.email} is signed in. Admin access is active.`
				: `${user.email} is signed in. Your YesGenie trip space is active.`;
		}
		const dashboardLink = signedInPanel?.querySelector('a[href="/dashboard"]');
		if (dashboardLink instanceof HTMLAnchorElement && isAdminEmail(user.email)) {
			dashboardLink.href = "/admin";
			dashboardLink.textContent = "Open Admin";
		}
		setMessage("You are signed in.", "success");
	};

	const completeGoogleSignIn = async (user) => {
		const pending = getPendingGoogleProfile();
		await saveProfile(user, {
			phoneNumber: pending.phoneNumber || getPhoneForAuth({ silent: true }),
			legalConsentAccepted: pending.legalConsentAccepted,
			source: pending.source || "google",
		});
		clearPendingGoogleProfile();
		setMessage("Signed in with Google.", "success");
		showToast("Google login complete.");
		window.setTimeout(() => window.location.assign(getPostAuthUrlFor(user)), 700);
	};

	const signInWithGoogle = async () => {
		if (!auth) throw new Error("Login is still loading. Try again in a moment.");
		if (!firebase.auth.GoogleAuthProvider) throw new Error("Google login is not available yet. Refresh and try again.");
		requireLegalConsent();
		const phoneNumber = getPhoneForAuth({ required: mode === "create" });
		const persistence = rememberInput?.checked ? firebase.auth.Auth.Persistence.LOCAL : firebase.auth.Auth.Persistence.SESSION;
		await auth.setPersistence(persistence);

		const provider = new firebase.auth.GoogleAuthProvider();
		provider.setCustomParameters({ prompt: "select_account" });
		setPendingGoogleProfile({
			phoneNumber,
			legalConsentAccepted: Boolean(legalConsentInput?.checked),
			source: mode === "create" ? "google-signup" : "google-login",
		});

		try {
			const result = await auth.signInWithPopup(provider);
			await completeGoogleSignIn(result.user);
		} catch (error) {
			if (error?.code === "auth/popup-blocked" || error?.code === "auth/cancelled-popup-request") {
				setMessage("Opening Google sign-in securely...", "success");
				await auth.signInWithRedirect(provider);
				return;
			}
			clearPendingGoogleProfile();
			throw error;
		}
	};

	const initFirebase = () => {
		if (!window.firebase?.initializeApp || !window.firebase?.auth) {
			setMessage("Firebase Auth did not load. Refresh the page and try again.", "error");
			return;
		}

		if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
		auth = firebase.auth();
		db = window.firebase.firestore ? firebase.firestore() : null;

		auth.onAuthStateChanged(async (user) => {
			syncUserPanel(user);
			if (!user) return;
			try {
				await saveProfile(user);
			} catch {
				setMessage("Signed in. Profile sync will retry later.", "success");
			}
		});

		auth
			.getRedirectResult()
			.then(async (result) => {
				if (!result?.user) return;
				await completeGoogleSignIn(result.user);
			})
			.catch((error) => {
				const message = authMessage(error);
				setMessage(message, "error");
				showToast(message);
				clearPendingGoogleProfile();
			});
	};

	const submitAuth = async () => {
		if (!auth) throw new Error("Login is still loading. Try again in a moment.");
		const email = getEmail();

		if (mode === "reset") {
			await auth.sendPasswordResetEmail(email);
			setMessage("Password reset email sent. Check your inbox.", "success");
			showToast("Password reset email sent.");
			return;
		}

		const password = getPassword();
		requireLegalConsent();
		const phoneNumber = getPhoneForAuth({ required: mode === "create" });
		const persistence = rememberInput?.checked ? firebase.auth.Auth.Persistence.LOCAL : firebase.auth.Auth.Persistence.SESSION;
		await auth.setPersistence(persistence);

		if (mode === "login") {
			const result = await auth.signInWithEmailAndPassword(email, password);
			await saveProfile(result.user, { phoneNumber, source: "login" });
			setMessage("Signed in successfully.", "success");
			showToast("Welcome back to YesGenie.");
			window.setTimeout(() => window.location.assign(getPostAuthUrlFor(result.user)), 700);
			return;
		}

		const confirmPassword = String(confirmPasswordInput?.value || "").trim();
		if (password !== confirmPassword) throw new Error("Passwords do not match.");

		const result = await auth.createUserWithEmailAndPassword(email, password);
		const name = String(displayName?.value || "").trim();
		if (name) await result.user.updateProfile({ displayName: name });
		await saveProfile(result.user, { displayName: name, phoneNumber, source: "signup" });
		setMessage("Account created successfully.", "success");
		showToast("Your YesGenie account has been created.");
		window.setTimeout(() => window.location.assign(getPostAuthUrlFor(result.user)), 700);
	};

	$$(".mode-tab").forEach((tab) => {
		tab.addEventListener("click", () => setMode(tab.dataset.mode || "login"));
	});

	inlineReset?.addEventListener("click", (event) => {
		event.preventDefault();
		setMode("reset");
	});

	form?.addEventListener("submit", async (event) => {
		event.preventDefault();
		try {
			setBusy(true);
			await submitAuth();
		} catch (error) {
			const message = error.code ? authMessage(error) : error.message;
			setMessage(message, "error");
			showToast(message);
		} finally {
			setBusy(false);
		}
	});

	googleSignInBtn?.addEventListener("click", async () => {
		try {
			setBusy(true);
			await signInWithGoogle();
		} catch (error) {
			const message = error.code ? authMessage(error) : error.message;
			setMessage(message, "error");
			showToast(message);
		} finally {
			setBusy(false);
		}
	});

	signOutBtn?.addEventListener("click", async () => {
		try {
			if (!auth) return;
			setBusy(true);
			await auth.signOut();
			setMessage("Signed out. You can log back in anytime.", "success");
			showToast("Signed out of YesGenie.");
		} catch (error) {
			const message = error.code ? authMessage(error) : "Could not sign out. Please try again.";
			setMessage(message, "error");
			showToast(message);
		} finally {
			setBusy(false);
		}
	});

	const startTypingEffect = () => {
		if (!typingText || prefersReducedMotion) return;
		const phrases = [
			"Unlocking your trip space...",
			"Saving your next wish...",
			"Opening the member portal...",
			"Keeping your departures close...",
		];
		let phraseIndex = 0;
		let charIndex = 0;
		let deleting = false;

		const tick = () => {
			const phrase = phrases[phraseIndex % phrases.length];
			typingText.textContent = phrase.slice(0, charIndex);

			if (!deleting && charIndex < phrase.length) {
				charIndex += 1;
				window.setTimeout(tick, 46);
				return;
			}
			if (!deleting) {
				deleting = true;
				window.setTimeout(tick, 1300);
				return;
			}
			if (charIndex > 0) {
				charIndex -= 1;
				window.setTimeout(tick, 24);
				return;
			}
			deleting = false;
			phraseIndex += 1;
			window.setTimeout(tick, 260);
		};

		tick();
	};

	setMode(mode);
	startTypingEffect();
	initFirebase();
})();
