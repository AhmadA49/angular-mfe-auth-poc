// Dynamic import for Module Federation - prevents eager consumption errors
import('./bootstrap').catch(err => console.error(err));
