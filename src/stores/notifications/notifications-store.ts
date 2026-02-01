import { createStore } from "zustand/vanilla";

export type NotificationsState = {
  hasUnreadPushNotifications: boolean;
};

export type NotificationsActions = {
  setHasUnreadPushNotifications: (value: boolean) => void;
};

export type NotificationsStore = NotificationsState & NotificationsActions;

export const defaultInitState: NotificationsState = {
  hasUnreadPushNotifications: false
};

export const createNotificationsStore = (initState: NotificationsState = defaultInitState) => {
  return createStore<NotificationsStore>()((set) => ({
    ...initState,
    setHasUnreadPushNotifications: (value) => set({ hasUnreadPushNotifications: value })
  }));
};
