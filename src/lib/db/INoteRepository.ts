import type { Note } from "$lib/models";

export interface INoteRepository {
    fetchAll(): Promise<Note[]>;
    fetchByID(id: number): Promise<Note | null>;
    create(note: Omit<Note, "id" | "createdAt" | "modifiedAt">): Promise<Note>;
    update(
        id: number,
        note: Partial<Omit<Note, "id" | "createdAt" | "modifiedAt">>,
    ): Promise<Note | null>;
    delete(id: number): Promise<boolean>;
}
