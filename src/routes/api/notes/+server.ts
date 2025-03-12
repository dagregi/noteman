import { json, type RequestHandler } from "@sveltejs/kit";
import { noteRepository } from "$lib/db/db";

export const GET: RequestHandler = async () => {
    const notes = await noteRepository.fetchAll();
    return json(notes);
};

export const POST: RequestHandler = async ({ request }) => {
    try {
        const data = await request.json();
        const { title, content } = data;
        if (!title) {
            return new Response(
                JSON.stringify({ message: "Missing title" }),
                { status: 400 },
            );
        }
        const newNote = await noteRepository.create({ title, content });
        return new Response(JSON.stringify(newNote), { status: 201 });
    } catch (error: any) {
        return new Response(
            JSON.stringify({
                message: "Error creating note",
                error: error.message,
            }),
            { status: 500 },
        );
    }
};
