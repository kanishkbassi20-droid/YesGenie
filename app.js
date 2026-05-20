(() => {
				document.documentElement.classList.remove("no-js");

				const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
				const $ = (sel, root = document) => root.querySelector(sel);
				const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

				const preloader = $("#preloader");
				const preloaderWord = $("#preloaderWord");
				const words = ["Wish karke dekho...", "Genie at work...", "Planning magic...", "Almost ready..."];
				let w = 0;
				let wordTimer = null;

				const finishPreloader = () => {
					if (wordTimer) {
						window.clearInterval(wordTimer);
						wordTimer = null;
					}
					preloader?.setAttribute("data-state", "done");
				};

				const setPreWord = () => {
					if (!preloaderWord) return;
					preloaderWord.textContent = words[w % words.length];
					w++;
				};

				if (!prefersReducedMotion) {
					wordTimer = window.setInterval(setPreWord, 460);
				} else {
					setPreWord();
				}

				window.addEventListener(
					"load",
					() => {
						window.setTimeout(finishPreloader, prefersReducedMotion ? 180 : 520);
					},
					{ once: true }
				);
				window.setTimeout(finishPreloader, 2600);

				const yearEl = $("#year");
				if (yearEl) yearEl.textContent = new Date().getFullYear();

				const progressBar = $("#progressBar");
				const nav = $("#siteNav");
				let ticking = false;
				let lastScrollTop = 0;

				const updateChrome = () => {
					ticking = false;
					const doc = document.documentElement;
					const scrollTop = window.scrollY || doc.scrollTop || 0;

					// Only update if scroll position changed significantly
					if (Math.abs(scrollTop - lastScrollTop) < 1) return;
					lastScrollTop = scrollTop;

					const max = Math.max(1, doc.scrollHeight - window.innerHeight);
					const p = Math.min(1, Math.max(0, scrollTop / max));
					if (progressBar) progressBar.style.transform = `scaleX(${p})`;
					if (nav) {
						const shouldBeSolid = scrollTop > 24;
						if (nav.classList.contains("is-solid") !== shouldBeSolid) {
							nav.classList.toggle("is-solid", shouldBeSolid);
						}
					}
				};

				const requestUpdate = () => {
					if (ticking) return;
					ticking = true;
					window.requestAnimationFrame(updateChrome);
				};

				window.addEventListener("scroll", requestUpdate, { passive: true });
				window.addEventListener("resize", requestUpdate);
				requestUpdate();

				const navToggle = $("#navToggle");
				const navOverlay = $("#navOverlay");
				const setNavOpen = (open) => {
					document.body.dataset.navOpen = open ? "true" : "false";
					navToggle?.setAttribute("aria-expanded", open ? "true" : "false");
					navOverlay?.classList.toggle("is-open", open);
					navOverlay?.setAttribute("aria-hidden", open ? "false" : "true");
				};

				navToggle?.addEventListener("click", () => setNavOpen(!(document.body.dataset.navOpen === "true")));
				navOverlay?.addEventListener("click", (e) => {
					const target = e.target;
					if (!(target instanceof Element)) return;
					const a = target.closest("a");
					if (a) setNavOpen(false);
				});
				window.addEventListener("keydown", (e) => {
					if (e.key === "Escape") setNavOpen(false);
				});

				if (!prefersReducedMotion) {
					const revealEls = $$("[data-reveal]");
					const io = new IntersectionObserver(
						(entries) => {
							for (const entry of entries) {
								if (entry.isIntersecting) entry.target.classList.add("is-inview");
							}
						},
						{ root: null, threshold: 0.18, rootMargin: "0px 0px -10% 0px" }
					);
					revealEls.forEach((el) => io.observe(el));
				} else {
					$$("[data-reveal]").forEach((el) => el.classList.add("is-inview"));
				}

				const heroImg = $("#heroImg");
				const heroVideo = $("#heroVideo");
				let lastParallaxY = 0;
				heroVideo?.addEventListener("error", () => {
					heroVideo.hidden = true;
				});

				const parallax = () => {
					if (!heroImg) return;
					const y = window.scrollY || 0;

					// Skip if minimal scroll change
					if (Math.abs(y - lastParallaxY) < 2) return;
					lastParallaxY = y;

					const t = Math.max(-80, Math.min(120, y * -0.12));
					heroImg.style.transform = `translate3d(0, ${t}px, 0) scale(1.08)`;
				};
				if (!prefersReducedMotion) {
					window.addEventListener("scroll", () => window.requestAnimationFrame(parallax), { passive: true });
					parallax();
				}

				const stage = $("#hscrollStage");
				const track = $("#hscrollTrack");
				const sticky = stage?.querySelector(".hscroll__sticky");
			let lastHscrollValue = -1;

			const getHScrollExtra = () => {
				if (!stage || !track || !sticky) return 0;
				const display = window.getComputedStyle(track).display;
				if (display === "grid") return 0;
				return Math.max(0, track.scrollWidth - sticky.clientWidth);
			};

			const layoutHScroll = () => {
				if (!stage || !track || !sticky) return;
				const extra = getHScrollExtra();
				if (extra <= 1) {
					stage.style.height = "";
					track.style.transform = "";
					return;
				}
				stage.style.height = `${sticky.offsetHeight + extra}px`;
			};

			const updateHScroll = () => {
				if (!stage || !track || !sticky) return;
				const extra = getHScrollExtra();
				if (extra <= 1) {
					stage.style.height = "";
					track.style.transform = "";
					return;
				}
				const rect = stage.getBoundingClientRect();
				const stageTop = rect.top + window.scrollY;
				const stageHeight = stage.offsetHeight - sticky.offsetHeight;
				const scrolled = (window.scrollY - stageTop) / Math.max(1, stageHeight);
				const clamped = Math.min(1, Math.max(0, scrolled));
				
				// Only update if value changed significantly
				if (Math.abs(clamped - lastHscrollValue) < 0.001) return;
				lastHscrollValue = clamped;
				track.style.transform = `translate3d(${-extra * clamped}px, 0, 0)`;
			};

				if (!prefersReducedMotion) {
					window.addEventListener("resize", () => {
						layoutHScroll();
						updateHScroll();
					});
					window.addEventListener(
						"scroll",
						() => {
							window.requestAnimationFrame(updateHScroll);
						},
						{ passive: true }
					);
					layoutHScroll();
					updateHScroll();
				}

				const videoModal = $("#videoModal");
				const quizModal = $("#quizModal");
				const videoFrame = $("#videoFrame");

				const openModal = (which) => {
					closeModal(videoModal);
					closeModal(quizModal);
					const modal = which === "video" ? videoModal : which === "quiz" ? quizModal : null;
					if (!modal) return;
					modal.classList.add("is-open");
					document.body.style.overflow = "hidden";
					if (which === "video" && videoFrame) {
						videoFrame.src = "https://www.youtube.com/embed/M7lc1UVf-VE?autoplay=1&rel=0";
					}
				};

				const closeModal = (modal) => {
					if (!modal) return;
					modal.classList.remove("is-open");
					document.body.style.overflow = "";
					if (modal === videoModal && videoFrame) videoFrame.src = "";
				};

				$$("[data-open]").forEach((btn) => {
					btn.addEventListener("click", () => openModal(btn.getAttribute("data-open")));
				});

				$$(".modal").forEach((modal) => {
					modal.addEventListener("click", (e) => {
						const isBackdrop = e.target === modal;
						if (isBackdrop) closeModal(modal);
					});
					modal.addEventListener("click", (e) => {
						const target = e.target;
						if (!(target instanceof Element)) return;
						if (target.matches("[data-close]")) closeModal(modal);
					});
				});

				window.addEventListener("keydown", (e) => {
					if (e.key !== "Escape") return;
					closeModal(videoModal);
					closeModal(quizModal);
				});

				const toast = $("#toast");
				const toastTitle = $("#toastTitle");
				const toastBody = $("#toastBody");
				let toastTimer = null;
				const showToast = (title, body) => {
					if (!toast) return;
					if (toastTimer) window.clearTimeout(toastTimer);
					toastTitle.textContent = title;
					toastBody.textContent = body;
					toast.classList.add("is-open");
					toastTimer = window.setTimeout(() => toast.classList.remove("is-open"), 3400);
				};

				const wa = {
					phone: "918901300069",
					defaultMessage: "Hi YesGenie! Wish karke dekho - I would like help planning my travel wish.",
				};

				const openWhatsApp = (message) => {
					const url = `https://wa.me/${wa.phone}?text=${encodeURIComponent(message || wa.defaultMessage)}`;
					window.open(url, "_blank", "noopener,noreferrer");
				};

				$("#whatsappBtn")?.addEventListener("click", () => openWhatsApp(wa.defaultMessage));

				const callbackForm = $("#callbackForm");
				callbackForm?.addEventListener("submit", (e) => {
					e.preventDefault();
					const fd = new FormData(callbackForm);
					const name = String(fd.get("name") || "").trim();
					const phone = String(fd.get("phone") || "").trim();
					const travellerType = String(fd.get("travellerType") || "").trim();
					const travelMonth = String(fd.get("travelMonth") || "").trim();
					const message = String(fd.get("message") || "").trim();

					if (!name || !phone) {
						showToast("Missing details", "Please add your name and phone number.");
						return;
					}

					const brief = [
						`Hi YesGenie! Wish karke dekho - I would like a callback for a curated travel wish.`,
						`Name: ${name}`,
						`Phone: ${phone}`,
						`Traveller type: ${travellerType || "-"}`,
						`Travel month: ${travelMonth || "-"}`,
						`Wish: ${message || "-"}`,
					].join("\n");

					showToast("Callback requested", "Opening WhatsApp with your wish brief...");
					openWhatsApp(brief);
					callbackForm.reset();
				});

				const slider = $("#testimonialSlider");
				const slides = slider ? $$(".slide", slider) : [];
				const dots = $$("[data-dot]");
				let active = 0;
				let autoTimer = null;

				const setSlide = (idx) => {
					if (!slides.length) return;
					active = (idx + slides.length) % slides.length;
					slides.forEach((s, i) => s.classList.toggle("is-active", i === active));
					dots.forEach((d) => d.classList.toggle("is-active", Number(d.dataset.dot) === active));
				};

				dots.forEach((d) => {
					d.addEventListener("click", () => {
						setSlide(Number(d.dataset.dot));
						if (autoTimer) {
							window.clearInterval(autoTimer);
							autoTimer = window.setInterval(() => setSlide(active + 1), 5200);
						}
					});
				});

				if (!prefersReducedMotion && slides.length > 1) {
					autoTimer = window.setInterval(() => setSlide(active + 1), 5200);
				}

				const marqueeRow = $("#marqueeRow");
				if (marqueeRow && marqueeRow.children.length) {
					const clone = marqueeRow.cloneNode(true);
					clone.setAttribute("aria-hidden", "true");
					marqueeRow.append(...Array.from(clone.children));
				}

				const quiz = $("#quiz");
				const quizSteps = quiz ? $$("[data-step]", quiz) : [];
				const quizPreview = $("#quizPreview");
				const quizProgress = $("#quizProgress");
				const quizBack = $("#quizBack");
				const quizNext = $("#quizNext");
				const quizSend = $("#quizSend");
				let step = 0;

				const quizState = {
					travellerType: null,
					interests: [],
					name: "",
					phone: "",
					destination: "",
				};

				const renderQuiz = () => {
					quizSteps.forEach((s) => s.classList.toggle("is-active", Number(s.dataset.step) === step));
					if (quizProgress) quizProgress.textContent = `Step ${step + 1} / ${quizSteps.length}`;
					if (quizBack) quizBack.disabled = step === 0;
					if (quizNext) quizNext.textContent = step === quizSteps.length - 1 ? "Finish" : "Next";
					if (quizPreview) {
						const bits = [];
						bits.push(`Traveller type: ${quizState.travellerType || "-"}`);
						bits.push(`Interests: ${quizState.interests.length ? quizState.interests.join(", ") : "-"}`);
						bits.push(`Name: ${quizState.name || "-"}`);
						bits.push(`Phone: ${quizState.phone || "-"}`);
						bits.push(`Destination: ${quizState.destination || "-"}`);
						quizPreview.textContent = bits.join("\n");
					}
				};

				const bindPills = () => {
					$$("[data-pick]", quiz).forEach((group) => {
						const pick = group.dataset.pick;
						const max = Number(group.dataset.max || "999");
						const name = group.dataset.name;
						group.addEventListener("click", (e) => {
							const target = e.target;
							if (!(target instanceof Element)) return;
							const btn = target.closest(".pill");
							if (!btn) return;
							const value = btn.dataset.value;
							if (!value || !name) return;

							if (pick === "single") {
								$$(".pill", group).forEach((p) => p.classList.remove("is-on"));
								btn.classList.add("is-on");
								quizState[name] = value;
							} else {
								const list = Array.isArray(quizState[name]) ? quizState[name] : [];
								const isOn = btn.classList.contains("is-on");
								if (isOn) {
									btn.classList.remove("is-on");
									quizState[name] = list.filter((x) => x !== value);
								} else {
									if (list.length >= max) {
										showToast("Limit reached", `Pick up to ${max}.`);
										return;
									}
									btn.classList.add("is-on");
									quizState[name] = [...list, value];
								}
							}
							renderQuiz();
						});
					});
				};

				const bindQuizInputs = () => {
					const qName = $("#qName");
					const qPhone = $("#qPhone");
					const qDest = $("#qDest");
					const on = () => {
						quizState.name = String(qName?.value || "").trim();
						quizState.phone = String(qPhone?.value || "").trim();
						quizState.destination = String(qDest?.value || "").trim();
						renderQuiz();
					};
					[qName, qPhone, qDest].forEach((el) => el?.addEventListener("input", on));
				};

				const nextStep = () => {
					if (step === 0 && !quizState.travellerType) {
						showToast("Pick one", "Choose a traveller type to continue.");
						return;
					}
					if (step === 1 && quizState.interests.length === 0) {
						showToast("Pick a vibe", "Select at least one interest.");
						return;
					}
					if (step === 2) {
						const brief = [
							"Hi YesGenie! Here is my travel wish brief:",
							`Traveller type: ${quizState.travellerType || "-"}`,
							`Interests: ${quizState.interests.length ? quizState.interests.join(", ") : "-"}`,
							`Name: ${quizState.name || "-"}`,
							`Phone: ${quizState.phone || "-"}`,
							`Destination: ${quizState.destination || "-"}`,
						].join("\n");
						showToast("Wish ready", "Opening WhatsApp...");
						openWhatsApp(brief);
						return;
					}
					step = Math.min(quizSteps.length - 1, step + 1);
					renderQuiz();
				};

				const backStep = () => {
					step = Math.max(0, step - 1);
					renderQuiz();
				};

				quizBack?.addEventListener("click", backStep);
				quizNext?.addEventListener("click", nextStep);
				quizSend?.addEventListener("click", () => {
					const brief = [
						"Hi YesGenie! Here is my travel wish brief:",
						`Traveller type: ${quizState.travellerType || "-"}`,
						`Interests: ${quizState.interests.length ? quizState.interests.join(", ") : "-"}`,
						`Name: ${quizState.name || "-"}`,
						`Phone: ${quizState.phone || "-"}`,
						`Destination: ${quizState.destination || "-"}`,
					].join("\n");
					openWhatsApp(brief);
				});

				if (quiz) {
					bindPills();
					bindQuizInputs();
					renderQuiz();
				}

				const cursorDot = $("#cursorDot");
				const cursorRing = $("#cursorRing");
				const pointerFine = window.matchMedia("(pointer: fine)").matches;
				if (!prefersReducedMotion && pointerFine && cursorDot && cursorRing) {
					document.body.dataset.cursor = "on";
					let x = 0,
						y = 0,
						rx = 0,
						ry = 0;
					const lerp = (a, b, t) => a + (b - a) * t;

					window.addEventListener(
						"mousemove",
						(e) => {
							x = e.clientX;
							y = e.clientY;
							cursorDot.style.transform = `translate3d(${x - 3}px, ${y - 3}px, 0)`;
						},
						{ passive: true }
					);

					const tick = () => {
						rx = lerp(rx, x, 0.16);
						ry = lerp(ry, y, 0.16);
						const scale = document.body.dataset.cursor === "hover" ? 1.25 : 1;
						cursorRing.style.transform = `translate3d(${rx - 18}px, ${ry - 18}px, 0) scale(${scale})`;
						window.requestAnimationFrame(tick);
					};
					window.requestAnimationFrame(tick);

					const hoverables = "a, button, input, select, textarea, [role='button']";
					document.addEventListener(
						"mouseover",
						(e) => {
							const target = e.target;
							if (!(target instanceof Element)) return;
							if (target.closest(hoverables)) document.body.dataset.cursor = "hover";
						},
						{ passive: true }
					);
					document.addEventListener(
						"mouseout",
						(e) => {
							const target = e.target;
							if (!(target instanceof Element)) return;
							if (target.closest(hoverables)) document.body.dataset.cursor = "on";
						},
						{ passive: true }
					);
				}
			})();
