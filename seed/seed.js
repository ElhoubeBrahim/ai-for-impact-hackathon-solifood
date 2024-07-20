const admin = require("firebase-admin");
const { faker } = require("@faker-js/faker");

// initialization
const projectId = "ai-for-impact-solifood-ca41a";
process.env["FIRESTORE_EMULATOR_HOST"] = "localhost:8080";
process.env["FIREBASE_AUTH_EMULATOR_HOST"] = "localhost:9099";
process.env["STORAGE_EMULATOR_HOST"] = "localhost:9199";

admin.initializeApp({
	projectId,
	credential: admin.credential.applicationDefault(),
});

const db = admin.firestore();
const auth = admin.auth();

const baskets = require("./data.json");

const users = [];

async function seedUsers(count) {
	for (let i = 0; i < count; i++) {
		const firstName = faker.person.firstName();
		const lastName = faker.person.lastName();

		const user = {
			id: faker.string.alphanumeric({ length: 28 }),
			firstName: firstName,
			lastName: lastName,
			picture: "/assets/user.svg",
			email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@gmail.com`,
			location: {
				lat: faker.location.latitude(),
				lng: faker.location.longitude(),
			},
			ratings: [],
			blocked: false,
			lastLogin: admin.firestore.Timestamp.now(),
			joinedAt: admin.firestore.Timestamp.now(),
		};

		// Authenticate user
		await auth.createUser({
			uid: user.id,
			displayName: user.firstName + " " + user.lastName,
			email: user.email,
			emailVerified: true,
			password: "password",
		});

		// Create user
		await db.collection("users").doc(user.id).set(user, { merge: true });
		users.push(user);
	}
}

async function seedBaskets() {
	for (let i = 0; i < baskets.length; i++) {
		const basket = baskets[i];
		basket.image = basket.image.replace("./", "");

		// construct image firebase storage path
		const image =
			"http://127.0.0.1:9199/ai-for-impact-solifood-ca41a.appspot.com/baskets%2F" +
			basket.image +
			"?alt=media";

		const basketData = {
			id: faker.string.alphanumeric({ length: 28 }),
			title: basket.title,
			description: basket.description,
			images: [image],
			realPrice: faker.number.int({ min: 1, max: 100 }),
			price: faker.number.int({ min: 1, max: 100 }),
			location: {
				lat: faker.location.latitude({
					max: 35,
					min: 20,
				}),
				lon: faker.location.longitude({
					min: -7,
					max: 10,
				}),
			},
			available: true,
			blocked: false,
			tags: basket.tags,
			ingredients: basket.ingredients,
			createdBy: faker.helpers.arrayElement(users),
			claimedBy: null,
			expiredAt: admin.firestore.Timestamp.fromDate(faker.date.future()),
			soldAt: null,
			createdAt: admin.firestore.Timestamp.fromDate(faker.date.recent()),
		};

		// Create basket
		await db
			.collection("baskets")
			.doc(basketData.id)
			.set(basketData, { merge: true });
	}
}

async function main() {
	// Seed users
	console.log("🌱 Seeding users ...");
	await seedUsers(10);

	// Seed baskets
	console.log("🌱 Seeding baskets ...");
	await seedBaskets();
}

main();
