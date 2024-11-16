import React, { useState, useEffect, use } from 'react';
import PageLayout from '../components/PageLayout';
import Tabs from '../components/Tabs';
import apiFetch from '../functions/apiFetch';
import TodoEntry from '../components/TodoEntry'; 

/**
* Todos Component
* 
* This component represents the main page for managing todos. It fetches todos from backend,
* categorizes them into incomplete and all todos, and allows the user to toggle between these
* categories using tabs. Each todo can be edited, marked as complete/incomplete, and saved.
* 
* State:
* - todos: An array of all todo items.
* - incompleteTodos: An array of incomplete todo items.
* - activeTab: The currently active tab ('Incomplete Todos' or 'All Todos').
* - isSaving: A boolean indicating whether a save operation is in progress.
* - toDoTabs: An array of tab configurations for the Tabs component.
* 
*/
 
const Todos = () => {
    const [todos, setTodos] = useState([]);
    const [incompleteTodos, setIncompleteTodos] = useState([]);
    const [activeTab, setActiveTab] = useState('Incomplete Todos');
    const [isSaving, setIsSaving] = useState(false);
    const [toDoTabs, setToDoTabs] = useState([]);

    useEffect(() => {
        fetchTodos();
        setIsSaving(false);
    }, [isSaving]);

    useEffect(() => {
        const tabs = [
            {
                title: 'Incomplete Todos',
                content: (
                    <div>
                        {incompleteTodos.map((todo) => (
                            <TodoEntry
                                key={todo.todoID}
                                name={todo.name}
                                completed={todo.completed}
                                onSave={(newName, newCompleted) => handleSave(todo.todoID, newName, newCompleted)}
                                onToggleComplete={() => toggleComplete(todo.todoID)}
                            />
                        ))}
                    </div>
                ),
                onClick: () => setActiveTab('Incomplete Todos'),
            },
            {
                title: 'All Todos',
                content: (
                    <div>
                        {todos.map((todo) => (
                            <TodoEntry
                                key={todo.todoID}
                                name={todo.name}
                                completed={todo.completed}
                                onSave={(newName) => handleSave(todo.todoID, newName)}
                                onToggleComplete={() => toggleComplete(todo.todoID)}
                            />
                        ))}
                    </div>
                ),
                onClick: () => setActiveTab('All Todos'),
            },
        ];

        setToDoTabs(tabs);
    }, [todos, incompleteTodos]);

    const fetchTodos = async () => {
        try {
            const response = await apiFetch('/todo/fetch-all');

            const sortedTodos = response.body.sort((a, b) => new Date(b.created) - new Date(a.created));
            const incomplete = sortedTodos.filter(todo => !todo.completed);

            setIncompleteTodos(incomplete);           
            setTodos(sortedTodos);
        } catch (error) {
            console.error('Uh oh Error fetching todos:', error);
        }
    };

    /**
    * handleSave Function
    * 
    * This function handles saving the updated name of a todo item. It sends a POST request to the API
    * to update the name of the todo item with the specified todoID. 
    * This passed to each ToDoEntry component
    * 
    * @param {string} todoID - The unique identifier of the todo item to be updated.
    * @param {string} newName - The new name for the todo item.
    */
    const handleSave = (todoID, newName) => {
        const updateName = async () => {
            const url = `/todo/update-name/${todoID}`;
            try {
                let response = await apiFetch(url, {
                    method: "POST",
                    body: { name: newName }
                });

            } catch (error) {
                console.error('Error updating the todo name:', error);
            }
        }

        updateName();
        setIsSaving(true);
    };

    /**
    * toggleComplete Function
    * 
    * This function handles toggling the completion status of a todo item. It sends a POST request to the API
    * to update the completion status of the todo item with the specified todoID.
    * This function is passed to each TodoEntry component.
    * 
    * @param {string} todoID - The unique identifier of the todo item to be updated.
    */
    const toggleComplete = (todoId) => {
        const updateToDoCompleted = async () => {
            const url = `/todo/toggle-completed/${todoId}`;
            try {
                let response = await apiFetch(url, {
                    method: "POST"
                });

            } catch (error) {
                console.error('Error setting the todo complete:', error);
            }
        }

        updateToDoCompleted(todoId);
        setIsSaving(true);
    };

    return (
        <PageLayout title="Create todo">
            <div>
                <Tabs activeTab={activeTab} tabs={toDoTabs} />
            </div>
        </PageLayout>
    );
};

export default Todos;