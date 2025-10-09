import React from 'react';
import './Pagination.css';

function Pagination({ currentPage, totalPages, onNext, onPrev }) {
  return (
    <div className="pagination-ui">
      <button
        className="pagination-btn"
        onClick={onPrev}
        disabled={currentPage === 1}
      >
        Prev
      </button>
      <span className="pagination-page-info">Page {currentPage} of {totalPages}</span>
      <button
        className="pagination-btn"
        onClick={onNext}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
}

export default Pagination;
