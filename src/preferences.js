export const preferences = localStorage.getItem('preferences') != null ? JSON.parse(localStorage.getItem('preferences')) : { lanugage: 'en-US', region: 'BE', streamingPlatforms: [] };


export const mapPreferences = () => {

    const preferencesMenu = document.querySelector(`#preferences`);


    // Set current language
    for (const option of preferencesMenu.querySelectorAll(`#language option`)) {
        if (preferences.language == option.value) {
            option.selected = true;
        }
    }

    // Set current region
    for (const option of preferencesMenu.querySelectorAll(`#region option`)) {
        if (preferences.region == option.value) {
            option.selected = true;
        }
    }

    // Set current Streaming Platforms
    for (const input of preferencesMenu.querySelectorAll(`fieldset input`)) {
        if (preferences.streamingPlatforms.includes(input.name)) {
            input.checked = true;
        }
    }


    document.querySelector(`#preferencesButton`).addEventListener(`click`, () => {
        preferencesMenu.showModal();
    })

    document.querySelector(`#cancelPreferences`).addEventListener(`click`, () => {
        preferencesMenu.close(false);
    })

    document.querySelector(`#savePreferences`).addEventListener(`click`, () => {
        let outputJSON = {
            streamingPlatforms: [],
        };

        for (const formSelection of document.querySelectorAll(`#preferences select`)) {
            outputJSON[formSelection.name] = formSelection.value;
        }

        for (const streamingPlatform of preferencesMenu.querySelectorAll(`fieldset input`)) {
            if (streamingPlatform.checked) {
                outputJSON.streamingPlatforms.push(streamingPlatform.name);
            }
        }

        localStorage.setItem('preferences', JSON.stringify(outputJSON));

        location.reload(); // Source: https://www.w3schools.com/jsref/met_loc_reload.asp
        preferencesMenu.close(true);
    })
}