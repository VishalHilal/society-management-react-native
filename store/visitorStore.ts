import { create } from 'zustand';
import { EntryLog, Notification, Visitor } from '../types';

interface VisitorState {
  visitors: Visitor[];
  entryLogs: EntryLog[];
  notifications: Notification[];
  loading: boolean;
  
  setVisitors: (visitors: Visitor[]) => void;
  addVisitor: (visitor: Visitor) => void;
  updateVisitor: (id: string, updates: Partial<Visitor>) => void;
  setEntryLogs: (logs: EntryLog[]) => void;
  addEntryLog: (log: EntryLog) => void;
  setNotifications: (notifications: Notification[]) => void;
  addNotification: (notification: Notification) => void;
  markNotificationRead: (id: string) => void;
  setLoading: (loading: boolean) => void;
}

export const useVisitorStore = create<VisitorState>((set, get) => ({
  visitors: [],
  entryLogs: [],
  notifications: [],
  loading: false,
  
  setVisitors: (visitors) => set({ visitors }),
  
  addVisitor: (visitor) => {
    const currentVisitors = get().visitors;
    set({ visitors: [...currentVisitors, visitor] });
  },
  
  updateVisitor: (id, updates) => {
    const currentVisitors = get().visitors;
    const updatedVisitors = currentVisitors.map(v => 
      v.id === id ? { ...v, ...updates } : v
    );
    set({ visitors: updatedVisitors });
  },
  
  setEntryLogs: (entryLogs) => set({ entryLogs }),
  
  addEntryLog: (log) => {
    const currentLogs = get().entryLogs;
    set({ entryLogs: [...currentLogs, log] });
  },
  
  setNotifications: (notifications) => set({ notifications }),
  
  addNotification: (notification) => {
    const currentNotifications = get().notifications;
    set({ notifications: [notification, ...currentNotifications] });
  },
  
  markNotificationRead: (id) => {
    const currentNotifications = get().notifications;
    const updatedNotifications = currentNotifications.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    );
    set({ notifications: updatedNotifications });
  },
  
  setLoading: (loading) => set({ loading }),
}));
