"use strict";
const pregnancyLength = 2; // 2 months
const minAgeForPregnancy = 4; // Age at which a female cat can first get pregnant; 4 months
const pregnancyDelay = 4; // A female cat can have 3 litters a year, meaning a cat can get pregnant every 4 months
const maxAgeForPregnancy = 120; // 120 months = 10 years;
const numberOfIterations = 24; // We are trying to find out how many descendants will a cat have after 18 months
class Cat {
    constructor(numOfKittensInALitter) {
        this.age = 1;
        this.isPregnant = false;
        this.pregnancyLength = 0;
        // Since the cat hasn't been pregnant yet, we'll just use infinity
        this.timeSinceLastPregnancy = Number.POSITIVE_INFINITY;
        this.numOfKittensInALitter = numOfKittensInALitter;
    }
    haveKittens() {
        // Get the min and max number of kittens a cat can have
        const minNumOfKittens = this.numOfKittensInALitter[0];
        const maxNumOfKittens = this.numOfKittensInALitter[1];
        // Get a random number between them
        const numberOfKittens = Math.floor(Math.random() * (maxNumOfKittens - minNumOfKittens)) +
            minNumOfKittens;
        // Create an array with length of kittens and fill it with new kittens
        const kittens = Array.from({ length: numberOfKittens }).map(() => new Cat(this.numOfKittensInALitter));
        // Reset this
        this.isPregnant = false;
        return kittens;
    }
    update() {
        // An array for children
        let newKittens = [];
        // Check if the cat is pregnant
        if (this.isPregnant) {
            // console.log('pregnant', this.age);
            // Check if the cat is at the end of its pregnancy
            if (this.pregnancyLength >= pregnancyLength) {
                // console.log('had kids', this.age);
                newKittens = this.haveKittens();
            }
            else {
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
        if (newKittens)
            return newKittens;
    }
}
// The average number of kittens in a litter is 4 to 6
const simulatePopulationGrowth = (numOfKittensInALitter = [4, 6]) => {
    // This array will hold the number of cats at each generation
    const chartData = [1];
    // Start with one cat
    const cats = [new Cat(numOfKittensInALitter)];
    // Loop until the end of simulation
    for (let month = 0; month < numberOfIterations; month++) {
        const newKittens = [];
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
        // Save the current population size (dont count the starting cat)
        chartData.push(cats.length - 1);
    }
    return chartData;
};
// Create trace for maximum population size
const maxPopSizeTrace = {
    x: Array.from({ length: numberOfIterations + 1 }).map((_, i) => i),
    y: simulatePopulationGrowth([6, 6]),
    mode: 'lines+markers',
    name: '6 kittens',
    line: {
        color: 'red',
    },
};
// Create trace for average population size
const avgPopSizeTrace = {
    x: Array.from({ length: numberOfIterations + 1 }).map((_, i) => i),
    y: simulatePopulationGrowth([5, 5]),
    mode: 'lines+markers',
    name: '5 kittens',
    line: {
        color: 'orange',
    },
};
// Create trace for minimum population size
const minPopSizeTrace = {
    x: Array.from({ length: numberOfIterations + 1 }).map((_, i) => i),
    y: simulatePopulationGrowth([4, 4]),
    mode: 'lines+markers',
    name: '4 kittens',
    line: {
        color: 'blue',
    },
};
const data = [maxPopSizeTrace, avgPopSizeTrace, minPopSizeTrace];
const layout = {
    title: `Descendants of a cat (${numberOfIterations} months)`,
    xaxis: {
        title: 'Time (Months)',
    },
    yaxis: {
        title: 'Number of descendants',
    },
};
// Plot the graphs
Plotly.newPlot('plot', data, layout, { displayModeBar: false });
