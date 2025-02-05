// On document load, get the stored settings and update the checkboxes
document.addEventListener("DOMContentLoaded", () => {
  const advancedSettingsButton = document.getElementById(
    "advancedSettingsButton"
  );
  chrome.storage.sync.get(
    ["applyBlurToChatList", "applyBlurToMain"],
    (result) => {
      document.getElementById("blurChatList").checked =
        result.applyBlurToChatList ?? true;
      document.getElementById("blurMainChat").checked =
        result.applyBlurToMain ?? true;
    }
  );
});

// Save settings when the user clicks the "Save" button
document.getElementById("saveButton").addEventListener("click", () => {
  const applyBlurToChatList = document.getElementById("blurChatList").checked;
  const applyBlurToMain = document.getElementById("blurMainChat").checked;

  chrome.storage.sync.set({ applyBlurToChatList, applyBlurToMain }, () => {
    alert("Settings saved! Reload page to see changes.");
  });
});

// Open advanced settings
advancedSettingsButton.addEventListener("click", () => {
  chrome.runtime.openOptionsPage();
});

// Import the chrome namespace.  This is typically handled automatically by the browser environment, but explicitly including it here addresses the undeclared variable error.
//If you are running this code outside of a chrome extension environment, you will need to replace this with a suitable alternative.
