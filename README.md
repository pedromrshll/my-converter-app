# Audio Converter

A modern, web-based audio converter that allows users to convert audio files between different formats using FFmpeg in the browser.

## Features

- **Multiple Format Support**: Convert between MP3, WAV, M4A, FLAC, OGG, AMR, MP2, and M4R formats
- **Batch Processing**: Upload and convert up to 15 files simultaneously
- **Drag & Drop Interface**: Easy-to-use drag and drop functionality
- **Real-time Progress**: Live conversion progress tracking
- **Client-side Processing**: All conversions happen in your browser - no files are uploaded to any server
- **Responsive Design**: Works on both desktop and mobile devices

## Technologies Used

- **React 19** - Modern React with hooks
- **FFmpeg.js** - Browser-based audio/video processing
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- pnpm (recommended) or npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/audio-converter.git
cd audio-converter
```

2. Install dependencies:
```bash
pnpm install
# or
npm install
```

3. Start the development server:
```bash
pnpm run dev
# or
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

1. **Select Output Format**: Choose your desired output format from the dropdown menu
2. **Upload Files**: Either drag and drop audio files onto the upload area or click "Choose Files" to browse
3. **Wait for Conversion**: The app will automatically start converting your files
4. **Download Results**: Once conversion is complete, click the download button for each file

### Supported Input Formats

- MP3, WAV, M4A, FLAC, OGG, AMR, MP2, M4R, AAC, WMA

### Supported Output Formats

- **MP3** - Most compatible, good compression
- **WAV** - Uncompressed, highest quality
- **M4A** - Good compression, Apple ecosystem
- **FLAC** - Lossless compression
- **OGG** - Open source alternative to MP3
- **AMR** - Optimized for speech
- **MP2** - MPEG-1 Audio Layer II
- **M4R** - iPhone ringtone format

## Building for Production

To create a production build:

```bash
pnpm run build
# or
npm run build
```

The built files will be in the `dist` directory.

## Deployment

### GitHub Pages

1. Build the project:
```bash
pnpm run build
```

2. Deploy the `dist` folder to GitHub Pages

### Vercel

1. Connect your GitHub repository to Vercel
2. Vercel will automatically detect it's a Vite project and deploy it

### Netlify

1. Connect your GitHub repository to Netlify
2. Set build command to `pnpm run build`
3. Set publish directory to `dist`

## Browser Compatibility

This application requires a modern browser that supports:
- WebAssembly (WASM)
- SharedArrayBuffer (for FFmpeg)
- File API
- Web Workers

**Supported Browsers:**
- Chrome 68+
- Firefox 79+
- Safari 15.2+
- Edge 79+

**Note**: Due to security requirements, the app must be served over HTTPS in production (except localhost).

## Limitations

- Maximum file size depends on available browser memory
- Processing large files may take significant time
- Some browsers may require specific headers for SharedArrayBuffer support

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [FFmpeg](https://ffmpeg.org/) - The powerful multimedia framework
- [FFmpeg.js](https://github.com/ffmpegwasm/ffmpeg.wasm) - FFmpeg for the browser
- [React](https://reactjs.org/) - The web framework used
- [Vite](https://vitejs.dev/) - Build tool and dev server

## Troubleshooting

### Common Issues

**"Failed to load audio converter"**
- Ensure you're using a supported browser
- Check that the site is served over HTTPS (in production)
- Clear browser cache and reload

**Conversion fails**
- Check that the input file is a valid audio file
- Try with a smaller file size
- Ensure sufficient browser memory is available

**Slow conversion**
- Large files take more time to process
- Close other browser tabs to free up memory
- Consider using a more powerful device for large batch conversions

## Support

If you encounter any issues or have questions, please [open an issue](https://github.com/yourusername/audio-converter/issues) on GitHub.

