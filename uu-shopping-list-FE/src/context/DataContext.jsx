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

  useEffect(() => {
    (async () => {
      try {
        const port = import.meta.env.VITE_PORT || 3000;
        const res = await fetch(`http://localhost:${port}/users`);
        const data = await res.json();
        if (Array.isArray(data)) setUsers(data);
      } catch (e) {
        console.warn("Could not load users", e);
      }
    })();
  }, []);
  const loadShoppingLists = (lists) => {
    if (Array.isArray(lists)) setShoppingLists(lists);
  };
  const loadItems = (it) => {
    if (Array.isArray(it)) setItems(it);
  };
  const loadUsers = (us) => {
    if (Array.isArray(us)) setUsers(us);
  };

  const loadUser = (user) => {
    setCurrentUser(user);
  };

  return (
    <DataContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        users,
        setUsers,
        shoppingLists,
        setShoppingLists,
        items,
        setItems,
        loadUser,
        loadShoppingLists,
        loadItems,
        loadUsers,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
