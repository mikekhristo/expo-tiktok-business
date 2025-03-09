# Contributing to expo-tiktok-business-sdk

Thank you for your interest in contributing to expo-tiktok-business-sdk! This document provides guidelines and instructions for contributing.

## Getting Started

1. Fork the repository
2. Clone your fork
3. Install dependencies:
   ```bash
   npm install
   ```
4. Make your changes
5. Test your changes
6. Submit a pull request

## Development Workflow

### Building the Module

```bash
npm run build
```

### Testing in the Example App

```bash
# From the module root directory
npm pack

# Switch to your test app directory
cd /path/to/your/test-app
npm install /path/to/expo-tiktok-business-sdk-x.y.z.tgz
npx pod-install  # For iOS
```

## Guidelines

### Code Style

- Follow the existing code style
- Use TypeScript for type safety
- Include JSDoc comments for public API methods

### Testing

- Test your changes on both iOS and Android
- Test with and without debug mode
- Verify event tracking works correctly

### Commits

- Use clear, descriptive commit messages
- Reference GitHub issues if applicable

## Pull Requests

- Provide a clear description of the changes
- Explain the motivation for the changes
- Include any relevant documentation updates

## Acknowledgments

This project builds upon the work of [Lior Levy](https://github.com/Lioruby) from the original [expo-tiktok-business-sdk](https://github.com/Lioruby/expo-tiktok-business-sdk) project.