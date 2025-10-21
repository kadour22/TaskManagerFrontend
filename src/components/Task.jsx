import React, { useEffect, useState } from 'react';
import { Calendar, CheckCircle2, Clock, Plus, Search, Bell, Trophy, Trash2, Edit, X, Mail } from 'lucide-react';
import axiosInstance from '../Auth/api';

const Task = ({task}) => {

const getPriorityColor = (priority) => {
    switch(priority) {
    case 'High': return 'text-red-500 bg-red-50';
    case 'Medium': return 'text-yellow-500 bg-yellow-50';
    case 'Low': return 'text-green-500 bg-green-50';
    default: return 'text-gray-500 bg-gray-50';
    }};

const deleteTask = async (id) => {
    await axiosInstance.delete(`Task/tasks/${id}/`);
    window.location.reload();
};

return (
    <div
    key={task.id}
    className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all">
        <div className="flex items-start space-x-4">
            <button
                onClick={() => toggleTaskStatus(task.id)}
                className="mt-1" >
                <CheckCircle2
                className={`w-6 h-6 ${
                task.completed === true
                ? 'text-green-500 fill-current'
                : 'text-gray-300 hover:text-green-400'} transition-colors`}/>
            </button>
            <div className="flex-1">
                <h3 className={`font-medium ${ task.completed === 'completed' ? 'text-gray-400 line-through': 'text-gray-900'}`}>
                {task.title}
                </h3>
                <div className="flex items-center space-x-3 mt-2">
                    {task.scheduled_time && (
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        <span>{task.scheduled_time}</span>
                    </div>
                    )}
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                    </span>
                </div>
            </div>
                        <button
                        onClick={() => deleteTask(task.id)}
                        className="p-2 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 className="w-4 h-4" />
                        </button>
        </div>
    </div>
)
}

export default Task