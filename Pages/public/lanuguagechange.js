// Initialize i18next library
i18next.init({
    lng: getSavedLanguage() || 'en', // Default language from the saved localStorage
    resources: {
      en: {
        translation: {
          home: 'Home',
          route: 'Routes',
          bustimes: 'Bus Times',
          settings: 'Settings'
        }
      },
      fr: {
        translation: {
          home: 'page daccueil',
          route: 'la voie',
          bustimes: 'horaires de bus',
          settings: 'paramètres'
        }
      }
    }
  });
  
  // Function to change the language
  function changeLanguage(language) {
    i18next.changeLanguage(language, (err, t) => {
      if (err) return console.log('Error loading translation:', err);
      updateContent();
      saveLanguage(language);
    });
  }
  
  // Function to update the content based on the selected language
  function updateContent() {
    document.getElementById('home').textContent = i18next.t('home');
    document.getElementById('route').textContent = i18next.t('route');
    document.getElementById('bustimes').textContent = i18next.t('bustimes');
    document.getElementById('settings').textContent = i18next.t('settings');
  }
  
  // Function to get the saved language from localStorage
  function getSavedLanguage() {
    return localStorage.getItem('selectedLanguage');
  }
  
  // Function to save the selected language to localStorage
  function saveLanguage(language) {
    localStorage.setItem('selectedLanguage', language);
  }
  
  // Initial content update
  updateContent();


