const admin = require("firebase-admin");
const { faker } = require("@faker-js/faker");

// Get environment from command line
const args = process.argv.slice(2);
const env = args[0] || "dev";

console.log("🚀 Seeding database in " + env + " environment ...");

// initialization
if (env === "dev") {
	const projectId = "ai-for-impact-solifood-ca41a";
	process.env["FIRESTORE_EMULATOR_HOST"] = "localhost:8080";
	process.env["FIREBASE_AUTH_EMULATOR_HOST"] = "localhost:9099";
	process.env["STORAGE_EMULATOR_HOST"] = "localhost:9199";

	admin.initializeApp({
		projectId,
		credential: admin.credential.applicationDefault(),
	});
} else {
	var serviceAccount = require("./account.json"); // path to the service account key; Make sure to add it to .gitignore
	admin.initializeApp({
		credential: admin.credential.cert(serviceAccount),
	});
}

const db = admin.firestore();
const auth = admin.auth();

const baskets = require("./data.json");

const users = [];

async function seedUsers(count) {
	// Create super admin user
	const superAdmin = {
		id: faker.string.alphanumeric({ length: 28 }),
		firstName: "Super",
		lastName: "Admin",
		picture: "/assets/user.svg",
		email: "admin@solifood.com",
		location: {
			lat: faker.location.latitude(),
			lon: faker.location.longitude(),
		},
		ratings: [],
		blocked: false,
		isSuperAdmin: true,
		lastLogin: admin.firestore.Timestamp.now(),
		joinedAt: admin.firestore.Timestamp.now(),
	};

	// Authenticate super admin
	await auth.createUser({
		uid: superAdmin.id,
		displayName: superAdmin.firstName + " " + superAdmin.lastName,
		email: superAdmin.email,
		emailVerified: true,
		password: "password",
	});

	// Create super admin
	await db.collection("users").doc(superAdmin.id).set(superAdmin, { merge: true });

	// Create other users
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
				lon: faker.location.longitude(),
			},
			ratings: [],
			blocked: false,
			isSuperAdmin: false,
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
		let image = "";
		if (env === "dev") {
			image =
				"http://127.0.0.1:9199/ai-for-impact-solifood-ca41a.appspot.com/baskets%2F" +
				basket.image +
				"?alt=media";
		} else {
			image =
				"https://firebasestorage.googleapis.com/v0/b/ai-for-impact-solifood-ca41a.appspot.com/o/baskets%2F" +
				basket.image +
				"?alt=media";
		}

		const basketData = {
			id: faker.string.alphanumeric({ length: 28 }),
			title: basket.title,
			description: basket.description,
			images: [image],
			realPrice: faker.number.int({ min: 1, max: 100 }),
			price: faker.number.int({ min: 1, max: 100 }),
			location: {
				lat: faker.location.latitude({
					max: 33.70297802572261,
					min: 33.44656819102574,
				}),
				lon: faker.location.longitude({
					min: -7.602389596191251,
					max: -7.397177843498806,
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
