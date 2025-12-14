import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { DataContext } from "../../context/DataContext";
import Cell from "../../components/Cell";

import {
  updateList as updateListService,
  loadLists as loadListsService,
} from "../../context/listsService";
import {
  fetchItems as fetchItemsService,
  createItem as createItemService,
  deleteItem as deleteItemService,
  checkItem as checkItemService,
  uncheckItem as uncheckItemService,
} from "../../context/itemsService";
import {
  fetchMembersService,
  inviteMemberService,
  leaveList as leaveListService,
  removeMember as removeMemberService,
} from "../../context/usersService";

export default function ListDetails() {
  const { listId } = useParams();
  const {
    shoppingLists,
    setShoppingLists,
    users,
    setUsers,
    items,
    setItems,
    currentUser,
  } = useContext(DataContext);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedUserName, setSelectedUserName] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  const navigate = useNavigate();

  const userId = currentUser?.id;

  const [list, setList] = useState(null);
  const [members, setMembers] = useState([]);
  const [newName, setNewName] = useState("");
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [filter, setFilter] = useState("all");
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [isSubmittingItem, setIsSubmittingItem] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await fetchMembersService(listId, setMembers);
      if (
        res?.status >= 200 &&
        res?.status < 300 &&
        Array.isArray(res.payload)
      ) {
        const membersData = res.payload;
        setMembers(membersData);

        // Add any missing users to users array
        setUsers((prevUsers) => {
          const newUsers = membersData
            .map((m) => m.user) // assumes m.user exists with {id, username}
            .filter(Boolean)
            .filter((u) => !prevUsers?.some((pu) => pu.id === u.id));
          return [...(prevUsers || []), ...newUsers];
        });
      }
    })();
  }, [listId]);

  useEffect(() => {
    (async () => {
      const listsRes = await loadListsService(setShoppingLists);
      let found = null;

      if (
        listsRes?.status >= 200 &&
        listsRes?.status < 300 &&
        Array.isArray(listsRes.payload)
      ) {
        found = listsRes.payload.find((l) => String(l.id) === String(listId));
      }

      if (!found) {
        found = (shoppingLists || []).find(
          (l) => String(l.id) === String(listId)
        );
      }

      if (found) {
        setList(found);
        setNewName(found.name || "");
      }

      await fetchItemsService(listId, setItems);
      await fetchMembersService(listId, setMembers);
    })();
  }, [listId]);

  useEffect(() => {
    const found = (shoppingLists || []).find((l) => l.id === listId);
    if (found) {
      setList(found);
      setNewName(found.name || "");
    }
  }, [shoppingLists, listId]);

  if (!list) return <div>List not found</div>;

  const listItems = (items || []).filter(
    (i) => String(i.listId) === String(list.id)
  );

  const filteredItems = listItems.filter((item) => {
    if (filter === "all") return true;
    if (filter === "checked") return item.checked;
    if (filter === "unchecked") return !item.checked;
    return true;
  });

  const isCreator = list.creatorId === userId;

  const handleNameChange = async () => {
    if (!isCreator) return;

    const id = list?.id;
    if (!id) {
      console.warn("Missing list id for update");
      return;
    }

    const res = await updateListService(
      { name: newName, updatedAt: new Date().toISOString() },
      id,
      setShoppingLists
    );

    if (res?.status >= 200 && res?.status < 300 && res.payload) {
      const updated = { ...res.payload, id: res.payload.id };

      setShoppingLists((prev) =>
        (prev || []).map((l) =>
          String(l.id) === String(updated.id) ? { ...l, ...updated } : l
        )
      );

      setList((prev) => ({ ...prev, ...updated }));
    } else {
      console.warn("Failed to update list name", res);
    }
  };

  const handleAddMember = async () => {
    if (!selectedUser || !list) {
      console.warn("Missing user or list id");
      return;
    }

    const formData = {
      name: selectedUser.username,
      userId: selectedUser.id,
    };

    const res = await inviteMemberService(list.id, formData);

    if (res.status >= 200 && res.status < 300) {
      console.log("Member added:", res.payload);
      setMembers((prev) => [res.payload, ...(prev || [])]);
      setSelectedUserId("");
      setSelectedUser(null);
    } else {
      console.warn("Failed to invite member", res);
    }
  };

  const handleRemoveMember = async (memberRecordId, memberUserId) => {
    if (!isCreator) {
      console.warn("Only the creator can remove members");
      return;
    }

    if (!memberRecordId && memberUserId) {
      const candidate =
        (members || []).find(
          (m) => String(m.userId) === String(memberUserId)
        ) ||
        (list?.members || []).find(
          (m) => String(m.userId) === String(memberUserId)
        );
      if (candidate && candidate.id) {
        memberRecordId = candidate.id;
      }
    }

    if (!memberRecordId && !memberUserId) {
      console.warn("Missing memberRecordId and memberUserId for removal");
      alert("Nelze odstranit člena: chybí identifikátor člena.");
      return;
    }

    if (!window.confirm("Opravdu odstranit tohoto člena ze seznamu?")) return;

    if (memberRecordId) {
      const res = await removeMemberService(memberRecordId, {
        setMembers,
        setUsers,
        setShoppingLists,
      });

      if (res?.status >= 200 && res?.status < 300) {
        if (typeof setMembers === "function") {
          setMembers((prev) =>
            (prev || []).filter((m) => String(m.id) !== String(memberRecordId))
          );
        }
        if (typeof setShoppingLists === "function") {
          setShoppingLists((prev) =>
            (prev || []).map((l) =>
              l.id === list.id
                ? {
                    ...l,
                    members: (l.members || []).filter(
                      (m) => String(m.id) !== String(memberRecordId)
                    ),
                  }
                : l
            )
          );
        }
        if (typeof setUsers === "function" && memberUserId) {
          setUsers((prev) =>
            (prev || []).map((u) =>
              u.id === memberUserId
                ? {
                    ...u,
                    memberLists: (u.memberLists || []).filter(
                      (id) => id !== list.id
                    ),
                  }
                : u
            )
          );
        }
        setList((prev) =>
          prev
            ? {
                ...prev,
                members: (prev.members || []).filter(
                  (m) => String(m.id) !== String(memberRecordId)
                ),
              }
            : prev
        );
        return;
      } else {
        console.warn("Failed to remove member by memberRecordId", res);
        alert("Nepodařilo se odstranit člena. Zkontrolujte síťové volání.");
        return;
      }
    }

    try {
      const updatedMembers = (list.members || []).filter(
        (m) => String(m.userId) !== String(memberUserId)
      );

      const patchRes = await updateListService(
        { members: updatedMembers, updatedAt: new Date().toISOString() },
        list.id,
        setShoppingLists
      );

      if (patchRes?.status >= 200 && patchRes?.status < 300) {
        // update local members & users & list state
        if (typeof setMembers === "function") {
          setMembers(updatedMembers);
        }
        if (typeof setShoppingLists === "function") {
          setShoppingLists((prev) =>
            (prev || []).map((l) =>
              l.id === list.id ? { ...l, members: updatedMembers } : l
            )
          );
        }
        if (typeof setUsers === "function") {
          setUsers((prev) =>
            (prev || []).map((u) =>
              u.id === memberUserId
                ? {
                    ...u,
                    memberLists: (u.memberLists || []).filter(
                      (id) => id !== list.id
                    ),
                  }
                : u
            )
          );
        }
        setList((prev) => (prev ? { ...prev, members: updatedMembers } : prev));
      } else {
        console.warn(
          "Failed to remove member by userId via list PATCH",
          patchRes
        );
        alert("Nepodařilo se odstranit člena. Zkontrolujte síťové volání.");
      }
    } catch (err) {
      console.error("Error removing member fallback", err);
      alert("Chyba při odstraňování člena. Podívejte se do konzole / Network.");
    }
  };

  const handleLeaveList = async () => {
    if (isCreator) {
      alert("Creators cannot leave their own list.");
      return;
    }

    const myMember = (members || []).find(
      (m) => String(m.userId) === String(userId)
    );
    if (!myMember) {
      const fallback = (list.members || []).find(
        (m) => String(m.userId) === String(userId)
      );
      if (!fallback) return;
      setShoppingLists((prev) =>
        prev.map((l) =>
          l.id === list.id
            ? {
                ...l,
                members: (l.members || []).filter((m) => m.userId !== userId),
              }
            : l
        )
      );
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId
            ? {
                ...u,
                memberLists: (u.memberLists || []).filter(
                  (id) => id !== list.id
                ),
              }
            : u
        )
      );
      navigate("/");
      return;
    }

    const res = await leaveListService(myMember.id, {
      setMembers,
      setUsers,
      setShoppingLists,
    });
    if (res?.status >= 200 && res?.status < 300) {
      navigate("/");
    } else {
      console.warn("Failed to leave list", res);
    }
  };

  const handleAddItem = () => {
    setNewItemName("");
    setIsAddItemOpen(true);
  };

  const submitAddItem = async () => {
    const name = (newItemName || "").trim();
    if (!name) return alert("Zadejte název položky.");
    if (isSubmittingItem) return;
    if (!list?.id) {
      console.warn("Missing list id for adding item");
      return;
    }

    const formData = {
      name,
      listId: list.id,
      checked: false,
      addedBy: userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setIsSubmittingItem(true);
    try {
      const res = await createItemService(formData, setItems);
      if (!(res?.status >= 200 && res?.status < 300 && res.payload)) {
        console.warn("Failed to create item", res);
        alert("Přidání položky se nezdařilo.");
        return;
      }

      const created = { ...res.payload, id: res.payload.id };

      const updatedItemsArray = [...(list.items || []), created.id];
      const updateRes = await updateListService(
        { items: updatedItemsArray, updatedAt: new Date().toISOString() },
        list.id,
        setShoppingLists
      );

      if (!(updateRes?.status >= 200 && updateRes?.status < 300)) {
        console.warn("Failed to persist item id into list", updateRes);
        alert(
          "Položka vytvořena, ale nepodařilo se ji přidat do seznamu na serveru."
        );
      }

      if (typeof setItems === "function") {
        setItems((prev) => [created, ...(prev || [])]);
      }

      setList((prev) => (prev ? { ...prev, items: updatedItemsArray } : prev));

      setNewItemName("");
      setIsAddItemOpen(false);
    } catch (err) {
      console.error("submitAddItem error", err);
      alert("Chyba při přidávání položky. Podívejte se do console / Network.");
    } finally {
      setIsSubmittingItem(false);
    }
  };

  return (
    <>
      {/* Back Button */}
      <div className="max-w-4xl mx-auto mt-6 px-4">
        <Link
          to="/"
          className="inline-block mb-4 text-indigo-600 hover:text-indigo-800 transition-colors font-medium"
        >
          ← Back to Lists
        </Link>

        <div className="bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 border-b flex justify-between items-center bg-gradient-to-r from-indigo-50 to-pink-50">
            {isCreator ? (
              <div className="flex items-center space-x-2">
                <input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="border border-gray-300 px-3 py-1.5 rounded-md focus:ring-2 focus:ring-indigo-400 outline-none text-gray-800"
                />
                <button
                  onClick={handleNameChange}
                  className="bg-indigo-500 text-white px-3 py-1.5 rounded hover:bg-indigo-600 transition-colors"
                >
                  Save
                </button>
              </div>
            ) : (
              <h2 className="text-2xl font-semibold text-gray-800">
                {list.name}
              </h2>
            )}

            {/* Leave Button */}
            {!isCreator && (
              <button
                onClick={handleLeaveList}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
              >
                Leave List
              </button>
            )}
          </div>

          {isCreator && (
            <div className="p-6 border-b bg-gray-50">
              <h3 className="text-lg font-semibold mb-3 text-gray-700">
                Members
              </h3>
              <ul className="space-y-2 mb-3">
                {(members || []).map((m, index) => {
                  // Find corresponding user
                  const userRecord = (users || []).find(
                    (u) => u.id === m.userId
                  );
                  const memberName = userRecord?.username ?? "Unknown";

                  const memberUserId = m.userId ?? null;
                  const isOwner =
                    memberUserId &&
                    (memberUserId === list.creatorId ||
                      memberUserId === userId);

                  // Use fallback for key: m.id -> m.userId -> index
                  const key = m.id ?? m.userId ?? index;

                  return (
                    <li
                      key={key}
                      className="flex justify-between items-center bg-white border border-gray-200 rounded-md px-3 py-2"
                    >
                      <span>
                        <span className="font-medium text-gray-800">
                          {memberName}
                        </span>{" "}
                        {isOwner && (
                          <span className="text-sm text-pink-600 font-semibold">
                            (Owner)
                          </span>
                        )}
                      </span>
                      {!isOwner && (
                        <button
                          onClick={() => handleRemoveMember(m.id, memberUserId)}
                          className="text-red-500 hover:text-red-700 transition-colors text-sm"
                        >
                          Remove
                        </button>
                      )}
                    </li>
                  );
                })}
              </ul>

              {/* Add member input */}
              <div className="flex space-x-2">
                <select
                  value={selectedUserId}
                  onChange={(e) => {
                    const userId = e.target.value;
                    const user = users.find((u) => u.id === userId);
                    setSelectedUser(user);
                    setSelectedUserId(userId);
                  }}
                  className="border border-gray-300 flex-1 px-3 py-2 rounded-md focus:ring-2 focus:ring-indigo-400 outline-none"
                >
                  <option value="">Select a user</option>
                  {users
                    .filter(
                      (u) => !(members || []).some((m) => m.userId === u.id)
                    )
                    .map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.username}
                      </option>
                    ))}
                </select>

                <button
                  onClick={handleAddMember}
                  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
                >
                  Add
                </button>
              </div>
            </div>
          )}

          {/* Filter Toggle */}
          <div className="flex justify-center space-x-3 p-4 border-b bg-gray-50">
            {["all", "checked", "unchecked"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-full font-medium transition ${
                  filter === f
                    ? "bg-indigo-500 text-white shadow"
                    : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          {/* Items List */}
          <div className="p-6 space-y-3">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                // pass the full item object so Cell doesn't need to re-lookup it
                <Cell key={item.id} itemId={item.id} item={item} />
              ))
            ) : (
              <p className="text-center text-gray-500 italic">No items found</p>
            )}
          </div>

          {/* Add Item Button */}
          <div className="p-6 border-t bg-gray-50 flex justify-center">
            <button
              onClick={handleAddItem}
              className="bg-indigo-500 text-white px-6 py-2 rounded-lg hover:bg-indigo-600 transition-colors font-medium"
            >
              + Add Item
            </button>
          </div>
        </div>
      </div>

      {/* Add Item Modal */}
      {isAddItemOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black opacity-40"
            onClick={() => setIsAddItemOpen(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 z-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-800">
                Přidat položku
              </h3>
              <button
                onClick={() => setIsAddItemOpen(false)}
                className="text-gray-400 hover:text-gray-600"
                aria-label="Zavřít"
              >
                ✕
              </button>
            </div>

            <label className="block text-sm text-gray-700 mb-2">Název</label>
            <input
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              className="w-full mb-4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200"
              placeholder="Např. Mléko"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsAddItemOpen(false)}
                type="button"
                className="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50"
              >
                Zrušit
              </button>
              <button
                onClick={submitAddItem}
                type="button"
                disabled={isSubmittingItem}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg shadow ${
                  isSubmittingItem
                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                    : "bg-gradient-to-r from-indigo-500 to-indigo-600 text-white"
                }`}
              >
                {isSubmittingItem ? "Adding…" : "Přidat"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
