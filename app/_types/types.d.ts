export type Task = {
    id: string;
    title: string;
    description: string;
    status: string;
    dueDate: string;
    priority: 'low' | 'medium' | 'high';
    tags: string[];
  };
  
  export type Column = {
    id: string;
    title: string;
    taskIds: string[];
  };
  
  export type BoardData = {
    tasks: { [key: string]: Task };
    columns: { [key: string]: Column };
    columnOrder: string[];
  };
  