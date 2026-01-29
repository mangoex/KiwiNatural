import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { UserProfile, MacroGoals, WeeklyPlan, DayPlan, MenuItem } from '../types';
import { calculateGoals, parseFoodText, findKiwiSubstitute, Macros } from '../utils/nutrition';
import { MENU_ITEMS } from '../constants';
import { ArrowRight, Activity, Zap, RefreshCw, Save, CheckCircle, RotateCw, DollarSign, ShoppingBag, FileText } from 'lucide-react';
import { KiwiLogo } from './KiwiLogo';

interface NutriPlannerProps {
  onAddToCart?: (item: MenuItem) => void;
}

const EmptyMeal = { text: '', estimatedMacros: { calories: 0, protein: 0, carbs: 0, fat: 0 } };
const EmptyDay: DayPlan = {
  breakfast: { ...EmptyMeal },
  lunch: { ...EmptyMeal },
  snack: { ...EmptyMeal },
  dinner: { ...EmptyMeal },
};

const NutriPlanner: React.FC<NutriPlannerProps> = ({ onAddToCart }) => {
  const [step, setStep] = useState<number>(0); // 0: Intro, 1: Profile, 2: Plan, 3: Results, 4: Budget
  
  // State
  const [profile, setProfile] = useState<UserProfile>({
    gender: 'M', age: 30, height: 175, weight: 75,
    activityLevel: 'moderate', goal: 'maintain', mealsPerDay: 4
  });
  
  const [goals, setGoals] = useState<MacroGoals | null>(null);
  
  const [plan, setPlan] = useState<WeeklyPlan>(
    Array(7).fill(null).map(() => JSON.parse(JSON.stringify(EmptyDay)))
  );
  
  const [activeDay, setActiveDay] = useState(0);

  // Handlers
  const handleCalculateGoals = () => {
    const calculated = calculateGoals(profile);
    setGoals(calculated);
    setStep(2);
  };

  const handleMealChange = (dayIndex: number, mealType: keyof DayPlan, text: string) => {
    const newPlan = [...plan];
    const macros = parseFoodText(text);
    newPlan[dayIndex][mealType] = {
      text,
      estimatedMacros: macros,
      isKiwiItem: false
    };
    setPlan(newPlan);
  };

  const getIdealMacroTarget = (mealType: keyof DayPlan, dailyGoals: MacroGoals): Macros => {
    let ratio = 0.25;
    if (mealType === 'lunch') ratio = 0.35;
    if (mealType === 'snack') ratio = 0.15;
    if (mealType === 'dinner') ratio = 0.25;

    return {
      calories: dailyGoals.calories * ratio,
      protein: dailyGoals.protein * ratio,
      carbs: dailyGoals.carbs * ratio,
      fat: dailyGoals.fat * ratio
    };
  };

  const suggestKiwiAlternative = (
    dayIndex: number, 
    mealType: keyof DayPlan, 
    idsToExclude: string[] = []
  ): string | null => {
    if (!goals) return null;
    
    const currentMeal = plan[dayIndex][mealType];
    let targetMacros: Macros;

    if (currentMeal.estimatedMacros.calories > 0 && !currentMeal.isKiwiItem) {
       targetMacros = currentMeal.estimatedMacros;
    } else {
       targetMacros = getIdealMacroTarget(mealType, goals);
    }
    
    const { item } = findKiwiSubstitute(targetMacros, mealType as any, idsToExclude);
    
    const newPlan = [...plan];
    newPlan[dayIndex][mealType] = {
      text: item.name + " (Kiwi Menu)",
      estimatedMacros: { 
        calories: item.calories || 0, 
        protein: item.macros?.protein || 0,
        carbs: item.macros?.carbs || 0,
        fat: item.macros?.fat || 0
      },
      isKiwiItem: true,
      kiwiId: item.id
    };
    setPlan(newPlan);

    return item.id; 
  };

  const handleSwapItem = (dayIndex: number, mealType: keyof DayPlan) => {
    const currentMeal = plan[dayIndex][mealType];
    const idsToExclude: string[] = [];
    
    if (currentMeal.isKiwiItem) {
        if (currentMeal.kiwiId) {
            idsToExclude.push(currentMeal.kiwiId);
        } else {
             // Fallback text match if old data format
            const cleanName = currentMeal.text.replace(" (Kiwi Menu)", "");
            const matchedItem = MENU_ITEMS.find(i => i.name === cleanName);
            if (matchedItem) idsToExclude.push(matchedItem.id);
        }
    }

    suggestKiwiAlternative(dayIndex, mealType, idsToExclude);
  };

  const optimizeFullDay = (dayIndex: number) => {
    const usedIds: string[] = [];
    (['breakfast', 'lunch', 'snack', 'dinner'] as const).forEach(meal => {
        const id = suggestKiwiAlternative(dayIndex, meal, usedIds);
        if (id) usedIds.push(id);
    });
  };

  // --- PDF GENERATION ---
  const generatePDF = (mode: 'full' | 'budget') => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Header
    doc.setFillColor(9, 9, 11); // Dark background header
    doc.rect(0, 0, pageWidth, 40, 'F');
    
    doc.setTextColor(132, 204, 22); // Lime 500
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('KIWI NATURAL', 15, 20);
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('NutriPlanner Pro', 15, 28);
    
    if (mode === 'full') {
        doc.setTextColor(10, 10, 10);
        doc.text(`Objetivo: ${profile.goal.toUpperCase().replace('_', ' ')}`, 15, 50);
        doc.text(`Calorías Meta: ${goals?.calories}`, 15, 56);
        
        const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
        
        let startY = 65;
        
        plan.forEach((day, index) => {
            if (startY > 250) {
                doc.addPage();
                startY = 20;
            }
            
            doc.setFillColor(240, 253, 244);
            doc.rect(15, startY, pageWidth - 30, 8, 'F');
            doc.setTextColor(21, 128, 61);
            doc.setFontSize(10);
            doc.setFont('helvetica', 'bold');
            doc.text(`DÍA ${index + 1} - ${days[index]}`, 18, startY + 6);
            
            const rows = [
                ['Desayuno', day.breakfast.text, `${day.breakfast.estimatedMacros.calories} kcal`],
                ['Comida', day.lunch.text, `${day.lunch.estimatedMacros.calories} kcal`],
                ['Snack', day.snack.text, `${day.snack.estimatedMacros.calories} kcal`],
                ['Cena', day.dinner.text, `${day.dinner.estimatedMacros.calories} kcal`],
            ];
            
            autoTable(doc, {
                startY: startY + 10,
                head: [['Momento', 'Platillo', 'Energía']],
                body: rows,
                theme: 'grid',
                headStyles: { fillColor: [63, 63, 70], textColor: 255 },
                styles: { fontSize: 9 },
                margin: { left: 15, right: 15 },
            });
            
            // @ts-ignore
            startY = doc.lastAutoTable.finalY + 10;
        });
        
        doc.save('Kiwi_NutriPlan.pdf');
    } else {
        // Budget PDF
        doc.setTextColor(10, 10, 10);
        doc.setFontSize(14);
        doc.text('Presupuesto Semanal', 15, 50);

        const rows: any[] = [];
        let total = 0;
        
        plan.forEach((day, idx) => {
            (['breakfast', 'lunch', 'snack', 'dinner'] as const).forEach(meal => {
                if (day[meal].isKiwiItem && day[meal].kiwiId) {
                    const item = MENU_ITEMS.find(i => i.id === day[meal].kiwiId);
                    if (item) {
                        rows.push([`Día ${idx + 1} - ${meal}`, item.name, `$${item.price}`]);
                        total += item.price;
                    }
                }
            });
        });

        rows.push(['TOTAL', '', `$${total}`]);

        autoTable(doc, {
            startY: 60,
            head: [['Día/Comida', 'Platillo', 'Precio']],
            body: rows,
            theme: 'striped',
            headStyles: { fillColor: [132, 204, 22], textColor: 0 },
            foot: [['', 'TOTAL', `$${total}`]],
            footStyles: { fillColor: [0, 0, 0], textColor: [132, 204, 22], fontStyle: 'bold' }
        });

        doc.save('Kiwi_Presupuesto.pdf');
    }
  };

  const handleOrderAll = () => {
    if (!onAddToCart) return;
    let count = 0;
    
    plan.forEach(day => {
        (['breakfast', 'lunch', 'snack', 'dinner'] as const).forEach(meal => {
             if (day[meal].isKiwiItem && day[meal].kiwiId) {
                 const item = MENU_ITEMS.find(i => i.id === day[meal].kiwiId);
                 if (item) {
                     onAddToCart(item);
                     count++;
                 }
             }
        });
    });
    alert(`¡Se han agregado ${count} platillos a tu carrito!`);
  };

  const renderIntro = () => (
    <div className="flex flex-col items-center justify-center text-center py-20 animate-fade-in">
       <div className="w-24 h-24 bg-lime-500/10 rounded-full flex items-center justify-center mb-8 neon-glow">
          <Activity className="w-12 h-12 text-lime-500" />
       </div>
       <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">NutriPlanner <span className="text-lime-500">Pro</span></h1>
       <p className="text-xl text-zinc-400 max-w-2xl mb-10">
         El motor de inteligencia nutricional de Kiwi Natural. Diseña, analiza y optimiza tu alimentación con nuestra tecnología de sustitución inteligente.
       </p>
       <button 
         onClick={() => setStep(1)}
         className="px-8 py-4 bg-lime-500 hover:bg-lime-400 text-black font-bold rounded-full transition-all flex items-center gap-2 hover:shadow-[0_0_20px_rgba(132,204,22,0.4)]"
       >
         COMENZAR ANÁLISIS <ArrowRight className="w-5 h-5" />
       </button>
    </div>
  );

  const renderProfile = () => (
    <div className="max-w-2xl mx-auto py-10">
      <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
        <span className="bg-lime-500 text-black w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
        Configuración Biológica
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="space-y-2">
          <label className="text-zinc-400 text-sm">Género</label>
          <div className="flex gap-4">
            {['M', 'F'].map((g) => (
              <button 
                key={g}
                onClick={() => setProfile({...profile, gender: g as 'M'|'F'})}
                className={`flex-1 py-3 rounded-xl border ${profile.gender === g ? 'bg-lime-500 text-black border-lime-500' : 'bg-zinc-900 border-zinc-700 text-zinc-400'}`}
              >
                {g === 'M' ? 'Masculino' : 'Femenino'}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
           <label className="text-zinc-400 text-sm">Edad (años)</label>
           <input type="number" value={profile.age} onChange={e => setProfile({...profile, age: parseInt(e.target.value)})} className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:border-lime-500 outline-none" />
        </div>

        <div className="space-y-2">
           <label className="text-zinc-400 text-sm">Peso (kg)</label>
           <input type="number" value={profile.weight} onChange={e => setProfile({...profile, weight: parseInt(e.target.value)})} className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:border-lime-500 outline-none" />
        </div>

        <div className="space-y-2">
           <label className="text-zinc-400 text-sm">Estatura (cm)</label>
           <input type="number" value={profile.height} onChange={e => setProfile({...profile, height: parseInt(e.target.value)})} className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:border-lime-500 outline-none" />
        </div>
        
        <div className="md:col-span-2 space-y-2">
           <label className="text-zinc-400 text-sm">Nivel de Actividad</label>
           <select 
             value={profile.activityLevel} 
             onChange={e => setProfile({...profile, activityLevel: e.target.value as any})}
             className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:border-lime-500 outline-none"
           >
             <option value="sedentary">Sedentario (Oficina, poco ejercicio)</option>
             <option value="moderate">Moderado (Entreno 3-4 días)</option>
             <option value="active">Activo (Deporte intenso/Diario)</option>
           </select>
        </div>

        <div className="md:col-span-2 space-y-2">
           <label className="text-zinc-400 text-sm">Objetivo Principal</label>
           <div className="grid grid-cols-3 gap-2">
             {[
               {id: 'lose_fat', label: 'Perder Grasa'},
               {id: 'maintain', label: 'Mantener'},
               {id: 'muscle_gain', label: 'Ganar Músculo'}
             ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setProfile({...profile, goal: opt.id as any})}
                  className={`py-3 px-2 rounded-xl border text-sm font-medium transition-all ${
                    profile.goal === opt.id 
                    ? 'bg-lime-500/20 text-lime-400 border-lime-500' 
                    : 'bg-zinc-900 border-zinc-700 text-zinc-400 hover:bg-zinc-800'
                  }`}
                >
                  {opt.label}
                </button>
             ))}
           </div>
        </div>
      </div>

      <button 
        onClick={handleCalculateGoals}
        className="w-full py-4 bg-gradient-to-r from-lime-500 to-emerald-500 text-black font-bold rounded-xl hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(132,204,22,0.3)]"
      >
        CALCULAR MACROS Y CONTINUAR
      </button>
    </div>
  );

  const renderPlanner = () => (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="bg-lime-500 text-black w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span>
            Editor de Plan Semanal
          </h2>
          <p className="text-zinc-400 text-sm mt-1">Escribe tu dieta actual o deja en blanco para que la IA sugiera.</p>
        </div>
        
        {goals && (
           <div className="flex gap-4 text-xs font-mono bg-zinc-900 p-3 rounded-lg border border-zinc-800">
             <div className="text-center">
               <span className="block text-zinc-500">CALORÍAS</span>
               <span className="text-white font-bold">{goals.calories}</span>
             </div>
             <div className="w-px bg-zinc-800"></div>
             <div className="text-center">
               <span className="block text-zinc-500">PROTEÍNA</span>
               <span className="text-lime-400 font-bold">{goals.protein}g</span>
             </div>
             <div className="text-center">
               <span className="block text-zinc-500">GRASAS</span>
               <span className="text-amber-400 font-bold">{goals.fat}g</span>
             </div>
             <div className="text-center">
               <span className="block text-zinc-500">CARBOS</span>
               <span className="text-blue-400 font-bold">{goals.carbs}g</span>
             </div>
           </div>
        )}
      </div>

      {/* Days Tabs */}
      <div className="flex overflow-x-auto gap-2 mb-6 pb-2">
        {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map((day, idx) => (
          <button
            key={idx}
            onClick={() => setActiveDay(idx)}
            className={`px-6 py-2 rounded-full whitespace-nowrap transition-colors ${
              activeDay === idx 
                ? 'bg-white text-black font-bold' 
                : 'bg-zinc-900 text-zinc-500 hover:text-white'
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Editor Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          {['breakfast', 'lunch', 'snack', 'dinner'].map((mealType) => {
             const meal = plan[activeDay][mealType as keyof DayPlan];
             return (
               <div key={mealType} className="glass-panel p-5 rounded-2xl relative group">
                 <div className="flex justify-between items-center mb-3">
                   <h3 className="text-lime-400 uppercase text-xs font-bold tracking-wider">{
                     mealType === 'breakfast' ? 'Desayuno' : 
                     mealType === 'lunch' ? 'Comida' :
                     mealType === 'snack' ? 'Snack' : 'Cena'
                   }</h3>
                   {meal.estimatedMacros.calories > 0 && (
                     <span className="text-xs text-zinc-500 font-mono">{meal.estimatedMacros.calories} kcal</span>
                   )}
                 </div>
                 
                 <div className="relative">
                   <input 
                     type="text" 
                     placeholder="Ej: 2 huevos con jamon..." 
                     value={meal.text}
                     onChange={(e) => handleMealChange(activeDay, mealType as any, e.target.value)}
                     className={`w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-lime-500 outline-none transition-colors ${meal.isKiwiItem ? 'text-lime-300' : ''}`}
                   />
                   {meal.isKiwiItem && (
                     <div className="absolute right-3 top-3">
                       <KiwiLogo className="w-5 h-5 opacity-80" />
                     </div>
                   )}
                 </div>

                 {/* Suggestion Button (Visible if empty or generic) */}
                 <div className="flex gap-2 mt-3">
                    {meal.isKiwiItem ? (
                         <button 
                            onClick={() => handleSwapItem(activeDay, mealType as any)}
                            className="text-xs flex items-center gap-1 text-lime-400 hover:text-white transition-colors bg-white/5 px-3 py-1.5 rounded-lg border border-lime-500/30"
                         >
                            <RotateCw size={12} /> Cambiar sugerencia
                         </button>
                    ) : (
                         <button 
                            onClick={() => suggestKiwiAlternative(activeDay, mealType as any)}
                            className="text-xs flex items-center gap-1 text-zinc-500 hover:text-lime-400 transition-colors"
                         >
                            <Zap size={12} /> Sugerir del menú Kiwi
                         </button>
                    )}
                 </div>
               </div>
             );
          })}
        </div>

        {/* Real-time Analysis for Active Day */}
        <div className="bg-zinc-900/50 rounded-3xl p-6 border border-white/5 h-fit">
           <h3 className="text-xl font-bold text-white mb-6">Análisis del Día {activeDay + 1}</h3>
           
           {(() => {
             const dayMeals = plan[activeDay];
             const totalCal = dayMeals.breakfast.estimatedMacros.calories + dayMeals.lunch.estimatedMacros.calories + dayMeals.snack.estimatedMacros.calories + dayMeals.dinner.estimatedMacros.calories;
             const totalP = dayMeals.breakfast.estimatedMacros.protein + dayMeals.lunch.estimatedMacros.protein + dayMeals.snack.estimatedMacros.protein + dayMeals.dinner.estimatedMacros.protein;
             const totalF = dayMeals.breakfast.estimatedMacros.fat + dayMeals.lunch.estimatedMacros.fat + dayMeals.snack.estimatedMacros.fat + dayMeals.dinner.estimatedMacros.fat;
             const totalC = dayMeals.breakfast.estimatedMacros.carbs + dayMeals.lunch.estimatedMacros.carbs + dayMeals.snack.estimatedMacros.carbs + dayMeals.dinner.estimatedMacros.carbs;
             
             const getProgressColor = (current: number, target: number) => {
               const pct = (current / target) * 100;
               if (pct > 115) return 'bg-red-500';
               if (pct < 85) return 'bg-amber-500';
               return 'bg-lime-500';
             };

             return (
               <div className="space-y-6">
                 {/* Calories Circle */}
                 <div className="flex items-center gap-4">
                    <div className="relative w-20 h-20 rounded-full border-4 border-zinc-800 flex items-center justify-center">
                       <span className="text-white font-bold">{totalCal}</span>
                    </div>
                    <div>
                       <p className="text-sm text-zinc-400">Total Calorías</p>
                       <p className="text-xs text-zinc-600">Meta: {goals?.calories}</p>
                    </div>
                 </div>

                 {/* Macros Bars */}
                 <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-zinc-400">Proteína ({totalP}g)</span>
                        <span className="text-zinc-600">{goals?.protein}g</span>
                      </div>
                      <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                        <div className={`h-full ${getProgressColor(totalP, goals?.protein || 100)}`} style={{width: `${Math.min((totalP / (goals?.protein || 1)) * 100, 100)}%`}}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-zinc-400">Carbohidratos ({totalC}g)</span>
                        <span className="text-zinc-600">{goals?.carbs}g</span>
                      </div>
                      <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                        <div className={`h-full ${getProgressColor(totalC, goals?.carbs || 100)}`} style={{width: `${Math.min((totalC / (goals?.carbs || 1)) * 100, 100)}%`}}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-zinc-400">Grasas ({totalF}g)</span>
                        <span className="text-zinc-600">{goals?.fat}g</span>
                      </div>
                      <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                        <div className={`h-full ${getProgressColor(totalF, goals?.fat || 100)}`} style={{width: `${Math.min((totalF / (goals?.fat || 1)) * 100, 100)}%`}}></div>
                      </div>
                    </div>
                 </div>

                 <button 
                    onClick={() => optimizeFullDay(activeDay)}
                    className="w-full mt-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-bold text-lime-400 flex items-center justify-center gap-2"
                 >
                    <RefreshCw className="w-4 h-4" /> KIWI-FICAR ESTE DÍA
                 </button>
                 
                 <div className="pt-4 border-t border-white/5">
                    <button 
                        onClick={() => setStep(3)}
                        className="w-full py-4 bg-lime-500 hover:bg-lime-400 text-black font-bold rounded-xl shadow-lg"
                    >
                        FINALIZAR Y VER REPORTE
                    </button>
                 </div>
               </div>
             );
           })()}
        </div>
      </div>
    </div>
  );

  const renderResults = () => (
    <div className="container mx-auto px-4 py-10">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-white mb-4">Tu Plan <span className="text-lime-500">Kiwi-Optimizado</span></h2>
        <p className="text-zinc-400">Hemos analizado tu estructura y sugerido los mejores platillos de nuestro menú para alcanzar tu meta de {profile.goal.replace('_', ' ')}.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-7 gap-4 overflow-x-auto pb-8">
        {plan.map((day, idx) => (
          <div key={idx} className="min-w-[200px] bg-zinc-900/40 border border-white/5 rounded-2xl p-4 flex flex-col gap-3">
             <h3 className="font-bold text-white text-center pb-2 border-b border-white/5">Día {idx + 1}</h3>
             
             {(['breakfast', 'lunch', 'snack', 'dinner'] as const).map(mealType => (
               <div key={mealType} className={`p-3 rounded-xl text-xs ${day[mealType].isKiwiItem ? 'bg-lime-500/10 border border-lime-500/30' : 'bg-black/20'}`}>
                 <span className="block text-zinc-500 uppercase text-[10px] mb-1">{mealType}</span>
                 <p className="text-white font-medium truncate">{day[mealType].text || "Sin registro"}</p>
                 {day[mealType].estimatedMacros.calories > 0 && (
                    <span className="text-zinc-500 mt-1 block">{day[mealType].estimatedMacros.calories} kcal</span>
                 )}
               </div>
             ))}
             
             <button 
                onClick={() => { setActiveDay(idx); setStep(2); }}
                className="mt-auto text-xs text-lime-400 hover:underline text-center"
             >
                Editar Día
             </button>
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-4 mt-8">
        <button 
            onClick={() => generatePDF('full')} 
            className="px-8 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl font-bold flex items-center gap-2"
        >
            <Save size={18} /> GUARDAR PDF
        </button>
        <button 
            className="px-8 py-3 bg-lime-500 hover:bg-lime-400 text-black rounded-xl font-bold flex items-center gap-2"
            onClick={() => setStep(4)}
        >
            <CheckCircle size={18} /> APROBAR PLAN
        </button>
      </div>
    </div>
  );

  const renderBudget = () => {
    let totalPrice = 0;
    let totalItems = 0;

    const budgetRows = plan.map((day, idx) => {
        const items: any[] = [];
        (['breakfast', 'lunch', 'snack', 'dinner'] as const).forEach(meal => {
            if (day[meal].isKiwiItem && day[meal].kiwiId) {
                const item = MENU_ITEMS.find(i => i.id === day[meal].kiwiId);
                if (item) {
                    items.push(item);
                    totalPrice += item.price;
                    totalItems++;
                }
            }
        });
        return { day: idx + 1, items };
    }).filter(row => row.items.length > 0);

    return (
        <div className="container mx-auto px-4 py-10 max-w-4xl">
            <div className="text-center mb-10">
                <h2 className="text-4xl font-bold text-white mb-2">Presupuesto del Plan</h2>
                <p className="text-zinc-400">Tu inversión en salud y rendimiento para esta semana.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                <div className="col-span-2 space-y-4">
                    {budgetRows.map((row) => (
                        <div key={row.day} className="bg-zinc-900/50 border border-white/5 rounded-xl p-6">
                            <h3 className="text-lime-400 font-bold mb-4 flex items-center gap-2">
                                <span className="bg-lime-500/10 w-6 h-6 rounded flex items-center justify-center text-xs">D{row.day}</span>
                                Menú del Día {row.day}
                            </h3>
                            <div className="space-y-3">
                                {row.items.map((item: MenuItem, i: number) => (
                                    <div key={i} className="flex justify-between items-center text-sm border-b border-white/5 pb-2 last:border-0 last:pb-0">
                                        <span className="text-white">{item.name}</span>
                                        <span className="text-zinc-400 font-mono">${item.price}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="col-span-1">
                    <div className="bg-zinc-900 border border-lime-500/30 rounded-2xl p-6 sticky top-24">
                        <h3 className="text-xl font-bold text-white mb-6">Resumen</h3>
                        
                        <div className="flex justify-between mb-2 text-zinc-400">
                            <span>Platillos Totales</span>
                            <span className="text-white">{totalItems}</span>
                        </div>
                        <div className="flex justify-between mb-6 text-zinc-400">
                            <span>Días Cubiertos</span>
                            <span className="text-white">{budgetRows.length}</span>
                        </div>
                        
                        <div className="border-t border-white/10 pt-4 mb-8">
                            <div className="flex justify-between items-end">
                                <span className="text-zinc-300 font-bold">Total</span>
                                <span className="text-4xl font-bold text-lime-500">${totalPrice}</span>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <button 
                                onClick={handleOrderAll}
                                className="w-full py-4 bg-lime-500 hover:bg-lime-400 text-black font-bold rounded-xl shadow-[0_0_20px_rgba(132,204,22,0.3)] flex items-center justify-center gap-2"
                            >
                                <ShoppingBag size={20} /> ORDENAR TODO
                            </button>
                            <button 
                                onClick={() => generatePDF('budget')}
                                className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-xl flex items-center justify-center gap-2"
                            >
                                <FileText size={20} /> DESCARGAR PDF
                            </button>
                            <button 
                                onClick={() => setStep(3)}
                                className="w-full py-2 text-zinc-500 hover:text-white text-sm"
                            >
                                Volver al plan
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
  };

  return (
    <div className="min-h-screen pt-20 bg-[#09090b]">
       {step === 0 && renderIntro()}
       {step === 1 && renderProfile()}
       {step === 2 && renderPlanner()}
       {step === 3 && renderResults()}
       {step === 4 && renderBudget()}
    </div>
  );
};

export default NutriPlanner;