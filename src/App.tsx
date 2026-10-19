import { useState, useRef, useEffect } from 'react'
import './App.css'

import type { Note } from './types/note'

import StickyNote from './components/StickyNote'

function App() {
  const [notes, setNotes] = useState<Note[]>(() => {
    try {
      const savedNotes = localStorage.getItem('sticky-notes')
      return savedNotes ? JSON.parse(savedNotes) as Note[] : []  // Restoring saved notes on page load
    } catch {
      return []
    }
  })
  const [isOverTrash, setIsOverTrash] = useState(false) // Trash zone hover over styling
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null)
  const workspaceRef = useRef<HTMLElement>(null)

  useEffect(() => {
    localStorage.setItem('sticky-notes', JSON.stringify(notes)) // Saving notes to local storage
  }, [notes])

  const addNote = () => {
    const newNote: Note = {
      id: crypto.randomUUID(),
      x: 40 + notes.length * 10, // Offset position of new notes, though eventually this would need to consider boundaries of workspace
      y: 40 + notes.length * 10,
      width: 200,
      height: 200,
      text: ''
    }
    setNotes (previousNotes => [...previousNotes, newNote])
    setActiveNoteId(newNote.id) // Any new note appears at front
  }

  const moveNote = (id: string, x: number, y: number) => {
    const workspace = workspaceRef.current
    if (!workspace) return

    setNotes (previousNotes => 
      previousNotes.map(note =>
        note.id === id
          ? { ...note,
            x: Math.max(0, Math.min(x, workspace.clientWidth - note.width)), // Stops the notes being moved outside of the workspace
            y: Math.max(0, Math.min(y, workspace.clientHeight - note.height))
          }
          : note
      )
    )
  }

  const resizeNote = (id: string, width: number, height: number) => {
    const workspace = workspaceRef.current
    if (!workspace) return

    setNotes (previousNotes => 
      previousNotes.map(note =>
        note.id === id
          ? { ...note,
            width: Math.max(0, Math.min(width, workspace.clientWidth - note.x)), // Stops the notes being sized outside of the workspace
            height: Math.max(0, Math.min(height, workspace.clientHeight - note.y)),
          }
          : note
      )
    )
  }

  const deleteNote = (id: string) => {
    setNotes (previousNotes => 
      previousNotes.filter(note => note.id !== id) // Creates new array for every note except the one being deleted
    )
  }

  const updateNoteText = (id: string, text: string) => {
    setNotes (previousNotes => 
      previousNotes.map(note =>
        note.id === id
          ? { ...note, text }
          : note
      )
    )
  }

  return (
    <main className="app">
      <header className="app-header">
        <h1>Sticky Notes</h1>
        <button type="button" onClick={addNote}>+ New Note</button>
      </header>

      <section className="workspace" ref={workspaceRef}>
        {notes.map(note => (
          <StickyNote key={note.id} note={note} onMove={moveNote} onResize={resizeNote} onDelete={deleteNote} onTrashHover={setIsOverTrash} onTextChange={updateNoteText} isActive={activeNoteId === note.id} onBringToFront={setActiveNoteId}></StickyNote>
        ))}
        <div className={`trash-zone ${isOverTrash ? 'trash-zone-active' : ''}`}>
          Drop here to delete
        </div>
      </section>
    </main>
  )
}

export default App
