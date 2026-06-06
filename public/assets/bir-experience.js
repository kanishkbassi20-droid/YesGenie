(() => {
	"use strict";

	const WHATSAPP_NUMBER = "918901300069";
	const tripKey = document.body?.dataset.trip || "bir";

	let itinerary = [
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

	let promises = [
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

	let included = [
		["ST", "Stay at villa", "A warm shared base to rest, gather, and return to."],
		["AC", "Curated activities", "Creativity, reflection, adventure, and connection."],
		["PG", "Paragliding coordination", "Support for the Bir Billing flying experience."],
		["ME", "Meals and chai breaks", "Shared food moments for comfort and conversation."],
		["YO", "Yoga and reflection circles", "Stillness, prompts, and guided closing rituals."],
		["AR", "Art, film, music, and movement", "Painting, short films, jamming, showcase, and flow."],
		["HO", "Host-led experience", "A host holds pace, safety, flow, and group tone."],
		["WA", "WhatsApp coordination", "Pre-trip and on-ground updates stay simple."],
	];

	let accommodation = [
		{
			title: "Warm shared mountain base",
			body: "A comfortable villa-style stay chosen for group flow, rest, and easy gathering between activities.",
		},
		{
			title: "Common spaces for real conversations",
			body: "Chai corners, music time, and quieter pockets help the group open up without forcing the pace.",
		},
		{
			title: "Hosted comfort",
			body: "The Genie host keeps check-ins, meal rhythm, safety notes, and day transitions simple.",
		},
	];

	let audience = [
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

	const pageCopy = {
		tripSlug: "bir-experience",
		heroImage: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=2200&h=1400&fit=crop&auto=format&q=78",
		finalImage: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1800&h=900&fit=crop&auto=format&q=78",
		planningImage: "https://images.unsplash.com/photo-1528164344705-47542687000d?w=900&h=900&fit=crop&auto=format&q=76",
		heroAria: "Bir experience hero",
		heroEyebrow: "Bir Edition",
		heroTitle: "The Bir wish, granted.",
		heroSub:
			"A hosted 4-day mountain experience with paragliding, cafes, creative sessions, reflective pauses, and a group that is shaped with care.",
		heroCardLabel: "What this feels like",
		heroCardTitle: "A mountain retreat beyond sightseeing.",
		heroCardItems: [
			"Mist-led mornings, mountain air, and intentional pacing.",
			"Hosted moments that help people connect naturally.",
			"Adventure, quiet, food, and culture held in one itinerary.",
			"Designed for both social and quieter travellers.",
		],
		promiseEyebrow: "Experience Promise",
		promiseTitle: "Connection, without the awkwardness.",
		promiseCopy:
			"The trip is designed to help people open up naturally through shared activities, meals, movement, and moments of quiet.",
		itineraryEyebrow: "Day-wise Itinerary",
		itineraryTitle: "Clear days. Real moments. No guesswork.",
		itineraryCopy:
			"Tap a day to see the flow. Each session has a purpose, but the day still leaves room for unexpected conversations.",
		includedId: "included",
		includedAria: "What's included",
		includedEyebrow: "What's Included",
		includedTitle: "The structure is handled. You just show up.",
		includedCopy:
			"From villa stay to host-led rituals, the experience is curated so the group can relax into the journey.",
		accommodationEyebrow: "Accommodation",
		accommodationTitle: "A stay that makes the group feel held.",
		accommodationCopy:
			"Your base is selected for comfort, shared spaces, and the kind of quiet mountain atmosphere that lets people settle in.",
		audienceEyebrow: "Who This Is For",
		audienceTitle: "For people who want to feel something.",
		audienceCopy:
			"This is not a checklist trip. It is for travelers who want nature, people, stories, adventure, and a held space.",
		audienceCardCopy: "Enough structure to belong, enough space to breathe.",
		wishEyebrow: "Make a Wish",
		wishTitle: "Save your travel profile before you ask for Bir.",
		wishCopy:
			"The live YesGenie wish form now sits on the main website and saves securely to your member dashboard.",
		wishCardTitle: "Your saved wish helps us plan better.",
		wishCardCopy:
			"Add your name, work city, occupation, phone number, Instagram ID, and travel profile once. Your email is taken from Firebase login and your saved wish remains available from the dashboard.",
		planningTitle: "Planning stays personal.",
		planningCopy:
			"Once your wish is saved, the YesGenie team can review it with better context before sharing next steps, seat updates, or booking guidance.",
		planningNote:
			"Firebase login keeps your email separate from the public form, and your wish data is stored under your own UID.",
		finalEyebrow: "Final Call",
		finalTitle: "Some trips are planned. Some are wished into existence.",
		finalCopy:
			"If the idea of Bir, strangers, stories, paragliding, cafes, silence, music, and honest conversations makes something in you move, open the wish form.",
		whatsappInterest: "I'm interested in the Bir experience. Please share details.",
	};

	if (tripKey === "himachal-expedition") {
		itinerary = [
			{
				id: "day1",
				day: "Day 1",
				title: "Overnight Journey from Delhi",
				summary:
					"The expedition starts in Delhi with a hosted briefing, group introductions, and an overnight drive toward Raison.",
				events: [
					{
						time: "Evening",
						title: "Delhi Assembly",
						body:
							"Meet the trip host and group at the pickup point, verify essentials, and settle into the travel rhythm.",
					},
					{
						time: "Night",
						title: "Overnight Drive to Raison",
						body:
							"Begin the Delhi to Himachal road journey with music, comfort stops, and light introductions on the move.",
					},
				],
			},
			{
				id: "day2",
				day: "Day 2",
				title: "Raison Arrival, Rafting, Paragliding, Bonfire",
				summary:
					"Arrive by the Beas, freshen up, step into river adventure, fly if weather permits, and close with a hosted bonfire.",
				events: [
					{
						time: "Morning",
						title: "Raison Arrival",
						body: "Reach Raison, check in, freshen up, and ease into the first mountain morning with breakfast.",
					},
					{
						time: "Late Morning",
						title: "River Rafting",
						body:
							"Safety briefing followed by a guided rafting session on the Beas, subject to river and operator conditions.",
					},
					{
						time: "Afternoon",
						title: "Paragliding Session",
						body:
							"Take off for a scenic paragliding experience with certified local operators, subject to wind and safety clearance.",
					},
					{
						time: "Evening",
						title: "Bonfire and Group Night",
						body: "Music, warm food, hosted conversations, and a soft first-night celebration at Raison.",
					},
				],
			},
			{
				id: "day3",
				day: "Day 3",
				title: "Atal Tunnel Drive and Riverside Jispa Camps",
				summary:
					"A cinematic drive through the Atal Tunnel leads into Lahaul landscapes, ending at riverside camps in Jispa.",
				events: [
					{
						time: "Morning",
						title: "Drive Toward Atal Tunnel",
						body: "Leave Raison after breakfast and climb toward the tunnel with scenic pauses along the way.",
					},
					{
						time: "Midday",
						title: "Atal Tunnel Crossing",
						body:
							"Cross one of Himachal's most iconic mountain routes and enter the stark, high-altitude Lahaul valley.",
					},
					{
						time: "Afternoon",
						title: "Jispa Riverside Camps",
						body:
							"Arrive at Jispa, check into riverside camps, rest, hydrate, and let the altitude pace settle in.",
					},
					{
						time: "Night",
						title: "Camp Dinner and Stargazing",
						body: "A quieter night by the river with dinner, warm layers, and sky-watching if conditions are clear.",
					},
				],
			},
			{
				id: "day4",
				day: "Day 4",
				title: "Shinku La Pass Snow Adventure and Keylong Stay",
				summary:
					"Drive to the snowline around Shinku La for a high-altitude adventure day, then settle into Keylong for the night.",
				events: [
					{
						time: "Morning",
						title: "Acclimatized Start",
						body: "Begin with a steady breakfast, hydration check, and route briefing before heading higher.",
					},
					{
						time: "Daytime",
						title: "Shinku La Pass Snow Adventure",
						body:
							"Experience snow play, mountain photography, and pass views around Shinku La, subject to road, weather, and safety access.",
					},
					{
						time: "Afternoon",
						title: "Transfer to Keylong",
						body: "Return through the Lahaul valley and check into the Keylong stay for a comfortable recovery night.",
					},
					{
						time: "Evening",
						title: "Keylong Dinner",
						body: "Warm meal, slow conversations, and rest after the highest-adventure stretch of the expedition.",
					},
				],
			},
			{
				id: "day5",
				day: "Day 5",
				title: "Solang Valley Exploration and Final Night Celebration",
				summary:
					"Move back toward Manali's adventure belt, explore Solang Valley, and celebrate the final mountain night together.",
				events: [
					{
						time: "Morning",
						title: "Keylong to Solang Valley",
						body: "Drive back through the Atal Tunnel corridor with scenic pauses and a gentler descent.",
					},
					{
						time: "Afternoon",
						title: "Solang Valley Exploration",
						body:
							"Explore Solang's viewpoints and optional local activities such as ATV rides, zipline, or ropeway, based on availability.",
					},
					{
						time: "Evening",
						title: "Final Night Celebration",
						body: "A hosted celebration with music, group memories, and one last mountain dinner before departure day.",
					},
				],
			},
			{
				id: "day6",
				day: "Day 6",
				title: "Old Manali, Mall Road, and Departure",
				summary:
					"Spend the final day in Manali's cafes, lanes, and market streets before boarding the overnight vehicle to Delhi.",
				events: [
					{
						time: "Morning",
						title: "Old Manali Cafe Time",
						body: "Slow breakfast, cafe hopping, riverside lanes, and time to absorb the final Himachal morning.",
					},
					{
						time: "Afternoon",
						title: "Mall Road Walk",
						body: "Explore Mall Road for souvenirs, snacks, local shopping, and relaxed group photos.",
					},
					{
						time: "Evening",
						title: "Departure for Delhi",
						body: "Board the overnight vehicle and begin the return journey from Manali toward Delhi.",
					},
				],
			},
			{
				id: "day7",
				day: "Day 7",
				title: "Delhi Arrival",
				summary:
					"Arrive back in Delhi with the expedition complete and the final overnight transfer behind you.",
				events: [
					{
						time: "Morning",
						title: "Arrive in Delhi",
						body:
							"Reach Delhi in the morning, say final goodbyes, and continue onward with a full high-altitude Himachal story.",
					},
				],
			},
		];

		promises = [
			{
				code: "HA",
				title: "High-altitude Himachal, hosted end to end",
				body: "Delhi pickup, mountain transfers, adventure pacing, and clear day-wise movement.",
			},
			{
				code: "AD",
				title: "Raft, fly, snow, and celebrate",
				body: "A compact route with river action, paragliding, snow access, valleys, and social nights.",
			},
			{
				code: "SA",
				title: "Safety-led mountain decisions",
				body: "Activities and pass access stay subject to operator, weather, altitude, and road safety.",
			},
			{
				code: "RG",
				title: "A route built for group energy",
				body: "Riverside camps, shared drives, scenic halts, and final-night celebration moments.",
			},
		];

		included = [
			["LC", "Layered clothing", "Thermals, fleece, windproof outerwear, gloves, cap, and extra socks for sudden temperature drops."],
			["SH", "Waterproof high-ankle shoes", "Grip, ankle support, and water resistance help across snow patches, camps, and uneven trails."],
			["MK", "Basic medical kit", "Carry personal medicines plus altitude and motion sickness support after medical advice."],
			["HY", "Sunscreen and ORS", "High SPF sunscreen, ORS sachets, lip balm, moisturiser, and personal hydration essentials."],
			["ID", "Government ID", "Carry original ID proof and a few digital/offline copies for hotel and route checks."],
			["PW", "Power essentials", "Power bank, charging cable, torch, and spare batteries for long drives and camp nights."],
			["BG", "Compact day bag", "Keep water, medicines, sunglasses, snacks, and warm layers accessible during day drives."],
			["RS", "Responsible extras", "Reusable bottle, personal waste pouch, wet wipes, tissues, and a small towel."],
		];

		accommodation = [
			{
				title: "Riverside and mountain stays",
				body: "A mix of hosted camps and comfortable mountain stays keeps the expedition practical without losing atmosphere.",
			},
			{
				title: "Recovery after high-movement days",
				body: "The overnight rhythm is planned around rest, warm food, hydration, and clear next-day briefings.",
			},
			{
				title: "Group-ready logistics",
				body: "Rooms, camps, transfers, and daily coordination are handled so the group can stay present on the route.",
			},
		];

		audience = [
			"Want a compact high-altitude Himachal route from Delhi",
			"Are excited by rafting, paragliding, snow, and valley drives",
			"Can follow altitude, hydration, and weather-led pacing",
			"Like premium group energy with clear logistics",
		];

		Object.assign(pageCopy, {
			heroAria: "Ultimate High-Altitude Himachal Expedition hero",
			tripSlug: "himachal-expedition",
			heroImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=2200&h=1400&fit=crop&auto=format&q=82",
			finalImage: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1800&h=900&fit=crop&auto=format&q=82",
			planningImage: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=900&h=900&fit=crop&auto=format&q=76",
			heroEyebrow: "5 Nights / 6 Days",
			heroTitle: "Ultimate High-Altitude Himachal Expedition",
			heroSub:
				"Delhi to Raison, Jispa, Shinku La, Keylong, Solang Valley, Manali, and back to Delhi in one premium hosted mountain arc.",
			heroCardLabel: "Route Snapshot",
			heroCardTitle: "Delhi to snowline, riverside camps, Solang, and Manali.",
			heroCardItems: [
				"Route: Delhi, Raison, Jispa, Shinku La, Keylong, Solang Valley, Manali, Delhi.",
				"Adventure mix: rafting, paragliding, snow access, valley drives, and final-night celebration.",
				"Stays shaped around riverside camps, Keylong comfort, and Manali energy.",
				"Day 7 is Delhi arrival after the final overnight transfer.",
			],
			promiseEyebrow: "Expedition Promise",
			promiseTitle: "Premium adventure, with the mountain pace respected.",
			promiseCopy:
				"This route is designed for travellers who want the thrill of high-altitude Himachal with hosted coordination, safety-led decisions, and clean group energy.",
			itineraryEyebrow: "Day-wise Expedition",
			itineraryTitle: "A high-altitude route with every movement mapped.",
			itineraryCopy:
				"Tap a day to see the flow from Delhi departure to Raison adventure, Jispa camps, Shinku La snow, Solang, Manali, and Delhi arrival.",
			includedId: "packing",
			includedAria: "Quick Trip Packing Essentials",
			includedEyebrow: "Quick Trip Packing Essentials",
			includedTitle: "Pack for altitude, snow, river air, and long drives.",
			includedCopy:
				"Keep your luggage compact but serious. These essentials help you stay warm, mobile, hydrated, and ready for fast-changing mountain conditions.",
			accommodationEyebrow: "Accommodation",
			accommodationTitle: "Stays planned around altitude, rest, and route flow.",
			accommodationCopy:
				"Every overnight stop supports the next day of movement, from riverside camp energy to warmer recovery nights after high-altitude drives.",
			audienceEyebrow: "Who This Is For",
			audienceTitle: "For travellers who want the big Himachal arc.",
			audienceCopy:
				"This is a high-movement itinerary with adventure, altitude, and road time. It suits guests who want a premium group expedition rather than a slow staycation.",
			audienceCardCopy: "Clear logistics, hosted group energy, and enough wildness to feel earned.",
			wishEyebrow: "Make a Wish",
			wishTitle: "Save your travel profile before you ask for the expedition.",
			wishCopy:
				"Your saved wish gives the YesGenie team the right context for group fit, pickup planning, and activity guidance.",
			wishCardTitle: "Your saved wish helps us plan the mountain details.",
			wishCardCopy:
				"Add your profile once so YesGenie can understand your phone, city, occupation, and travel context before sharing seat and booking guidance.",
			planningTitle: "High-altitude planning stays personal.",
			planningCopy:
				"Once your wish is saved, the team can guide you on route conditions, packing, activity suitability, and next steps with better context.",
			planningNote:
				"Firebase login keeps your email separate from the public form, and your wish data is stored under your own UID.",
			finalEyebrow: "Final Call",
			finalTitle: "The pass, the river, the snowline, the valley, the road back.",
			finalCopy:
				"If this Delhi to high-altitude Himachal arc sounds like your next big yes, save your wish and let the team guide the next step.",
			whatsappInterest:
				"I'm interested in the Ultimate High-Altitude Himachal Expedition. Please share details.",
		});
	}

	if (tripKey === "kasauli-himachal") {
		itinerary = [
			{
				id: "day1",
				day: "Day 1",
				title: "Arrive, Settle, Open Up",
				summary:
					"We begin together with a welcome drink, an opening interaction, a soft journey into the hills, and an evening designed for connection.",
				events: [
					{
						time: "Before Departure",
						title: "Welcome Drink and Opening Interaction",
						body:
							"Everyone gathers before departure for a welcome drink and a light interaction that breaks the ice and creates comfort.",
					},
					{
						time: "On The Way",
						title: "Lunch Stop and Slow Arrival",
						body:
							"A lunch stop gives the group time to ease into the experience before the road carries everyone toward Kasauli.",
					},
					{
						time: "Arrival",
						title: "Check-in, Relaxation, and Group Activities",
						body:
							"Reach Kasauli, check in, rest, and begin with gentle group activities that help people feel grounded.",
					},
					{
						time: "Sunset",
						title: "Chai Conversations and Sunset Painting",
						body:
							"Chai, mountain light, and a painting session create the first shared memory of the trip.",
					},
					{
						time: "Evening",
						title: "Music, Jamming, Drinks, Dancing",
						body:
							"As the sun disappears, the evening flows naturally into music, jamming, drinks, dancing, and shared conversations.",
					},
				],
			},
			{
				id: "day2",
				day: "Day 2",
				title: "Play, Connect, Explore",
				summary:
					"Breakfast under mountain skies, a shared trek, quiet reset time, Walk With A Stranger, and a gratitude circle that becomes the emotional high point.",
				events: [
					{
						time: "Morning",
						title: "Slow Breakfast",
						body: "The morning begins slowly with breakfast under mountain skies and space to arrive fully into the day.",
					},
					{
						time: "Late Morning",
						title: "Shared Trekking Experience",
						body:
							"The group heads out for a shared trek, moving together through fresh air, small pauses, and easy conversations.",
					},
					{
						time: "Afternoon",
						title: "Relaxation and Reflection",
						body: "After returning, the pace softens into rest, quiet moments, and personal reflection.",
					},
					{
						time: "Evening",
						title: "Walk With A Stranger",
						body:
							"A signature YesGenie activity where simple paired walks often lead to the deepest conversations of the journey.",
					},
					{
						time: "Night",
						title: "Music, Stories, Laughter, Gratitude",
						body:
							"The night continues with jamming, drinks, dancing, storytelling, laughter, and a closing gratitude circle.",
					},
				],
			},
			{
				id: "day3",
				day: "Day 3",
				title: "Reflect, Close, Carry Forward",
				summary:
					"The final morning is intentionally slow, with letters, gratitude, chai, farewells, and the feeling of leaving lighter.",
				events: [
					{
						time: "Morning",
						title: "Letters to People You Connected With",
						body:
							"Participants write letters to people they connected with during the journey, preserving the parts that mattered.",
					},
					{
						time: "Late Morning",
						title: "Final Gratitude Circle",
						body:
							"The group comes together one last time to share gratitude, perspective, and small truths from the experience.",
					},
					{
						time: "Before Departure",
						title: "Chai and Farewells",
						body: "One final chai, warm farewells, and a departure that carries new friendships, memories, and clarity forward.",
					},
				],
			},
		];

		promises = [
			{
				code: "SL",
				title: "Slow down without disappearing",
				body: "A mountain escape that leaves room for quiet, creativity, and people.",
			},
			{
				code: "CO",
				title: "Conversations that feel natural",
				body: "Opening interactions, stranger walks, chai, and circles help people connect without pressure.",
			},
			{
				code: "CR",
				title: "Creativity in the hills",
				body: "Sunset painting, music, letters, and reflection turn the trip into something personal.",
			},
			{
				code: "HG",
				title: "Hosted group comfort",
				body: "A dedicated Genie host holds the flow so guests can relax into the experience.",
			},
		];

		included = [
			["AC", "Accommodation", "Comfortable mountain stay arranged for rest, group warmth, and shared spaces."],
			["ME", "Meals", "Planned meals and chai moments that keep the group comfortable and connected."],
			["TR", "Transportation", "Coordinated travel flow for arrival, local movement, and departure."],
			["MU", "Music Experiences", "Jamming, music-led evenings, and atmospheric group moments."],
			["DR", "Drinks", "Curated drink moments during the hosted evening flow."],
			["HO", "Dedicated Genie Host", "A YesGenie host stays with the group throughout the journey."],
		];

		accommodation = [
			{
				title: "Mountain stay for a softer pace",
				body: "The stay is selected to feel warm, social, and calm, with enough comfort for slow mornings and late-night conversations.",
			},
			{
				title: "Shared corners and open-air pauses",
				body: "Common spaces support chai, music, painting, and the quieter moments between planned activities.",
			},
			{
				title: "Hosted coordination",
				body: "Check-in, meals, activity flow, and closing rituals are coordinated so guests can stay present.",
			},
		];

		audience = [
			"Want a short mountain reset with emotional depth",
			"Enjoy conversations, music, creativity, and slow mornings",
			"Are open to meeting strangers in a hosted, comfortable setting",
			"Want to leave with memories, friendships, and a little more clarity",
		];

		Object.assign(pageCopy, {
			tripSlug: "kasauli-himachal",
			heroImage: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=2200&h=1400&fit=crop&auto=format&q=82",
			finalImage: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=1800&h=900&fit=crop&auto=format&q=82",
			planningImage: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=900&h=900&fit=crop&auto=format&q=78",
			heroAria: "Kasauli Himachal experience hero",
			heroEyebrow: "Kasauli, Himachal - 3 Days",
			heroTitle: "Slow Down. Open Up. Leave Lighter.",
			heroSub:
				"A mountain escape designed around conversations, creativity, connection, and moments that stay with you long after the journey ends.",
			heroCardLabel: "Experience Mood",
			heroCardTitle: "A short mountain escape with emotional afterglow.",
			heroCardItems: [
				"Welcome drink and opening interaction before the journey begins.",
				"Sunset painting, chai conversations, music, dancing, and jamming.",
				"Walk With A Stranger and gratitude circles for deeper connection.",
				"Letters, farewells, and a final morning designed to close gently.",
			],
			promiseEyebrow: "Experience Promise",
			promiseTitle: "A trip that helps people soften into themselves.",
			promiseCopy:
				"Kasauli is designed around meaningful group travel: shared rituals, creative expression, and conversations that unfold without pressure.",
			itineraryEyebrow: "Day-wise Itinerary",
			itineraryTitle: "Three days to arrive, open, and carry something forward.",
			itineraryCopy:
				"Tap each day to see how the experience moves from arrival and sunset painting to stranger walks, gratitude, letters, and departure.",
			includedId: "included",
			includedAria: "What your Genie takes care of",
			includedEyebrow: "What Your Genie Takes Care Of",
			includedTitle: "The essentials are held with care.",
			includedCopy:
				"Accommodation, meals, transportation, music experiences, drinks, and a dedicated Genie host are part of the hosted journey.",
			accommodationEyebrow: "Accommodation",
			accommodationTitle: "A stay chosen for comfort, conversation, and calm.",
			accommodationCopy:
				"The accommodation supports both group energy and personal quiet, so the trip can feel social without becoming overwhelming.",
			audienceEyebrow: "Who This Is For",
			audienceTitle: "For people who want a short trip that actually lands.",
			audienceCopy:
				"This experience is for travellers who want mountains, music, reflection, creativity, and a group that feels gently held.",
			audienceCardCopy: "Soft structure, honest moments, and enough space to breathe.",
			wishEyebrow: "Make a Wish",
			wishTitle: "Save your travel profile before you ask for Kasauli.",
			wishCopy:
				"Your saved wish gives the team the right context for group fit, phone coordination, and booking guidance.",
			wishCardTitle: "Your saved wish helps us understand your travel rhythm.",
			wishCardCopy:
				"Add your name, work city, occupation, phone number, Instagram ID, and travel profile once. Your email comes from Firebase login.",
			planningTitle: "Planning stays personal.",
			planningCopy:
				"Once your wish is saved, the YesGenie team can guide you on availability, comfort, and the next step with better context.",
			planningNote:
				"Phone number is requested so the team can coordinate quickly after your invite request or saved wish.",
			finalEyebrow: "Final Call",
			finalTitle: "Come for the hills. Leave with people, stories, and a lighter heart.",
			finalCopy:
				"If Kasauli feels like the pause you have been needing, request an invite and let the Genie help with the next step.",
			whatsappInterest: "I'm interested in the Kasauli, Himachal experience. Please share details.",
		});
	}

	if (tripKey === "patnitop-jammu") {
		itinerary = [
			{
				id: "day1",
				day: "Day 1",
				title: "Arrive and Connect",
				summary:
					"Arrive into Patnitop, settle into the mountain stay, and begin with gentle hosted interactions that help the group feel comfortable.",
				events: [
					{
						time: "Arrival",
						title: "Welcome and Check-in",
						body:
							"Reach the destination, check in, freshen up, and receive a simple experience briefing from the Genie host.",
					},
					{
						time: "Afternoon",
						title: "First Circle and Chai",
						body:
							"A warm opening circle, chai, and low-pressure introductions help the group move from strangers to fellow travellers.",
					},
					{
						time: "Evening",
						title: "Mountain Social",
						body:
							"Music, light activities, dinner, and conversations create the first shared memory of the Patnitop experience.",
					},
				],
			},
			{
				id: "day2",
				day: "Day 2",
				title: "Explore and Experience",
				summary:
					"A full day for fresh mountain air, scenic exploration, hosted connection activities, and an evening designed around shared stories.",
				events: [
					{
						time: "Morning",
						title: "Slow Breakfast and Scenic Start",
						body:
							"Begin with breakfast, fresh air, and a clear day briefing before stepping into the destination at a comfortable pace.",
					},
					{
						time: "Daytime",
						title: "Local Exploration",
						body:
							"Explore Patnitop's natural surroundings, viewpoints, forested paths, and seasonal experiences based on conditions.",
					},
					{
						time: "Evening",
						title: "Hosted Connection Night",
						body:
							"Return for rest, music, group-led prompts, storytelling, and an evening that keeps the energy warm and grounded.",
					},
				],
			},
			{
				id: "day3",
				day: "Day 3",
				title: "Reflect and Return",
				summary:
					"The final morning gives the group time to reflect, exchange memories, close the experience, and return with something changed.",
				events: [
					{
						time: "Morning",
						title: "Reflection Breakfast",
						body:
							"A slow breakfast and guided reflection help guests name what they are carrying back from the journey.",
					},
					{
						time: "Late Morning",
						title: "Closing Circle",
						body:
							"The group closes with gratitude, acknowledgements, and a few final moments together before departure.",
					},
					{
						time: "Departure",
						title: "Return Journey",
						body:
							"Depart from Patnitop with new friendships, fresh mountain air still in memory, and a different inner pace.",
					},
				],
			},
		];

		promises = [
			{
				code: "BR",
				title: "Fresh mountain air, cleaner headspace",
				body: "Patnitop is framed as a pause from the usual pace, with enough movement to feel alive.",
			},
			{
				code: "FR",
				title: "Friendships without pressure",
				body: "Hosted circles, shared meals, and natural prompts help the group connect gently.",
			},
			{
				code: "EX",
				title: "Exploration with room to breathe",
				body: "The framework leaves space for scenic walks, viewpoints, local conditions, and seasonal magic.",
			},
			{
				code: "RT",
				title: "Return different",
				body: "The closing flow is designed to help guests carry memories, perspective, and warmth back home.",
			},
		];

		included = [
			["AC", "Accommodation", "Comfortable hosted stay selected for warmth, rest, and group flow."],
			["ME", "Meals", "Planned meals and chai moments during the experience."],
			["TR", "Transportation", "Coordinated travel and destination movement as per the final route plan."],
			["EX", "Curated Experiences", "Scenic exploration, group prompts, music, and reflection moments."],
			["HO", "Dedicated Genie Host", "A YesGenie host holds the pace, comfort, and coordination throughout."],
			["UP", "Pre-trip Updates", "Final route, packing, timing, and activity details shared before departure."],
		];

		accommodation = [
			{
				title: "Comfortable mountain base",
				body: "The stay is planned as a calm base for fresh mornings, restful evenings, and easy access to the group flow.",
			},
			{
				title: "Shared spaces for hosted moments",
				body: "Common areas support opening circles, music, storytelling, and warm unplanned conversations.",
			},
			{
				title: "Ready for final content updates",
				body: "The page framework is production ready while remaining easy to update when exact property and route details are finalized.",
			},
		];

		audience = [
			"Want mountain air, comfort, and a hosted group setting",
			"Prefer a short escape that balances exploration with rest",
			"Are open to new friendships and reflective moments",
			"Want a production-ready plan that can adapt to final route details",
		];

		Object.assign(pageCopy, {
			tripSlug: "patnitop-jammu",
			heroImage: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=2200&h=1400&fit=crop&auto=format&q=82",
			finalImage: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1800&h=900&fit=crop&auto=format&q=78",
			planningImage: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=900&h=900&fit=crop&auto=format&q=78",
			heroAria: "Patnitop Jammu experience hero",
			heroEyebrow: "Patnitop, Jammu - 3 Days",
			heroTitle: "Breathe Deeper. Wander Further. Return Different.",
			heroSub:
				"A hosted mountain framework for fresh air, scenic movement, new friendships, and reflective moments that can evolve as final trip details are locked.",
			heroCardLabel: "Experience Mood",
			heroCardTitle: "A mountain reset designed to feel complete, even before every detail is final.",
			heroCardItems: [
				"Day 1 opens with arrival, check-in, chai, and group comfort.",
				"Day 2 holds scenic exploration and hosted connection moments.",
				"Day 3 closes with reflection, gratitude, and a return journey.",
				"Content is production ready and easy to refine as route details are finalized.",
			],
			promiseEyebrow: "Experience Promise",
			promiseTitle: "A clear framework for a trip that still has room to breathe.",
			promiseCopy:
				"Patnitop is shaped as a premium placeholder-ready destination page: polished now, flexible later, and aligned with the YesGenie experience philosophy.",
			itineraryEyebrow: "Day-wise Itinerary",
			itineraryTitle: "A complete three-day rhythm, ready for final route details.",
			itineraryCopy:
				"Tap each day to explore the current production-ready framework for arrival, exploration, reflection, and return.",
			includedId: "included",
			includedAria: "What's included",
			includedEyebrow: "What's Included",
			includedTitle: "The trip framework is already held.",
			includedCopy:
				"Accommodation, meals, transportation, curated experiences, hosting, and pre-trip updates are planned into the experience structure.",
			accommodationEyebrow: "Accommodation",
			accommodationTitle: "A mountain base for rest, stories, and easy updates.",
			accommodationCopy:
				"The accommodation section is designed to remain polished now and simple to update when the final stay partner is confirmed.",
			audienceEyebrow: "Who This Is For",
			audienceTitle: "For travellers who want a short mountain reset with room for surprise.",
			audienceCopy:
				"This is for guests who want scenic exploration, warm group energy, fresh air, and a guided experience that can adapt gracefully.",
			audienceCardCopy: "A polished framework, hosted comfort, and destination details that can evolve.",
			wishEyebrow: "Make a Wish",
			wishTitle: "Save your travel profile before you ask for Patnitop.",
			wishCopy:
				"Your saved wish helps YesGenie understand your fit, phone coordination needs, and interest as final details are released.",
			wishCardTitle: "Your saved wish keeps you close to the next update.",
			wishCardCopy:
				"Add your profile once so the team can contact you when route, stay, and availability details are ready.",
			planningTitle: "Planning can evolve without feeling unfinished.",
			planningCopy:
				"This destination page is ready for visitors now, while exact itinerary details can be replaced later through content updates.",
			planningNote:
				"Phone number is requested so the team can coordinate quickly after your invite request or saved wish.",
			finalEyebrow: "Final Call",
			finalTitle: "Fresh air. New people. A version of you that returns a little different.",
			finalCopy:
				"If Patnitop feels like your next reset, request an invite and stay close as the final departure details open.",
			whatsappInterest: "I'm interested in the Patnitop, Jammu experience. Please share details.",
		});
	}

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
			pageCopy.whatsappInterest,
		].join("\n");
	};

	const getWhatsAppUrl = () => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(getWhatsAppMessage())}`;

	const isQuizComplete = () => quizQuestions.every((q) => Boolean(state.answers[q.key]));

	const Hero = () => `
		<section class="hero" id="top" aria-label="${escapeHtml(pageCopy.heroAria)}" style="--trip-hero-img: url('${escapeHtml(pageCopy.heroImage)}')">
			<div class="container hero__grid">
				<div>
					<div class="eyebrow">${escapeHtml(pageCopy.heroEyebrow)}</div>
					<h1>${escapeHtml(pageCopy.heroTitle)}</h1>
					<p class="hero__sub">
						${escapeHtml(pageCopy.heroSub)}
					</p>
					<div class="hero__actions">
						<button class="button button--primary" type="button" data-invite-trip="${escapeHtml(pageCopy.tripSlug)}">Request Invite</button>
						<a class="button button--primary" href="/#wish-quiz">Make a Wish</a>
						<button class="button button--secondary" type="button" data-scroll="#itinerary">View Itinerary</button>
					</div>
				</div>
				<aside class="hero-card" aria-label="Experience snapshot">
					<div class="hero-card__label">${escapeHtml(pageCopy.heroCardLabel)}</div>
					<h2 class="hero-card__title">${escapeHtml(pageCopy.heroCardTitle)}</h2>
					<ul class="hero-card__list">
						${pageCopy.heroCardItems.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
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
					pageCopy.promiseEyebrow,
					pageCopy.promiseTitle,
					pageCopy.promiseCopy
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
					pageCopy.itineraryEyebrow,
					pageCopy.itineraryTitle,
					pageCopy.itineraryCopy
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
		<section class="section soft-band" id="${escapeHtml(pageCopy.includedId)}" aria-label="${escapeHtml(pageCopy.includedAria)}">
			<div class="container">
				${SectionHead(
					pageCopy.includedEyebrow,
					pageCopy.includedTitle,
					pageCopy.includedCopy
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

	const AccommodationSection = () => `
		<section class="section section--tight" id="stay" aria-label="Accommodation">
			<div class="container">
				${SectionHead(
					pageCopy.accommodationEyebrow,
					pageCopy.accommodationTitle,
					pageCopy.accommodationCopy
				)}
				<div class="stay-grid">
					<div class="stay-visual" aria-hidden="true" style="--trip-stay-img: url('${escapeHtml(pageCopy.planningImage)}')"></div>
					<div class="stay-list">
						${accommodation
							.map(
								(item, index) => `
									<article class="stay-card">
										<div class="mini-icon" aria-hidden="true">${String(index + 1).padStart(2, "0")}</div>
										<div>
											<h3>${escapeHtml(item.title)}</h3>
											<p>${escapeHtml(item.body)}</p>
										</div>
									</article>
								`
							)
							.join("")}
					</div>
				</div>
			</div>
		</section>
	`;

	const AudienceSection = () => `
		<section class="section section--tight" aria-label="Who this is for">
			<div class="container">
				${SectionHead(
					pageCopy.audienceEyebrow,
					pageCopy.audienceTitle,
					pageCopy.audienceCopy
				)}
				<div class="audience-grid">
					${audience
						.map(
							(item, index) => `
								<article class="audience-card">
									<div class="mini-icon" aria-hidden="true">${String(index + 1).padStart(2, "0")}</div>
									<div>
										<h3>${escapeHtml(item)}</h3>
										<p>${escapeHtml(pageCopy.audienceCardCopy)}</p>
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
					pageCopy.wishEyebrow,
					pageCopy.wishTitle,
					pageCopy.wishCopy
				)}
				<div class="quiz-wrap quiz-wrap--cta">
					<div class="quiz-card quiz-card--cta">
						<div class="mini-icon" aria-hidden="true">YG</div>
						<h3>${escapeHtml(pageCopy.wishCardTitle)}</h3>
						<p>
							${escapeHtml(pageCopy.wishCardCopy)}
						</p>
						<div class="quiz-actions">
							<a class="button button--primary" href="/#wish-quiz">Open Make a Wish Form</a>
							<a class="button button--secondary" href="/dashboard">View Dashboard</a>
						</div>
					</div>
					<aside class="whatsapp-card" aria-label="${escapeHtml(pageCopy.heroTitle)} planning note" style="--trip-planning-img: url('${escapeHtml(pageCopy.planningImage)}')">
						<h3>${escapeHtml(pageCopy.planningTitle)}</h3>
						<p>
							${escapeHtml(pageCopy.planningCopy)}
						</p>
						<a class="button button--secondary" href="/login?mode=create">Create Account</a>
						<div class="preview-message">${escapeHtml(pageCopy.planningNote)}</div>
					</aside>
				</div>
			</div>
		</section>
	`;

	const WhatsAppCTA = () => `
		<aside class="whatsapp-card" aria-label="WhatsApp message preview" style="--trip-planning-img: url('${escapeHtml(pageCopy.planningImage)}')">
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
				<div class="final-cta" style="--trip-final-img: url('${escapeHtml(pageCopy.finalImage)}')">
					<div class="eyebrow">${escapeHtml(pageCopy.finalEyebrow)}</div>
					<h2>${escapeHtml(pageCopy.finalTitle)}</h2>
					<p>
						${escapeHtml(pageCopy.finalCopy)}
					</p>
					<div class="final-cta__actions">
						<button class="button button--primary" type="button" data-invite-trip="${escapeHtml(pageCopy.tripSlug)}">Request Invite</button>
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
			AccommodationSection(),
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
