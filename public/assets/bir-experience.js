(() => {
	"use strict";

	const WHATSAPP_NUMBER = "918901300069";

	const itinerary = [
		{
			id: "day0",
			day: "Day 0",
			title: "The Threshold",
			summary:
				"The trip begins before Bir. The group meets, the energy opens up, and the overnight road becomes the first shared memory.",
			events: [
				{
					time: "10:00 PM",
					title: "Welcome Circle",
					body:
						"High-energy beginning at the Chandigarh departure point with Copy Me activity, briefing, rules, and tone-setting.",
				},
				{
					time: "10:30 PM - 6:00 AM",
					title: "The Drift",
					body: "Overnight journey from Chandigarh to Bir with light music and organic conversations.",
				},
			],
		},
		{
			id: "day1",
			day: "Day 1",
			title: "Landing Into the Group",
			summary:
				"Arrival, first conversations, creative play, shared meals, painting, no-phone dinner, and the first honest circle.",
			events: [
				{
					time: "6:00 AM - 10:30 AM",
					title: "The Landing",
					body: "Arrival, check-in, tea or coffee, breakfast, and slow settling into the villa.",
				},
				{
					time: "10:30 AM - 11:30 AM",
					title: "Build the Unfamiliar",
					body: "Team creative challenge where groups build objects using their bodies.",
				},
				{
					time: "11:30 AM - 12:00 PM",
					title: "Group Identity Collage",
					body: "Teams create a collage representing the personality of their group.",
				},
				{
					time: "12:00 PM - 1:00 PM",
					title: "Chai Without Agenda",
					body: "Unstructured chai break for natural conversations.",
				},
				{
					time: "2:00 PM - 3:00 PM",
					title: "The First Table",
					body: "First shared lunch with mixed seating and free-flowing conversations.",
				},
				{
					time: "3:00 PM - 4:00 PM",
					title: "Unscripted Hours",
					body: "Rest, explore, or talk freely.",
				},
				{
					time: "4:00 PM - 6:00 PM",
					title: "Paint What You Can't Explain",
					body: "Sunset painting session with music, paints, canvas or paper, and optional wine.",
				},
				{
					time: "7:30 PM - 8:30 PM",
					title: "The Unplugged Table",
					body: "No-phone dinner to encourage real presence.",
				},
				{
					time: "8:30 PM - 10:30 PM",
					title: "The First Truth",
					body: "Light hot-seat sharing circle about something participants are figuring out.",
				},
				{
					time: "10:30 PM - 11:00 PM",
					title: "The First Acknowledgement",
					body: "Short gratitude circle where each person acknowledges someone.",
				},
			],
		},
		{
			id: "day2",
			day: "Day 2",
			title: "Adventure, Silence, Sound",
			summary:
				"Yoga, paragliding, poetry at the landing site, monastery quiet, picnic music, a stranger walk, and playful evening pitches.",
			events: [
				{
					time: "6:00 AM - 7:00 AM",
					title: "Before the Noise",
					body: "Morning yoga and stillness.",
				},
				{
					time: "8:00 AM - 11:00 AM",
					title: "Jump Anyway",
					body: "Paragliding at Bir Billing.",
				},
				{
					time: "11:00 AM - 1:00 PM",
					title: "Fragments & Thoughts",
					body: "Coffee and poetry/reflection writing at the landing site.",
				},
				{
					time: "1:00 PM - 4:00 PM",
					title: "Silence to Sound",
					body: "Monastery visit followed by picnic, music, and jamming.",
				},
				{
					time: "4:00 PM - 6:00 PM",
					title: "One Person, No Distractions",
					body: "Walk With a Stranger: randomly paired one-on-one walk.",
				},
				{
					time: "8:30 PM - 10:30 PM",
					title: "Creative Travel Pitch",
					body: "A light team challenge where the group presents imaginative travel ideas with confidence and humour.",
				},
				{
					time: "10:30 PM - 11:00 PM",
					title: "The Second Acknowledgement",
					body: "Deeper gratitude circle.",
				},
			],
		},
		{
			id: "day3",
			day: "Day 3",
			title: "Make It Mean Something",
			summary:
				"The group turns experience into expression through yoga, cafe breakfast, film-making, Himachali lunch, movement, showcase, and deep perspective sharing.",
			events: [
				{
					time: "7:00 AM - 8:00 AM",
					title: "Flow Yoga",
					body: "Morning yoga and stillness.",
				},
				{
					time: "9:00 AM - 10:00 AM",
					title: "Breakfast at a Special Cafe",
					body: "Shared breakfast outside the villa.",
				},
				{
					time: "10:00 AM - 2:00 PM",
					title: "Film Challenge",
					body: "Teams of two create a short film about what the experience means to them.",
				},
				{
					time: "2:00 PM - 3:00 PM",
					title: "Himachali Dham Lunch",
					body: "Traditional sit-down lunch with everyone back together.",
				},
				{
					time: "4:00 PM - 5:00 PM",
					title: "Say It Before You Leave It",
					body: "Reflection sharing circle.",
				},
				{
					time: "5:00 PM - 7:00 PM",
					title: "Lose the Frame",
					body: "Flow dance and movement session at sunset.",
				},
				{
					time: "7:00 PM - 8:00 PM",
					title: "Dinner",
					body: "Relaxed dinner after movement.",
				},
				{
					time: "8:30 PM - 9:30 PM",
					title: "What You Made",
					body: "Film showcase with projector and speakers.",
				},
				{
					time: "9:30 PM - 10:30 PM",
					title: "If You Were Me",
					body: "Hot Problem Circle where people share real problems and receive perspectives.",
				},
				{
					time: "10:30 PM - 12:00 AM",
					title: "The Final Acknowledgement",
					body: "Emotional gratitude and acknowledgement table.",
				},
			],
		},
		{
			id: "day4",
			day: "Day 4",
			title: "Full Circle",
			summary:
				"A softer ending: slow morning, letters, closing circle, one final chai, and a goodbye that feels earned.",
			events: [
				{
					time: "Morning",
					title: "Slow Morning",
					body: "Slow morning, yoga, and breakfast.",
				},
				{
					time: "10:00 AM - 11:00 AM",
					title: "Write What You Felt",
					body: "Participants write letters to new friends on branded cards.",
				},
				{
					time: "11:00 AM - 11:30 AM",
					title: "What Changed?",
					body: "Closing circle with one shift or takeaway from each participant.",
				},
				{
					time: "11:30 AM - 12:00 PM",
					title: "Full Circle + Chai",
					body: "Final Copy Me activity mirroring the start.",
				},
				{
					time: "Departure",
					title: "Warm Goodbye",
					body: "End with warm goodbye and onward travel.",
				},
			],
		},
	];

	const promises = [
		{
			code: "ST",
			title: "Meet strangers, leave with stories",
			body: "First conversations open naturally, without forced networking.",
		},
		{
			code: "FL",
			title: "Create, reflect, dance, fly",
			body: "Adventure, stillness, art, food, movement, and expression.",
		},
		{
			code: "RC",
			title: "No forced networking, only real connection",
			body: "Hosted moments, no performative mingling.",
		},
		{
			code: "CU",
			title: "Curated activities, meals, circles, and local experiences",
			body: "A clear flow with space for unscripted magic.",
		},
	];

	const included = [
		["ST", "Stay at villa", "A warm shared base to rest, gather, and return to."],
		["AC", "Curated activities", "Creativity, reflection, adventure, and connection."],
		["PG", "Paragliding coordination", "Support for the Bir Billing flying experience."],
		["ME", "Meals and chai breaks", "Shared food moments for comfort and conversation."],
		["YO", "Yoga and reflection circles", "Stillness, prompts, and guided closing rituals."],
		["AR", "Art, film, music, and movement", "Painting, short films, jamming, showcase, and flow."],
		["HO", "Host-led experience", "A host holds pace, safety, flow, and group tone."],
		["WA", "WhatsApp coordination", "Pre-trip and on-ground updates stay simple."],
	];

	const audience = [
		"Want a meaningful trip, not just sightseeing",
		"Are open to meeting new people",
		"Like cafes, nature, conversations, creativity, and adventure",
		"Want a safe, hosted experience",
	];

	const quizQuestions = [
		{
			key: "wish",
			question: "What are you wishing for right now?",
			options: ["New friends", "Adventure", "Peace", "Confidence", "A reset"],
		},
		{
			key: "traveller",
			question: "What kind of traveler are you?",
			options: ["Quiet observer", "Social explorer", "Creative soul", "Adventure seeker", "Deep conversation person"],
		},
		{
			key: "excites",
			question: "What scares you a little but excites you?",
			options: ["Meeting strangers", "Paragliding", "Opening up", "Dancing freely", "Making something creative"],
		},
		{
			key: "moment",
			question: "Pick your ideal Bir moment:",
			options: ["Sunrise yoga", "Cafe breakfast", "Paragliding", "Monastery silence", "Night gratitude circle"],
		},
	];

	const state = {
		activeDay: 0,
		answers: {},
		submitted: false,
		error: "",
	};

	const app = document.querySelector("#app");

	const escapeHtml = (value) =>
		String(value)
			.replaceAll("&", "&amp;")
			.replaceAll("<", "&lt;")
			.replaceAll(">", "&gt;")
			.replaceAll('"', "&quot;");

	const scrollToId = (id) => {
		document.querySelector(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
	};

	const getWhatsAppMessage = () => {
		const fallback = "-";
		return [
			"Hi YesGenie, I saved my Make a Wish details.",
			"",
			`My current wish: ${state.answers.wish || fallback}`,
			`My traveler type: ${state.answers.traveller || fallback}`,
			`What excites me: ${state.answers.excites || fallback}`,
			`My ideal Bir moment: ${state.answers.moment || fallback}`,
			"",
			"I'm interested in the Bir experience. Please share details.",
		].join("\n");
	};

	const getWhatsAppUrl = () => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(getWhatsAppMessage())}`;

	const isQuizComplete = () => quizQuestions.every((q) => Boolean(state.answers[q.key]));

	const Hero = () => `
		<section class="hero" id="top" aria-label="Bir experience hero">
			<div class="container hero__grid">
				<div>
					<div class="eyebrow">Bir Edition</div>
					<h1>The Bir wish, granted.</h1>
					<p class="hero__sub">
						A hosted 4-day mountain experience with paragliding, cafes, creative sessions, reflective pauses, and a
						group that is shaped with care.
					</p>
					<div class="hero__actions">
						<a class="button button--primary" href="/#wish-quiz">Make a Wish</a>
						<button class="button button--secondary" type="button" data-scroll="#itinerary">View Itinerary</button>
					</div>
				</div>
				<aside class="hero-card" aria-label="Experience snapshot">
					<div class="hero-card__label">What this feels like</div>
					<h2 class="hero-card__title">A mountain retreat beyond sightseeing.</h2>
					<ul class="hero-card__list">
						<li>Mist-led mornings, mountain air, and intentional pacing.</li>
						<li>Hosted moments that help people connect naturally.</li>
						<li>Adventure, quiet, food, and culture held in one itinerary.</li>
						<li>Designed for both social and quieter travellers.</li>
					</ul>
				</aside>
			</div>
		</section>
	`;

	const SectionHead = (eyebrow, title, copy) => `
		<div class="section-head">
			<div>
				<div class="eyebrow">${escapeHtml(eyebrow)}</div>
				<h2 class="section-title">${escapeHtml(title)}</h2>
			</div>
			<p class="section-copy">${escapeHtml(copy)}</p>
		</div>
	`;

	const ExperiencePromise = () => `
		<section class="section section--tight" aria-label="Experience promise">
			<div class="container">
				${SectionHead(
					"Experience Promise",
					"Connection, without the awkwardness.",
					"The trip is designed to help people open up naturally through shared activities, meals, movement, and moments of quiet."
				)}
				<div class="promise-grid">
					${promises
						.map(
							(item) => `
								<article class="promise-card">
									<div class="mini-icon" aria-hidden="true">${item.code}</div>
									<h3>${escapeHtml(item.title)}</h3>
									<p>${escapeHtml(item.body)}</p>
								</article>
							`
						)
						.join("")}
				</div>
			</div>
		</section>
	`;

	const ItineraryCard = (event, index) => `
		<details class="itinerary-card" ${index === 0 ? "open" : ""}>
			<summary>
				<span class="itinerary-card__time">${escapeHtml(event.time)}</span>
				<span class="itinerary-card__title">${escapeHtml(event.title)}</span>
				<span class="itinerary-card__toggle" aria-hidden="true">+</span>
			</summary>
			<div class="itinerary-card__body">${escapeHtml(event.body)}</div>
		</details>
	`;

	const DayTimeline = () => `
		<section class="section" id="itinerary" aria-label="Day-wise itinerary">
			<div class="container">
				${SectionHead(
					"Day-wise Itinerary",
					"Clear days. Real moments. No guesswork.",
					"Tap a day to see the flow. Each session has a purpose, but the day still leaves room for unexpected conversations."
				)}
				<div class="timeline-shell">
					<div class="day-tabs" role="tablist" aria-label="Itinerary days">
						${itinerary
							.map(
								(day, index) => `
									<button
										class="day-tab ${index === state.activeDay ? "is-active" : ""}"
										type="button"
										role="tab"
										aria-selected="${index === state.activeDay ? "true" : "false"}"
										data-day="${index}"
									>
										<strong>${escapeHtml(day.day)}</strong>
										<span>${escapeHtml(day.title)}</span>
									</button>
								`
							)
							.join("")}
					</div>
					<div class="day-panels">
						${itinerary
							.map(
								(day, index) => `
									<section class="day-panel ${index === state.activeDay ? "is-active" : ""}" role="tabpanel">
										<div class="day-summary">
											<h3>${escapeHtml(day.day)} - ${escapeHtml(day.title)}</h3>
											<p>${escapeHtml(day.summary)}</p>
										</div>
										<div class="itinerary-list">
											${day.events.map(ItineraryCard).join("")}
										</div>
									</section>
								`
							)
							.join("")}
					</div>
				</div>
			</div>
		</section>
	`;

	const IncludedSection = () => `
		<section class="section soft-band" id="included" aria-label="What's included">
			<div class="container">
				${SectionHead(
					"What's Included",
					"The structure is handled. You just show up.",
					"From villa stay to host-led rituals, the experience is curated so the group can relax into the journey."
				)}
				<div class="included-grid">
					${included
						.map(
							([code, title, body]) => `
								<article class="included-card">
									<div class="mini-icon" aria-hidden="true">${code}</div>
									<h3>${escapeHtml(title)}</h3>
									<p>${escapeHtml(body)}</p>
								</article>
							`
						)
						.join("")}
				</div>
			</div>
		</section>
	`;

	const AudienceSection = () => `
		<section class="section section--tight" aria-label="Who this is for">
			<div class="container">
				${SectionHead(
					"Who This Is For",
					"For people who want to feel something.",
					"This is not a checklist trip. It is for travelers who want nature, people, stories, adventure, and a held space."
				)}
				<div class="audience-grid">
					${audience
						.map(
							(item, index) => `
								<article class="audience-card">
									<div class="mini-icon" aria-hidden="true">${String(index + 1).padStart(2, "0")}</div>
									<div>
										<h3>${escapeHtml(item)}</h3>
										<p>Enough structure to belong, enough space to breathe.</p>
									</div>
								</article>
							`
						)
						.join("")}
				</div>
			</div>
		</section>
	`;

	const WishQuiz = () => `
		<section class="section" id="quiz" aria-label="Make a Wish">
			<div class="container">
				${SectionHead(
					"Make a Wish",
					"Save your travel profile before you ask for Bir.",
					"The live YesGenie wish form now sits on the main website and saves securely to your member dashboard."
				)}
				<div class="quiz-wrap quiz-wrap--cta">
					<div class="quiz-card quiz-card--cta">
						<div class="mini-icon" aria-hidden="true">YG</div>
						<h3>Your saved wish helps us plan better.</h3>
						<p>
							Add your name, work city, occupation, phone number, Instagram ID, and travel profile once. Your email is
							taken from Firebase login and your saved wish remains available from the dashboard.
						</p>
						<div class="quiz-actions">
							<a class="button button--primary" href="/#wish-quiz">Open Make a Wish Form</a>
							<a class="button button--secondary" href="/dashboard">View Dashboard</a>
						</div>
					</div>
					<aside class="whatsapp-card" aria-label="Bir planning note">
						<h3>Planning stays personal.</h3>
						<p>
							Once your wish is saved, the YesGenie team can review it with better context before sharing next steps,
							seat updates, or booking guidance.
						</p>
						<a class="button button--secondary" href="/login?mode=create">Create Account</a>
						<div class="preview-message">Firebase login keeps your email separate from the public form, and your wish data is stored under your own UID.</div>
					</aside>
				</div>
			</div>
		</section>
	`;

	const WhatsAppCTA = () => `
		<aside class="whatsapp-card" aria-label="WhatsApp message preview">
			<h3>Send your wish to YesGenie.</h3>
			<p>
				Once your quiz is complete, this becomes a ready-to-send message with your answers.
			</p>
			<a
				class="button button--secondary ${state.submitted && isQuizComplete() ? "" : "is-disabled"}"
				id="sendWishWhatsApp"
				href="${state.submitted && isQuizComplete() ? getWhatsAppUrl() : "#quiz"}"
				${state.submitted && isQuizComplete() ? 'target="_blank" rel="noreferrer noopener"' : 'aria-disabled="true" data-scroll="#quiz"'}
			>
				Send My Wish on WhatsApp
			</a>
			<div class="preview-message" id="messagePreview">${escapeHtml(getWhatsAppMessage())}</div>
		</aside>
	`;

	const FinalCTA = () => `
		<section class="section section--tight" aria-label="Final call to action">
			<div class="container">
				<div class="final-cta">
					<div class="eyebrow">Final Call</div>
					<h2>Some trips are planned. Some are wished into existence.</h2>
					<p>
						If the idea of Bir, strangers, stories, paragliding, cafes, silence, music, and honest conversations
						makes something in you move, start with the quiz.
					</p>
					<div class="final-cta__actions">
						<a class="button button--primary" href="/#wish-quiz">Make a Wish</a>
						<a class="button button--secondary" href="/active-itineraries">View Active Trips</a>
					</div>
				</div>
			</div>
		</section>
	`;

	const render = () => {
		app.innerHTML = [
			Hero(),
			ExperiencePromise(),
			DayTimeline(),
			IncludedSection(),
			AudienceSection(),
			WishQuiz(),
			FinalCTA(),
		].join("");
		bindEvents();
	};

	const bindEvents = () => {
		document.querySelectorAll("[data-scroll]").forEach((button) => {
			button.addEventListener("click", () => scrollToId(button.getAttribute("data-scroll")));
		});

		document.querySelectorAll("[data-day]").forEach((button) => {
			button.addEventListener("click", () => {
				state.activeDay = Number(button.getAttribute("data-day") || "0");
				render();
				scrollToId("#itinerary");
			});
		});

		document.querySelectorAll("[data-answer]").forEach((button) => {
			button.addEventListener("click", () => {
				const key = button.getAttribute("data-question");
				const answer = button.getAttribute("data-answer");
				if (!key || !answer) return;
				state.answers[key] = answer;
				state.submitted = false;
				state.error = "";
				render();
			});
		});

		document.querySelector("#wishQuiz")?.addEventListener("submit", (event) => {
			event.preventDefault();
			if (!isQuizComplete()) {
				const missing = quizQuestions.find((q) => !state.answers[q.key]);
				state.error = `Please answer: ${missing ? missing.question : "all questions"}`;
				state.submitted = false;
				render();
				scrollToId("#quiz");
				return;
			}
			state.error = "";
			state.submitted = true;
			render();
			scrollToId("#quizResult");
		});

		document.querySelector("[data-reset-quiz]")?.addEventListener("click", () => {
			state.answers = {};
			state.submitted = false;
			state.error = "";
			render();
			scrollToId("#quiz");
		});
	};

	render();
})();
