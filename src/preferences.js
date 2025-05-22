// This file manages user preferences for language, region, and streaming platforms.
// Preferences are stored in localStorage and mapped to a preferences dialog in the UI.


// Load preferences from localStorage, or use defaults if not present
export const preferences = localStorage.getItem('preferences') != null ? JSON.parse(localStorage.getItem('preferences')) : { language: 'en-US', region: 'BE', streamingPlatforms: [] };


// Maps the stored preferences to the preferences dialog UI.
// Handles setting current selections and saving changes back to localStorage.
export const mapPreferences = () => {

    // Get the preferences dialog element
    const preferencesMenu = document.querySelector(`#preferences`);

    // Set the current language in the select dropdown
    for (const option of preferencesMenu.querySelectorAll(`#language option`)) {
        if (preferences.language == option.value) {
            option.selected = true;
        }
    }

    // Set the current region in the select dropdown
    for (const option of preferencesMenu.querySelectorAll(`#region option`)) {
        if (preferences.region == option.value) {
            option.selected = true;
        }
    }

    // Set the current streaming platforms as checked
    for (const input of preferencesMenu.querySelectorAll(`fieldset input`)) {
        if (preferences.streamingPlatforms.includes(input.name)) {
            input.checked = true;
        }
    }

    // Show the preferences dialog when the button is clicked
    document.querySelector(`#preferencesButton`).addEventListener(`click`, () => {
        preferencesMenu.showModal();
    });

    // Close the dialog without saving when cancel is clicked
    document.querySelector(`#cancelPreferences`).addEventListener(`click`, () => {
        preferencesMenu.close(false);
    });

    // Save preferences and reload page when save is clicked
    document.querySelector(`#savePreferences`).addEventListener(`click`, () => {
        let outputJSON = {
            streamingPlatforms: [],
        };

        // Get selected values from all select elements
        for (const formSelection of document.querySelectorAll(`#preferences select`)) {
            outputJSON[formSelection.name] = formSelection.value;
        }

        // Get checked streaming platforms
        for (const streamingPlatform of preferencesMenu.querySelectorAll(`fieldset input`)) {
            if (streamingPlatform.checked) {
                outputJSON.streamingPlatforms.push(streamingPlatform.name);
            }
        }

        // Save updated preferences to localStorage
        localStorage.setItem('preferences', JSON.stringify(outputJSON));

        // Reload the page to apply changes
        location.reload(); // Source: https://www.w3schools.com/jsref/met_loc_reload.asp
        preferencesMenu.close(true);
    });
}