import { BoardData } from './types';

const initialData: BoardData = {
  tasks: {
    'task-1': {
      id: 'task-1',
      title: 'Design Homepage',
      description: 'Create a modern and responsive homepage design.',
      status: 'todo',
      dueDate: '2024-12-01',
      priority: 'high',
      tags: ['design', 'frontend'],
    },
    'task-2': {
      id: 'task-2',
      title: 'Develop Login Feature',
      description: 'Implement authentication using OAuth.',
      status: 'in-progress',
      dueDate: '2024-12-05',
      priority: 'medium',
      tags: ['backend', 'authentication'],
    },
    'task-3': {
      id: 'task-3',
      title: 'Test Payment Gateway',
      description: 'Ensure the payment gateway integration is secure and functional.',
      status: 'done',
      dueDate: '2024-11-30',
      priority: 'high',
      tags: ['testing', 'payment'],
    },
    'task-4': {
      id: 'task-4',
      title: 'Write Documentation',
      description: 'Create comprehensive documentation for the project.',
      status: 'todo',
      dueDate: '2024-12-10',
      priority: 'low',
      tags: ['documentation'],
    },
  },
  columns: {
    'column-1': {
      id: 'column-1',
      title: 'To Do',
      taskIds: ['task-1', 'task-4'],
    },
    'column-2': {
      id: 'column-2',
      title: 'In Progress',
      taskIds: ['task-2'],
    },
    'column-3': {
      id: 'column-3',
      title: 'Done',
      taskIds: ['task-3'],
    },
  },
  columnOrder: ['column-1', 'column-2', 'column-3'],
};

export default initialData;
