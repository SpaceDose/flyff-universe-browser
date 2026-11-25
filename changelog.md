### v0.2.0

-   Updated Electron from v29 to v45, which brings a much newer Chromium engine and the latest security fixes.
-   Fix deleted clients sometimes continuing to run (and play sound) in the background.
-   Fix a crash when opening a client in a panel after closing its external window.
-   New experimental setting "Unlimited FPS" under General tries to remove the frame rate cap for all clients. It may have no effect depending on your system and requires an app restart.
-   Clients can now have hotkeys (Settings → Clients). A hotkey is always sent to its client, even while another client is focused. Hotkey forwarding can be turned off under General, or with a toggle hotkey you can set there.
-   The client navigation now shows whether hotkey forwarding is on (click it to toggle) and whether Unlimited FPS is active (including when a restart is pending).
-   Releases now also include Linux builds (AppImage and deb), and the macOS build runs natively on both Intel and Apple Silicon.

---

### v0.1.0

-   Fix a bug that you could not use keybinds anymore on entering fullscreen.
-   Enable scrolling the client list at the bottom _just in case_ people are playing an insane amount of characters.

---

### v0.0.9

-   Replaced the client reload button with a close button.
-   Removed the possibility to hide open clients as it does not seem to be necessary anymore.
-   Fix some minor bugs.
-   Added a simple readme.

---

### v0.0.8

-   Added an option to disable opening the client navigation on hover while in fullscreen.
-   Added an interface to control and rename clients.
-   You now have to confirm before a client is removed from the app.

---

### v0.0.7

-   Added an interface to change settings.
-   You can now disable the automatic focus on hovering a client view.
-   This changelog was added to the settings.

---

### v0.0.6

-   Fixed truncating the character name inside the client navigation.
-   Fixed copy&paste on MacOS.

---

### v0.0.5

-   Added a basic tutorial.
-   Allow to close open panels and windows via navigation.
-   Open the navigation on hover while in fullscreen. You still can pin the bar with a click.
-   Fixed a bug where the dragging state was not correctly deactivated when resizing the panels.

---

### v0.0.4

-   Add context menu button to mute a client. Mute status will be saved on restart.
-   Indicate that an update is currently being downloaded.
-   Improve visualisation of the client navigation.

---

### v0.0.3

-   Added a button to reload clients.
-   Fix some minor bugs.

---

### v0.0.2

-   You can now open clients in separate windows.

---

### v0.0.1

-   Initial release...
