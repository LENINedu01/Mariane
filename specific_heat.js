/**
 * Calculates specific heat using Siebel's formula.
 * Cp = 0.008 * waterContent + 0.20
 * @param {number} waterContent - Percentage of water (e.g., 75 for 75%).
 * @returns {number} Calculated specific heat.
 */
function calculateSiebel(waterContent) {
    if (typeof waterContent !== 'number' || waterContent < 0 || waterContent > 100) {
        // console.error("Invalid input for waterContent. Please provide a number between 0 and 100.");
        return NaN;
    }
    return 0.008 * waterContent + 0.20;
}

/**
 * Calculates specific heat using Charm's formula.
 * Cp = massFractionWater * 1.0 + massFractionSolids * 0.35
 * @param {number} massFractionWater - Mass fraction of water (decimal, e.g., 0.75 for 75%).
 * @param {number} massFractionSolids - Mass fraction of solids (decimal, e.g., 0.25 for 25%).
 * @returns {number} Calculated specific heat.
 */
function calculateCharm(massFractionWater, massFractionSolids) {
    if (typeof massFractionWater !== 'number' || massFractionWater < 0 || massFractionWater > 1 ||
        typeof massFractionSolids !== 'number' || massFractionSolids < 0 || massFractionSolids > 1) {
        // console.error("Invalid input for mass fractions. Please provide numbers between 0 and 1.");
        return NaN;
    }
    // Optional: Check if fractions sum up to approximately 1
    // if (Math.abs(massFractionWater + massFractionSolids - 1.0) > 1e-9) {
    //     console.warn("Mass fractions do not sum to 1.");
    // }
    return massFractionWater * 1.0 + massFractionSolids * 0.35;
}

/**
 * Calculates specific heat using Heldman & Singh's formula.
 * Cp = Σ (massFraction_i * Cp_i)
 * @param {Array<Object>} components - Array of objects, each with massFraction and specificHeatValue.
 *   Example: [{ massFraction: 0.75, specificHeatValue: 4.18 }, { massFraction: 0.25, specificHeatValue: 1.5 }]
 * @returns {number} Calculated specific heat.
 */
function calculateHeldmanSingh(components) {
    if (!Array.isArray(components) || components.length === 0) {
        // console.error("Invalid input for components. Please provide a non-empty array of components.");
        return NaN;
    }

    let totalSpecificHeat = 0;
    for (const component of components) {
        if (typeof component !== 'object' || component === null ||
            typeof component.massFraction !== 'number' || component.massFraction < 0 || component.massFraction > 1 ||
            typeof component.specificHeatValue !== 'number' || component.specificHeatValue < 0) {
            // console.error("Invalid component data:", component);
            return NaN;
        }
        totalSpecificHeat += component.massFraction * component.specificHeatValue;
    }
    return totalSpecificHeat;
}

/**
 * Calculates specific heat using Choi & Okos' formula with predefined specific heat values.
 * Cp = Σ (massFraction_i * Cp_i)
 * @param {Array<Object>} components - Array of objects, each with name and massFraction.
 *   Example: [{ name: "water", massFraction: 0.75 }, { name: "protein", massFraction: 0.15 }]
 * @returns {number} Calculated specific heat.
 */
function calculateChoiOkos(components) {
    if (!Array.isArray(components) || components.length === 0) {
        // console.error("Invalid input for components. Please provide a non-empty array of components.");
        return NaN;
    }

    const specificHeatValues = {
        water: 4.18, // kJ/kg·K
        protein: 2.00, // kJ/kg·K
        fat: 1.90, // kJ/kg·K
        carbohydrate: 1.55, // kJ/kg·K
        ash: 1.09  // kJ/kg·K
    };

    let totalSpecificHeat = 0;
    let totalMassFraction = 0;

    for (const component of components) {
        if (typeof component !== 'object' || component === null ||
            typeof component.name !== 'string' ||
            typeof component.massFraction !== 'number' || component.massFraction < 0 || component.massFraction > 1) {
            // console.error("Invalid component data:", component);
            return NaN;
        }

        const cpValue = specificHeatValues[component.name.toLowerCase()];
        if (cpValue === undefined) {
            // console.error(`Specific heat value for component '${component.name}' is not defined.`);
            return NaN; // Or handle more gracefully, e.g., allow user to input Cp for unknown components
        }

        totalSpecificHeat += component.massFraction * cpValue;
        totalMassFraction += component.massFraction;
    }

    // Optional: Check if total mass fraction is approximately 1
    // if (Math.abs(totalMassFraction - 1.0) > 1e-9) { // Allowing for small floating point inaccuracies
    //     console.warn(`Total mass fraction is ${totalMassFraction}, which is not 1. The result will be normalized if considered as weighted average, or check inputs.`);
    // }

    return totalSpecificHeat;
}

// Example Usage (can be commented out or removed for production)
/*
console.log("Siebel (75% water):", calculateSiebel(75)); // Expected: 0.008 * 75 + 0.20 = 0.6 + 0.20 = 0.8
console.log("Siebel (invalid input):", calculateSiebel("abc"));

console.log("Charm (0.75 water, 0.25 solids):", calculateCharm(0.75, 0.25)); // Expected: 0.75*1 + 0.25*0.35 = 0.75 + 0.0875 = 0.8375
console.log("Charm (invalid input):", calculateCharm(-0.1, 0.25));

const heldmanComponents = [
    { massFraction: 0.75, specificHeatValue: 4.18 }, // Water
    { massFraction: 0.25, specificHeatValue: 1.50 }  // Solids (example)
];
console.log("Heldman & Singh:", calculateHeldmanSingh(heldmanComponents)); // Expected: 0.75*4.18 + 0.25*1.5 = 3.135 + 0.375 = 3.51

const choiOkosComponents = [
    { name: "water", massFraction: 0.60 },
    { name: "protein", massFraction: 0.15 },
    { name: "fat", massFraction: 0.10 },
    { name: "carbohydrate", massFraction: 0.12 },
    { name: "ash", massFraction: 0.03 }
];
// Expected: 0.6*4.18 + 0.15*2.00 + 0.10*1.90 + 0.12*1.55 + 0.03*1.09 = 2.508 + 0.3 + 0.19 + 0.186 + 0.0327 = 3.2167
console.log("Choi & Okos:", calculateChoiOkos(choiOkosComponents));

const choiOkosComponentsInvalid = [
    { name: "water", massFraction: 0.60 },
    { name: "sugar", massFraction: 0.15 } // "sugar" is not a predefined component
];
console.log("Choi & Okos (invalid component name):", calculateChoiOkos(choiOkosComponentsInvalid));
*/
