import {
  fetchLists as apiFetchLists,
  createList as apiCreateList,
  updateList as apiUpdateList,
  deleteList as apiDeleteList,
} from "../models/lists";

const getIdFromPayload = (p) => p?.id;
const getUserId = (user) => user?.id;

const isSuccess = (res) => res?.status >= 200 && res?.status < 300;

// Load all shopping lists
export const loadLists = async (setShoppingLists) => {
  try {
    const res = await apiFetchLists();
    if (isSuccess(res) && Array.isArray(res.payload) && typeof setShoppingLists === "function") {
      setShoppingLists(res.payload);
    }
    return res;
  } catch (e) {
    console.warn("Failed to load lists", e);
    return { status: 500, error: e };
  }
};

// Create a new list
export const createList = async (
  { name, description = "" },
  currentUser,
  { setShoppingLists, setUsers, setCurrentUser } = {}
) => {
  try {
    const payload = {
      name,
      description,
      creatorId: getUserId(currentUser),
      members: [{ userId: getUserId(currentUser) }],
      items: [],
      archived: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const res = await apiCreateList(payload);

    if (isSuccess(res) && res.payload) {
      const normalized = {
        ...res.payload,
        id: getIdFromPayload(res.payload),
        creatorId: res.payload.creatorId ?? payload.creatorId,
      };

      const newId = getIdFromPayload(normalized);

      if (typeof setShoppingLists === "function") {
        setShoppingLists((prev) => [normalized, ...(prev || [])]);
      }

      if (typeof setUsers === "function") {
        setUsers((prev) =>
          (prev || []).map((u) =>
            u.id === getUserId(currentUser)
              ? {
                  ...u,
                  createdLists: [...(u.createdLists || []), newId],
                  memberLists: [...(u.memberLists || []), newId],
                }
              : u
          )
        );
      }

      if (typeof setCurrentUser === "function") {
        setCurrentUser((prev) => ({
          ...prev,
          createdLists: [...(prev.createdLists || []), newId],
          memberLists: [...new Set([...(prev.memberLists || []), newId])],
        }));
      }

      return { ...res, payload: normalized };
    }

    return res;
  } catch (e) {
    console.warn("Failed to create list", e);
    return { status: 500, error: e };
  }
};

// Update an existing list
export const updateList = async (formData, listID, setShoppingLists) => {
  try {
    const res = await apiUpdateList(formData, listID);
    if (isSuccess(res) && res.payload && typeof setShoppingLists === "function") {
      const normalized = { ...res.payload, id: getIdFromPayload(res.payload) };

      setShoppingLists((prev) =>
        (prev || []).map((l) => (String(l.id) === String(listID) ? { ...l, ...normalized } : l))
      );
    }
    return res;
  } catch (e) {
    console.warn("Failed to update list", e);
    return { status: 500, error: e };
  }
};

// Delete a list
export const deleteList = async (
  listID,
  { setShoppingLists, setItems, setUsers, setCurrentUser } = {}
) => {
  try {
    const res = await apiDeleteList(listID);
    if (isSuccess(res)) {
      if (typeof setShoppingLists === "function") {
        setShoppingLists((prev) => (prev || []).filter((l) => String(l.id) !== String(listID)));
      }

      if (typeof setItems === "function") {
        setItems((prev) => (prev || []).filter((it) => String(it.listId) !== String(listID)));
      }

      if (typeof setUsers === "function") {
        setUsers((prev) =>
          (prev || []).map((u) => ({
            ...u,
            createdLists: (u.createdLists || []).filter((id) => String(id) !== String(listID)),
            memberLists: (u.memberLists || []).filter((id) => String(id) !== String(listID)),
          }))
        );
      }

      if (typeof setCurrentUser === "function") {
        setCurrentUser((prev) => ({
          ...prev,
          createdLists: (prev.createdLists || []).filter((id) => String(id) !== String(listID)),
          memberLists: (prev.memberLists || []).filter((id) => String(id) !== String(listID)),
        }));
      }
    }
    return res;
  } catch (e) {
    console.warn("Failed to delete list", e);
    return { status: 500, error: e };
  }
};
