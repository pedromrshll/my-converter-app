# Deployment Guide

This guide will help you deploy your Audio Converter app to various platforms.

## Quick Start

1. **Upload to GitHub**:
   - Create a new repository on GitHub
   - Upload all files from this project
   - Enable GitHub Pages in repository settings

2. **Automatic Deployment**:
   - The included GitHub Actions workflow will automatically build and deploy your app
   - Your app will be available at `https://yourusername.github.io/audio-converter`

## Platform-Specific Instructions

### GitHub Pages

1. Create a new repository on GitHub
2. Upload all project files
3. Go to Settings → Pages
4. Select "GitHub Actions" as the source
5. The workflow will automatically deploy your app

### Vercel

1. Connect your GitHub repository to Vercel
2. Vercel will automatically detect the Vite configuration
3. Deploy with default settings
4. Your app will be available at a Vercel URL

### Netlify

1. Connect your GitHub repository to Netlify
2. Set build command: `pnpm run build`
3. Set publish directory: `dist`
4. Deploy with the included `netlify.toml` configuration

### Manual Deployment

1. Build the project:
   ```bash
   pnpm run build
   ```
2. Upload the `dist` folder to your web server
3. Ensure your server supports the required headers for FFmpeg

## Important Notes

### Browser Requirements

Your deployed app requires:
- HTTPS (except localhost)
- Cross-Origin-Embedder-Policy: require-corp
- Cross-Origin-Opener-Policy: same-origin

These headers are configured in:
- `vercel.json` for Vercel
- `netlify.toml` for Netlify
- `vite.config.js` for development

### File Size Limits

- GitHub Pages: 1GB repository limit
- Vercel: 100MB per deployment
- Netlify: 100MB per deployment

The built app is typically under 10MB, so this shouldn't be an issue.

### Custom Domain

To use a custom domain:

1. **GitHub Pages**: Add a `CNAME` file with your domain
2. **Vercel**: Add domain in project settings
3. **Netlify**: Add domain in site settings

### Troubleshooting

**Build Fails**:
- Ensure Node.js 18+ is available
- Check that all dependencies are installed
- Verify the build command is correct

**App Doesn't Load**:
- Check browser console for errors
- Verify HTTPS is enabled
- Ensure required headers are set

**FFmpeg Fails to Load**:
- Check that SharedArrayBuffer is supported
- Verify cross-origin headers are correct
- Try a different browser

## Security Considerations

- The app processes files entirely in the browser
- No files are uploaded to any server
- All processing happens client-side
- Consider adding a privacy policy if required

## Performance Optimization

- Large files may take time to process
- Consider adding file size limits
- Monitor memory usage for batch conversions
- Test with various file formats and sizes

## Monitoring

Consider adding analytics to track:
- Usage patterns
- Popular conversion formats
- Error rates
- Performance metrics

Popular options:
- Google Analytics
- Vercel Analytics
- Netlify Analytics

