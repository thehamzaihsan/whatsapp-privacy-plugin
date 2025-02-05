// Create and append style element
const style = document.createElement('style');
browser.storage.sync.get('settings', (data) => {
    const blurIntensity = data.settings?.blurIntensity || 5;
    const blurOnHover = data.settings?.blurOnHover ?? true;
    
    style.textContent = `
.blur {
    filter: blur(${blurIntensity}px);
    transition: filter 0.2s ease;
}
${blurOnHover ? `
.blur:hover {
    filter: blur(0);
}` : ''}`;
});
document.head.appendChild(style);

// Two boolean flags to control the application of blur
let applyBlurToMain = true;
let applyBlurToChatList = true;

// Load the stored settings from browser.storage
browser.storage.sync.get(["applyBlurToChatList", "applyBlurToMain"], (result) => {
  applyBlurToChatList = result.applyBlurToChatList ?? true;
  applyBlurToMain = result.applyBlurToMain ?? true;

  // Start applying the blur effects based on settings
  waitForProfiles();
  waitForChat();
});

// Function to apply blur class to an element
const applyBlurToElement = (element) => {
  if (element.tagName === "DIV") {
    element.classList.add("blur");
  }
};

// Function to process all direct children of a parent element
const processDirectChildren = (parentElement, applyBlur) => {
  const directChildren = parentElement.children;
  for (const child of directChildren) {
    if (applyBlur) {
      applyBlurToElement(child);
    }
  }
};

// Function to observe changes in a parent element and apply blur to new children
const observeChanges = (parentElement, applyBlur) => {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "childList") {
        processDirectChildren(parentElement, applyBlur);
      }
    });
  });

  observer.observe(parentElement, { childList: true });
};

// Function to wait for and process the chat list
const waitForProfiles = () => {
  const chatList = document.querySelector('[aria-label="Chat list"]');

  if (!chatList) {
    setTimeout(waitForProfiles, 1000);
    return;
  }

  if (applyBlurToChatList) {
    processDirectChildren(chatList, applyBlurToChatList);
  }
  observeChanges(chatList, applyBlurToChatList);
};

// Function to wait for and process the main chat area
const waitForChat = () => {
  const main = document.getElementById("main");

  if (!main) {
    setTimeout(waitForChat, 1000);
    return;
  }

  const processFocusableItems = () => {
    const focusableItems = main.querySelectorAll(".focusable-list-item");
    focusableItems.forEach((item) => {
      if (applyBlurToMain) {
        applyBlurToElement(item);
      }
    });
  };

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "childList") {
        processFocusableItems();
      }
    });
  });

  observer.observe(main, {
    childList: true,
    subtree: true,
  });

  if (applyBlurToMain) {
    processFocusableItems();
  }
};

// Start observing when the window loads
window.addEventListener("load", () => {
  waitForProfiles();
  waitForChat();
});

// Additionally, observe for any dynamic changes after initial load
const observeDynamicChanges = () => {
  const bodyObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "childList") {
        waitForProfiles();
        waitForChat();
      }
    });
  });

  bodyObserver.observe(document.body, {
    childList: true,
    subtree: true,
  });
};

observeDynamicChanges();
