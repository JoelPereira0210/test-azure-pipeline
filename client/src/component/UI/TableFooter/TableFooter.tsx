"use client";
import { Box, Button } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

interface PaginationFooterProps {
  currentPage: number;
  totalRecords: number;
  pageSize: number;
  onPageChange: (newPage: number) => void;
}

const PaginationFooter: React.FC<PaginationFooterProps> = ({
  currentPage,
  totalRecords,
  pageSize,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalRecords / pageSize);

  const renderPageNumbers = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 5) {
      // Show all pages if <= 5 pages
      for (let i = 0; i < totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(0); // First page

      if (currentPage > 2) {
        pages.push("...");
      }

      let start = Math.max(1, currentPage - 1);
      let end = Math.min(totalPages - 2, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 3) {
        pages.push("...");
      }

      pages.push(totalPages - 1); // Last page
    }

    return pages.map((page, index) =>
      typeof page === "number" ? (
        <Button
          key={index}
          variant={page === currentPage ? "contained" : "outlined"}
          onClick={() => onPageChange(page)}
          sx={{

            minWidth: {xs:'16px',sm:'16px',md:'30px',lg:'30px',xl:'30px'},
            padding: {xs:'2px 10px',sm:'2px 10px',md:'5px 12px',lg:'5px 12px',xl:'5px 12px'},

            fontSize: "12px",
            fontWeight: "bold",
            borderRadius: "50%",
            background: page === currentPage ? "#e0e0e0" : "none",
            color: page === currentPage ? "#000" : "#333",
            "&:hover": { background: "#e0e0e0" },
          }}
        >
          {page + 1}
        </Button>
      ) : (
        <span key={index} style={{ padding: "0 8px", fontSize: "14px" }}>
          {page}
        </span>
      )
    );
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center",
        padding: "16px",
        marginTop: "20px",
        gap: "6px",
      }}
    >
      {/* Previous Button */}
      <Button
        disabled={currentPage === 0}
        onClick={() => onPageChange(currentPage - 1)}
        sx={{
          minWidth: "30px",
          padding: "4px 8px",
          fontSize: "18px",
          fontWeight: "bold",
          background: "none",
          color: currentPage === 0 ? "#aaa" : "#333",
          cursor: currentPage === 0 ? "default" : "pointer",
          "&:hover": { background: "none" },
        }}
      >
        <ArrowBackIosIcon fontSize="small"/>
      </Button>

      {/* Page Number Buttons */}
      {renderPageNumbers()}

      {/* Next Button */}
      <Button
        disabled={currentPage === totalPages - 1}
        onClick={() => onPageChange(currentPage + 1)}
        sx={{
          minWidth: "30px",
          padding: "4px 8px",
          fontSize: "18px",
      
          fontWeight: "bold",
          background: "none",
          color: currentPage === totalPages - 1 ? "#aaa" : "#333",
          cursor: currentPage === totalPages - 1 ? "default" : "pointer",
          "&:hover": { background: "none" },
        }}
      >
        <ArrowForwardIosIcon fontSize="small"/>
      </Button>
    </Box>
  );
};

export default PaginationFooter;
