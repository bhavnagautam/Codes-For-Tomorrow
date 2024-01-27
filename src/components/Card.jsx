import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTodos } from "../redux/slice/todo";

export default function Card() {
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const itemsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);
  const [visibleCards, setVisibleCards] = useState([]);

  useEffect(() => {
    // Fetch data when the component mounts
    dispatch(fetchTodos());
  }, [dispatch]);

  useEffect(() => {
    // Update visible cards when data or current page changes
    if (state.todo.data !== null) {
      const indexOfLastItem = currentPage * itemsPerPage;
      const indexOfFirstItem = indexOfLastItem - itemsPerPage;
      setVisibleCards(state.todo.data.slice(indexOfFirstItem, indexOfLastItem));
    }
  }, [state.todo.data, currentPage]);

  // Check if state.todo.data is not null before calculating totalPages
  const totalPages =
    state.todo.data !== null
      ? Math.ceil(state.todo.data.length / itemsPerPage)
      : 0;

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleDeleteCard = (id) => {
    // Hide the card by filtering out the one with the given id
    setVisibleCards(visibleCards.filter((card) => card.id !== id));
  };

  const generateImageUrl = (id) => `https://picsum.photos/200/300?random=${id}`;

 const currentDate = new Date();
 const formattedDate = currentDate.toDateString();


  const renderPageButtons = () => {
    const buttons = [];
    for (let i = 1; i <= totalPages; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-2 mr-2 ${
            i === currentPage ? "bg-gray-500 text-white" : "bg-gray-300"
          } rounded`}
        >
          {i}
        </button>
      );
    }
    return buttons;
  };

  if (state.todo.isLoading) {
    return <h1>Loading...</h1>;
  }

  return (
    <>
      {/* Check if visibleCards is not empty before mapping over it */}
      {visibleCards.length > 0 ? (
        <>
          <div className="grid grid-cols-3 gap-4">
            {visibleCards.map((todo) => (
              <div
                key={todo.id}
                className="relative bg-white p-4 rounded shadow-md mb-4"
              >
                {/* Delete button (red cross) */}
                <button
                  onClick={() => handleDeleteCard(todo.id)}
                  className="absolute top-0 right-0 p-2 text-red-500 cursor-pointer"
                >
                  &#x2715;
                </button>
                <h2 className="text-xl font-semibold mb-2">
                  User ID: {todo.id}
                </h2>
                <p className="text-gray-700">Title: {todo.title}</p>
                <p className="text-gray-700">Body: {todo.body}</p>
                <p>Date: {formattedDate}</p>

                <img
                  src={generateImageUrl(todo.id)}
                  alt={`Image for User ID: ${todo.id}`}
                  className="w-full h-32 object-cover mb-2 rounded"
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 mr-2 bg-gray-300 rounded"
            >
              &larr; Prev
            </button>
            <div className="flex">{renderPageButtons()}</div>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={visibleCards.length < itemsPerPage}
              className="px-4 py-2 ml-2 bg-gray-300 rounded"
            >
              Next &rarr;
            </button>
          </div>
        </>
      ) : (
        <p>No data available</p>
      )}
    </>
  );
}
