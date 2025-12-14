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

export const fetchLists = async () => {
  const res = await fetch("/shoppingLists", {
    headers: { Accept: "application/json" },
  });
  const data = await parseJsonSafe(res);
  return makeResponse(res, data);
};

export const createList = async (formData) => {
  const res = await fetch("/shoppingLists", {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });
  const data = await parseJsonSafe(res);
  return makeResponse(res, data);
};

export const updateList = async (formData, listId) => {
  const res = await fetch(`/shoppingLists/${listId}`, {
    method: "PATCH",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });
  const data = await parseJsonSafe(res);
  return makeResponse(res, data);
};

export const deleteList = async (listId) => {
  const res = await fetch(`/shoppingLists/${listId}`, {
    method: "DELETE",
    headers: { Accept: "application/json" },
  });
  const data = await parseJsonSafe(res);
  return makeResponse(res, data);
};
