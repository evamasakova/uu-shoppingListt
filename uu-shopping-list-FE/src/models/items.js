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

/**
 * Fetch items for a shopping list.
 * Expects items to have a listId field (json-server query: /items?listId=...)
 * @param {number|string} listID
 */
export const fetchItems = async (listID) => {
  try {
    // json-server style: /items?listId=123
    const url = `${baseUrl}/items${
      listID ? `?listId=${encodeURIComponent(listID)}` : ""
    }`;
    const req = await fetch(url, {
      headers: { Accept: "application/json" },
      method: "GET",
    });

    const data = await parseJsonSafe(req);
    return makeResponse(req, data);
  } catch (err) {
    return { status: 0, payload: null, msg: null, errors: [err.message] };
  }
};

/**
 * Create a new item.
 * formData should include at least { name, listId } (json-server /items)
 * @param {object} formData
 */
export const createItem = async (formData) => {
  try {
    const req = await fetch(`${baseUrl}/items`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(formData),
    });
    const data = await parseJsonSafe(req);
    return makeResponse(req, data);
  } catch (err) {
    return { status: 0, payload: null, msg: null, errors: [err.message] };
  }
};

/**
 * Delete an item by ID
 * @param {number|string} itemID
 */
export const deleteItem = async (itemID) => {
  try {
    const req = await fetch(
      `${baseUrl}/items/${encodeURIComponent(itemID)}`,
      {
        headers: { Accept: "application/json" },
        method: "DELETE",
      }
    );
    const data = await parseJsonSafe(req);
    return makeResponse(req, data);
  } catch (err) {
    return { status: 0, payload: null, msg: null, errors: [err.message] };
  }
};

/**
 * Update an item by ID
 * @param {object} formData - The data to update
 * @param {number|string} itemID - The ID of the item to update
 */
export const updateItem = async (formData, itemID) => {
  try {
    const req = await fetch(
      `${baseUrl}/items/${encodeURIComponent(itemID)}`,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "PATCH",
        body: JSON.stringify(formData),
      }
    );
    const data = await parseJsonSafe(req);
    return makeResponse(req, data);
  } catch (err) {
    return { status: 0, payload: null, msg: null, errors: [err.message] };
  }
};

/**
 * Set checked = true for an item
 * @param {number|string} itemID
 */
export const checkItem = async (itemID) =>
  updateItem(
    { checked: true, updatedAt: new Date().toISOString() },
    itemID
  );
/**
 * Set checked = false for an item
 * @param {number|string} itemID
 */
export const uncheckItem = async (itemID) =>
  updateItem(
    { checked: false, updatedAt: new Date().toISOString() },
    itemID
  );
