# Architecture Overview

The application is built using React, TypeScript and Vite.
The main App component manages the collection of sticky notes,
including their positions, dimensions and text content.
Each note uses a TypeScript interface to define its structure
and is rendered through a reusable StickyNote component.
This keeps note data management separate from individual
note interactions and styling.

Dragging and resizing are handled using pointer events.
React refs track the starting pointer position and note dimensions,
while callback functions update the notes in the main application state.
Notes are positioned absolutely within a workspace, with boundaries
preventing them from being dragged or resized outside the available area.
The application also tracks the active note to control which appears
in front, while pointer coordinates are used to detect when a note
is dragged over the trash zone.

Browser local storage is used to save and restore notes between sessions
without requiring a backend.
The interface is kept simple, using CSS and native browser functionality
where possible.
New notes are created with default dimensions and offset positions
to make adding notes quick and straightforward, rather than requiring
users to specify these values manually.
The application is primarily designed for desktop use.