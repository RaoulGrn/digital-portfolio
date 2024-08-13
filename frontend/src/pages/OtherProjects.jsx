import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import UserCard from "../components/UserCard";

function OtherProjects() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const currentUserId = localStorage.getItem("userId");
  const navigate = useNavigate();

  const handleUserClick = useCallback(
    (userId) => {
      navigate(`/user/${userId}/projects`);
    },
    [navigate]
  );

  const fetchUsers = useCallback(
    async (newPage = 1, newSearch = false) => {
      try {
        const token = localStorage.getItem("token");
        const url =
          searchQuery.trim() !== ""
            ? `http://localhost:3000/users/search?query=${encodeURIComponent(
                searchQuery
              )}&page=${newPage}&limit=12`
            : `http://localhost:3000/users?page=${newPage}&limit=12`;

        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const { users: newUsers, pages } = response.data;
        const filteredUsers = newUsers.filter(
          (user) => user._id !== currentUserId
        );

        setUsers((prevUsers) =>
          newSearch ? filteredUsers : [...prevUsers, ...filteredUsers]
        );
        setHasMore(newPage < pages && filteredUsers.length > 0);
        setPage(newPage + 1);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("A apărut o eroare la încărcarea datelor.");
        setLoading(false);
      }
    },
    [searchQuery, currentUserId]
  );

  useEffect(() => {
    fetchUsers(1, true);
  }, [fetchUsers, searchQuery]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(1);
    setHasMore(true);
  };

  if (loading && users.length === 0) {
    return (
      <div className="text-center text-gray-200 mt-8 text-xl">Loading...</div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 mt-8 text-xl">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl md:text-5xl font-bold mb-12 text-center text-gray-200 ">
        Discover Creative Minds
      </h1>

      <div className="mb-12 max-w-xl mx-auto">
        <div className="relative">
          <input
            type="text"
            placeholder="Search for users..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full p-3 pl-10 bg-gray-800 text-white rounded-full border-2 border-gray-700 focus:outline-none focus:border-teal-500 transition-colors duration-300 text-base"
          />
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
        </div>
      </div>

      <InfiniteScroll
        dataLength={users.length}
        next={() => fetchUsers(page)}
        hasMore={hasMore}
        loader={
          <h4 className="text-center text-gray-400 my-8 text-xl">Loading...</h4>
        }
        endMessage={
          <p className="text-center text-gray-200 mt-12 text-2xl font-semibold">
            You've seen all the creative minds!
          </p>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {users.map((user) => (
            <UserCard
              key={user._id}
              user={user}
              searchQuery={searchQuery}
              onClick={handleUserClick}
            />
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
}

export default OtherProjects;
