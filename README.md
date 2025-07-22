# Drink and Pee

A hydration reminder Chrome extension with a retro pixel-art inspired UI.

## Features

- **Custom Reminder:** Set a custom time (in minutes) for hydration reminders.
- **Theme Selection:** Choose from 6 themes: Dark, Light, Soft Pink, Soft Yellow, Pride, and Custom Color.
- **Banner Selection:** Pick a banner image for reminders from built-in options or upload your own.
- **Multi-Image Mode:** Select multiple images for reminders; a random one will be shown each time.
- **Settings Page:** Change theme and access the product (banner) page.
- **Product Page:** Manage and preview your banner images.

## Setup

1. Clone the repo and install dependencies:
   ```sh
   npm install
   ```
2. Start the dev server:
   ```sh
   npm run dev
   ```
3. Build for production:
   ```sh
   npm run build
   ```

## How to Compile and Test in Chrome

1. **Build the extension:**
   ```sh
   npm run build
   ```
   This will generate a `dist` folder with the compiled extension files.
2. **Load the extension in Chrome:**
   - Open Chrome and go to `chrome://extensions`.
   - Enable **Developer mode** (toggle in the top right).
   - Click **Load unpacked** and select the `dist` folder from your project.
   - The extension should now appear in your Chrome extensions list and be ready for testing.
3. **Test the extension:**
   - Click the extension icon in Chrome to open the popup UI.
   - Try setting reminders, changing themes, and updating banners.
   - Check the console for any errors if something doesn't work as expected.

## Credits

- UI inspired by retro pixel-art and the 'Snake on the Throne' style.
- Uses [Tabler Icons](https://tabler.io/icons) and [Tailwind CSS](https://tailwindcss.com/).
