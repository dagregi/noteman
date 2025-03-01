import { writable, type Writable } from "svelte/store";

export const isSidebarOpen: Writable<boolean> = writable();

export function toggleSidebar() {
    isSidebarOpen.update((v: boolean) => !v);
}

export function closeSidebar(event: MouseEvent) {
    const sidebar = document.getElementById("default-sidebar");
    if (sidebar && !sidebar.contains(event.target as Node)) {
        isSidebarOpen.set(false);
    }
}
