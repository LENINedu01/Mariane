/**
 * Calculates thermal conductivity using Sweat's model for food products.
 * k = 0.55 * Xw + 0.17 * Xp + 0.15 * Xf + 0.14 * Xc + 0.13 * Xa
 * where Xw, Xp, Xf, Xc, Xa are mass fractions of water, protein, fat, carbohydrate, and ash, respectively.
 *
 * @param {object} components - An object containing the mass fractions of the components.
 *   Example: { water: 0.6, protein: 0.1, fat: 0.05, carbohydrate: 0.2, ash: 0.05 }
 *   Values should be decimals (e.g., 0.75 for 75%).
 * @returns {number} Calculated thermal conductivity (k) in W/m·K (assuming coefficients are for this unit).
 *                   Returns NaN if inputs are invalid.
 */
function calculateSweatThermalConductivity(components) {
    if (typeof components !== 'object' || components === null) {
        // console.error("Invalid input: components must be an object.");
        return NaN;
    }

    const massFractions = {
        water: components.water || 0,
        protein: components.protein || 0,
        fat: components.fat || 0,
        carbohydrate: components.carbohydrate || 0,
        ash: components.ash || 0
    };

    // Validate that all provided component values are numbers and within typical range (0-1)
    for (const key in massFractions) {
        if (typeof massFractions[key] !== 'number' || massFractions[key] < 0 || massFractions[key] > 1) {
            // console.error(`Invalid mass fraction for ${key}: ${massFractions[key]}. Must be a number between 0 and 1.`);
            return NaN;
        }
    }

    // Optional: Check if the sum of mass fractions is approximately 1
    // const totalMassFraction = Object.values(massFractions).reduce((sum, val) => sum + val, 0);
    // if (Math.abs(totalMassFraction - 1.0) > 1e-9 && totalMassFraction > 0) { // Allow sum to be 0 if all inputs are 0
    //     console.warn(`Sum of mass fractions (${totalMassFraction}) is not close to 1. Ensure inputs are correct.`);
    //     // Depending on requirements, one might want to normalize or return NaN here.
    //     // For this formula, it's typically applied to the given fractions directly.
    // }


    const k = 0.55 * massFractions.water +
              0.17 * massFractions.protein +
              0.15 * massFractions.fat +
              0.14 * massFractions.carbohydrate +
              0.13 * massFractions.ash;

    return k;
}

// Example Usage (can be commented out or removed for production)
/*
const exampleComponents1 = {
    water: 0.60,
    protein: 0.10,
    fat: 0.05,
    carbohydrate: 0.20,
    ash: 0.05
};
// Expected: 0.55*0.6 + 0.17*0.1 + 0.15*0.05 + 0.14*0.2 + 0.13*0.05
//         = 0.33    + 0.017   + 0.0075  + 0.028   + 0.0065
//         = 0.389 W/m·K
console.log("Sweat (Example 1):", calculateSweatThermalConductivity(exampleComponents1));

const exampleComponents2 = {
    water: 0.85,
    protein: 0.03,
    fat: 0.02,
    carbohydrate: 0.08,
    ash: 0.02
    // Sum = 1.00
};
// Expected: 0.55*0.85 + 0.17*0.03 + 0.15*0.02 + 0.14*0.08 + 0.13*0.02
//         = 0.4675  + 0.0051  + 0.003   + 0.0112  + 0.0026
//         = 0.4894 W/m·K
console.log("Sweat (Example 2):", calculateSweatThermalConductivity(exampleComponents2));

const exampleComponentsOnlyWater = { water: 1.0 };
// Expected: 0.55 * 1.0 = 0.55
console.log("Sweat (Only Water):", calculateSweatThermalConductivity(exampleComponentsOnlyWater));

const exampleComponentsMissing = { water: 0.7, protein: 0.3 }; // Fat, Carb, Ash will be 0
// Expected: 0.55*0.7 + 0.17*0.3 = 0.385 + 0.051 = 0.436
console.log("Sweat (Missing Components):", calculateSweatThermalConductivity(exampleComponentsMissing));

const invalidComponents1 = { water: "text", protein: 0.1 };
console.log("Sweat (Invalid type):", calculateSweatThermalConductivity(invalidComponents1)); // Expected: NaN

const invalidComponents2 = { water: 1.5, protein: 0.1 }; // Water > 1
console.log("Sweat (Invalid value > 1):", calculateSweatThermalConductivity(invalidComponents2)); // Expected: NaN

const invalidComponents3 = null;
console.log("Sweat (Null input):", calculateSweatThermalConductivity(invalidComponents3)); // Expected: NaN

const emptyComponents = {};
console.log("Sweat (Empty object):", calculateSweatThermalConductivity(emptyComponents)); // Expected: 0
*/
