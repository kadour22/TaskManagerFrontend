import React, { useEffect, useState } from 'react';
import { Calendar, CheckCircle2, Clock, Plus, Search, Bell, Trophy, Trash2, Edit, X, Mail } from 'lucide-react';
import axiosInstance from '../Auth/api';
import Task from './Task';
const TaskManagerApp = () => {
  const [activeTab, setActiveTab] = useState('tasks');
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showChallengeModal, setShowChallengeModal] = useState(false);
  
  const [challenges, setChallenges] = useState([
    { id: 1, title: '30-Day Fitness Challenge', startDate: '2025-10-01', endDate: '2025-10-30', progress: 60 },
    { id: 2, title: 'Read 5 Books', startDate: '2025-10-15', endDate: '2025-11-15', progress: 40 }
  ]);

  
  const [challengeForm, setChallengeForm] = useState({
    title: '',
    startDate: '',
    endDate: ''
  });

  const [my_tasks, setMyTasks] = useState([]);
  
  useEffect(() => {
    const fetchTasks = async () => {
      try{
        const response = await axiosInstance.get('Task/tasks/');
        setMyTasks(response.data);
        console.log(response.data)
      }catch (error) {
        
      }
    }
    fetchTasks();
  },[])
  
  const [taskForm, setTaskForm] = useState({
    title: '',
    scheduled_time: '',
    priority: 'Medium',
  });

 const handleCreateTask = async () => {
  try {
    const payload = {
      ...taskForm,
      priority: taskForm.priority.charAt(0).toUpperCase() + taskForm.priority.slice(1), // "low" → "Low"
      scheduled_time: taskForm.scheduled_time
        ? new Date(taskForm.scheduled_time).toISOString()
        : null,
    };

    const response = await axiosInstance.post('Task/tasks/', payload); // adjust URL if needed
    const newTask = response.data;

    // Update state
    setMyTasks((prevTasks) => [...prevTasks, newTask]);

    // Close modal and reset form
    setTaskForm({ title: '', scheduled_time: '', priority: 'Medium' });
    setShowTaskModal(false);
    window.location.reload();
  } catch (error) {
    console.error('❌ Error creating task:', error.response?.data || error.message);
  }
};

  const handleCreateChallenge = () => {
    if (!challengeForm.title.trim() || !challengeForm.startDate || !challengeForm.endDate) return;
    const newChallenge = {
      id: Date.now(),
      title: challengeForm.title,
      startDate: challengeForm.startDate,
      endDate: challengeForm.endDate,
      progress: 0
    };
    setChallenges([...challenges, newChallenge]);
    setChallengeForm({ title: '', startDate: '', endDate: '' });
    setShowChallengeModal(false);
  };

  // const toggleTaskStatus = (id) => {
  //   setTasks(my_tasks.map(task => 
  //     task.id === id 
  //       ? { ...task, status: task.status === 'completed' ? 'pending' : 'completed' }
  //       : task
  //   ));
  // };

  const deleteChallenge = (id) => {
    setChallenges(challenges.filter(challenge => challenge.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-lg">
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">TaskFlow</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                U
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex space-x-1 bg-white p-1 rounded-lg shadow-sm mb-6">
          <button
            onClick={() => setActiveTab('tasks')}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-md font-medium transition-all ${
              activeTab === 'tasks'
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Tasks</span>
          </button>
          <button
            onClick={() => setActiveTab('challenges')}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-md font-medium transition-all ${
              activeTab === 'challenges'
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Challenges</span>
          </button>
        </div>

        {activeTab === 'tasks' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                />
              </div>
              <button
                onClick={() => setShowTaskModal(true)}
                className="ml-4 flex items-center space-x-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all font-medium"
              >
                <Plus className="w-5 h-5" />
                <span>New Task</span>
              </button>
            </div>

            <div className="space-y-3">
              {my_tasks.map(task => (
                <Task task={task}/>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'challenges' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Your Challenges</h2>
              <button
                onClick={() => setShowChallengeModal(true)}
                className="flex items-center space-x-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all font-medium"
              >
                <Plus className="w-5 h-5" />
                <span>New Challenge</span>
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {challenges.map(challenge => (
                <div
                  key={challenge.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-2 rounded-lg">
                        <Trophy className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="font-semibold text-gray-900">{challenge.title}</h3>
                    </div>
                    <button
                      onClick={() => deleteChallenge(challenge.id)}
                      className="p-1 hover:bg-red-50 rounded text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Start: {challenge.startDate}</span>
                      <span className="text-gray-500">End: {challenge.endDate}</span>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">Progress</span>
                        <span className="text-sm font-semibold text-indigo-600">{challenge.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all"
                          style={{ width: `${challenge.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {showTaskModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Create New Task</h2>
              <button
                onClick={() => setShowTaskModal(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Task Title
                </label>
                <input
                  type="text"
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  placeholder="Enter task title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Schedule Date (Optional)
                </label>
                <input
                  type="datetime-local"
                  value={taskForm.scheduled_time}
                  onChange={(e) => setTaskForm({ ...taskForm, scheduled_time: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Reminder (Optional)
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <select
                  value={taskForm.priority}
                  onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <button
                onClick={handleCreateTask}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-lg hover:shadow-lg transition-all font-medium"
              >
                Create Task
              </button>
            </div>
          </div>
        </div>
      )}

      {showChallengeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Create New Challenge</h2>
              <button
                onClick={() => setShowChallengeModal(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Challenge Title
                </label>
                <input
                  type="text"
                  value={challengeForm.title}
                  onChange={(e) => setChallengeForm({ ...challengeForm, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  placeholder="Enter challenge title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={challengeForm.startDate}
                  onChange={(e) => setChallengeForm({ ...challengeForm, startDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  value={challengeForm.endDate}
                  onChange={(e) => setChallengeForm({ ...challengeForm, endDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                />
              </div>
              <button
                onClick={handleCreateChallenge}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-lg hover:shadow-lg transition-all font-medium"
              >
                Create Challenge
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskManagerApp;