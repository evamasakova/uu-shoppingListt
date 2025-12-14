import { createContext, useEffect, useState } from "react";

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const raw = localStorage.getItem("currentUser");
      return raw
        ? JSON.parse(raw)
        : {
            id: "u1",
            username: "john_doe",
            email: "john@example.com",
            createdLists: ["l1"],
            memberLists: ["l1", "l2"],
          };
    } catch {
      return {
        id: "u1",
        username: "john_doe",
        email: "john@example.com",
        createdLists: ["l1"],
        memberLists: ["l1", "l2"],
      };
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
    } catch {}
  }, [currentUser]);

  const [users, setUsers] = useState([]);
  const [shoppingLists, setShoppingLists] = useState([]);
  const [items, setItems] = useState([]);

  const [loading, setLoading] = useState({
    users: false,
    shoppingLists: false,
    items: false,
  });

  const [error, setError] = useState({
    users: null,
    shoppingLists: null,
    items: null,
  });

  // Load users
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading((prev) => ({ ...prev, users: true }));
      try {
        const res = await fetch("/users");
        const data = await res.json();
        if (Array.isArray(data)) setUsers(data);
        setError((prev) => ({ ...prev, users: null }));
      } catch (e) {
        console.warn("Could not load users", e);
        setError((prev) => ({ ...prev, users: e }));
      } finally {
        setLoading((prev) => ({ ...prev, users: false }));
      }
    };
    fetchUsers();
  }, []);

  // Load shopping lists
  const fetchShoppingLists = async () => {
    setLoading((prev) => ({ ...prev, shoppingLists: true }));
    try {
      const res = await fetch("/shoppingLists");
      const data = await res.json();
      if (Array.isArray(data)) setShoppingLists(data);
      setError((prev) => ({ ...prev, shoppingLists: null }));
    } catch (e) {
      console.warn("Could not load shopping lists", e);
      setError((prev) => ({ ...prev, shoppingLists: e }));
    } finally {
      setLoading((prev) => ({ ...prev, shoppingLists: false }));
    }
  };

  // Load items
  const fetchItems = async (listId) => {
    setLoading((prev) => ({ ...prev, items: true }));
    try {
      const res = await fetch(listId ? `/items?listId=${listId}` : "/items");
      const data = await res.json();
      if (Array.isArray(data)) setItems(data);
      setError((prev) => ({ ...prev, items: null }));
    } catch (e) {
      console.warn("Could not load items", e);
      setError((prev) => ({ ...prev, items: e }));
    } finally {
      setLoading((prev) => ({ ...prev, items: false }));
    }
  };

  // Helper setters (optional if you want manual overrides)
  const loadUsers = (us) => Array.isArray(us) && setUsers(us);
  const loadShoppingLists = (lists) =>
    Array.isArray(lists) && setShoppingLists(lists);
  const loadItems = (it) => Array.isArray(it) && setItems(it);
  const loadUser = (user) => setCurrentUser(user);

  return (
    <DataContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        users,
        setUsers, // <-- add this
        shoppingLists,
        setShoppingLists, // <-- add this
        items,
        setItems, // <-- add this
        loading,
        error,
        loadUser,
        loadUsers,
        loadShoppingLists,
        loadItems,
        fetchShoppingLists,
        fetchItems,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
