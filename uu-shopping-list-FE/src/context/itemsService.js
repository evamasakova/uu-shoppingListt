import * as api from "../models/items";

// Helper to handle successful responses
const isSuccess = (res) => res?.status >= 200 && res?.status < 300;

// Fetch items for a specific list
export const fetchItems = async (listId, setItems) => {
  try {
    const res = await api.fetchItems(listId);
    if (isSuccess(res) && Array.isArray(res.payload) && typeof setItems === "function") {
      setItems(res.payload);
    }
    return res;
  } catch (e) {
    console.warn("Failed to fetch items", e);
    return { status: 500, error: e };
  }
};

// Create a new item
export const createItem = async (formData, { setItems, setShoppingLists } = {}) => {
  try {
    const res = await api.createItem(formData);
    if (isSuccess(res) && res.payload) {
      const created = { ...res.payload, id: res.payload.id };

      if (typeof setItems === "function") {
        setItems((prev) => [created, ...(prev || [])]);
      }

      if (typeof setShoppingLists === "function" && created.listId) {
        setShoppingLists((prev) =>
          (prev || []).map((l) =>
            String(l.id) === String(created.listId)
              ? { ...l, items: [...(l.items || []), created.id] }
              : l
          )
        );
      }
    }
    return res;
  } catch (e) {
    console.warn("Failed to create item", e);
    return { status: 500, error: e };
  }
};

// Delete an item
export const deleteItem = async (itemId, { setItems, setShoppingLists } = {}) => {
  try {
    const res = await api.deleteItem(itemId);
    if (isSuccess(res)) {
      if (typeof setItems === "function") {
        setItems((prev) => (prev || []).filter((i) => String(i.id) !== String(itemId)));
      }
      if (typeof setShoppingLists === "function") {
        setShoppingLists((prev) =>
          (prev || []).map((l) => ({
            ...l,
            items: (l.items || []).filter((iid) => String(iid) !== String(itemId)),
          }))
        );
      }
    }
    return res;
  } catch (e) {
    console.warn("Failed to delete item", e);
    return { status: 500, error: e };
  }
};

// Check an item
export const checkItem = async (itemId, { setItems } = {}) => {
  try {
    const res = await api.checkItem(itemId);
    if (isSuccess(res) && res.payload && typeof setItems === "function") {
      setItems((prev) =>
        (prev || []).map((it) =>
          String(it.id) === String(itemId) ? { ...it, checked: true, ...res.payload } : it
        )
      );
    }
    return res;
  } catch (e) {
    console.warn("Failed to check item", e);
    return { status: 500, error: e };
  }
};

// Uncheck an item
export const uncheckItem = async (itemId, { setItems } = {}) => {
  try {
    const res = await api.uncheckItem(itemId);
    if (isSuccess(res) && res.payload && typeof setItems === "function") {
      setItems((prev) =>
        (prev || []).map((it) =>
          String(it.id) === String(itemId) ? { ...it, checked: false, ...res.payload } : it
        )
      );
    }
    return res;
  } catch (e) {
    console.warn("Failed to uncheck item", e);
    return { status: 500, error: e };
  }
};
