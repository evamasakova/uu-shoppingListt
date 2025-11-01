import { useContext } from "react";
import { DataContext } from "../../context/DataContext";

export default function Cell({ itemId }) {
  const { items, setItems, shoppingLists, setShoppingLists } = useContext(DataContext);

  const item = items.find((i) => i._id === itemId);
  if (!item) return <div>Item not found</div>;

  // toggle checked state
  const handleCheck = () => {
    const updatedItems = items.map((i) =>
      i._id === itemId ? { ...i, checked: !i.checked } : i
    );
    setItems(updatedItems);
  };

  const handleRemove = () => {
    const updatedItems = items.filter((i) => i._id !== itemId);
    setItems(updatedItems);

    const updatedLists = shoppingLists.map((list) => {
      if (list._id === item.listId) {
        return {
          ...list,
          items: list.items.filter((id) => id !== itemId),
        };
      }
      return list;
    });
    setShoppingLists(updatedLists);
  };

  return (
  <div className="flex justify-between items-center bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-all">
    {/* Item Name */}
    <span
      className={`text-lg ${
        item.checked
          ? "line-through text-gray-400"
          : "text-gray-800 font-medium"
      }`}
    >
      {item.name}
    </span>

    {/* Action Buttons */}
    <div className="flex items-center space-x-2">
      <button
        onClick={handleCheck}
        className={`px-3 py-1.5 rounded-md font-medium text-sm transition-colors duration-200 ${
          item.checked
            ? "bg-green-500 text-white hover:bg-green-600"
            : "bg-gray-800 text-white hover:bg-green-500"
        }`}
      >
        {item.checked ? "Checked" : "Check"}
      </button>

      <button
        onClick={handleRemove}
        className="px-3 py-1.5 rounded-md font-medium text-sm bg-red-500 text-white hover:bg-red-600 transition-colors duration-200"
      >
        Remove
      </button>
    </div>
  </div>
);

}
