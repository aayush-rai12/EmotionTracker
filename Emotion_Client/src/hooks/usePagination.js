import { useState, useMemo } from "react";

const usePagination = (data = [], cardsPerPage = 4) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / cardsPerPage);

  const currentCards = useMemo(() => {
    const indexOfLastCard = currentPage * cardsPerPage;
    const indexOfFirstCard = indexOfLastCard - cardsPerPage;
    return data.slice(indexOfFirstCard, indexOfLastCard);
  }, [currentPage, cardsPerPage, data]);

  const handleNext = () => {
    setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev));
  };

  const handlePrev = () => {
    setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
  };

  return {
    currentPage,
    totalPages,
    currentCards,
    handleNext,
    handlePrev,
    setCurrentPage,
  };
};

export default usePagination;
