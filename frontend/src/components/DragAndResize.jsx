import React, { useRef, useState } from 'react'
import { usePdf } from '../hooks/usePdf';
import { IoClose } from 'react-icons/io5';

const DragAndResize = ({ field, handleUpdateFields }) => {

    const [draggedField, setDraggedField] = useState(null);
    const [resizingField, setResizingField] = useState(null);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const containerRef = useRef(null);
    const { setFields } = usePdf();

    // handlePointerDown 
    const handlePointerDown = (e, id, action) => {
        e.preventDefault();
        e.stopPropagation();

        e.currentTarget.setPointerCapture(e.pointerId);

        // drag 
        if (action === "drag") {
            setDraggedField(id);
            setDragOffset({
                x: e.clientX - field.x,
                y: e.clientY - field.y
            })
        }

        // resize
        if (action === "resize") {
            setResizingField({
                id,
                startX: e.clientX,
                startY: e.clientY,
                startWidth: field.w,
                startHeight: field.h
            })
        }
    }

    // handlePointerMove
    const handlePointerMove = (e) => {
        e.preventDefault();

        if (draggedField !== null) {
            const data = {
                id: draggedField,
                x: e.clientX - dragOffset.x,
                y: e.clientY - dragOffset.y,
                w: field.w,
                h: field.h
            }

            setFields((prev) =>
                prev.map((item) =>
                    item.id === draggedField ?
                        { ...item, ...data }
                        : item
                )
            )
            handleUpdateFields(data);
        }

        if (resizingField !== null) {
            const deltaX = e.clientX - resizingField.startX;
            const deltaY = e.clientY - resizingField.startY;

            const data = {
                id: resizingField.id,
                w: resizingField.startWidth + deltaX,
                h: resizingField.startHeight + deltaY,
                x: field.x,
                y: field.y
            }

            setFields((prev) =>
                prev.map((item) =>
                    item.id === resizingField.id ?
                        { ...item, ...data }
                        : item
                )
            )

            handleUpdateFields(data);
        }
    }

    // handlePointerUp
    const handlePointerUp = () => {
        setDraggedField(null);
        setResizingField(null);
    };

    // handlePointerLeave
    const handlePointerLeave = () => {
        setResizingField(null);
        setDraggedField(null);
    };

    // remove
    const remove = (field) => {
        setFields(prev => prev.filter(item => item.id !== field.id));
    }

    return (
        <div className="draggable-box"
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            ref={containerRef}>
            <div key={field.id}
                className="absolute rounded-md bg-(--accent)/10 border border-dotted border-(--accent) cursor-move"
                style={{
                    left: `${field.x}px`,
                    top: `${field.y}px`,
                    width: `${field.w}px`,
                    height: `${field.h}px`,
                    zIndex: '49',
                    touchAction: "none",
                    userSelect: "none",
                }}
                onPointerDown={(e) => handlePointerDown(e, field.id, 'drag')}
                onPointerLeave={handlePointerLeave}>
                <IoClose onClick={() => remove(field)}
                    className='text-2xl absolute right-0 top-0 p-1 rounded-full cursor-pointer text-red-600' />
                <img
                    src={field.imageBase64}
                    alt="Draggable"
                    className="w-full h-full object-contain pointer-events-none select-none"
                    draggable="false"
                />

                <div
                    className="absolute -bottom-1 -right-1 w-2 h-2 bg-(--accent) rounded-full cursor-se-resize"
                    style={{
                        touchAction: "none",
                    }}
                    onPointerDown={(e) => {
                        e.stopPropagation();
                        handlePointerDown(e, field.id, 'resize');
                    }}
                />
            </div>
        </div>
    )
}

export default DragAndResize;
