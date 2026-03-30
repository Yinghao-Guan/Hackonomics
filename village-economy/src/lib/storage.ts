// src/lib/storage.ts
export const STORAGE_KEY = "village_economy_save_v1";
export const PERMANENT_ACHIEVEMENTS_KEY = "village_economy_achievements_v1";

export function safeParseJSON<T>(raw: string | null): T | null {
    if (!raw) return null;
    try {
        return JSON.parse(raw) as T;
    } catch {
        return null;
    }
}

export function saveToStorage<T>(data: T) {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function loadFromStorage<T>(): T | null {
    if (typeof window === "undefined") return null;
    return safeParseJSON<T>(localStorage.getItem(STORAGE_KEY));
}

export function clearStorage() {
    if (typeof window === "undefined") return;
    localStorage.removeItem(STORAGE_KEY);
}

export function savePermanentAchievements<T>(data: T) {
    if (typeof window === "undefined") return;
    localStorage.setItem(PERMANENT_ACHIEVEMENTS_KEY, JSON.stringify(data));
}

export function loadPermanentAchievements<T>(): T | null {
    if (typeof window === "undefined") return null;
    return safeParseJSON<T>(localStorage.getItem(PERMANENT_ACHIEVEMENTS_KEY));
}
