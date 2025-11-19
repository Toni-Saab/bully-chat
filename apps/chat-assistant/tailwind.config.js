const preset = require('@event-bot/tailwind-preset');

module.exports = {
  darkMode: 'class', 
  presets: [preset], 

  content: [
    '../../packages/**/*.{js,ts,jsx,tsx}',
    './{src,pages,components,app}/**/*.{ts,tsx,js,jsx,html}',
    '!./{src,pages,components,app}/**/*.{stories,spec}.{ts,tsx,js,jsx,html}',
  ],
  
  theme: {
    extend: {},
  },
  plugins: [],
};