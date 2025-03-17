/* Diabetes and Training Management Guide */
document.addEventListener('DOMContentLoaded', function() {
  /* Main component */
  const TrainingDiabetesGuide = function() {
    const [data, setData] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [activeTab, setActiveTab] = React.useState('overview');
    const [selectedIntensity, setSelectedIntensity] = React.useState('medium');
    const [themeMode, setThemeMode] = React.useState('light');

    /* Check current theme on component mount and set up theme detection */
    React.useEffect(function() {
      /* Function to detect theme */
      function detectTheme() {
        if (document.documentElement.classList.contains('dark-theme')) {
          setThemeMode('dark');
        } else {
          setThemeMode('light');
        }
      }
      
      /* Initialize theme detection */
      detectTheme();
      
      /* Set up a mutation observer to detect theme changes */
      const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
          if (mutation.attributeName === 'class') {
            detectTheme();
          }
        });
      });
      
      /* Start observing document for class changes */
      observer.observe(document.documentElement, { attributes: true });
      
      /* Clean up observer on component unmount */
      return function() {
        observer.disconnect();
      };
    }, []);

    /* Fetch data on component mount */
    React.useEffect(function() {
      fetch('/assets/data/diabetes-guide-data.json')
        .then(function(response) { return response.json(); })
        .then(function(jsonData) {
          setData(jsonData);
          setLoading(false);
        })
        .catch(function(error) {
          console.error('Error loading guide data:', error);
          setLoading(false);
        });
    }, []);

    /* Loading state */
    if (loading) {
      return React.createElement(
        'div', { className: 'card' },
        React.createElement(
          'div', { className: 'p-3 bg-blue-50 md:p-4' },
          React.createElement(
            'h2', { className: 'text-lg font-semibold text-center md:text-xl', style: { color: 'white' } },
            'Loading...'
          )
        )
      );
    }

    /* Error state */
    if (!data) {
      return React.createElement(
        'div', { className: 'card' },
        React.createElement(
          'div', { className: 'p-3 bg-red-50 md:p-4' },
          React.createElement(
            'h2', { className: 'text-lg font-semibold text-center md:text-xl', style: { color: 'white' } },
            'Failed to load guide data'
          )
        )
      );
    }

    const trainingIntensities = data.trainingIntensities;
    const glucoseRules = data.glucoseRules;
    const mealTimingPrinciples = data.mealTimingPrinciples;

    const OverviewTab = function() {
      return React.createElement(
        'div', { className: 'space-y-3 md:space-y-4' },
        React.createElement(
          'div', { className: 'info-card' },
          React.createElement('h3', { className: 'section-title' }, 'Training Intensity Levels'),
          React.createElement(
            'div', { className: 'grid gap-2 md:gap-3' },
            Object.entries(trainingIntensities).map(function(entry) {
              const key = entry[0];
              const intensity = entry[1];
              return React.createElement(
                'div', { key: key, className: 'p-2 bg-white rounded border md:p-3' },
                React.createElement('h4', { className: 'font-semibold text-sm md:text-base' }, intensity.name),
                React.createElement('p', { className: 'text-gray-600 text-sm' }, intensity.description)
              );
            })
          )
        ),
        React.createElement(
          'div', { className: 'info-card' },
          React.createElement('h3', { className: 'section-title' }, 'Key Principles'),
          React.createElement(
            'ul', { className: 'list-disc space-y-1 text-sm md:text-base' },
            mealTimingPrinciples.general.map(function(principle, i) {
              return React.createElement('li', { key: i }, principle);
            })
          )
        )
      );
    };

    const MealsTab = function() {
      return React.createElement(
        'div', { className: 'space-y-3 md:space-y-4' },
        React.createElement(
          'div', { className: 'flex flex-wrap gap-2 mb-3 md:gap-3 md:mb-4' },
          Object.entries(trainingIntensities).map(function(entry) {
            const key = entry[0];
            const intensity = entry[1];
            return React.createElement(
              'button',
              {
                key: key,
                onClick: function() { setSelectedIntensity(key); },
                className: 'tab-button flex-1 min-w-[calc(33%-0.5rem)] md:min-w-0 ' +
                  (selectedIntensity === key ? 'active' : '')
              },
              intensity.name
            );
          })
        ),
        React.createElement(
          'div', { className: 'grid gap-2 md:gap-3' },
          Object.entries(trainingIntensities[selectedIntensity].baseMeals).map(function(entry) {
            const meal = entry[0];
            const items = entry[1];
            return React.createElement(
              'div', { key: meal, className: 'info-card' },
              React.createElement(
                'h3',
                { className: 'section-title capitalize' },
                meal.replace(/([A-Z])/g, ' $1').trim()
              ),
              React.createElement(
                'ul', { className: 'list-disc space-y-1 text-sm md:text-base' },
                items.map(function(item, i) {
                  return React.createElement('li', { key: i }, item);
                })
              )
            );
          })
        )
      );
    };

    const GlucoseTab = function() {
      return React.createElement(
        'div', { className: 'space-y-3 md:space-y-4' },
        Object.entries(glucoseRules).map(function(entry) {
          const timing = entry[0];
          const rules = entry[1];
          return React.createElement(
            'div', { key: timing, className: 'info-card' },
            React.createElement(
              'h3', { className: 'section-title capitalize' },
              timing.replace(/([A-Z])/g, ' $1').trim() + ' Guidelines'
            ),
            React.createElement(
              'div', { className: 'space-y-2' },
              rules.map(function(rule, i) {
                return React.createElement(
                  'div', { key: i, className: 'bg-white p-2 rounded border text-sm md:text-base md:p-3' },
                  React.createElement(
                    'div', { className: 'flex justify-between font-medium' },
                    React.createElement('span', {}, rule.range),
                    React.createElement('span', {}, rule.action)
                  ),
                  React.createElement(
                    'p', { className: 'text-gray-600 text-xs md:text-sm mt-1' },
                    rule.recommendation
                  )
                );
              })
            )
          );
        })
      );
    };

    const TimingTab = function() {
      return React.createElement(
        'div', { className: 'space-y-3 md:space-y-4' },
        Object.entries(mealTimingPrinciples).map(function(entry) {
          const category = entry[0];
          const principles = entry[1];
          return React.createElement(
            'div', { key: category, className: 'info-card' },
            React.createElement(
              'h3', { className: 'section-title capitalize' },
              category + ' Timing'
            ),
            React.createElement(
              'ul', { className: 'list-disc space-y-1 text-sm md:text-base' },
              principles.map(function(principle, i) {
                return React.createElement('li', { key: i }, principle);
              })
            )
          );
        }),
        React.createElement(
          'div', { className: 'info-card' },
          React.createElement('h3', { className: 'section-title' }, 'Intensity-Specific Timing'),
          React.createElement(
            'div', { className: 'space-y-2 md:space-y-3' },
            Object.entries(trainingIntensities).map(function(entry) {
              const key = entry[0];
              const intensity = entry[1];
              return React.createElement(
                'div', { key: key, className: 'bg-white p-2 rounded border md:p-3' },
                React.createElement(
                  'h4', { className: 'font-semibold text-sm md:text-base mb-1' },
                  intensity.name
                ),
                React.createElement(
                  'ul', { className: 'list-disc space-y-1 text-xs md:text-sm' },
                  Object.entries(intensity.timing).map(function(timingEntry) {
                    const timeKey = timingEntry[0];
                    const value = timingEntry[1];
                    return React.createElement(
                      'li', { key: timeKey },
                      timeKey.replace(/([A-Z])/g, ' $1').trim() + ': ' + value
                    );
                  })
                )
              );
            })
          )
        )
      );
    };

    /* Determine header color based on theme - enhanced for better visibility */
    const headerStyle = {
      color: 'white',
      textShadow: '0px 1px 2px rgba(0, 0, 0, 0.2)'  /* Add text shadow for better contrast */
    };

    return React.createElement(
      'div', { className: 'card' },
      React.createElement(
        'div', { className: 'p-3 bg-blue-50 md:p-4' },
        React.createElement(
          'h2', { 
            className: 'text-lg font-semibold text-center md:text-xl',
            style: headerStyle
          },
          'Training & Diabetes Management Guide'
        )
      ),
      React.createElement(
        'div', { className: 'p-2 md:p-4' },
        React.createElement(
          'div', { className: 'flex flex-wrap gap-2 mb-3 md:gap-3 md:mb-4' },
          [
            { id: 'overview', label: '📋 Overview' },
            { id: 'meals', label: '🍽️ Meals' },
            { id: 'glucose', label: '📊 Glucose' },
            { id: 'timing', label: '⏰ Timing' }
          ].map(function(tab) {
            return React.createElement(
              'button',
              {
                key: tab.id,
                onClick: function() { setActiveTab(tab.id); },
                className: 'tab-button flex-1 min-w-[calc(50%-0.5rem)] md:min-w-0 ' +
                  (activeTab === tab.id ? 'active' : '')
              },
              React.createElement('span', {}, tab.label.split(' ')[0]),
              React.createElement('span', {}, tab.label.split(' ').slice(1).join(' '))
            );
          })
        ),
        activeTab === 'overview' && React.createElement(OverviewTab),
        activeTab === 'meals' && React.createElement(MealsTab),
        activeTab === 'glucose' && React.createElement(GlucoseTab),
        activeTab === 'timing' && React.createElement(TimingTab)
      )
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