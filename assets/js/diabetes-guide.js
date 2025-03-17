/* Diabetes and Training Management Guide */
document.addEventListener('DOMContentLoaded', function() {
  /* Main component */
  const TrainingDiabetesGuide = () => {
    const [data, setData] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [activeTab, setActiveTab] = React.useState('overview');
    const [selectedIntensity, setSelectedIntensity] = React.useState('medium');

    /* Fetch data on component mount */
    React.useEffect(() => {
      fetch('/assets/data/diabetes-guide-data.json')
        .then(response => response.json())
        .then(jsonData => {
          setData(jsonData);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error loading guide data:', error);
          setLoading(false);
        });
    }, []);

    /* Loading state */
    if (loading) {
      return (
        <div className="card">
          <div className="p-3 bg-blue-50 md:p-4">
            <h2 className="text-lg font-semibold text-center md:text-xl">Loading...</h2>
          </div>
        </div>
      );
    }

    /* Error state */
    if (!data) {
      return (
        <div className="card">
          <div className="p-3 bg-red-50 md:p-4">
            <h2 className="text-lg font-semibold text-center md:text-xl">Failed to load guide data</h2>
          </div>
        </div>
      );
    }

    const { trainingIntensities, glucoseRules, mealTimingPrinciples } = data;

    const OverviewTab = () => (
      <div className="space-y-3 md:space-y-4">
        <div className="info-card">
          <h3 className="section-title">Training Intensity Levels</h3>
          <div className="grid gap-2 md:gap-3">
            {Object.entries(trainingIntensities).map(([key, intensity]) => (
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
            {mealTimingPrinciples.general.map((principle, i) => (
              <li key={i}>• {principle}</li>
            ))}
          </ul>
        </div>
      </div>
    );

    const MealsTab = () => (
      <div className="space-y-3 md:space-y-4">
        <div className="flex flex-wrap gap-2 mb-3 md:gap-3 md:mb-4">
          {Object.entries(trainingIntensities).map(([key, intensity]) => (
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
          {Object.entries(trainingIntensities[selectedIntensity].baseMeals).map(([meal, items]) => (
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
        {Object.entries(glucoseRules).map(([timing, rules]) => (
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
        {Object.entries(mealTimingPrinciples).map(([category, principles]) => (
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
            {Object.entries(trainingIntensities).map(([key, intensity]) => (
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

  /* Render the app */
  function renderApp() {
    ReactDOM.render(
      React.createElement(TrainingDiabetesGuide),
      document.getElementById('diabetes-guide-root')
    );
  }

  /* Initialize the app */
  if (document.readyState === 'loading') {
    window.addEventListener('load', renderApp);
  } else {
    renderApp();
  }
});
