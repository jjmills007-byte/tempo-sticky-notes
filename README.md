# Sticky Notes

An interactive sticky notes application built using React, TypeScript and Vite.

## Getting Started

### Prerequisites
- Node.js
- npm

### Installation
1. Clone or download the repository.
2. Install dependencies:
`npm install`
3. Start the development server:
`npm run dev`
4. Open the local URL displayed in the terminal.

### Production Build
`npm run build`

### Linting
`npm run lint`

## Features
The application implements the following core functionality:
- **Create notes:** Add new sticky notes with predefined dimensions (200 × 200px) and automatically offset starting positions.
- **Move notes:** Drag notes around the workspace using pointer interactions.
- **Resize notes:** Adjust note dimensions using the bottom-right resize handle.
- **Delete notes:** Drag notes into the designated trash zone to remove them.

Additional functionality includes:
- Editable note content with placeholder text.
- Bringing selected and newly created notes to the foreground.
- Automatic persistence using browser local storage.
- Workspace boundaries for dragging and resizing.
- Visual feedback when dragging notes over the trash zone.

## Technical Approach
The application uses React functional components and TypeScript.
Note data is managed centrally within the main application component, while individual sticky note components handle user interactions.
Pointer events are used for dragging and resizing, with React refs tracking the initial pointer position and note dimensions during interactions.
Workspace dimensions are used to constrain note movement and resizing, preventing notes from being moved or resized beyond the available area.
Browser local storage is used to persist notes between sessions without requiring a backend.

## Design Decisions

### Note Creation
Rather than requiring users to manually specify dimensions and coordinates, new notes are created with a default size of 200 × 200px and a progressively offset starting position.
This approach was chosen to simplify note creation and allow users to begin interacting immediately. Notes can subsequently be repositioned and resized using drag interactions.
This differs from the original requirement to specify size and position during creation.

### User Experience
The interface is intentionally minimal, prioritising straightforward interactions, intuitiveness and usability.
Visual resize handles and a dedicated trash zone make the available actions easier to discover.
Selected notes are brought to the foreground to make working with overlapping notes more intuitive.

### Implementation
The application uses native browser functionality and CSS where practical, avoiding unnecessary dependencies.
React state is used to manage note data, while refs are used for pointer interaction tracking without requiring additional state updates.

## Known Limitations
- Notes are stored locally in the current browser and are not synchronised between devices.
- The application is designed primarily for desktop interaction.

## Browser Support
Designed and tested for modern desktop versions of Chrome, Firefox and Edge.