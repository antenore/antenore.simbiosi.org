// Data configuration
const TRAINING_INTENSITIES = {
  high: {
    name: "High Intensity",
    description: "Heavy compounds (Deadlift/Squat days)",
    mealSizes: {
      breakfast: 1.2,
      lunch: 1.3,
      dinner: 1.2,
      snacks: 1.2
    },
    baseMeals: {
      preWorkout: ["15g whey protein", "1 tsp honey (if glucose <7 mmol/L)"],
      breakfast: ["60g oats", "200g skyr", "30g seeds", "110g berries"],
      lunch: ["200g lean protein", "70g rice/150g sweet potato", "2 portions vegetables"],
      dinner: ["200g protein", "Unlimited vegetables", "Healthy fats", "Optional: 200g skyr"],
      snacks: ["150g cottage cheese", "1 apple", "30g nuts"]
    },
    timing: {
      preWorkout: "30-45 min before training",
      postWorkout: "Within 45 min after training",
      mealSpacing: "3-4 hours between meals"
    }
  },
  medium: {
    name: "Medium Intensity",
    description: "Upper body training days",
    mealSizes: {
      breakfast: 1,
      lunch: 1,
      dinner: 1,
      snacks: 1
    },
    baseMeals: {
      preWorkout: ["15g whey protein", "Optional honey based on glucose"],
      breakfast: ["50g oats", "30g whey", "20g seeds", "100g berries"],
      lunch: ["180g lean protein", "50g rice/130g sweet potato", "2 portions vegetables"],
      dinner: ["180g protein", "Unlimited vegetables", "Healthy fats"],
      snacks: ["150g cottage cheese", "1 medium fruit", "20g nuts"]
    },
    timing: {
      preWorkout: "30 min before training",
      postWorkout: "Within 60 min after training",
      mealSpacing: "3-4 hours between meals"
    }
  },
  rest: {
    name: "Rest Day",
    description: "Recovery and light activity",
    mealSizes: {
      breakfast: 0.8,
      lunch: 0.8,
      dinner: 1,
      snacks: 0.8
    },
    baseMeals: {
      breakfast: ["40g oats", "200g skyr", "15g seeds", "80g berries"],
      lunch: ["150g lean protein", "40g rice/100g sweet potato", "2 portions vegetables"],
      dinner: ["180g protein", "Unlimited vegetables", "Healthy fats"],
      snacks: ["150g skyr", "15g nuts", "Optional: 1 small fruit"]
    },
    timing: {
      firstMeal: "Within 1 hour of waking",
      mealSpacing: "4-5 hours between meals",
      snacks: "Based on hunger and activity"
    }
  }
};

const GLUCOSE_RULES = {
  preMeal: [
    { range: ">8 mmol/L", action: "Reduce or eliminate carbs", recommendation: "Focus on protein and vegetables" },
    { range: "7-8 mmol/L", action: "Reduce carbs by 50%", recommendation: "Monitor response" },
    { range: "<7 mmol/L", action: "Follow normal plan", recommendation: "Regular portions" }
  ],
  preWorkout: [
    { range: ">8 mmol/L", action: "No carbs", recommendation: "Only protein" },
    { range: "7-8 mmol/L", action: "Half portion carbs", recommendation: "Full protein portion" },
    { range: "<7 mmol/L", action: "Normal pre-workout", recommendation: "Include recommended carbs" }
  ],
  postWorkout: [
    { range: ">9 mmol/L", action: "Delay carbs", recommendation: "Focus on protein first" },
    { range: "7-9 mmol/L", action: "Moderate carbs", recommendation: "Balance with protein" },
    { range: "<7 mmol/L", action: "Full recovery meal", recommendation: "Include all macronutrients" }
  ]
};

const MEAL_TIMING_PRINCIPLES = {
  general: [
    "Maintain 3-4 hours between main meals",
    "Include protein with every meal",
    "Adjust portions based on glucose response",
    "Plan largest meals around training"
  ],
  training: [
    "Pre-workout meal: 30-45 minutes before",
    "Post-workout nutrition within 45 minutes",
    "Larger meals on training days",
    "More carbs around workout times"
  ],
  recovery: [
    "More frequent, smaller meals",
    "Focus on protein distribution",
    "Reduce carbs when less active",
    "Listen to hunger cues"
  ]
};

