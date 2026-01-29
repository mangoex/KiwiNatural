import { GENERIC_FOOD_DB, MENU_ITEMS } from '../constants';
import { MenuItem, UserProfile, MacroGoals, Category } from '../types';

export const calculateGoals = (profile: UserProfile): MacroGoals => {
  // Mifflin-St Jeor Equation
  let bmr = 10 * profile.weight + 6.25 * profile.height - 5 * profile.age;
  bmr += profile.gender === 'M' ? 5 : -161;

  const activityMultipliers = {
    sedentary: 1.2,
    moderate: 1.55,
    active: 1.725
  };

  let tdee = bmr * activityMultipliers[profile.activityLevel];

  // Adjust by goal
  if (profile.goal === 'lose_fat') tdee -= 500;
  if (profile.goal === 'muscle_gain') tdee += 300;

  // Macro split (Approximate 40/30/30 split for simplicity, adjusted slightly)
  // 1g Protein = 4cal, 1g Carb = 4cal, 1g Fat = 9cal
  
  const proteinRatio = profile.goal === 'muscle_gain' ? 0.35 : 0.30;
  const fatRatio = 0.30;
  const carbRatio = 1 - (proteinRatio + fatRatio);

  return {
    calories: Math.round(tdee),
    protein: Math.round((tdee * proteinRatio) / 4),
    fat: Math.round((tdee * fatRatio) / 9),
    carbs: Math.round((tdee * carbRatio) / 4)
  };
};

export const parseFoodText = (text: string) => {
  const lowerText = text.toLowerCase();
  let totalCal = 0, totalP = 0, totalC = 0, totalF = 0;
  
  // Very basic heuristic parser
  // Look for quantity (assume grams if number matches, or "pieza" logic)
  
  // Default portion 100g if not specified
  let portionMultiplier = 1.0; 
  
  // Check for simple gram specification like "150g" or "200"
  const numberMatch = lowerText.match(/(\d+)/);
  if (numberMatch) {
    const qty = parseInt(numberMatch[0]);
    // Reasonable assumption: if number > 10, it's grams. If < 10, it matches "piezas" or cups which we simplify to ~100g units for this demo or specific logic
    if (qty > 10) {
      portionMultiplier = qty / 100;
    }
  }

  // Iterate DB keys to find matches
  let found = false;
  Object.keys(GENERIC_FOOD_DB).forEach(key => {
    if (lowerText.includes(key)) {
      found = true;
      const item = GENERIC_FOOD_DB[key];
      totalCal += item.cal * portionMultiplier;
      totalP += item.p * portionMultiplier;
      totalC += item.c * portionMultiplier;
      totalF += item.f * portionMultiplier;
    }
  });

  // Fallback estimation if no specific keywords found but text exists
  if (!found && text.length > 3) {
    totalCal = 350; // Generic meal guess
    totalP = 20;
    totalC = 30;
    totalF = 12;
  }

  return {
    calories: Math.round(totalCal),
    protein: Math.round(totalP),
    carbs: Math.round(totalC),
    fat: Math.round(totalF)
  };
};

// Define valid categories per meal time for "Nutritionist AI" logic
const MEAL_CATEGORY_MAP: Record<string, Category[]> = {
  breakfast: [Category.OMELETTES, Category.SMOOTHIES, Category.POSTRES, Category.EMPAREDADOS, Category.JUGOS],
  lunch: [Category.ENSALADAS, Category.COMBOS, Category.EMPAREDADOS],
  snack: [Category.JUGOS, Category.SMOOTHIES, Category.POSTRES],
  dinner: [Category.ENSALADAS, Category.EMPAREDADOS, Category.JUGOS]
};

export interface Macros {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

// Find the closest Kiwi Menu item to the target macros with smart logic
export const findKiwiSubstitute = (
  target: Macros, 
  mealType: 'breakfast' | 'lunch' | 'snack' | 'dinner',
  excludeIds: string[] = []
): { item: MenuItem, score: number } => {
  
  const allowedCategories = MEAL_CATEGORY_MAP[mealType];
  const candidates: { item: MenuItem, score: number }[] = [];

  MENU_ITEMS.forEach(item => {
    // 1. Skip if no macros defined (safety)
    if (!item.macros) return;

    // 2. Category Filter
    if (!allowedCategories.includes(item.category)) return;

    // 3. Calculate Distance (Weighted)
    // We prioritize Protein and Calories matching.
    const pDiff = Math.abs(item.macros.protein - target.protein) * 2.0; 
    const calDiff = Math.abs((item.calories || 0) - target.calories) * 1.0;
    const cDiff = Math.abs(item.macros.carbs - target.carbs) * 0.8;
    const fDiff = Math.abs(item.macros.fat - target.fat) * 0.8;

    const totalScore = pDiff + calDiff + cDiff + fDiff;

    candidates.push({ item, score: totalScore });
  });

  // Sort by score ascending (lower is better)
  candidates.sort((a, b) => a.score - b.score);

  // 4. Filter out excluded IDs strictly
  // We do this after collecting all candidates so we know if we are running out of options
  let validCandidates = candidates.filter(c => !excludeIds.includes(c.item.id));

  // If strict filtering removed everything (e.g. user cycled through all options), 
  // allow reusing items but maybe pick from the bottom of the exclusion list?
  // For now, just fallback to all candidates to ensure we always return something.
  if (validCandidates.length === 0) {
     validCandidates = candidates;
  }

  // 5. Variety Logic: Pick randomly from the top 3 best matches
  // This ensures that if there are multiple good options, we don't always pick #1
  const topPicks = validCandidates.slice(0, 3);
  
  if (topPicks.length === 0) {
      // Should not happen unless menu is empty or no categories match
      return { item: MENU_ITEMS[0], score: Infinity };
  }

  const selected = topPicks[Math.floor(Math.random() * topPicks.length)];

  return selected;
};