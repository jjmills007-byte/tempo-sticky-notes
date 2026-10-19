import { useRef } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'
import type { Note } from '../types/note'

interface StickyNoteProps {
    note: Note
    onMove: (id: string, x: number, y: number) => void
    onResize: (id: string, width: number, height: number) => void
    onDelete: (id: string) => void
    onTrashHover: (isOver: boolean) => void
    onTextChange: (id: string, text: string) => void
    isActive: boolean
    onBringToFront: (id: string) => void
}

function StickyNote({ note, onMove, onResize, onDelete, onTrashHover, onTextChange, isActive, onBringToFront }: StickyNoteProps) {
    const moveStart = useRef<{
        pointerX: number,
        pointerY: number,
        noteX: number,
        noteY: number
    } | null>(null)

    const resizeStart = useRef<{
        pointerX: number,
        pointerY: number,
        width: number,
        height: number
    } | null>(null)

    const noteGrab = (
        event: ReactPointerEvent<HTMLDivElement>
    ) => {
        onBringToFront(note.id)

        moveStart.current = {
            pointerX: event.clientX,
            pointerY: event.clientY,
            noteX: note.x,
            noteY: note.y
        }
        event.currentTarget.setPointerCapture(event.pointerId);
    }

    const startResize = (
        event: ReactPointerEvent<HTMLDivElement>
    ) => {
        event.stopPropagation() // Required to avoid the notes position moving when trying to resize

        resizeStart.current = {
            pointerX: event.clientX,
            pointerY: event.clientY,
            width: note.width,
            height: note.height
        }
        event.currentTarget.setPointerCapture(event.pointerId);
    }

    const noteMove = (
        event: ReactPointerEvent<HTMLDivElement>
    ) => {
        if (!moveStart.current) return

        const changeX = event.clientX - moveStart.current.pointerX
        const changeY = event.clientY - moveStart.current.pointerY
        const newX = moveStart.current.noteX + changeX
        const newY = moveStart.current.noteY + changeY

        onMove(note.id, newX, newY)

        // Check whether the pointer is over the trash zone
        const trashZone = document.querySelector('.trash-zone')

        if (trashZone) {
            const trashZoneBounds = trashZone.getBoundingClientRect()

            const overTrashZone = 
                event.clientX >= trashZoneBounds.left &&
                event.clientX <= trashZoneBounds.right &&
                event.clientY >= trashZoneBounds.top &&
                event.clientY <= trashZoneBounds.bottom

            onTrashHover(overTrashZone)
        }
    }

    const noteResize = (
        event: ReactPointerEvent<HTMLDivElement>
    ) => {
        event.stopPropagation() // Required to avoid the notes position moving when trying to resize

        if (!resizeStart.current) return

        const changeX = event.clientX - resizeStart.current.pointerX
        const changeY = event.clientY - resizeStart.current.pointerY
        const newWidth = Math.max(100, resizeStart.current.width + changeX)
        const newHeight = Math.max(100, resizeStart.current.height + changeY)

        onResize(note.id, newWidth, newHeight)
    }

    const finishNoteMove = (
        event: ReactPointerEvent<HTMLDivElement>
    ) => {
        if (moveStart.current) {
            const trashZone = document.querySelector('.trash-zone')
            
            if (trashZone) {
                const trashZoneBounds = trashZone.getBoundingClientRect()

                const inTrashZone = 
                    event.clientX >= trashZoneBounds.left &&
                    event.clientX <= trashZoneBounds.right &&
                    event.clientY >= trashZoneBounds.top &&
                    event.clientY <= trashZoneBounds.bottom

                if (inTrashZone) {
                    onDelete(note.id)
                    onTrashHover(false) // reset trash zone style after a note deleted
                }
            }
        }
        moveStart.current = null
    }

    const finishNoteResize = (
        event: ReactPointerEvent<HTMLDivElement>
    ) => {
        event.stopPropagation() // Required to avoid the notes position moving when trying to resize
        resizeStart.current = null
    }

    return (
        <div className="sticky-note"
            onPointerDown={noteGrab}
            onPointerMove={noteMove}
            onPointerUp={finishNoteMove}
            onPointerCancel={finishNoteMove}
            style={{left: note.x, top: note.y, width: note.width, height: note.height, zIndex: isActive ? 3 : 2}}>
            <textarea className="sticky-note-text" placeholder='Click to add text' value={note.text} onChange={event => onTextChange(note.id, event.target.value)} onPointerDown={event => {
                event.stopPropagation()
                onBringToFront(note.id)
            }}></textarea>
            <div className="resize-icon"
                onPointerDown={startResize}
                onPointerMove={noteResize}
                onPointerUp={finishNoteResize}
                onPointerCancel={finishNoteResize}></div>
        </div>
    )
}

export default StickyNote