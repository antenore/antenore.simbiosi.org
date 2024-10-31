// Data configuration
const TRAINING_INTENSITIES = {
  high: {
    name: "High Intensity",
    description: "Heavy compound movements (e.g., Deadlift days)",
    mealSizes: {
      breakfast: 1.2, // Multiplier for base portions
      lunch: 1.3,
      dinner: 1.2,
      snacks: 1.2
    },
    baseMeals: {
      preWorkout: ["15g whey protein", "1 tsp honey (if glucose <7 mmol/L)"],
      breakfast: ["60g oats", "30g protein", "30g seeds", "110g berries"],
      lunch: ["200g lean protein", "70g complex carbs", "2 portions vegetables"],
      dinner: ["200g protein", "Unlimited vegetables", "Healthy fats"],
      snacks: ["30g protein", "1 piece fruit", "Small handful nuts"]
    },
    timing: {
      preWorkout: "30-45 min before training",
      postWorkout: "Within 45 min after training",
      mealSpacing: "2.5-3 hours between meals"
    }
  },
  medium: {
    name: "Medium Intensity",
    description: "Normal training days",
    mealSizes: {
      breakfast: 1,
      lunch: 1,
      dinner: 1,
      snacks: 1
    },
    baseMeals: {
      preWorkout: ["15g whey protein", "Optional honey based on glucose"],
      breakfast: ["50g oats", "25g protein", "20g seeds", "100g berries"],
      lunch: ["180g lean protein", "60g complex carbs", "2 portions vegetables"],
      dinner: ["180g protein", "Unlimited vegetables", "Healthy fats"],
      snacks: ["25g protein", "1 small fruit", "Small handful nuts"]
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
      breakfast: ["40g oats", "20g protein", "15g seeds", "80g berries"],
      lunch: ["150g lean protein", "40g complex carbs", "2 portions vegetables"],
      dinner: ["180g protein", "Unlimited vegetables", "Healthy fats"],
      snacks: ["20g protein", "1 small fruit OR handful nuts"]
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
    "Pre-workout meal: 30-60 minutes before",
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

  // Tab components
  const OverviewTab = () => (
    <div className="space-y-6">
      <div className="info-card">
        <h3 className="section-title">Training Intensity Levels</h3>
        <div className="grid gap-4">
          {Object.entries(TRAINING_INTENSITIES).map(([key, intensity]) => (
            <div key={key} className="p-3 bg-white rounded border">
              <h4 className="font-semibold">{intensity.name}</h4>
              <p className="text-gray-600">{intensity.description}</p>
            </div>
          ))}
        </div>
      </div>
      
      <div className="info-card">
        <h3 className="section-title">Key Principles</h3>
        <ul className="space-y-2">
          {MEAL_TIMING_PRINCIPLES.general.map((principle, i) => (
            <li key={i}>• {principle}</li>
          ))}
        </ul>
      </div>
    </div>
  );

  const MealsTab = () => (
    <div className="space-y-6">
      <div className="flex gap-4 mb-4">
        {Object.entries(TRAINING_INTENSITIES).map(([key, intensity]) => (
          <button
            key={key}
            onClick={() => setSelectedIntensity(key)}
            className={`tab-button ${selectedIntensity === key ? 'active' : ''}`}
          >
            {intensity.name}
          </button>
        ))}
      </div>

      <div className="grid gap-4">
        {Object.entries(TRAINING_INTENSITIES[selectedIntensity].baseMeals).map(([meal, items]) => (
          <div key={meal} className="info-card">
            <h3 className="section-title capitalize">{meal.replace(/([A-Z])/g, ' $1').trim()}</h3>
            <ul className="list-disc pl-5 space-y-1">
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
    <div className="space-y-6">
      {Object.entries(GLUCOSE_RULES).map(([timing, rules]) => (
        <div key={timing} className="info-card">
          <h3 className="section-title capitalize">
            {timing.replace(/([A-Z])/g, ' $1').trim()} Guidelines
          </h3>
          <div className="space-y-3">
            {rules.map((rule, i) => (
              <div key={i} className="bg-white p-3 rounded border">
                <div className="flex justify-between font-medium">
                  <span>{rule.range}</span>
                  <span>{rule.action}</span>
                </div>
                <p className="text-gray-600 text-sm mt-1">{rule.recommendation}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  const TimingTab = () => (
    <div className="space-y-6">
      {Object.entries(MEAL_TIMING_PRINCIPLES).map(([category, principles]) => (
        <div key={category} className="info-card">
          <h3 className="section-title capitalize">{category} Timing</h3>
          <ul className="space-y-2">
            {principles.map((principle, i) => (
              <li key={i}>• {principle}</li>
            ))}
          </ul>
        </div>
      ))}
      
      <div className="info-card">
        <h3 className="section-title">Intensity-Specific Timing</h3>
        <div className="space-y-4">
          {Object.entries(TRAINING_INTENSITIES).map(([key, intensity]) => (
            <div key={key} className="bg-white p-3 rounded border">
              <h4 className="font-semibold mb-2">{intensity.name}</h4>
              <ul className="space-y-1 text-sm">
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
    <div className="card max-w-4xl mx-auto">
      <div className="p-6 bg-blue-50">
        <h2 className="text-2xl font-semibold text-center">
          Training & Diabetes Management Guide
        </h2>
      </div>
      
      <div className="p-6">
        <div className="flex gap-4 mb-6">
          {[
            { id: 'overview', label: '📋 Overview' },
            { id: 'meals', label: '🍽️ Meals' },
            { id: 'glucose', label: '📊 Glucose' },
            { id: 'timing', label: '⏰ Timing' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
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
ReactDOM.render(
  <TrainingDiabetesGuide />,
  document.getElementById('root')
);