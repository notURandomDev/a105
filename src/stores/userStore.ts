import { User } from "@/models/user";
import { STORAGE_KEYS } from "@/storages";
import {
  getStorageSync,
  removeStorageSync,
  setStorageSync,
} from "@tarojs/taro";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface UserStore {
  userInfo: User | null;
  setUserInfo: (info: User) => void;
  clearUserInfo: () => void;
}

export const useUserStore = create(
  persist<UserStore>(
    (set) => ({
      userInfo: null,
      setUserInfo: (info: User) => {
        set({ userInfo: info });
        console.log("【zustand】用户全局数据已更新", info);
      },
      clearUserInfo: () => {
        set({ userInfo: null });
        console.log("【zustand】用户全局数据已重置");
      },
    }),
    {
      name: STORAGE_KEYS.USER_CACHE_KEY,
      storage: createJSONStorage(() => ({
        getItem: (key) => getStorageSync(key),
        setItem: (key, value) => setStorageSync(key, value),
        removeItem: (key) => removeStorageSync(key),
      })),
    }
  )
);
