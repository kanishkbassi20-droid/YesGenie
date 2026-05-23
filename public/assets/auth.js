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
	const passwordInput = $("#password");
	const confirmPasswordInput = $("#confirmPassword");
	const rememberInput = $("#remember");
	const legalConsentInput = $("#legalConsent");
	const submitBtn = $("#submitBtn");
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
		};
		return messages[code] || "Something went wrong. Please try again.";
	};

	const setBusy = (busy) => {
		[submitBtn, signOutBtn, ...$$(".mode-tab")].forEach((button) => {
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
			setMessage("Enter your email and password to continue.");
		} else if (mode === "create") {
			submitBtn.textContent = "Create Account";
			passwordInput.autocomplete = "new-password";
			setMessage("Create your YesGenie account with a valid email and password.");
		} else {
			submitBtn.textContent = "Send Reset Link";
			setMessage("Enter your email and we will send a password reset link.");
		}

		if (legalConsentInput) legalConsentInput.required = mode !== "reset";
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

	const saveProfile = async (user) => {
		if (!db || !user) return;
		const payload = {
			email: user.email,
			displayName: user.displayName || "",
			lastSeenAt: firebase.firestore.FieldValue.serverTimestamp(),
			source: "yesgenie-login-page",
		};
		if (legalConsentInput?.checked) {
			payload.legalConsent = {
				accepted: true,
				policyVersion: window.YESGENIE_POLICY_VERSION || "2026-05-23",
				acceptedAt: firebase.firestore.FieldValue.serverTimestamp(),
				source: mode === "create" ? "signup" : "login",
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
		signedInPanel?.classList.toggle("is-hidden", !signedIn);

		if (!user) return;
		if (signedInTitle) signedInTitle.textContent = user.displayName ? `Welcome, ${user.displayName}.` : "Welcome back.";
		if (signedInEmail) signedInEmail.textContent = `${user.email} is signed in. Your YesGenie trip space is active.`;
		setMessage("You are signed in.", "success");
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
		const persistence = rememberInput?.checked ? firebase.auth.Auth.Persistence.LOCAL : firebase.auth.Auth.Persistence.SESSION;
		await auth.setPersistence(persistence);

		if (mode === "login") {
			const result = await auth.signInWithEmailAndPassword(email, password);
			await saveProfile(result.user);
			setMessage("Signed in successfully.", "success");
			showToast("Welcome back to YesGenie.");
			window.setTimeout(() => window.location.assign("/dashboard"), 700);
			return;
		}

		const confirmPassword = String(confirmPasswordInput?.value || "").trim();
		if (password !== confirmPassword) throw new Error("Passwords do not match.");

		const result = await auth.createUserWithEmailAndPassword(email, password);
		const name = String(displayName?.value || "").trim();
		if (name) await result.user.updateProfile({ displayName: name });
		await saveProfile(result.user);
		setMessage("Account created successfully.", "success");
		showToast("Your YesGenie account has been created.");
		window.setTimeout(() => window.location.assign("/dashboard"), 700);
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
