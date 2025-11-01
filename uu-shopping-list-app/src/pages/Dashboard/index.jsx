import { useContext } from "react";
import { DataContext } from "../../context/DataContext";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { shoppingLists, currentUser } = useContext(DataContext);

  const userLists = shoppingLists.filter(
    (list) =>
      list.creatorId === currentUser._id ||
      list.members.some((m) => m.userId === currentUser._id)
  );

  return (
    <div className="max-w-md mx-auto mt-6">
      <h1 className="text-2xl font-bold mb-4">Your Lists</h1>
      <ul className="space-y-2">
        {userLists.map((list) => (
          <Link key={list._id} to={`/list/${list._id}`}>
            <li key={list._id} className="p-4 border rounded hover:bg-pink-100">
              <p>{list.name}</p>
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
}
