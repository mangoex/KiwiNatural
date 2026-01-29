export enum Category {
  ENSALADAS = 'Ensaladas',
  COMBOS = 'Combos',
  EMPAREDADOS = 'Emparedados',
  OMELETTES = 'Omelettes',
  JUGOS = 'Jugoterapia',
  SMOOTHIES = 'Smoothies',
  POSTRES = 'Frutas & Postres',
}

export interface Macros {
  protein: number;
  carbs: number;
  fat: number;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  image: string;
  isPopular?: boolean;
  calories?: number;
  macros?: Macros; // New field for the planner
}

export interface CartItem extends MenuItem {
  quantity: number;
}

// NutriPlanner Types
export interface UserProfile {
  gender: 'M' | 'F';
  age: number;
  height: number; // cm
  weight: number; // kg
  activityLevel: 'sedentary' | 'moderate' | 'active';
  goal: 'lose_fat' | 'muscle_gain' | 'maintain';
  mealsPerDay: number;
}

export interface MacroGoals extends Macros {
  calories: number;
}

export interface MealEntry {
  text: string;
  estimatedMacros: Macros & { calories: number };
  isKiwiItem?: boolean; // If it matches a menu item exactly
  kiwiId?: string; // ID of the matched Kiwi menu item
}

export interface DayPlan {
  breakfast: MealEntry;
  lunch: MealEntry;
  snack: MealEntry;
  dinner: MealEntry;
}

export type WeeklyPlan = DayPlan[];