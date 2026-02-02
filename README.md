# Glass Theme Toggle CDN

A premium, glass-morphic theme toggle button built as a zero-dependency Web Component.

![Glass Theme Toggle Demo](https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80) 

## Quick Start

You can use this toggle button in any project by including the CDN link in your HTML.

### 1. Include the Script

Add the following script tag to your `<head>` or before the closing `</body>` tag:

```html
<script src="https://cdn.jsdelivr.net/gh/your-username/your-repo/glass-toggle.js"></script>
```

*(Note: Replace the URL with your actual CDN link once hosted)*

### 2. Use the Component

Add the custom element where you want the toggle to appear:

```html
<glass-theme-toggle></glass-theme-toggle>
```

## Features

- **Zero Dependencies**: Pure Vanilla JS & CSS. No Tailwind or React required.
- **Glassmorphism**: Beautiful backdrop-blur and glass effects.
- **Auto-Persistence**: Automatically saves the theme preference to `localStorage`.
- **System Theme Detection**: Defaults to the user's saved preference.
- **Custom Events**: Listen for theme changes easily.

## Customization & Events

### Listening for Changes

The component dispatches a `theme-change` event whenever the toggle is clicked.

```javascript
const toggle = document.querySelector('glass-theme-toggle');
toggle.addEventListener('theme-change', (event) => {
    console.log('Current theme:', event.detail.theme);
});
```

### Tailwind Optimization

If you are using Tailwind CSS, make sure to enable the `class` dark mode in your `tailwind.config.js`:

```javascript
module.exports = {
  darkMode: 'class',
  // ...
}
```

The component will automatically add/remove the `.dark` class on the `<html>` element.

## Local Development

If you want to run the demo locally:

1. Clone this repository.
2. Open `switch.html` in your browser.

## License

MIT
