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

export const fetchItems = async (listId) => {
  const url = listId ? `/items?listId=${encodeURIComponent(listId)}` : "/items";
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  const data = await parseJsonSafe(res);
  return makeResponse(res, data);
};

export const createItem = async (formData) => {
  const res = await fetch("/items", {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });
  const data = await parseJsonSafe(res);
  return makeResponse(res, data);
};

export const updateItem = async (formData, itemId) => {
  const res = await fetch(`/items/${itemId}`, {
    method: "PATCH",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });
  const data = await parseJsonSafe(res);
  return makeResponse(res, data);
};

export const deleteItem = async (itemId) => {
  const res = await fetch(`/items/${itemId}`, {
    method: "DELETE",
    headers: { Accept: "application/json" },
  });
  const data = await parseJsonSafe(res);
  return makeResponse(res, data);
};
// Check an item
export const checkItem = async (itemId, { setItems } = {}) => {
  const res = await updateItem({ checked: true }, itemId);
  if (
    res.status >= 200 &&
    res.status < 300 &&
    res.payload &&
    typeof setItems === "function"
  ) {
    setItems((prev) =>
      (prev || []).map((it) =>
        String(it.id) === String(itemId)
          ? { ...it, checked: true, ...res.payload }
          : it
      )
    );
  }
  return res;
};

// Uncheck an item
export const uncheckItem = async (itemId, { setItems } = {}) => {
  const res = await updateItem({ checked: false }, itemId);
  if (
    res.status >= 200 &&
    res.status < 300 &&
    res.payload &&
    typeof setItems === "function"
  ) {
    setItems((prev) =>
      (prev || []).map((it) =>
        String(it.id) === String(itemId)
          ? { ...it, checked: false, ...res.payload }
          : it
      )
    );
  }
  return res;
};