// Main component
const TrainingDiabetesGuide = () => {
  const [activeTab, setActiveTab] = React.useState('overview');
  const [selectedIntensity, setSelectedIntensity] = React.useState('medium');

  const OverviewTab = () => (
    <div className="space-y-3 md:space-y-4">
      <div className="info-card">
        <h3 className="section-title">Training Intensity Levels</h3>
        <div className="grid gap-2 md:gap-3">
          {Object.entries(TRAINING_INTENSITIES).map(([key, intensity]) => (
            <div key={key} className="p-2 bg-white rounded border md:p-3">
              <h4 className="font-semibold text-sm md:text-base">{intensity.name}</h4>
              <p className="text-gray-600 text-sm">{intensity.description}</p>
            </div>
          ))}
        </div>
      </div>
      
      <div className="info-card">
        <h3 className="section-title">Key Principles</h3>
        <ul className="space-y-1 text-sm md:text-base">
          {MEAL_TIMING_PRINCIPLES.general.map((principle, i) => (
            <li key={i}>• {principle}</li>
          ))}
        </ul>
      </div>
    </div>
  );

  const MealsTab = () => (
    <div className="space-y-3 md:space-y-4">
      <div className="flex flex-wrap gap-2 mb-3 md:gap-3 md:mb-4">
        {Object.entries(TRAINING_INTENSITIES).map(([key, intensity]) => (
          <button
            key={key}
            onClick={() => setSelectedIntensity(key)}
            className={`tab-button flex-1 min-w-[calc(33%-0.5rem)] md:min-w-0 ${
              selectedIntensity === key ? 'active' : ''
            }`}
          >
            {intensity.name}
          </button>
        ))}
      </div>

      <div className="grid gap-2 md:gap-3">
        {Object.entries(TRAINING_INTENSITIES[selectedIntensity].baseMeals).map(([meal, items]) => (
          <div key={meal} className="info-card">
            <h3 className="section-title capitalize">{meal.replace(/([A-Z])/g, ' $1').trim()}</h3>
            <ul className="list-disc pl-4 space-y-1 text-sm md:text-base">
              {items.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );

  const GlucoseTab = () => (
    <div className="space-y-3 md:space-y-4">
      {Object.entries(GLUCOSE_RULES).map(([timing, rules]) => (
        <div key={timing} className="info-card">
          <h3 className="section-title capitalize">
            {timing.replace(/([A-Z])/g, ' $1').trim()} Guidelines
          </h3>
          <div className="space-y-2">
            {rules.map((rule, i) => (
              <div key={i} className="bg-white p-2 rounded border text-sm md:text-base md:p-3">
                <div className="flex justify-between font-medium">
                  <span>{rule.range}</span>
                  <span>{rule.action}</span>
                </div>
                <p className="text-gray-600 text-xs md:text-sm mt-1">{rule.recommendation}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  const TimingTab = () => (
    <div className="space-y-3 md:space-y-4">
      {Object.entries(MEAL_TIMING_PRINCIPLES).map(([category, principles]) => (
        <div key={category} className="info-card">
          <h3 className="section-title capitalize">{category} Timing</h3>
          <ul className="space-y-1 text-sm md:text-base">
            {principles.map((principle, i) => (
              <li key={i}>• {principle}</li>
            ))}
          </ul>
        </div>
      ))}
      
      <div className="info-card">
        <h3 className="section-title">Intensity-Specific Timing</h3>
        <div className="space-y-2 md:space-y-3">
          {Object.entries(TRAINING_INTENSITIES).map(([key, intensity]) => (
            <div key={key} className="bg-white p-2 rounded border md:p-3">
              <h4 className="font-semibold text-sm md:text-base mb-1">{intensity.name}</h4>
              <ul className="space-y-1 text-xs md:text-sm">
                {Object.entries(intensity.timing).map(([timeKey, value]) => (
                  <li key={timeKey}>• {timeKey.replace(/([A-Z])/g, ' $1').trim()}: {value}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="card">
      <div className="p-3 bg-blue-50 md:p-4">
        <h2 className="text-lg font-semibold text-center md:text-xl">
          Training & Diabetes Management Guide
        </h2>
      </div>
      
      <div className="p-2 md:p-4">
        <div className="flex flex-wrap gap-2 mb-3 md:gap-3 md:mb-4">
          {[
            { id: 'overview', label: '📋 Overview' },
            { id: 'meals', label: '🍽️ Meals' },
            { id: 'glucose', label: '📊 Glucose' },
            { id: 'timing', label: '⏰ Timing' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`tab-button flex-1 min-w-[calc(50%-0.5rem)] md:min-w-0 ${
                activeTab === tab.id ? 'active' : ''
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'meals' && <MealsTab />}
        {activeTab === 'glucose' && <GlucoseTab />}
        {activeTab === 'timing' && <TimingTab />}
      </div>
    </div>
  );
};

// Render the app
(function() {
  function renderApp() {
    ReactDOM.render(
      React.createElement(TrainingDiabetesGuide),
      document.getElementById('root')
    );
  }

  if (document.readyState === 'loading') {
    window.addEventListener('load', renderApp);
  } else {
    renderApp();
  }
})();
