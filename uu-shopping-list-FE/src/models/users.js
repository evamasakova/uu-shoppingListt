const port = import.meta.env.VITE_PORT || 3000;
const baseUrl = `http://localhost:${port}`;

const parseJsonSafe = async (res) => {
  try {
    return await res.json();
  } catch {
    return null;
  }
};
const makeResponse = (res, data) => ({
  status: res.status,
  payload: data ?? null,
  msg: data?.msg ?? null,
  errors: data?.errors ?? null,
});

// get shopping list by id helper
const fetchShoppingList = async (listId) => {
  const res = await fetch(
    `${baseUrl}/shoppingLists/${encodeURIComponent(listId)}`,
    {
      headers: { Accept: "application/json" },
      method: "GET",
    }
  );
  const data = await parseJsonSafe(res);
  return { res, data };
};

const fetchUserById = async (id) => {
  try {
    const r = await fetch(
      `${baseUrl}/users/${encodeURIComponent(id)}`,
      {
        headers: { Accept: "application/json" },
        method: "GET",
      }
    );
    return await parseJsonSafe(r);
  } catch {
    return null;
  }
};

const findUserByQuery = async (q) => {
  // q: { email?, username? }
  try {
    let url = `${baseUrl}/users`;
    const params = [];
    if (q.email) params.push(`email=${encodeURIComponent(q.email)}`);
    if (q.username) params.push(`username=${encodeURIComponent(q.username)}`);
    if (params.length) url += `?${params.join("&")}`;
    const r = await fetch(url, { headers: { Accept: "application/json" }, method: "GET" });
    const data = await parseJsonSafe(r);
    return Array.isArray(data) && data.length ? data[0] : null;
  } catch {
    return null;
  }
};

/**
 * Return membership records for a list (reads shoppingLists/:id.members)
 * Attaches username when possible.
 */
export const fetchMembers = async (listId) => {
  try {
    if (!listId) {
      return { status: 400, payload: null, msg: "Missing listId", errors: [] };
    }

    const { res, data: list } = await fetchShoppingList(listId);
    if (res.status === 404 || !list) {
      return makeResponse(res, []);
    }

    const members = Array.isArray(list.members) ? list.members : [];

    // For members with userId, try to fetch their user record to attach username
    const enhanced = await Promise.all(
      members.map(async (m) => {
        if (!m || !m.userId) return m;
        const user = await fetchUserById(m.userId);
        if (user && user.username) return { ...m, username: user.username };
        return m;
      })
    );

    return { status: 200, payload: enhanced, msg: null, errors: null };
  } catch (err) {
    return { status: 0, payload: null, msg: null, errors: [err.message] };
  }
};

/**
 * Invite a member: adds a member record into shoppingLists/:listId.members
 * formData: { name, listId, userId? } — if name looks like username/email we try to resolve a user
 */
export const inviteMember = async (formData) => {
  try {
    const { listId, name, userId: providedUserId = null } = formData || {};
    if (!listId || !name) {
      return { status: 400, payload: null, msg: "Missing listId or name", errors: [] };
    }

    const { res: getRes, data: list } = await fetchShoppingList(listId);
    if (getRes.status === 404 || !list) {
      return makeResponse(getRes, null);
    }

    // try to resolve a registered user
    let resolvedUser = null;
    if (providedUserId) {
      resolvedUser = await fetchUserById(providedUserId);
    } else {
      // if input looks like email
      if (name.includes("@")) {
        resolvedUser = await findUserByQuery({ email: name });
      }
      // if not found by email, try username
      if (!resolvedUser) {
        resolvedUser = await findUserByQuery({ username: name });
      }
    }

    const newMember = {
      id: `m${Date.now()}`,
      // store display name as the registered username when available, otherwise the provided name
      name: resolvedUser?.username ?? name,
      userId: resolvedUser?.id ?? providedUserId ?? null,
      listId,
      createdAt: new Date().toISOString(),
    };

    const updatedMembers = [...(list.members || []), newMember];

    const patchRes = await fetch(
      `${baseUrl}/shoppingLists/${encodeURIComponent(listId)}`,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "PATCH",
        body: JSON.stringify({ members: updatedMembers, updatedAt: new Date().toISOString() }),
      }
    );

    const patchData = await parseJsonSafe(patchRes);
    // return the created member as payload (with username if resolved)
    return makeResponse(patchRes, newMember);
  } catch (err) {
    return { status: 0, payload: null, msg: null, errors: [err.message] };
  }
};

/**
 * Remove a member by memberId: finds the shoppingList containing that member and patches it
 */
export const leaveList = async (memberID) => {
  try {
    if (!memberID) {
      return { status: 400, payload: null, msg: "Missing memberID", errors: [] };
    }

    // fetch all lists and find the one containing this member
    const listsRes = await fetch(`${baseUrl}/shoppingLists`, {
      headers: { Accept: "application/json" },
      method: "GET",
    });
    const lists = await parseJsonSafe(listsRes);

    const found = (lists || []).find((sl) =>
      Array.isArray(sl.members) && sl.members.some((m) => String(m.id) === String(memberID))
    );

    if (!found) {
      return { status: 404, payload: null, msg: "Member not found in any list", errors: [] };
    }

    const updatedMembers = (found.members || []).filter((m) => String(m.id) !== String(memberID));

    const patchRes = await fetch(
      `${baseUrl}/shoppingLists/${encodeURIComponent(found.id)}`,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "PATCH",
        body: JSON.stringify({ members: updatedMembers, updatedAt: new Date().toISOString() }),
      }
    );

    const patchData = await parseJsonSafe(patchRes);
    return makeResponse(patchRes, { memberId: memberID, listId: found.id });
  } catch (err) {
    return { status: 0, payload: null, msg: null, errors: [err.message] };
  }
};

export const removeMember = async (memberID) => {
  return leaveList(memberID);
};
