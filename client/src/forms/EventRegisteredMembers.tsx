
import React, { useState, useEffect, useContext, useRef } from 'react';
import {
  Avatar,
  Box,
  Button,
  useTheme,
  useMediaQuery,
  Typography,
  Menu,
  MenuItem,
} from '@mui/material';

import FilterListTable from '../component/UI/Tables/FilterListTable';
import FilterListTableHeader from '../component/UI/TableHeader/FilterListTableHeader';
import { fetchEventRegisteredMembersAction } from '../actions/createevent';
import { EventContext } from '../component/context/EventContext';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { CSVLink } from 'react-csv';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { Height } from '@mui/icons-material';
import { fetchLoggedInUserdata, fetchLoggedInUserDetails } from '../actions/auth';
import PaginationFooter from '../component/UI/TableFooter/TableFooter';
dayjs.extend(utc);

const EventRegisteredMembers = () => {
  const {
    setCreateEvent,
    setEventActionType,
    eventId,
    setEventId,
    eventActionType,
    eventName,
    setRegisteredMembers
  } = useContext(EventContext);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const mode = theme.palette.mode;

  const [eventRegMemembers,setEventRegMemembers] = useState(null);
  const [jsonMemberData, setJsonMemberData] = useState<any[]>([]);
  const [originalMemberData, setOriginalMemberData] = useState<any[]>([]);
  const [filterOptions, setFilterOptions] = useState<any[]>([]);
  const [sortOption, setSortOption] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [acceptDonation, setAcceptDonation] = useState(null);
  const [checkEventType, setCheckEventType] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventEndTime, setEventEndTime] = useState('');
  const [eventEndDate, setEventEndDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [societyDetails, setSocietyDetails] = useState(null);

  const [currentPage, setCurrentPage] = useState(0);
const [totalRecords, setTotalRecords] = useState(0);
const pageSize = 10; // Records per page

  // CSVLink reference for triggering CSV download programmatically
  const csvLinkRef = useRef<any>();

  // For the dropdown menu
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  // Handle dropdown menu open/close
  const handleExportClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };


  const formatTime = (timeString) => {
    const time = new Date(timeString);

    // Get the hours and minutes in UTC
    let hours = time.getUTCHours(); // You can adjust this to 'getHours()' if you don't want to handle UTC
    const minutes = String(time.getUTCMinutes()).padStart(2, '0');

    // Determine AM or PM suffix
    const ampm = hours >= 12 ? 'PM' : 'AM';

    // Convert 24-hour time to 12-hour format
    hours = hours % 12 || 12; // Convert 0 to 12 and handle 12-hour format

    return `${hours}:${minutes} ${ampm}`;
  };


    const fetchData = async (page = 0) => {
      try {

        const limit = pageSize;
        const offset = page * limit;

        const data = await fetchEventRegisteredMembersAction(eventId,limit, offset); // Call the action
        console.log('Fetched Registered Members:', data); // Log the fetched data
        setEventRegMemembers(data);
        setJsonMemberData(data.members); // Update the state with fetched data
        setOriginalMemberData(data.members); // Store the original data
        setAcceptDonation(data.acceptDonation);
        setCheckEventType(data.eventType.eventType);
        setEventDate(data.eventDate);
        setEventTime(data.eventStartTime);
        setEventEndTime(data.eventEndTime);
        setEventEndDate(data.eventEndDate);
        setSocietyDetails(data.societyDetails);
        setTotalRecords(data.totalRecords);
      } catch (error) {
        console.error('Error fetching registered members:', error);
      }
    };


  useEffect(() => {
    fetchData(currentPage);
  }, [eventId, currentPage]);


  // console.log("eventDateTime", dayjs(eventDate).format('D MMM YYYY'),"asdasd",eventDate);
  // Unified Sorting and Search Logic
  useEffect(() => {
    let updatedData = [...originalMemberData];

    if (sortOption === 'A-Z') {
      updatedData.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === 'Z-A') {
      updatedData.sort((a, b) => b.name.localeCompare(a.name));
    }

    if (searchTerm) {
      updatedData = updatedData.filter((member) =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setJsonMemberData(updatedData);
  }, [sortOption, searchTerm, originalMemberData]);


  const columnNameArray = [
    { field: 'serialNumber', headerName: 'Sr. No.' },
    { field: 'Name', headerName: 'Name' },
    { field: 'date', headerName: 'Date' },
    { field: 'members', headerName: 'Members' },
    { field: 'mobile', headerName: 'Mobile No.' },
  ];

  // Add the conditional column outside the initial definition
  if (acceptDonation) {
    columnNameArray.splice(3, 0, { field: 'amount', headerName: 'Donation' });
  } else if (checkEventType === 'paid') {
    columnNameArray.splice(3, 0, { field: 'amount', headerName: 'Amount' });
  }


  // Merged data for the table
  const mergedMemberData = jsonMemberData.map((member, index) => ({
    ...member,
    serialNumber: index + 1,
    Name: (
      <Box display="flex" alignItems="center" justifyContent="left">
        <Avatar
          alt={member.name}
          src={member.profilePicture} // Use profilePicture field as the Avatar src
          // style={{ marginRight: 8, width: 24, height: 24 }}
          style={{ marginRight: 8, }}
        />
        {member.name}
      </Box>
    ),

  }));



  const handleSortSelect = (sortOption) => {
    setSortOption(sortOption); // Update sort option
  };

  const handleSearchChange = (term) => {
    setSearchTerm(term); // Update the search term state
  };

  const handleClearFilters = () => {
    setJsonMemberData(originalMemberData); // Reset to the original data
    setSearchTerm('');
  };


  const getBase64ImageFromURL = (url) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const dataURL = canvas.toDataURL('image/png');
        resolve(dataURL);
      };
      img.onerror = (error) => {
        reject(error);
      };
      img.src = url;
    });
  };



  // PDF Export Function
  const exportToPDF = async () => {

    // const imageUrl = 'logo.png';
    // const base64Image = await getBase64ImageFromURL(imageUrl);


    const base64Image = eventRegMemembers.societyLogoBase64 
    ? `${eventRegMemembers.societyLogoBase64}` :await getBase64ImageFromURL('logo.png');


    const docDefinition = {
      content: [

        {
          canvas: [
            {
              type: 'line',
              x1: 0,
              y1: 0,
              x2: 515, // Adjust based on page width
              y2: 0,
              lineWidth: 8, // Thickness of the line
              lineColor: '#000B4D'
            }
          ],
          margin: [0, 10, 0, 10] // Adjusts space around the line
        },
        {
          table: {
            body: [
              [
                {
                  image: base64Image,
                  width: 50,
                  height: 50,
                  alignment: 'center',
                  margin: [0, 0, 0, 0], // Adjust margins as needed
                },
                {
                  text: societyDetails.societyName,
                  style: 'headerTitle',
                  alignment: 'center',
                  margin: [0, 10, 0, 0], // Adjust top margin to align vertically with the image
                },
              ],
            ],
          },
          layout: 'noBorders', // Removes table borders
          alignment: 'center', // Centers the table horizontally
          margin: [0, 0, 0, 0], // Adjust margins around the table as needed
        }

        ,
        {
          canvas: [
            {
              type: 'line',
              x1: 0,
              y1: 0,
              x2: 515, // Adjust based on page width
              y2: 0,
              lineWidth: 8, // Thickness of the line
              lineColor: '#000B4D',
              dash: { length: 207, space: 100 }
            }
          ],
          margin: [0, 10, 0, 10] // Adjusts space around the line
        },
        { text: "Event Name", style: 'subheader1', alignment: 'center' },
        { text: eventName, style: 'header', alignment: 'center' },
        {
          columns: [
            { text: `Start Date: ${dayjs(eventDate).format('DD-MM-YYYY')}`, style: 'subheader2', alignment: 'left' },
            { text: `Start Time: ${formatTime(eventTime)}`, style: 'subheader2', alignment: 'right' },
          ],
        },
        {
          columns: [
            { text: `End Date: ${dayjs(eventEndDate).format('DD-MM-YYYY')}`, style: 'subheader2', alignment: 'left' },
            { text: `End Time: ${formatTime(eventEndTime)}`, style: 'subheader2', alignment: 'right' },
          ],
        },
        { text: "Registered Name", style: 'subheader1', alignment: 'left' },
        {
          table: {
            headerRows: 1,
            widths: ['auto', '*', 'auto', 'auto', 'auto'],
            alignment: 'center',
            body: [
              [
                { text: 'Sr. No.', style: 'tableHeader' },
                { text: 'Name', style: 'tableHeader' },
                { text: 'Date', style: 'tableHeader' },
                { text: 'Members', style: 'tableHeader' },
                { text: 'Mobile No.', style: 'tableHeader' },
              ],
              ...jsonMemberData.map((member, index) => [
                index + 1,
                member.name,
                member.date,
                member.members,
                member.mobile,
              ]),
            ],
          },
          layout: {
            fillColor: (rowIndex) => (rowIndex === 0 ? '#B1B0B0' : null),
            paddingLeft: (i, node) => 15,   // Adjusts left padding
            paddingRight: (i, node) => 15,  // Adjusts right padding
            paddingTop: (i, node) => 15,    // Adjusts top padding
            paddingBottom: (i, node) => 15, // Adjusts bottom padding

            hLineColor: '#D3D3D3',
            vLineColor: '#D3D3D3',

          },
        },
        {
          canvas: [
            {
              type: 'line',
              x1: 0,
              y1: 0,
              x2: 515, // Adjust based on page width
              y2: 0,
              lineWidth: 8, // Thickness of the line
              lineColor: '#000B4D',
              dash: { length: 207, space: 100 }
            }
          ],
          margin: [0, 10, 0, 10] // Adjusts space around the line
        },
      ],

      footer: function (currentPage, pageCount) {
        return [
          {
            canvas: [
              {
                type: 'line',
                x1: 40, // Adjust the starting x-coordinate
                y1: 0,
                x2: 555, // Adjust the ending x-coordinate (page width - margin)
                y2: 0,
                lineWidth: 1, // Thickness of the line
                lineColor: '#000B4D', // Color of the line
              },
            ],
            margin: [0, 0, 0, 5], // Space between the line and the footer text
          },
          {
            columns: [
              {
                text: `${societyDetails.societyName}, ${societyDetails.streetName}, ${societyDetails.state["name"]}, ${societyDetails.pincode}`,
                style: 'footerText',
              },
            ],
            margin: [0, 5, 20, 10], // Adjust the margins as needed
          },
        ];
      },


      styles: {
        headerTitle: {
          fontSize: 25,
          bold: true,
          color: '#133E58',
        },
        header: {
          color: '#000B4D',
          fontSize: 28,
          bold: true,
          decoration: 'underline',
          decorationStyle: 'solid',
          decorationColor: '#000B4D',
          margin: [0, 0, 0, 10],
        },
        subheader1: {
          color: '#000B4D',
          fontSize: 12,
          margin: [0, 5, 0, 15],
          bold: true,
          decoration: 'underline',
        },
        subheader2: {
          color: '#000B4D',
          fontSize: 12,
          margin: [0, 5, 0, 15],
          bold: true
        },
        tableHeader: {
          color: '#000B4D',
          bold: true,
          fontSize: 13,
          textAlign: 'center'

        },
        footerText: {
          fontSize: 12,
          alignment: 'right',
          margin: [0, 0, 20, 0], // Adjust the right margin as needed
        },
      },
    };

    pdfMake.createPdf(docDefinition).download(`${eventName}_registered_members.pdf`);
  };


  // CSV Headers for export 
  const csvHeaders = [
    { label: 'Name', key: 'name' },
    { label: 'Date', key: 'date' },
    { label: 'Members', key: 'members' },
    { label: 'Mobile No.', key: 'mobile' },
  ];
  // Trigger CSV Download
  const exportToCSV = () => {
    // Map the data to convert date and mobile to string


    if (csvLinkRef.current) {
      csvLinkRef.current.link.click(); // Programmatically trigger CSV download
    }





    handleClose();

  };



  return (
    <>
      <ArrowBackIcon
        fontSize="large"
        onClick={() => {
          setCreateEvent(false);
          setRegisteredMembers(false);

        }}
      />
      <Box sx={{ width: '100%' }} className="custom-container">
        <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ flexDirection: { xs: "column ", sm: "column", md: "row", lg: "row" } }}>
          <Typography variant="text12" marginLeft={3} sx={{ textWrap: 'nowrap' }}>{eventName}</Typography>
          <FilterListTableHeader
            filterOptions={filterOptions}
            onFilterSelect={() => { }}
            sortOptions={['A-Z', 'Z-A']}
            onSortSelect={handleSortSelect}
            Buttontext="Export"
            buttonIcon={<FileUploadIcon />}
            onButtonClick={handleExportClick}
            onSearchChange={handleSearchChange}
            onClearFilters={handleClearFilters} // Reset data instead of clearing it
            onSearchClear={() => setSearchTerm('')}
            onClearFilterSortOption={() => setSortOption(null)}
            onClearFilterOption={() => console.log('Cleared filter options')}
            showSearch={true}
            showFilter={false}
            showSort={true}
            showButton={true}

          />
        </Box>


        {/* Hidden CSVLink component to handle CSV download */}


        {jsonMemberData.length === 0 ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            marginTop="5%"
          >
            <Box sx={{ textAlign: 'center' }}>
              <img src="/images/Frame.png" alt="No Registered Members" />
              <Typography variant='text12'>No Registered Members</Typography>
            </Box>
          </Box>
        ) : (
          <Box sx={{ width: '100%', textAlign: 'center', padding: "2%" }}>

            <FilterListTable
              tableData={mergedMemberData}
              columnNameArray={columnNameArray}
              toDisplayFooter={false}
            />

          <PaginationFooter
            currentPage={currentPage}
            totalRecords={totalRecords}
            pageSize={pageSize}
            onPageChange={(newPage) => {
              setCurrentPage(newPage);
              fetchData(newPage);
            }}
          />

          </Box>
        )}
      </Box>


      <CSVLink
        data={jsonMemberData.map((member) => ({
          ...member,
          date: (member.date).toString(),
          mobile: `'${member.mobile.toString()}`,
        }))}
        headers={csvHeaders}
        filename={`${eventName}_registered_members.csv`}
        ref={csvLinkRef} // Reference to trigger CSV download
        className="hidden"
        target="_blank"
      />


      <Menu
        id="export-menu"
        anchorEl={anchorEl}


        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'export-button',
        }}
      >
        <MenuItem onClick={exportToCSV}>Export as CSV</MenuItem>
        <MenuItem onClick={exportToPDF}>Export as PDF</MenuItem>
      </Menu>



    </>
  );
};

export default EventRegisteredMembers;
