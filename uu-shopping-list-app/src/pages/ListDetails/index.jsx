import { useState, useContext } from "react"; // added useState
import { useParams, useNavigate, Link } from "react-router-dom";
import { DataContext } from "../../context/DataContext";
import Cell from "../../components/Cell";

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

  const list = shoppingLists.find((l) => l._id === listId);
  if (!list) return <div>List not found</div>;
  const navigate = useNavigate();

  const [newName, setNewName] = useState(list.name);
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [filter, setFilter] = useState("all");

  const listItems = list.items
    .map((itemId) => items.find((i) => i._id === itemId))
    .filter(Boolean);
  //filter
  const filteredItems = listItems.filter((item) => {
    if (filter === "all") return true;
    if (filter === "checked") return item.checked;
    if (filter === "unchecked") return !item.checked;
  });

  const handleNameChange = () => {
    if (!currentUser?.createdLists.includes(list._id)) return;
    setShoppingLists(
      shoppingLists.map((l) =>
        l._id === list._id ? { ...l, name: newName } : l
      )
    );
  };

  const handleAddMember = () => {
    if (currentUser?.createdLists.includes(list._id)) return;
    const userToAdd = users.find((u) => u.email === newMemberEmail);
    if (!userToAdd) return alert("User not found");
    if (list.members.some((m) => m.userId === userToAdd._id)) return;

    setShoppingLists(
      shoppingLists.map((l) =>
        l._id === list._id
          ? {
              ...l,
              members: [
                ...l.members,
                { userId: userToAdd._id, role: "member" },
              ],
            }
          : l
      )
    );

    setUsers(
      users.map((u) =>
        u._id === userToAdd._id
          ? { ...u, memberLists: [...u.memberLists, list._id] }
          : u
      )
    );
    setNewMemberEmail("");
  };

  const handleRemoveMember = (memberId) => {
    if (!currentUser?.createdLists.includes(list._id)) return;
    setShoppingLists(
      shoppingLists.map((l) =>
        l._id === list._id
          ? { ...l, members: l.members.filter((m) => m.userId !== memberId) }
          : l
      )
    );
    setUsers(
      users.map((u) =>
        u._id === memberId
          ? { ...u, memberLists: u.memberLists.filter((id) => id !== list._id) }
          : u
      )
    );
  };

  const handleLeaveList = () => {
    if (currentUser?.createdLists.includes(list._id)) {
      alert("Creators cannot leave their own list.");
      return;
    }

    const updatedLists = shoppingLists.map((l) =>
      l._id === list._id
        ? { ...l, members: l.members.filter((m) => m.userId !== currentUser._id) }
        : l
    );

    const updatedUsers = users.map((u) =>
      u._id === currentUser._id
        ? { ...u, memberLists: u.memberLists.filter((id) => id !== list._id) }
        : u
    );

    setShoppingLists(updatedLists);
    setUsers(updatedUsers);

    navigate("/");
  };

  const handleAddItem = () => {
    const name = prompt("Enter item name:");
    if (!name) return;
    const newItem = {
      _id: `i${Date.now()}`,
      listId: list._id,
      name,
      checked: false,
      addedBy: currentUser._id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setItems([...items, newItem]);
    setShoppingLists(
      shoppingLists.map((l) =>
        l._id === list._id ? { ...l, items: [...l.items, newItem._id] } : l
      )
    );
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

      {/* Main Card */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b flex justify-between items-center bg-gradient-to-r from-indigo-50 to-pink-50">
          {currentUser?.createdLists.includes(list._id) ? (
            <div className="flex items-center space-x-2">
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="border px-3 py-1.5 rounded-md focus:ring-2 focus:ring-indigo-400 outline-none text-gray-800"
              />
              <button
                onClick={handleNameChange}
                className="bg-indigo-500 text-white px-3 py-1.5 rounded hover:bg-indigo-600 transition-colors"
              >
                Save
              </button>
            </div>
          ) : (
            <h2 className="text-2xl font-semibold text-gray-800">{list.name}</h2>
          )}

          {/* Leave Button */}
          {!currentUser?.createdLists.includes(list._id) && (
            <button
              onClick={handleLeaveList}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
            >
              Leave List
            </button>
          )}
        </div>

        {currentUser?.createdLists.includes(list._id) && (
          <div className="p-6 border-b bg-gray-50">
            <h3 className="text-lg font-semibold mb-3 text-gray-700">Members</h3>
            <ul className="space-y-2 mb-3">
              {list.members.map((m) => {
                const user = users.find((u) => u._id === m.userId);
                const isOwner = user?.createdLists.includes(list._id);
                return (
                  <li
                    key={m.userId}
                    className="flex justify-between items-center bg-white border rounded-md px-3 py-2"
                  >
                    <span>
                      <span className="font-medium text-gray-800">{user?.username || "Unknown"}</span>{" "}
                      {isOwner && <span className="text-sm text-pink-600 font-semibold">(Owner)</span>}
                    </span>
                    {!isOwner && (
                      <button
                        onClick={() => handleRemoveMember(m.userId)}
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
              <input
                type="email"
                placeholder="User email"
                value={newMemberEmail}
                onChange={(e) => setNewMemberEmail(e.target.value)}
                className="border flex-1 px-3 py-2 rounded-md focus:ring-2 focus:ring-indigo-400 outline-none"
              />
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
            filteredItems.map((item) => <Cell key={item._id} itemId={item._id} />)
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
  </>
);

}
