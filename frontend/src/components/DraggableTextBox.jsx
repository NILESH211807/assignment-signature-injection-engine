import React, { useRef, useState } from 'react'
import { usePdf } from '../hooks/usePdf';
import { IoClose } from 'react-icons/io5';
import { RxBorderDotted } from 'react-icons/rx';


const DraggableTextBox = ({ field, handleUpdateFields }) => {

    const [draggedField, setDraggedField] = useState(null);
    const [resizingField, setResizingField] = useState(null);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const containerRef = useRef(null);
    const { setFields } = usePdf();

    // handleMouseDown
    const handleMouseDown = (e, id, action) => {
        e.preventDefault();
        if (action === 'drag') {
            setDraggedField(id);
            setDragOffset({
                x: e.clientX - field.x,
                y: e.clientY - field.y
            });
        } else if (action === 'resize') {
            setResizingField({
                id: id,
                startX: e.clientX,
                startY: e.clientY,
                startWidth: field.w,
                startHeight: field.h
            });
        }
    };

    // handleMouseMove
    const handleMouseMove = (e) => {
        if (draggedField !== null) {

            const data = {
                id: draggedField,
                x: e.clientX - dragOffset.x,
                y: e.clientY - dragOffset.y,
                w: field.w,
                h: field.h
            }

            setFields(prev => prev.map(item =>
                item.id === draggedField
                    ? { ...item, ...data }
                    : item
            ));
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

            setFields(prev => prev.map(item =>
                item.id === resizingField.id
                    ? {
                        ...item, ...data
                    }
                    : item
            ));
            handleUpdateFields(data);
        }
    };

    // handleMouseUp
    const handleMouseUp = () => {
        setDraggedField(null);
        setResizingField(null);
    };

    // handleMouseLeave
    const handleMouseLeave = () => {
        setResizingField(null);
        setDraggedField(null);
    };

    // remove
    const remove = (field) => {
        setFields(prev => prev.filter(item => item.id !== field.id));
    }

    const handleInputChange = (e) => {
        setFields(prev => prev.map(item =>
            item.id === field.id
                ? { ...item, value: e.target.value }
                : item
        ));
    }

    return (
        <div className=""
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            ref={containerRef}>
            <div key={field.id}
                className="absolute rounded-md bg-(--accent)/10 border border-dotted border-(--accent) cursor-move"
                style={{
                    left: `${field.x}px`,
                    top: `${field.y}px`,
                    width: `${field.w}px`,
                    height: `${field.h}px`,
                    zIndex: '49',
                }}
                onMouseDown={(e) => handleMouseDown(e, field.id, 'drag')}
                onMouseLeave={handleMouseLeave}>
                <div className="absolute w-full -top-6.25 rounded-2xl flex justify-center left-0 text-xl bg-gray-100">
                    <RxBorderDotted />
                </div>
                <IoClose onClick={() => remove(field)}
                    className='text-2xl absolute right-0 top-0 p-1 rounded-full cursor-pointer text-red-600' />
                <input
                    type="text"
                    name="input"
                    placeholder='Enter Text'
                    value={field.value}
                    onChange={handleInputChange}
                    onMouseDown={(e) => e.stopPropagation()}
                    style={{
                        width: "100%",
                        height: "100%",
                        border: "none",
                        outline: "none",
                        padding: '10px',
                        fontSize: '14px',
                        background: "transparent",
                    }}
                />

                <div
                    className="absolute -bottom-1 -right-1 w-2 h-2 bg-(--accent) rounded-full cursor-se-resize"
                    onMouseDown={(e) => {
                        e.stopPropagation();
                        handleMouseDown(e, field.id, 'resize');
                    }}
                />
            </div>
        </div>
    );
}

export default DraggableTextBox
