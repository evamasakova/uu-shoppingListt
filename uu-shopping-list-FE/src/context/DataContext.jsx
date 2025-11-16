/**
 * Mock data :D
 */
import { createContext, useState } from "react";

export const DataContext = createContext();

//current user mock 
export const DataProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState({
    _id: "u1",
    username: "john_doe",
    email: "john@example.com",
    createdLists: ["l1"],
    memberLists: ["l1", "l2"],
  });
  // const [currentUser, setCurrentUser] = useState({
  //   _id: "u2",
  //   username: "jane_doe",
  //   email: "jane@example.com",
  //   createdLists: ["l2"],
  //   memberLists: ["l1", "l2"],
  // });

  //USERS
  const [users, setUsers] = useState([
    {
      _id: "u1",
      username: "john_doe",
      email: "john@example.com",
      passwordHash: "mock-hash-123",
      createdLists: ["l1"],
      memberLists: ["l1", "l2"],
      createdAt: new Date("2025-10-29T10:00:00Z"),
      updatedAt: new Date("2025-10-30T10:00:00Z"),
    },
    {
      _id: "u2",
      username: "jane_doe",
      email: "jane@example.com",
      passwordHash: "mock-hash-456",
      createdLists: ["l2"],
      memberLists: ["l1", "l2"],
      createdAt: new Date("2025-10-29T12:00:00Z"),
      updatedAt: new Date("2025-10-30T10:00:00Z"),
    },
  ]);

  //ITEMS
  const [items, setItems] = useState([
    {
      _id: "i1",
      listId: "l1",
      name: "Milk",
      checked: false,
      addedBy: "u1",
      createdAt: new Date("2025-10-30T10:00:00Z"),
      updatedAt: new Date("2025-10-30T10:00:00Z"),
    },
    {
      _id: "i2",
      listId: "l1",
      name: "Airbus 890",
      checked: true,
      addedBy: "u2",
      createdAt: new Date("2025-10-30T10:00:00Z"),
      updatedAt: new Date("2025-10-30T10:00:00Z"),
    },
  ]);

  //SHOPPING LISTS
  const [shoppingLists, setShoppingLists] = useState([
    {
      _id: "l1",
      name: "Weekly Groceries l1",
      description: "All the items we need for this week.",
      creatorId: "u1",
      members: [{ userId: "u1" }, { userId: "u2" }],
      items: ["i1", "i2"],
      createdAt: new Date("2025-10-29T10:00:00Z"),
      updatedAt: new Date("2025-10-30T10:00:00Z"),
    },
    {
      _id: "l2",
      name: "Weekly Groceries l2",
      description: "All the items we need for this week.",
      creatorId: "u2",
      members: [{ userId: "u1" }, { userId: "u2" }],
      items: ["i1", "i2"],
      createdAt: new Date("2025-10-29T10:00:00Z"),
      updatedAt: new Date("2025-10-30T10:00:00Z"),
    },
  ]);

  // simple id generator
  const genId = (prefix = "id") =>
    `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;

  // create a new shopping list and make current user creator + member
  const createList = ({ name, description = "" }) => {
    const id = genId("l");
    const newList = {
      _id: id,
      name,
      description,
      creatorId: currentUser._id,
      members: [{ userId: currentUser._id }],
      items: [],
      archived: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setShoppingLists((prev) => [newList, ...prev]);

    setUsers((prev) =>
      prev.map((u) =>
        u._id === currentUser._id
          ? {
              ...u,
              createdLists: [...(u.createdLists || []), id],
              memberLists: [...new Set([...(u.memberLists || []), id])],
            }
          : u
      )
    );

    setCurrentUser((prev) => ({
      ...prev,
      createdLists: [...(prev.createdLists || []), id],
      memberLists: [...new Set([...(prev.memberLists || []), id])],
    }));

    return id;
  };

  // delete a shopping list only if current user is the creator
  const deleteList = (listId) => {
    const list = shoppingLists.find((l) => l._id === listId);
    if (!list) return false;
    if (list.creatorId !== currentUser._id) return false;

    // remove list
    setShoppingLists((prev) => prev.filter((l) => l._id !== listId));

    // remove related items
    setItems((prev) => prev.filter((it) => it.listId !== listId));

    // remove references from users
    setUsers((prev) =>
      prev.map((u) => ({
        ...u,
        createdLists: (u.createdLists || []).filter((id) => id !== listId),
        memberLists: (u.memberLists || []).filter((id) => id !== listId),
      }))
    );

    // update currentUser
    setCurrentUser((prev) => ({
      ...prev,
      createdLists: (prev.createdLists || []).filter((id) => id !== listId),
      memberLists: (prev.memberLists || []).filter((id) => id !== listId),
    }));

    return true;
  };

   return (
     <DataContext.Provider
       value={{
         users,
         shoppingLists,
         items,
         currentUser,
         setUsers,
         setShoppingLists,
         setItems,
         setCurrentUser,
        createList,
        deleteList,
       }}
     >
       {children}
     </DataContext.Provider>
   );
};
