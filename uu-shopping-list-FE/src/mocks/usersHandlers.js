// src/mocks/handlers/membersHandlers.js
import { http, HttpResponse } from "msw";
import { shoppingLists } from "./listsHandlers.js";

// Mock users
export const users = [
  {
    id: "u1",
    username: "john_doe",
    email: "john@example.com",
    passwordHash: "mock-hash-123",
    createdLists: ["l1"],
    memberLists: ["l1", "l2"],
    createdAt: "2025-10-29T10:00:00Z",
    updatedAt: "2025-10-30T10:00:00Z",
  },
  {
    id: "u2",
    username: "jane_smith",
    email: "jane@example.com",
    passwordHash: "mock-hash-456",
    createdLists: ["l2"],
    memberLists: ["l1", "l2"],
    createdAt: "2025-10-29T11:00:00Z",
    updatedAt: "2025-10-30T11:00:00Z",
  },
  {
    id: "u3",
    username: "alice_wonder",
    email: "alice@example.com",
    passwordHash: "mock-hash-789",
    createdLists: [],
    memberLists: ["l1"],
    createdAt: "2025-10-29T12:00:00Z",
    updatedAt: "2025-10-30T12:00:00Z",
  },
];

function findListById(listId) {
  return shoppingLists.find((l) => String(l.id) === String(listId));
}

export const membersHandlers = [
  // GET members of a list
  http.get("/shoppingLists/:id/members", ({ params }) => {
    const list = findListById(params.id);
    const members = Array.isArray(list?.members) ? list.members : [];

    // Attach user info to each member
    const membersWithUsers = members.map((m) => ({
      ...m,
      user: users.find((u) => u.id === m.userId) || null,
    }));

    return HttpResponse.json(membersWithUsers, { status: 200 });
  }),

  // POST add a member
  http.post("/shoppingLists/:id/members", async ({ params, request }) => {
    const list = findListById(params.id);
    if (!list) {
      return HttpResponse.json({ msg: "List not found" }, { status: 404 });
    }

    const body = await request.json();
    const { name, userId: providedUserId } = body;
    if (!name) {
      return HttpResponse.json({ msg: "Missing name" }, { status: 400 });
    }

    const newMember = {
      id: `m${Date.now()}`,
      name,
      userId: providedUserId ?? null,
      listId: list.id,
      createdAt: new Date().toISOString(),
    };

    list.members.push(newMember);
    list.updatedAt = new Date().toISOString();

    // Attach user info
    const memberWithUser = {
      ...newMember,
      user: users.find((u) => u.id === providedUserId) || null,
    };

    return HttpResponse.json(memberWithUser, { status: 201 });
  }),

  // DELETE a member
  http.delete("/shoppingLists/:listId/members/:memberId", ({ params }) => {
    const list = findListById(params.listId);
    if (!list) {
      return HttpResponse.json({ msg: "List not found" }, { status: 404 });
    }

    list.members = list.members.filter((m) => String(m.id) !== String(params.memberId));
    list.updatedAt = new Date().toISOString();

    return HttpResponse.json({ memberId: params.memberId, listId: list.id }, { status: 200 });
  }),
];
