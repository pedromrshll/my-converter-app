# Contributing to Audio Converter

Thank you for your interest in contributing to Audio Converter! This document provides guidelines and information for contributors.

## Getting Started

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/yourusername/audio-converter.git
   cd audio-converter
   ```
3. Install dependencies:
   ```bash
   pnpm install
   ```
4. Start the development server:
   ```bash
   pnpm run dev
   ```

## Development Guidelines

### Code Style

- Use TypeScript/JavaScript ES6+ features
- Follow React best practices and hooks patterns
- Use Tailwind CSS for styling
- Keep components small and focused
- Write descriptive commit messages

### File Structure

```
src/
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   └── AudioConverter.jsx  # Main converter component
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── assets/             # Static assets
└── App.jsx             # Main app component
```

### Adding New Features

1. Create a new branch for your feature:
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. Make your changes
3. Test your changes thoroughly
4. Commit your changes with a descriptive message
5. Push to your fork and create a pull request

### Testing

- Test the application in multiple browsers
- Verify that audio conversion works with different file formats
- Check responsive design on different screen sizes
- Ensure no console errors or warnings

## Reporting Issues

When reporting issues, please include:

- Browser and version
- Operating system
- Steps to reproduce the issue
- Expected vs actual behavior
- Any console errors or warnings

## Feature Requests

We welcome feature requests! Please:

- Check if the feature already exists or is planned
- Describe the use case and benefits
- Consider the complexity and maintenance burden
- Be open to discussion and feedback

## Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and grow
- Maintain a positive environment

## Questions?

If you have questions about contributing, feel free to:

- Open an issue for discussion
- Reach out to the maintainers
- Check existing issues and pull requests

Thank you for contributing!

