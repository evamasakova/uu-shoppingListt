import { useContext, useEffect, useState } from "react";
import { DataContext } from "../../context/DataContext";
import { Link } from "react-router-dom";
import { CiTrash } from "react-icons/ci";
import { CiCirclePlus } from "react-icons/ci";

import {
  loadLists as loadListsService,
  createList as createListService,
  updateList as updateListService,
  deleteList as deleteListService,
} from "../../context/listsService";

export default function Dashboard() {
  const { currentUser, setCurrentUser } = useContext(DataContext);

  useEffect(() => {
    if (!currentUser) return;
    if (!currentUser.id) {
      setCurrentUser((prev) => ({ ...prev, id: prev.id }));
    }
  }, [currentUser]);

  const userId = currentUser?.id;

  const [shoppingLists, setShoppingLists] = useState([]);
  const [showArchived, setShowArchived] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newName, setNewName] = useState("");

  const normalizeLists = (arr = []) =>
    (arr || []).map((l) => ({
      ...l,
      id: l.id ,
    members: (l.members || []).map((m) => ({ ...m, id: m.id })),
    }));

  useEffect(() => {
    (async () => {
      const res = await loadListsService();
      if (res?.status >= 200 && res?.status < 300 && Array.isArray(res.payload)) {
        setShoppingLists(normalizeLists(res.payload));
      } else {
        // fallback: keep any existing lists but normalize them
        setShoppingLists((prev) => normalizeLists(prev));
      }
    })();
  }, []);

  const archiveList = async (listId, nextArchivedState) => {
    await updateListService(
      {
        archived: Boolean(nextArchivedState),
        updatedAt: new Date().toISOString(),
      },
      listId,
      setShoppingLists
    );
  };

  const handleCreateList = async ({ name }) => {
    if (!name?.trim()) return;

    const res = await createListService({ name: name.trim(), description: "" }, currentUser);

    if (res?.status >= 200 && res?.status < 300 && res.payload) {
      const created = { ...res.payload, id: res.payload.id  };

      setShoppingLists((prev) => [created, ...(prev || [])]);

      setCurrentUser((prev) => {
        const newId = created.id;
        return {
          ...prev,
          id: prev.id ,
          createdLists: [...(prev.createdLists || []), newId],
          memberLists: [...new Set([...(prev.memberLists || []), newId])],
        };
      });
    } else {
      console.warn("createList failed", res);
    }
  };

  const handleDelete = async (listId) => {
    if (!window.confirm("Opravdu smazat tento seznam?")) return;
    await deleteListService(listId, { setShoppingLists, setCurrentUser });
  };

  const userLists = (shoppingLists || []).filter((list) => {
    const isCreator = list.creatorId === userId;
    const isMember =
      Array.isArray(list.members) && list.members.some((m) => m.userId === userId);

    const visible =
      !Boolean(list.archived) ||
      (Boolean(list.archived) && showArchived && isCreator);

    return (isCreator || isMember) && visible;
  });

  return (
    <div className="max-w-4xl mx-auto mt-8 px-4">
      <div className="flex items-center gap-4 mb-6">
        <h1 className="text-3xl font-extrabold text-indigo-600">
          Nákupní seznamy
        </h1>
        <div className="ml-auto flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={showArchived}
              onChange={() => setShowArchived((s) => !s)}
              className="h-4 w-4 rounded border-gray-300 focus:ring-indigo-400"
            />
            Zobrazit archivované
          </label>

          <button
            onClick={() => setIsModalOpen(true)}
            type="button"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white px-4 py-2 rounded-full shadow-md transition transform hover:-translate-y-0.5"
            aria-label="Nový seznam"
          >
            <CiCirclePlus />
            Nový seznam
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {userLists.map((list) => (
          <Link key={list.id} to={`/list/${list.id}`} className="group">
            <article className="bg-white border border-transparent hover:border-indigo-100 rounded-xl p-4 shadow-md hover:shadow-lg transition transform hover:-translate-y-1 h-full flex flex-col justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-800 group-hover:text-indigo-600">
                  {list.name}
                </h2>
                {list.description && (
                  <p className="text-sm text-gray-500 mt-2 line-clamp-3">
                    {list.description}
                  </p>
                )}
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  {list.archived ? (
                    <span className="px-2 py-0.5 bg-gray-100 rounded-full text-xs">
                      Archivovaný
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-full text-xs">
                      Aktivní
                    </span>
                  )}
                </div>

                {list.creatorId === userId ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const nextArchived = !Boolean(list.archived);
                        const confirmMsg = nextArchived
                          ? "Opravdu archivovat tento seznam?"
                          : "Opravdu znovu aktivovat tento seznam?";
                        if (window.confirm(confirmMsg)) {
                          archiveList(list.id, nextArchived);
                        }
                      }}
                      type="button"
                      className="inline-flex items-center justify-center h-8 px-3 rounded-full bg-indigo-50 hover:bg-indigo-100 text-indigo-600 text-sm transition"
                      aria-label={
                        list.archived ? "Aktivovat seznam" : "Archivovat seznam"
                      }
                    >
                      {list.archived ? "Aktivovat" : "Archivovat"}
                    </button>

                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDelete(list.id);
                      }}
                      type="button"
                      className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-red-50 hover:bg-red-100 text-red-600 transition"
                      aria-label="Smazat seznam"
                    >
                      <CiTrash />
                    </button>
                  </div>
                ) : (
                  <div className="text-xs text-gray-400">—</div>
                )}
              </div>
            </article>
          </Link>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black opacity-40"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 z-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-800">
                Vytvořit nový seznam
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
                aria-label="Zavřít"
              >
                ✕
              </button>
            </div>

            <label className="block text-sm text-gray-700 mb-2">Název</label>
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full mb-4 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200"
              placeholder="Např. Týdenní nákup"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                type="button"
                className="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50"
              >
                Zrušit
              </button>
              <button
                onClick={async () => {
                  if (!newName.trim()) return alert("Zadejte název.");
                  await handleCreateList({ name: newName });
                  setNewName("");
                  setIsModalOpen(false);
                }}
                type="button"
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-lg shadow hover:from-indigo-600 hover:to-indigo-700"
              >
                <CiCirclePlus />
                Vytvořit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
