import * as api from "../models/items";

export const fetchItems = async (listID, setItems) => {
  const res = await api.fetchItems(listID);
  if (res?.status >= 200 && res?.status < 300 && Array.isArray(res.payload)) {
    if (typeof setItems === "function") setItems(res.payload);
  }
  return res;
};

export const createItem = async (formData, { setItems, setShoppingLists } = {}) => {
  const res = await api.createItem(formData);
  if (res?.status >= 200 && res?.status < 300 && res.payload) {
    const created = { ...res.payload, id: res.payload.id };
    if (typeof setItems === "function") {
      setItems((prev) => [created, ...(prev || [])]);
    }
    if (typeof setShoppingLists === "function" && created.listId) {
      setShoppingLists((prev) =>
        (prev || []).map((l) =>
          String(l.id) === String(created.listId) ? { ...l, items: [...(l.items || []), created.id] } : l
        )
      );
    }
  }
  return res;
};

export const deleteItem = async (itemID, { setItems, setShoppingLists } = {}) => {
  const res = await api.deleteItem(itemID);
  if (res?.status >= 200 && res?.status < 300) {
    if (typeof setItems === "function") {
      setItems((prev) => (prev || []).filter((i) => String(i.id) !== String(itemID)));
    }
    if (typeof setShoppingLists === "function") {
      setShoppingLists((prev) =>
        (prev || []).map((l) => ({
          ...l,
          items: (l.items || []).filter((iid) => String(iid) !== String(itemID)),
        }))
      );
    }
  }
  return res;
};

export const checkItem = async (itemID, { setItems } = {}) => {
  const res = await api.checkItem(itemID);
  if (res?.status >= 200 && res?.status < 300 && res.payload) {
    if (typeof setItems === "function") {
      setItems((prev) =>
        (prev || []).map((it) => (String(it.id) === String(itemID) ? { ...it, checked: true, ...res.payload } : it))
      );
    }
  }
  return res;
};

export const uncheckItem = async (itemID, { setItems } = {}) => {
  const res = await api.uncheckItem(itemID);
  if (res?.status >= 200 && res?.status < 300 && res.payload) {
    if (typeof setItems === "function") {
      setItems((prev) =>
        (prev || []).map((it) => (String(it.id) === String(itemID) ? { ...it, checked: false, ...res.payload } : it))
      );
    }
  }
  return res;
};
