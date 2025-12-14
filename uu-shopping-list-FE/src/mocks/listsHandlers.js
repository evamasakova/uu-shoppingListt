// src/mocks/handlers/listsHandlers.js
import { http, HttpResponse } from "msw";

// simple in‑memory list store
export let shoppingLists = [];

export const listsHandlers = [
  http.get("/shoppingLists", () => {
    return HttpResponse.json(shoppingLists, { status: 200 });
  }),

  http.post("/shoppingLists", async ({ request }) => {
    const body = await request.json();

    const newList = {
      ...body,
      id: Date.now().toString(),
      members: body.members ?? [],
      items: body.items ?? [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    shoppingLists.push(newList);

    return HttpResponse.json(newList, { status: 201 });
  }),

  http.patch("/shoppingLists/:id", async ({ params, request }) => {
    const id = String(params.id);
    const updates = await request.json();

    let updatedList = null;

    shoppingLists = shoppingLists.map((list) => {
      if (String(list.id) === id) {
        updatedList = {
          ...list,
          ...updates,
          members: list.members ?? [],
          items: [...(list.items ?? []), ...(updates.items ?? [])], // merge old + new items
          updatedAt: new Date().toISOString(),
        };
        return updatedList;
      }
      return list;
    });

    if (!updatedList) {
      return HttpResponse.json({ msg: "List not found" }, { status: 404 });
    }

    return HttpResponse.json(updatedList, { status: 200 });
  }),
  http.delete("/shoppingLists/:id", ({ params }) => {
    const id = String(params.id);
    const before = shoppingLists.length;

    shoppingLists = shoppingLists.filter((list) => String(list.id) !== id);

    if (shoppingLists.length === before) {
      return HttpResponse.json({ msg: "List not found" }, { status: 404 });
    }

    return HttpResponse.json({ success: true }, { status: 200 });
  }),
];
export const checkItem = async (itemId) => {
  // Example using patch
  return api.patch(`/items/${itemId}`, { checked: true });
};

export const uncheckItem = async (itemId) => {
  return api.patch(`/items/${itemId}`, { checked: false });
};
