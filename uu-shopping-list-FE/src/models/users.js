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

export const fetchMembers = async (listId) => {
  const res = await fetch(`/shoppingLists/${listId}/members`, {
    headers: { Accept: "application/json" },
  });
  const data = await parseJsonSafe(res);
  return makeResponse(res, data);
};

export const inviteMember = async (listId, formData) => {
  const res = await fetch(`/shoppingLists/${listId}/members`, {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });
  const data = await parseJsonSafe(res);
  return makeResponse(res, data);
};

export const removeMember = async (listId, memberId) => {
  const res = await fetch(`/shoppingLists/${listId}/members/${memberId}`, {
    method: "DELETE",
    headers: { Accept: "application/json" },
  });
  const data = await parseJsonSafe(res);
  return makeResponse(res, data);
};
export const leaveList = removeMember;
