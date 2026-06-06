(() => {
	"use strict";

	document.documentElement.classList.remove("no-js");

	const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
	const $ = (selector, root = document) => root.querySelector(selector);
	const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

	const year = $("#year");
	if (year) year.textContent = new Date().getFullYear();

	const progressBar = $("#progressBar");
	const nav = $("#siteNav");
	let ticking = false;

	const updateChrome = () => {
		ticking = false;
		const doc = document.documentElement;
		const scrollTop = window.scrollY || doc.scrollTop || 0;
		const maxScroll = Math.max(1, doc.scrollHeight - window.innerHeight);
		const progress = Math.min(1, Math.max(0, scrollTop / maxScroll));

		if (progressBar) progressBar.style.transform = `scaleX(${progress})`;
		if (nav) nav.classList.toggle("is-solid", scrollTop > 20);
	};

	const requestChromeUpdate = () => {
		if (ticking) return;
		ticking = true;
		window.requestAnimationFrame(updateChrome);
	};

	window.addEventListener("scroll", requestChromeUpdate, { passive: true });
	window.addEventListener("resize", requestChromeUpdate);
	requestChromeUpdate();

	const navToggle = $("#navToggle");
	const mobileMenu = $("#mobileMenu");

	const setMenuOpen = (open) => {
		document.body.dataset.menuOpen = open ? "true" : "false";
		navToggle?.setAttribute("aria-expanded", open ? "true" : "false");
		mobileMenu?.classList.toggle("is-open", open);
		mobileMenu?.setAttribute("aria-hidden", open ? "false" : "true");
	};

	navToggle?.addEventListener("click", () => {
		setMenuOpen(document.body.dataset.menuOpen !== "true");
	});

	mobileMenu?.addEventListener("click", (event) => {
		const target = event.target;
		if (target instanceof Element && target.closest("a")) setMenuOpen(false);
	});

	window.addEventListener("keydown", (event) => {
		if (event.key === "Escape") setMenuOpen(false);
	});

	$$('a[href^="#"]').forEach((link) => {
		link.addEventListener("click", (event) => {
			const id = link.getAttribute("href");
			if (!id || id === "#") return;
			const target = $(id);
			if (!target) return;
			event.preventDefault();
			setMenuOpen(false);
			target.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" });
		});
	});

	const tripCards = $$(".trip-portal-card");
	const coarsePointer = window.matchMedia("(hover: none), (pointer: coarse)").matches;

	tripCards.forEach((card) => {
		card.addEventListener("pointermove", (event) => {
			if (prefersReducedMotion) return;
			const rect = card.getBoundingClientRect();
			const x = ((event.clientX - rect.left) / Math.max(1, rect.width)) * 100;
			const y = ((event.clientY - rect.top) / Math.max(1, rect.height)) * 100;
			card.style.setProperty("--cursor-x", `${x.toFixed(2)}%`);
			card.style.setProperty("--cursor-y", `${y.toFixed(2)}%`);
		});

		card.addEventListener("pointerleave", () => {
			card.style.removeProperty("--cursor-x");
			card.style.removeProperty("--cursor-y");
		});

		if (!coarsePointer) return;
		card.addEventListener("click", (event) => {
			if (card.classList.contains("is-active")) return;
			event.preventDefault();
			tripCards.forEach((item) => item.classList.toggle("is-active", item === card));
		});
	});

	if (!prefersReducedMotion) {
		const revealEls = $$("[data-reveal]");
		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						entry.target.classList.add("is-inview");
						observer.unobserve(entry.target);
					}
				}
			},
			{ threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
		);
		revealEls.forEach((el) => observer.observe(el));
	} else {
		$$("[data-reveal]").forEach((el) => el.classList.add("is-inview"));
	}

	const typingText = $("#typingText");
	const toast = $("#toast");
	const wishForm = $("#wishQuizForm");
	const wishStatus = $("#wishQuizStatus");
	const wishStatusText = $("#wishQuizStatusText");
	const wishSubmitBtn = $("#wishSubmitBtn");
	const wishLoginLink = $("#wishLoginLink");
	const wishDashboardLink = $("#wishDashboardLink");
	const wishBirthYear = $("#wishBirthYear");
	let toastTimer = 0;
	let auth = null;
	let db = null;
	let currentUser = null;

	const showToast = (message) => {
		if (!toast) return;
		window.clearTimeout(toastTimer);
		toast.textContent = message;
		toast.classList.add("is-open");
		toastTimer = window.setTimeout(() => toast.classList.remove("is-open"), 4200);
	};

	const setWishStatus = (message, type = "idle") => {
		if (wishStatusText) wishStatusText.textContent = message;
		wishStatus?.classList.toggle("is-success", type === "success");
		wishStatus?.classList.toggle("is-error", type === "error");
	};

	const setWishFormEnabled = (enabled) => {
		if (!wishForm) return;
		wishForm.setAttribute("aria-disabled", enabled ? "false" : "true");
		$$("input, select", wishForm).forEach((field) => {
			field.disabled = !enabled;
		});
		if (wishSubmitBtn) wishSubmitBtn.disabled = !enabled;
		wishLoginLink?.classList.toggle("is-hidden", enabled);
		wishDashboardLink?.classList.toggle("is-hidden", !enabled);
	};

	const getWishField = (name) => wishForm?.elements?.[name];

	const setWishFieldValue = (name, value, { overwrite = true } = {}) => {
		const field = getWishField(name);
		if (!field || value === undefined || value === null) return;
		if (!overwrite && String(field.value || "").trim()) return;
		field.value = String(value);
	};

	const normalizeInstagram = (value) => {
		const clean = String(value || "").trim().replace(/^@+/, "");
		return clean ? `@${clean}` : "";
	};

	const applyProfileToWishForm = (profile = {}, user = null) => {
		const profileName = profile.name || profile.displayName || user?.displayName || "";
		setWishFieldValue("name", profileName, { overwrite: false });
		setWishFieldValue("phoneNumber", profile.phoneNumber, { overwrite: false });
		setWishFieldValue("cityOfWork", profile.cityOfWork, { overwrite: false });
		setWishFieldValue("occupation", profile.occupation, { overwrite: false });
		setWishFieldValue("instagramId", profile.instagramId, { overwrite: false });
		setWishFieldValue("gender", profile.gender, { overwrite: false });
		setWishFieldValue("yearOfBirth", profile.yearOfBirth, { overwrite: false });
	};

	const applyWishToForm = (data = {}) => {
		setWishFieldValue("name", data.name);
		setWishFieldValue("gender", data.gender);
		setWishFieldValue("yearOfBirth", data.yearOfBirth);
		setWishFieldValue("phoneNumber", data.phoneNumber);
		setWishFieldValue("instagramId", data.instagramId);
		setWishFieldValue("cityOfWork", data.cityOfWork);
		setWishFieldValue("occupation", data.occupation);
	};

	const getWishPayload = () => {
		if (!wishForm) throw new Error("Wish form is not available.");
		if (!currentUser) throw new Error("Please login before saving your wish.");
		const formData = new FormData(wishForm);
		const currentYear = new Date().getFullYear();
		const yearOfBirth = Number(formData.get("yearOfBirth"));
		const phoneNumber = String(formData.get("phoneNumber") || "").trim();

		if (!Number.isInteger(yearOfBirth) || yearOfBirth < 1900 || yearOfBirth > currentYear) {
			throw new Error("Please enter a valid year of birth.");
		}

		if (!/^\+?[0-9\s-]{7,18}$/.test(phoneNumber)) {
			throw new Error("Please enter a valid mobile number.");
		}

		const payload = {
			name: String(formData.get("name") || "").trim(),
			age: currentYear - yearOfBirth,
			yearOfBirth,
			gender: String(formData.get("gender") || "").trim(),
			phoneNumber,
			instagramId: normalizeInstagram(formData.get("instagramId")),
			cityOfWork: String(formData.get("cityOfWork") || "").trim(),
			occupation: String(formData.get("occupation") || "").trim(),
			email: currentUser.email || "",
			uid: currentUser.uid,
			source: "yesgenie-home-make-a-wish",
			policyVersion: window.YESGENIE_POLICY_VERSION || "2026-05-23",
			createdAt: firebase.firestore.FieldValue.serverTimestamp(),
		};

		const missing = Object.entries(payload).find(([key, value]) =>
			["name", "gender", "phoneNumber", "instagramId", "cityOfWork", "occupation"].includes(key) && !value
		);
		if (missing) throw new Error("Please complete every required field.");
		return payload;
	};

	const loadSavedWish = async (user) => {
		if (!db || !wishForm || !user) return;
		const userRef = db.collection("users").doc(user.uid);
		const [profileSnap, snap] = await Promise.all([userRef.get(), userRef.collection("wishQuiz").doc("current").get()]);
		const profile = profileSnap.exists ? profileSnap.data() || {} : {};
		applyProfileToWishForm(profile, user);
		if (snap.exists) {
			const data = snap.data() || {};
			applyWishToForm(data);
			setWishStatus("Your saved wish is loaded. You can update it anytime.", "success");
			return;
		}
		setWishStatus("Your profile details are prefilled. Complete anything missing to save your wish.", "success");
	};

	const saveWish = async () => {
		if (!db || !currentUser) throw new Error("Please login before saving your wish.");
		const payload = getWishPayload();
		const userRef = db.collection("users").doc(currentUser.uid);
		await userRef.set(
			{
				email: currentUser.email || "",
				displayName: currentUser.displayName || payload.name,
				name: payload.name,
				phoneNumber: payload.phoneNumber,
				cityOfWork: payload.cityOfWork,
				occupation: payload.occupation,
				lastSeenAt: firebase.firestore.FieldValue.serverTimestamp(),
				wishQuizUpdatedAt: firebase.firestore.FieldValue.serverTimestamp(),
			},
			{ merge: true }
		);
		const wishQuizRef = userRef.collection("wishQuiz");
		await wishQuizRef.doc("current").set({ ...payload, recordType: "current" }, { merge: true });
		await wishQuizRef.add({ ...payload, recordType: "submission" });
	};

	const initWishQuiz = () => {
		if (!wishForm) return;
		const currentYear = new Date().getFullYear();
		if (wishBirthYear) wishBirthYear.max = String(currentYear);
		setWishFormEnabled(false);

		if (!window.firebase?.initializeApp || !window.firebase?.auth || !window.firebase?.firestore) {
			setWishStatus("Secure login tools are still loading. Refresh if this message stays visible.", "error");
			return;
		}

		if (!firebase.apps.length) firebase.initializeApp(window.YESGENIE_FIREBASE_CONFIG);
		auth = firebase.auth();
		db = firebase.firestore();

		auth.onAuthStateChanged(async (user) => {
			currentUser = user;
			if (!user) {
				setWishFormEnabled(false);
				setWishStatus("Login or sign up to save your wish securely.", "error");
				return;
			}
			setWishFormEnabled(true);
			try {
				await loadSavedWish(user);
			} catch {
				setWishStatus("Signed in. Saved wish details will load after refresh if available.", "success");
			}
		});

		wishForm.addEventListener("submit", async (event) => {
			event.preventDefault();
			try {
				if (!currentUser) {
					window.location.href = "/login?mode=create";
					return;
				}
				if (wishSubmitBtn) wishSubmitBtn.disabled = true;
				setWishStatus("Saving your wish...");
				await saveWish();
				setWishStatus("Your wish has been saved to your dashboard.", "success");
				showToast("Your Make a Wish details are saved.");
			} catch (error) {
				const message = error?.message || "Could not save your wish. Please try again.";
				setWishStatus(message, "error");
				showToast(message);
			} finally {
				if (wishSubmitBtn) wishSubmitBtn.disabled = !currentUser;
			}
		});
	};
	const typingPhrases = [
		"Matching your vibe to the right departure...",
		"Summoning mountain mornings and new friends...",
		"Turning wishlists into hosted group journeys...",
		"Finding your people before the trip begins...",
	];

	const startTypingEffect = () => {
		if (!typingText || prefersReducedMotion) return;
		let phraseIndex = 0;
		let charIndex = 0;
		let deleting = false;

		const tick = () => {
			const phrase = typingPhrases[phraseIndex % typingPhrases.length];
			typingText.textContent = phrase.slice(0, charIndex);

			if (!deleting && charIndex < phrase.length) {
				charIndex += 1;
				window.setTimeout(tick, 46);
				return;
			}

			if (!deleting) {
				deleting = true;
				window.setTimeout(tick, 1450);
				return;
			}

			if (charIndex > 0) {
				charIndex -= 1;
				window.setTimeout(tick, 24);
				return;
			}

			deleting = false;
			phraseIndex += 1;
			window.setTimeout(tick, 280);
		};

		tick();
	};

	initWishQuiz();
	startTypingEffect();
})();
