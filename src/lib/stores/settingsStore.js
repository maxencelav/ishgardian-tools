import { writable } from 'svelte/store';
import { browser } from '$app/environment'; // Ensures code runs only in the browser

const defaultLanguage = 'en';
const supportedLanguages = ['en', 'fr', 'jp', 'de'];

const initialLanguage = browser
    ? localStorage.getItem('selectedLanguage') || defaultLanguage
    : defaultLanguage;

export const selectedLanguage = writable(initialLanguage);

selectedLanguage.subscribe((value) => {
    if (browser && supportedLanguages.includes(value)) {
        localStorage.setItem('selectedLanguage', value);
    }
});

if (browser) {
    // Listen for changes to the selectedLanguage store to update the variable if the user changes the language in a different tab
    window.addEventListener('storage', (event) => {
        if (event.key === 'selectedLanguage') {
            selectedLanguage.set(event.newValue);
        }
    });
}