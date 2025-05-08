



"use client";
import { useState } from 'react';
import Paper from '@mui/material/Paper';
import { Box, Button, Pagination, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// Define props with TypeScript
interface FilterListTableProps {
  tableData: Array<Record<string, any>>; // Array of generic objects
  columnNameArray: { field: string; headerName: string }[]; // Array of column definitions
  toDisplayFooter: boolean; // Whether to show the footer
  totalRecords?: number; // Optional total records
  currentPage?: number;
}

 
const FilterListTable : React.FC<FilterListTableProps> = ({ tableData, columnNameArray, toDisplayFooter,totalRecords = tableData.length,currentPage }) => {

  const pageSize = 10;
  const [paginationModel, setPaginationModel] = useState(0);




  // //  /** UPDATED: handle local + parent callback **/


  const handlePageChange =  (event,newPage) => {
    console.log("Page changed to:", newPage); // Debugging log
    setPaginationModel(newPage - 1); // Adjusting to 0-based index for internal state

  
    // // Call parent callback if available
    // if (onPageChange) {
    //   onPageChange(newPage - 1, pageSize);
    // }
  };
  
  
  const displayedRows = tableData.slice(
    // paginationModel * pageSize,
    // (paginationModel + 1) * pageSize

    0,10
  );
 
  const theme = useTheme();
  const mode = theme.palette.mode;

  console.log("paginationModel test",paginationModel);
  
  console.log("table data test",tableData);

  return (
    <div>
      <Paper className="filter-list-table-body"
        sx={{
          width: {xs:"100%",sm:"100%",md:"100%",lg:"100%"},
          overflowX: 'auto',
          margin: 'auto',
          border: 'none',
         
        }}
      >
        <Box sx={{ maxWidth: {xs:'320px',sm:'320px',md:'1024px',lg:'2560px'} }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {columnNameArray.map((column) => (
                  <th
                    key={column.field}
                    style={{
                      textAlign: 'left',
                      padding: '8px',
                      fontWeight: '600',
                      fontSize: '16px',
                      // borderBottom: '2px solid #ddd', // Add a bottom border for separation
                    }}
                  >
                    {column.headerName}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody style={{textAlign: 'left'}}>
              {displayedRows.map((row) => (
                <tr key={row.id} style={{ borderBottom: '1px solid #ddd' }}>
                  {columnNameArray.map((column) => (
                    <td key={column.field} style={{ padding: '8px'
                    // , textAlign: 'center' 
                    }}> {/* Ensure text is centered */}
                      {row[column.field]} {/* Dynamic access */}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </Box>
      </Paper>
 
      {toDisplayFooter && (
        <Box
          className="filter-table-footer"
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px',
            marginTop: '20px',
          }}
        >

          
 
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Pagination
              // count={Math.ceil(tableData.length / paginationModel.pageSize)}
              count={Math.ceil(totalRecords / pageSize)}
              page={paginationModel + 1}
              onChange={handlePageChange}
             
             
            />
        
          </Box>
        </Box>
      )}



    </div>
  );
};
 
export default FilterListTable;
 