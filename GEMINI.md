# Gemini CLI Project Context: mylink

This project is a modern web application centered around a Next.js framework, specifically located in the `my-app/` directory.

## Project Overview
- **Core Technology**: [Next.js 16+](https://nextjs.org) using the **App Router** architecture.
- **UI Framework**: [React 19](https://react.dev).
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com) with PostCSS.
- **Language**: [TypeScript](https://www.typescriptlang.org) for static typing.
- **Linting**: [ESLint](https://eslint.org) with Next.js configuration.
- **Fonts**: Geist and Geist Mono via `next/font`.

## Directory Structure (Key Paths)
- `my-app/app/`: Contains the application routes, layouts, and global styles.
- `my-app/public/`: Static assets like SVG icons and images.
- `my-app/next.config.ts`: Next.js configuration.
- `my-app/tailwind.config.ts` (if applicable) or `postcss.config.mjs`: Styling configuration.

## Building and Running
All commands should be executed within the `my-app/` directory:

| Task | Command | Description |
| :--- | :--- | :--- |
| **Development** | `npm run dev` | Starts the development server with Turbopack. |
| **Build** | `npm run build` | Compiles the application for production. |
| **Production** | `npm run start` | Starts the production server after building. |
| **Linting** | `npm run lint` | Runs ESLint to check for code quality issues. |

## Development Conventions
- **Routing**: Follows the Next.js App Router convention. Define new routes by creating folders in `my-app/app/` with a `page.tsx` file.
- **Styles**: Global styles are managed in `my-app/app/globals.css`. Prefer Tailwind utility classes for component styling.
- **Components**: Use React Server Components (RSC) by default. Add `"use client"` at the top of files that require interactivity or browser APIs.
- **Type Safety**: Use TypeScript for all new components and logic. Ensure `tsconfig.json` requirements are met.
- **Icons**: Standard SVG assets are located in the `public/` folder.
