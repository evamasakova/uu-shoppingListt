import { useContext, useState } from "react";
import { DataContext } from "../../context/DataContext";
import {
  deleteItem as apiDeleteItem,
  checkItem as apiCheckItem,
  uncheckItem as apiUncheckItem,
} from "../../context/itemsService";
import LoadingCard from "./LoadingCard";
import ErrorCard from "./ErrorCard";



export default function Cell({ itemId, item }) {
  const { items, setItems, setShoppingLists } = useContext(DataContext);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [retryAction, setRetryAction] = useState(null);

  const resolvedItem =
    item ?? (Array.isArray(items) ? items.find((i) => String(i.id) === String(itemId)) : null);

  if (!resolvedItem) {
    return (
      <div className="bg-white border border-gray-200 rounded-md px-4 py-3 flex items-center justify-between">
        <div className="text-gray-500 italic">Item not found</div>
      </div>
    );
  }

  const performDelete = async () => {
    if (isProcessing) return;
    if (!resolvedItem?.id) return;
    if (!window.confirm("Opravdu smazat položku?")) return;

    setError(null);
    setIsProcessing(true);
    setRetryAction(() => performDelete);

    try {
      const res = await apiDeleteItem(resolvedItem.id);
      if (res?.status >= 200 && res?.status < 300) {
        if (typeof setItems === "function") {
          setItems((prev) => (prev || []).filter((i) => String(i.id) !== String(resolvedItem.id)));
        }
        if (typeof setShoppingLists === "function" && resolvedItem.listId) {
          setShoppingLists((prev) =>
            (prev || []).map((l) =>
              String(l.id) === String(resolvedItem.listId)
                ? { ...l, items: (l.items || []).filter((iid) => String(iid) !== String(resolvedItem.id)) }
                : l
            )
          );
        }
      } else {
        setError("Failed to delete item.");
      }
    } catch (err) {
      console.error("performDelete error", err);
      setError(err?.message ?? "Network error");
    } finally {
      setIsProcessing(false);
    }
  };

  const performToggle = async () => {
    if (isProcessing) return;
    if (!resolvedItem?.id) return;

    setError(null);
    setIsProcessing(true);
    setRetryAction(() => performToggle);

    try {
      let res;
      if (resolvedItem.checked) {
        res = await apiUncheckItem(resolvedItem.id);
      } else {
        res = await apiCheckItem(resolvedItem.id);
      }

      if (res?.status >= 200 && res?.status < 300) {
        if (typeof setItems === "function") {
          setItems((prev) =>
            (prev || []).map((it) =>
              String(it.id) === String(resolvedItem.id)
                ? { ...it, checked: !resolvedItem.checked, updatedAt: new Date().toISOString() }
                : it
            )
          );
        }
      } else {
        setError("Failed to update item state.");
      }
    } catch (err) {
      console.error("performToggle error", err);
      setError(err?.message ?? "Network error");
    } finally {
      setIsProcessing(false);
    }
  };

  if (error) {
    return (
      <ErrorCard
        message={error}
        onRetry={async () => {
          setError(null);
          if (typeof retryAction === "function") await retryAction();
        }}
        onClose={() => setError(null)}
      />
    );
  }

  if (isProcessing) {
    return <LoadingCard label="Processing…" />;
  }

  return (
    <div
      className={`bg-white border border-gray-200 rounded-md px-4 py-3 flex items-center justify-between ${
        resolvedItem.checked ? "opacity-80" : ""
      }`}
    >
      <div className="flex items-center gap-3">
        <button
          onClick={performToggle}
          disabled={isProcessing}
          className={`h-8 w-8 flex items-center justify-center rounded-full transition ${
            resolvedItem.checked
              ? "bg-indigo-600 text-white hover:bg-indigo-700"
              : "bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
          }`}
          aria-label={resolvedItem.checked ? "Uncheck item" : "Check item"}
        >
          {resolvedItem.checked ? "✓" : ""}
        </button>
        <div className="text-gray-800">{resolvedItem.name}</div>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-sm text-gray-400">{resolvedItem.addedBy ? resolvedItem.addedBy : ""}</div>
        <button
          onClick={performDelete}
          disabled={isProcessing}
          className={`inline-flex items-center gap-2 px-3 py-1 rounded-md text-sm transition ${
            isProcessing ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-red-50 text-red-600 hover:bg-red-100"
          }`}
          aria-label="Delete item"
        >
          Smazat
        </button>
      </div>
    </div>
  );
}
