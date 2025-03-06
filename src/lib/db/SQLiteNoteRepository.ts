import Database from "better-sqlite3";
import type { Note } from "$lib/models";
import type { INoteRepository } from "./INoteRepository";

export class SQLiteNoteRepository implements INoteRepository {
    private db: Database.Database;

    constructor(dbFilePath: string) {
        this.db = new Database(dbFilePath);
        this.init();
    }

    private init() {
        const query = `
			CREATE TABLE IF NOT EXISTS notes (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				title VARCHAR(64) NOT NULL,
				content TEXT NOT NULL,
				created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
				modified_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
			)
		`;
        this.db.prepare(query).run();
    }

    async fetchAll(): Promise<Note[]> {
        const rows = this.db
            .prepare("select * from notes order by created_at desc")
            .all();
        return rows.map((row: Note) => ({
            ...row,
            created_at: new Date(row.created_at),
            modified_at: new Date(row.modified_at),
        }));
    }
    async fetchByID(id: number): Promise<Note | null> {
        const row = this.db.prepare("SELECT * FROM notes WHERE id = ?").get(id);
        if (!row) return null;
        return {
            ...row,
            created_at: new Date(row.created_at),
            modified_at: new Date(row.modified_at),
        };
    }
    async create(
        note: Omit<Note, "id" | "created_at" | "modified_at">,
    ): Promise<Note> {
        const createdAt = new Date();
        const stmt = this.db.prepare(
            "INSERT INTO notes(title, content, created_at, modified_at) VALUES (?,?,?,?)",
        );
        const result = stmt.run(
            note.title,
            note.content,
            createdAt.toISOString(),
            createdAt.toISOString(),
        );
        const id = Number(result.lastInsertRowid);

        return {
            id,
            title: note.title,
            content: note.content,
            created_at: createdAt,
            modified_at: createdAt,
        };
    }
    async update(
        id: number,
        note: Partial<Omit<Note, "id" | "created_at" | "modified_at">>,
    ): Promise<Note | null> {
        const currentNote = await this.fetchByID(id);
        if (!currentNote) return null;

        const updatedTitle = note.title ?? currentNote.title;
        const updatedContent = note.content ?? currentNote.content;
        const modifiedAt = new Date();

        const stmt = this.db.prepare(
            "UPDATE notes SET title = ?, content = ?, modified_at= ? WHERE id = ?",
        );
        stmt.run(updatedTitle, updatedContent, modifiedAt.toISOString(), id);
        return {
            ...currentNote,
            title: updatedTitle,
            content: updatedContent,
            modified_at: modifiedAt,
        };
    }
    async delete(id: number): Promise<boolean> {
        const stmt = this.db.prepare("DELETE FROM notes WHERE id = ?");
        const result = stmt.run(id);
        return result.changes > 0;
    }
}
