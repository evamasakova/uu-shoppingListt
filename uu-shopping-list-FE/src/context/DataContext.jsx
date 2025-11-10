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
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
