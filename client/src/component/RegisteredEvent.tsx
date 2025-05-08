

import React, { useContext, useEffect, useState } from 'react';
import { MemberContext } from '@/src/component/context/MemberContext';
import FilterListTable from './UI/Tables/FilterListTable';
import { fetchEventDetails } from '../actions/addMembers';
import { Box, Typography } from '@mui/material';
import PaginationFooter from './UI/TableFooter/TableFooter';


const Registeredevent = () => {
  const { contextUserId } = useContext(MemberContext);
  const [eventData, setEventData] = useState<any>([]);

  const [currentPage, setCurrentPage] = useState(0);
const pageSize = 10; // Number of records per page


      const fetchData = async (page = 0) => {
        try {
          const limit = pageSize; // Define the limit
    const offset = page * limit; // Calculate offset

          const response = await fetchEventDetails(contextUserId, limit, offset);
          setEventData(response);
          // setTotalRecords(response.totalRecords)
          // Ensure response is an array and check status
          if (response && response.status === 200) {
            // setEventData(response.data); // Assuming response.data contains the event array
            console.log('Event details found:', response.data);
          } else if (response && response.status === 203) {
            console.log('No events found');
            setEventData([]); // Clear data if no events found
          }
        } catch (error) {
          console.error('Error fetching event details:', error);
        }
      };

      useEffect(() => {
        if (contextUserId) {
          fetchData(currentPage);
        }
      }, [contextUserId, currentPage]); // Re-fetch when page changes
      

  console.log('eventData', eventData);

  // Only create tableData if eventData is valid
  const tableData = Array.isArray(eventData)
    ? eventData.map((event: any) => ({
        eventName: event.eventName,
        eventStartDate: new Date(event.eventStartDate).toLocaleDateString(),
        eventType: event.eventType,
      }))
    : [];

  const columnNameArray = [
    { field: 'eventName', headerName: 'Event' },
    { field: 'eventStartDate', headerName: 'Event Date' },
    { field: 'eventType', headerName: 'Event Type' },
  ];
  console.log('tableData', tableData);
  console.log('tableData', tableData.length);

  return (
    <Box>
      {tableData.length > 0 ? (
        <Box> 
          <FilterListTable
            tableData={tableData}
            columnNameArray={columnNameArray}
            toDisplayFooter={false}
          />

          <PaginationFooter
          currentPage={currentPage}
          totalRecords={eventData[0].totalRecords}
          pageSize={pageSize}
          onPageChange={(newPage) => setCurrentPage(newPage)} // Update page state on change
        />
        </Box>
      ) : (
        <Box
          sx={{
            display: 'flex',

            justifyContent: 'center',

            alignItems: 'center',

            height: '50vh',
          }}
        >
          <img
            src="/images/Frame.png"
            alt="Description of image"
            style={{ maxWidth: '100%', height: 'auto' }}
          />
          
         
        </Box>
      )}
    </Box>
  );
};

export default Registeredevent;
