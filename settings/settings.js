// Get DOM elements
const blurSlider = document.getElementById('mainChatBlur');
const blurValueDisplay = document.getElementById('mainChatBlurValue');
const blurOnHoverToggle = document.getElementById('blurOnHover');
const saveButton = document.getElementById('saveButton');

// Update blur value display
blurSlider.addEventListener('input', () => {
    blurValueDisplay.textContent = `${blurSlider.value}px`;
});

// Save settings
saveButton.addEventListener('click', () => {
    const settings = {
        blurIntensity: blurSlider.value,
        blurOnHover: blurOnHoverToggle.checked,
    };

    // Save to browser storage (for extensions)
    browser.storage.sync.set({ settings }, () => {
        alert('Settings saved successfully! Reload Whatsapp to see changes.');
        console.log('Settings saved:', settings);
    });
});

// Load saved settings
browser.storage.sync.get('settings', (data) => {
    if (data.settings) {
        blurSlider.value = data.settings.blurIntensity;
        blurValueDisplay.textContent = `${data.settings.blurIntensity}px`;
        blurOnHoverToggle.checked = data.settings.blurOnHover;
    }
    else{
        blurSlider.value = 5;
        blurValueDisplay.textContent = `5px`;
        blurOnHoverToggle.checked = true;
    }
});