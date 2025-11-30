import {
  fetchLists as apiFetchLists,
  createList as apiCreateList,
  updateList as apiUpdateList,
  deleteList as apiDeleteList,
} from "../models/lists";

const getIdFromPayload = (p) => p?.id ;

const getUserId = (user) => user?.id ;

export const loadLists = async (setShoppingLists) => {
  const res = await apiFetchLists();
  if (res.status >= 200 && res.status < 300 && Array.isArray(res.payload)) {
    if (typeof setShoppingLists === "function") setShoppingLists(res.payload);
  }
  return res;
};

export const createList = async (
  { name, description = "" },
  currentUser,
  { setShoppingLists, setUsers, setCurrentUser } = {}
) => {
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
  if (res.status >= 200 && res.status < 300 && res.payload) {
    const normalized = {
      ...res.payload,
      id: res.payload.id ,
      creatorId: res.payload.creatorId ?? payload.creatorId,
    };

    const newId = getIdFromPayload(normalized);

    if (typeof setShoppingLists === "function")
      setShoppingLists((prev) => [normalized, ...(prev || [])]);

    if (typeof setUsers === "function") {
      setUsers((prev) =>
        prev.map((u) =>
          (u.id ) === getUserId(currentUser)
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
};

export const updateList = async (formData, listID, setShoppingLists) => {
  const res = await apiUpdateList(formData, listID);
  if (
    res.status >= 200 &&
    res.status < 300 &&
    res.payload &&
    typeof setShoppingLists === "function"
  ) {
    const normalized = { ...res.payload, id: res.payload.id };

    setShoppingLists((prev) =>
      (prev || []).map((l) => {
        const lid = String(l.id );
        const target = String(listID);
        return lid === target ? { ...l, ...normalized } : l;
      })
    );
  }
  return res;
};

export const deleteList = async (
  listID,
  { setShoppingLists, setItems, setUsers, setCurrentUser } = {}
) => {
  const res = await apiDeleteList(listID);
  if (res.status >= 200 && res.status < 300) {
    if (typeof setShoppingLists === "function")
      setShoppingLists((prev) => (prev || []).filter((l) => !((l.id === listID) )));

    if (typeof setItems === "function")
      setItems((prev) =>
        (prev || []).filter(
          (it) => !(it.listId === listID || it.listId === String(listID))
        )
      );

    if (typeof setUsers === "function")
      setUsers((prev) =>
        (prev || []).map((u) => ({
          ...u,
          createdLists: (u.createdLists || []).filter(
            (id) => id !== listID && id !== String(listID)
          ),
          memberLists: (u.memberLists || []).filter(
            (id) => id !== listID && id !== String(listID)
          ),
        }))
      );

    if (typeof setCurrentUser === "function")
      setCurrentUser((prev) => ({
        ...prev,
        createdLists: (prev.createdLists || []).filter(
          (id) => id !== listID && id !== String(listID)
        ),
        memberLists: (prev.memberLists || []).filter(
          (id) => id !== listID && id !== String(listID)
        ),
      }));
  }
  return res;
};
