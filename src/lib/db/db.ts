import { SQLiteNoteRepository } from "./SQLiteNoteRepository";
import type { INoteRepository } from "./INoteRepository";

export const noteRepository: INoteRepository = new SQLiteNoteRepository("notes.db");
