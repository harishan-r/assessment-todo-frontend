import React, { useState, useEffect } from 'react';

/**
 * TodoEntry Component
 * 
 * This component represents a single todo entry. It allows the user to edit the name of the todo,
 * toggle its completion status, and save the changes.
 * 
 * Props:
 * - todoID: The unique identifier for the todo item.
 * - name: The name of the todo item.
 * - completed: The completion status of the todo item.
 * - onSave: A callback function to handle saving the updated todo item.
 * - onToggleComplete: A callback function to handle toggling the completion status of the todo item.
 */

const TodoEntry = ({ todoID, name, completed, onSave, onToggleComplete }) => {
    const [todoName, setTodoName] = useState(name);
    const [isCompleted, setIsCompleted] = useState(completed);
    const [isSaveEnabled, setIsSaveEnabled] = useState(false);

    useEffect(() => {
        setIsSaveEnabled(todoName !== name);
    }, [todoName, name]);


    const handleSave = () => {
        if (isSaveEnabled) {
            onSave(todoName);
        }
    };

    const handleToggleComplete = () => {
        const newCompletedStatus = !isCompleted;

        onToggleComplete(newCompletedStatus);
        setIsCompleted(newCompletedStatus);
    };

    return (
        <div>
            <input
                type="text"
                value={todoName}
                onChange={(e) => setTodoName(e.target.value)}
            />
            <input
                type="checkbox"
                checked={isCompleted}
                onChange={handleToggleComplete}
            />
            <button onClick={handleSave} disabled={!isSaveEnabled}>
                Save
            </button>
        </div>
    );
};

export default TodoEntry;