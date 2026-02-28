# Kuaishou Video Downloader

A browser extension for extracting and downloading videos from Kuaishou (快手). Supports all Chromium-based browsers (Chrome, Edge, Brave, Opera) and Firefox.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## Screenshot

![Kuaishou Video Downloader UI](Screenshot%202026-02-28%20at%2014-07-25%20%E7%B2%BE%E5%BD%A9%E6%8E%A8%E8%8D%90.png)

## Features

- **Detect Videos Automatically** - Detects videos on feed pages and short-video pages
- **Download Options**:
  - Download video only
  - Download thumbnail only  
  - Download both video and thumbnail
- **Copy to Clipboard** - Click any field to copy (title, creator, video URL, thumbnail URL, etc.)
- **Works on All Pages**:
  - Home feed / recommendations
  - Short-video direct pages (`/short-video/{id}`)
- **Clean UI** - Modern dark theme with click-to-copy feedback

## Installation

### Download Latest Release

Download the latest release package from the [Releases page](https://github.com/codebyhasan/kuaishou-video-downloader/releases/latest):

- **kuaishou-v1.0.0.zip** - Extension package (extract before installing)

### Chrome, Edge, Brave, Opera (Chromium-based)

1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions`
3. Enable "Developer mode" (toggle in top-right)
4. Click "Load unpacked"
5. Select the extension folder

### Firefox

1. Download or clone this repository
2. Open Firefox and navigate to `about:debugging#/runtime/this-firefox`
3. Click "Load Temporary Add-on..."
4. Select any file in the extension folder (e.g., `manifest.json`)

## Usage

1. Visit any Kuaishou page (feed or short-video)
2. Click the download pill icon in the bottom-right corner
3. The panel shows detected video info:
   - Title, Creator, Video ID, Posted date
   - Thumbnail URL, Video URL, Direct URL (all clickable to copy)
4. Use buttons to download or click fields to copy

## Files

```
kuaishou-video-downloader/
├── manifest.json       # Extension manifest (MV3)
├── content.js          # Main extension logic
├── icon16.png          # 16x16 icon
├── icon48.png          # 48x48 icon
├── icon128.png         # 128x128 icon
└── README.md           # This file
```

## Permissions

- `clipboardWrite` - For copying video info to clipboard
- `clipboardRead` - For clipboard operations

## Supported Pages

- `https://www.kuaishou.com/` - Home feed
- `https://www.kuaishou.com/short-video/*` - Direct video pages
- `https://www.kuaishou.com/short-video/feed/*` - Video feed

## License

MIT License - Feel free to use and modify.

---

**Note:** This extension is for personal use only. Respect copyright and terms of service when downloading content.
