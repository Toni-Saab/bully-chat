// packages/tailwind-preset/src/lib/preset.ts

import { colors } from './colors.js';

const preset = {
  theme: {
    extend: {
      colors: {
        ...colors,
      },
    },
  },
};

export default preset;