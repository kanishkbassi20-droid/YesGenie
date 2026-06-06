(() => {
	"use strict";

	const $ = (selector, root = document) => root.querySelector(selector);
	const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
	const STORAGE_KEY = "yesgenie_genie_chat_opened";

	const createEl = (tag, className, attrs = {}) => {
		const el = document.createElement(tag);
		if (className) el.className = className;
		Object.entries(attrs).forEach(([key, value]) => {
			if (value === undefined || value === null) return;
			el.setAttribute(key, String(value));
		});
		return el;
	};

	function GenieLamp({ chatId }) {
		const button = createEl("button", "genie-lamp", {
			type: "button",
			"aria-label": "Open YesGenie chat",
			"aria-controls": chatId,
			"aria-expanded": "false",
		});
		["glow", "smoke", "smoke genie-lamp__smoke--two", "handle", "body", "spout", "base"].forEach((part) => {
			button.appendChild(createEl("span", `genie-lamp__${part}`));
		});
		return button;
	}

	function GenieBubble({ id }) {
		const panel = createEl("section", "genie-bubble", {
			id,
			role: "dialog",
			"aria-modal": "false",
			"aria-labelledby": `${id}-title`,
		});

		const header = createEl("div", "genie-bubble__header");
		const titleWrap = createEl("div", "genie-bubble__title");
		const kicker = createEl("span", "genie-bubble__kicker");
		kicker.textContent = "YesGenie";
		const title = createEl("h2", "genie-bubble__heading", { id: `${id}-title` });
		title.textContent = "Travel chat";
		titleWrap.append(kicker, title);

		const close = createEl("button", "genie-bubble__close", {
			type: "button",
			"aria-label": "Hide YesGenie chat",
		});
		header.append(titleWrap, close);

		const messages = createEl("div", "genie-chat__messages", {
			role: "log",
			"aria-live": "polite",
			"aria-relevant": "additions",
		});

		const quickActions = createEl("div", "genie-chat__quick-actions", {
			"aria-label": "Quick chat actions",
		});

		const form = createEl("form", "genie-chat__form");
		const label = createEl("label", "genie-chat__label", { for: `${id}-input` });
		label.textContent = "Ask YesGenie";
		const input = createEl("input", "genie-chat__input", {
			id: `${id}-input`,
			type: "text",
			placeholder: "Ask about trips, Kasauli, login, policies...",
			autocomplete: "off",
		});
		const submit = createEl("button", "genie-chat__send", {
			type: "submit",
			"aria-label": "Send message",
		});
		submit.textContent = "Send";
		form.append(label, input, submit);

		panel.append(header, messages, quickActions, form);
		return { panel, close, messages, quickActions, form, input, submit };
	}

	class GenieChat {
		constructor() {
			this.chatId = "yesgenieChat";
			this.signedIn = false;
			this.userEmail = "";
			this.endpoint = window.YESGENIE_GENIE_CHAT_ENDPOINT || "";
			this.root = createEl("aside", "genie-guide", {
				"aria-label": "YesGenie chatbot",
			});
			this.lamp = GenieLamp({ chatId: this.chatId });
			const parts = GenieBubble({ id: this.chatId });
			this.panel = parts.panel;
			this.closeButton = parts.close;
			this.messagesEl = parts.messages;
			this.quickActionsEl = parts.quickActions;
			this.form = parts.form;
			this.input = parts.input;
			this.submitButton = parts.submit;
			this.root.append(this.panel, this.lamp);
			document.body.appendChild(this.root);
			this.bindEvents();
			this.initAuthAwareness();
			this.renderQuickActions();
			this.addAssistant(this.greeting());
		}

		bindEvents() {
			this.lamp.addEventListener("click", () => {
				this.root.classList.contains("is-open") ? this.close() : this.open();
			});

			this.closeButton.addEventListener("click", () => this.close());

			document.addEventListener("click", (event) => {
				if (!this.root.classList.contains("is-open")) return;
				if (this.root.contains(event.target)) return;
				this.close();
			});

			window.addEventListener("keydown", (event) => {
				if (event.key === "Escape" && this.root.classList.contains("is-open")) this.close();
			});

			this.form.addEventListener("submit", async (event) => {
				event.preventDefault();
				const message = this.input.value.trim();
				if (!message) return;
				this.input.value = "";
				this.addUser(message);
				await this.reply(message);
			});

			this.quickActionsEl.addEventListener("click", (event) => {
				const target = event.target;
				if (!(target instanceof HTMLElement)) return;
				const button = target.closest("[data-chat-action]");
				if (!(button instanceof HTMLElement)) return;
				const action = button.dataset.chatAction || "";
				if (action === "login") {
					window.location.href = "/login?mode=create";
					return;
				}
				if (action === "wish") {
					window.location.href = "/#wish-quiz";
					return;
				}
				if (action === "bir") {
					window.location.href = "/bir-experience";
					return;
				}
				if (action === "himachal") {
					window.location.href = "/himachal-expedition";
					return;
				}
				if (action === "kasauli") {
					window.location.href = "/kasauli-himachal";
					return;
				}
				if (action === "patnitop") {
					window.location.href = "/patnitop-jammu";
					return;
				}
				if (action === "trips") {
					window.location.href = "/active-itineraries";
				}
			});
		}

		initAuthAwareness() {
			if (!window.firebase?.initializeApp || !window.firebase?.auth || !window.YESGENIE_FIREBASE_CONFIG) return;
			if (!firebase.apps.length) firebase.initializeApp(window.YESGENIE_FIREBASE_CONFIG);
			firebase.auth().onAuthStateChanged((user) => {
				const wasSignedIn = this.signedIn;
				this.signedIn = Boolean(user);
				this.userEmail = user?.email || "";
				this.renderQuickActions();
				if (!wasSignedIn && user && this.root.classList.contains("is-open")) {
					this.addAssistant(`Welcome back${this.userEmail ? `, ${this.userEmail}` : ""}. Your travel space is ready.`);
				}
			});
		}

		greeting() {
			if (this.signedIn) return "Welcome back. Ask me about trips, Kasauli, Patnitop, saved wishes, policies, or your dashboard.";
			return "Hi, I am your YesGenie chat. Login to save your travel wish, or ask me about trips as a guest.";
		}

		open() {
			this.root.classList.add("is-open");
			this.lamp.setAttribute("aria-expanded", "true");
			try {
				localStorage.setItem(STORAGE_KEY, "1");
			} catch {
				// Storage can fail in private modes; chat still works without it.
			}
			if (!prefersReducedMotion) window.setTimeout(() => this.input.focus(), 140);
		}

		close() {
			this.root.classList.remove("is-open");
			this.lamp.setAttribute("aria-expanded", "false");
		}

		renderQuickActions() {
			this.quickActionsEl.replaceChildren();
			const actions = [
				this.signedIn
					? { label: "Dashboard", action: "dashboard", href: "/dashboard" }
					: { label: "Login / Sign Up", action: "login" },
				{ label: "Make a Wish", action: "wish" },
				{ label: "Kasauli", action: "kasauli" },
				{ label: "Patnitop", action: "patnitop" },
				{ label: "Active Trips", action: "trips" },
			];

			actions.forEach((item) => {
				if (item.href) {
					const link = createEl("a", "genie-chat__chip", { href: item.href });
					link.textContent = item.label;
					this.quickActionsEl.appendChild(link);
					return;
				}
				const button = createEl("button", "genie-chat__chip", {
					type: "button",
					"data-chat-action": item.action,
				});
				button.textContent = item.label;
				this.quickActionsEl.appendChild(button);
			});
		}

		addMessage(role, text, actions = []) {
			const message = createEl("div", `genie-chat__message genie-chat__message--${role}`);
			const bubble = createEl("div", "genie-chat__message-bubble");
			bubble.textContent = text;
			message.appendChild(bubble);

			if (actions.length) {
				const actionRow = createEl("div", "genie-chat__message-actions");
				actions.forEach((action) => {
					const link = createEl("a", "genie-chat__message-link", { href: action.href });
					link.textContent = action.label;
					actionRow.appendChild(link);
				});
				message.appendChild(actionRow);
			}

			this.messagesEl.appendChild(message);
			this.messagesEl.scrollTop = this.messagesEl.scrollHeight;
		}

		addAssistant(text, actions = []) {
			this.addMessage("assistant", text, actions);
		}

		addUser(text) {
			this.addMessage("user", text);
		}

		async reply(message) {
			this.setBusy(true);
			try {
				const remoteReply = await this.fetchRemoteReply(message);
				if (remoteReply) {
					this.addAssistant(remoteReply.text, remoteReply.actions || []);
					return;
				}
				const fallback = this.localReply(message);
				this.addAssistant(fallback.text, fallback.actions || []);
			} catch {
				const fallback = this.localReply(message);
				this.addAssistant(fallback.text, fallback.actions || []);
			} finally {
				this.setBusy(false);
			}
		}

		async fetchRemoteReply(message) {
			if (!this.endpoint) return null;
			// Future: Connect this to a secure backend route that calls the OpenAI API.
			// Never expose an OpenAI API key in this public static frontend.
			const response = await fetch(this.endpoint, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					message,
					path: window.location.pathname,
					signedIn: this.signedIn,
				}),
			});
			if (!response.ok) return null;
			const data = await response.json();
			if (!data?.text) return null;
			return {
				text: String(data.text),
				actions: Array.isArray(data.actions) ? data.actions : [],
			};
		}

		localReply(message) {
			const text = message.toLowerCase();
			if (/login|sign|account|save/.test(text)) {
				return this.signedIn
					? {
							text: "You are signed in. You can open your dashboard or update your saved travel wish anytime.",
							actions: [{ label: "Open Dashboard", href: "/dashboard" }],
						}
					: {
							text: "Login first so YesGenie can save your wish, dashboard, and trip interests securely.",
							actions: [{ label: "Login / Sign Up", href: "/login?mode=create" }],
						};
			}
			if (/wish|form|profile/.test(text)) {
				return this.signedIn
					? {
							text: "Use Make a Wish to share your travel profile. It stays linked to your YesGenie account.",
							actions: [{ label: "Make a Wish", href: "/#wish-quiz" }],
						}
					: {
							text: "You can view the Make a Wish form, but login is needed before saving.",
							actions: [
								{ label: "Login / Sign Up", href: "/login?mode=create" },
								{ label: "View Form", href: "/#wish-quiz" },
							],
						};
			}
			if (/himachal|jipsa|jispa|shinku|solang|manali|raison|altitude|snow/.test(text)) {
				return {
					text: "The Ultimate High-Altitude Himachal Expedition runs Delhi to Raison, Jispa, Shinku La, Keylong, Solang Valley, Manali, and back to Delhi.",
					actions: [{ label: "Open Himachal Trip", href: "/himachal-expedition" }],
				};
			}
			if (/kasauli|painting|stranger|gratitude|chai/.test(text)) {
				return {
					text: "Kasauli is a 3-day mountain escape with slow mornings, sunset painting, Walk With A Stranger, music, and gratitude circles.",
					actions: [{ label: "Open Kasauli", href: "/kasauli-himachal" }],
				};
			}
			if (/patnitop|jammu|wander|fresh air/.test(text)) {
				return {
					text: "Patnitop is a 3-day hosted mountain framework for fresh air, exploration, new friendships, reflection, and return.",
					actions: [{ label: "Open Patnitop", href: "/patnitop-jammu" }],
				};
			}
			if (/bir|paragliding|mountain/.test(text)) {
				return {
					text: "The Bir Experience is the active mountain trip: paragliding, cafes, quiet creative time, and hosted group energy.",
					actions: [{ label: "Open Bir Trip", href: "/bir-experience" }],
				};
			}
			if (/trip|itinerary|departure|active|travel/.test(text)) {
				return {
					text: "You can explore active trips first, then login when you are ready to save your interest.",
					actions: [{ label: "Active Trips", href: "/active-itineraries" }],
				};
			}
			if (/refund|cancel|policy|payment/.test(text)) {
				// Future: Payment genie guidance will be added here
				return {
					text: "For payment, refund, and cancellation details, check the published policy before making any final decision.",
					actions: [{ label: "Refund Policy", href: "/refund-cancellation-policy" }],
				};
			}
			if (/contact|support|email|help/.test(text)) {
				return {
					text: "For support, email YesGenie at infoyesgenie@gmail.com. You can also use the contact page for policy and grievance details.",
					actions: [{ label: "Contact Page", href: "/contact-grievance-officer" }],
				};
			}
			return {
				text: "I can help with trips, Kasauli, Patnitop, Bir, Make a Wish, login, dashboard access, policies, and support. Ask me what you want to do next.",
				actions: this.signedIn ? [{ label: "Dashboard", href: "/dashboard" }] : [{ label: "Login / Sign Up", href: "/login?mode=create" }],
			};
		}

		setBusy(busy) {
			this.submitButton.disabled = busy;
			this.input.disabled = busy;
			this.root.classList.toggle("is-busy", busy);
		}
	}

	window.YesGenieGenieGuide = { GenieLamp, GenieBubble, GenieChat };
	window.yesGenieGuide = new GenieChat();
})();
