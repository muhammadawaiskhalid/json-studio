
# JSON Studio

A modern, browser-based JSON formatter, validator, and minifier built with HTML, CSS, and vanilla JavaScript.

JSON Studio helps developers inspect, clean, and transform JSON without uploading their data to a server.

## Features

- **Format JSON** — Pretty-print JSON with 2-space indentation.
- **Validate JSON** — Detect invalid syntax and display error feedback.
- **Minify JSON** — Remove unnecessary whitespace.
- **Copy Output** — Copy processed JSON to the clipboard.
- **Download JSON** — Export results as a `.json` file.
- **Load Sample** — Try the application with example data.
- **Live Statistics** — View character counts and line numbers.
- **Keyboard Shortcut** — Press `Ctrl + Enter` to format JSON.
- **Responsive Interface** — Works on desktop, tablet, and mobile.
- **Local Processing** — JSON is processed entirely in the browser.

## Tech Stack

- HTML5
- CSS3
- JavaScript (ES6+)
- Browser Clipboard API
- Browser Blob API

No frameworks, backend, database, or API keys required.

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/muhammadawaiskhalid/json-studio.git
   ```

2. Open the project folder.

3. Run `index.html` using a local development server, such as VS Code Live Server.

4. Paste JSON into the input editor and choose an action.

## Keyboard Shortcuts

| Shortcut | Action |
| --- | --- |
| `Ctrl + Enter` | Format JSON |
| `Cmd + Enter` | Format JSON on macOS |
| `Tab` | Insert two spaces in the input editor |

## Project Structure

```text
json-studio/
├── index.html
├── assets/
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── app.js
├── README.md
└── .gitignore
```

## Privacy

JSON formatting, validation, and minification happen locally in your browser. The application does not send your JSON to a backend server.

## Author

**Muhammad Awais Khalid**

[GitHub](https://github.com/muhammadawaiskhalid)

## License

No license has been assigned yet.
