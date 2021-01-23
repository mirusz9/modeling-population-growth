const pregnancyLength = 2; // 2 months
const minAgeForPregnancy = 4; // Age at which a female cat can first get pregnant; 4 months
const numOfKittensInALitter = [4, 6]; // Number of kittens in a litter; Usually 4 to 6
const pregnancyDelay = 4; // A female cat can have 3 litters a year, meaning a cat can get pregnant every 4 months
const maxAgeForPregnancy = 120; // 120 months = 10 years;
const numberOfIterations = 24; // We are trying to find out how many descendants will a cat have after 18 months
class Cat {
	private age: number; // Age in months
	private isPregnant: boolean; // If the cat is pregnant or not
	private pregnancyLength: number; // How long the cat has been pregnant
	private timeSinceLastPregnancy: number; // The time in months since last pregnancy started

	constructor() {
		this.age = 1;
		this.isPregnant = false;
		this.pregnancyLength = 0;
		// Since the cat hasn't been pregnant yet, we'll just use infinity
		this.timeSinceLastPregnancy = Number.POSITIVE_INFINITY;
	}

	private haveKittens() {
		// Get the min and max number of kittens a cat can have
		const minNumOfKittens = numOfKittensInALitter[0];
		const maxNumOfKittens = numOfKittensInALitter[1];

		// Get a random number between them
		const numberOfKittens =
			Math.floor(Math.random() * (maxNumOfKittens - minNumOfKittens)) +
			minNumOfKittens;

		// Create an array with length of kittens and fill it with new kittens
		const kittens = Array.from({ length: numberOfKittens }).map(
			() => new Cat()
		);

		// Reset this
		this.isPregnant = false;

		return kittens;
	}

	public update() {
		// An array for children
		let newKittens: Cat[] = [];

		// Check if the cat is pregnant
		if (this.isPregnant) {
			// console.log('pregnant', this.age);
			// Check if the cat is at the end of its pregnancy
			if (this.pregnancyLength >= pregnancyLength) {
				// console.log('had kids', this.age);
				newKittens = this.haveKittens();
			} else {
				// Increment time the cat has been pregnant
				this.pregnancyLength++;
			}
		}
		// If the cat is not pregnant and old enough to have children
		else if (this.age >= minAgeForPregnancy) {
			// If enough time has passed since last pregnancy to get pregnant again
			if (this.timeSinceLastPregnancy >= pregnancyDelay) {
				// console.log('just got pregnant', this.age);
				this.isPregnant = true; // The cat is now pregnant
				this.pregnancyLength = 1; // It just got pregnant
				this.timeSinceLastPregnancy = 0;
			}
		}

		this.age++;
		this.timeSinceLastPregnancy++;

		// Return the kittens if there are any
		if (newKittens) return newKittens;
	}
}

// Start with one cat
const cats: Cat[] = [new Cat()];

// Loop until the end of simulation
for (let month = 0; month < numberOfIterations; month++) {
	const newKittens: Cat[] = [];

	// Update all cats
	for (const cat of cats) {
		const kittens = cat.update();

		// If there are any new cats
		if (kittens) {
			// Loop through the new cats
			for (const kitten of kittens) {
				// Add them to the newborn cats array
				newKittens.push(kitten);
			}
		}
	}

	// After updating all cats, let's ad the new cats array
	for (const kitten of newKittens) {
		cats.push(kitten);
	}
}
console.log('Number of descendants:', cats.length - 1);
