import { json, type RequestHandler } from "@sveltejs/kit";
import { noteRepository } from "$lib/db/db";

export const GET: RequestHandler = async ({ params }) => {
    const id = Number(params.id);
    const note = await noteRepository.fetchByID(id);
    if (!note) {
        return new Response(JSON.stringify({ message: "Note not found" }), {
            status: 404,
        });
    }
    return json(note);
};

export const PATCH: RequestHandler = async ({ request, params }) => {
    const id = Number(params.id);
    try {
        const data = await request.json();
        const updatedNote = await noteRepository.update(id, data);
        if (!updatedNote) {
            return new Response(JSON.stringify({ message: "Note not found" }), {
                status: 404,
            });
        }
        return new Response(JSON.stringify(updatedNote), { status: 200 });
    } catch (error: any) {
        return new Response(
            JSON.stringify({
                message: "Error updating note",
                error: error.message,
            }),
            { status: 500 },
        );
    }
};

export const DELETE: RequestHandler = async ({ params }) => {
    const id = Number(params.id);
    const success = await noteRepository.delete(id);
    if (!success) {
        return new Response(JSON.stringify({ message: "Note not found" }), {
            status: 404,
        });
    }
    return new Response(JSON.stringify({ message: "Note deleted" }), {
        status: 200,
    });
};
