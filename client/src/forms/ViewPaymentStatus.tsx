import React, { useState, useEffect, useContext,useRef } from 'react';

import { ChargesContext } from '../component/context/ChargesContext';
import { fetchPaymentDetails } from '../actions/charges';
import FilterListTable from '../component/UI/Tables/FilterListTable';
import FilterListTableHeader from '../component/UI/TableHeader/FilterListTableHeader';
import { Box, Typography, Avatar,  Menu, MenuItem, } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter } from 'next/navigation';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import PaginationFooter from '../component/UI/TableFooter/TableFooter';
import { CSVLink } from 'react-csv';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);


const ViewPaymentStatus = () => {
  const router = useRouter();

  const {
    createCharge,
    setCreateCharge,
    setChargeActionType,
    chargeId,
    setChargeId,
    chargeActionType,
    chargeName,
    setChargeName,
    setChargeMemberStatus,
  } = useContext(ChargesContext);

  const [paymentStatus, setPaymentStatus] = useState([]);
  const [originalPaymentData, setOriginalPaymentData] = useState([]);
  const [filterOptions, setFilterOptions] = useState([]);
  const [sortOption, setSortOption] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [societyDetails, setSocietyDetails] = useState(null);
  const [pdfData, setPdfData] = useState(null);

  // CSVLink reference for triggering CSV download programmatically
  const csvLinkRef = useRef<any>();

  let base64Image = null;
 // For the dropdown menu
 const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
 const open = Boolean(anchorEl);


 const [currentPage, setCurrentPage] = useState(0);
 const [totalRecords, setTotalRecords] = useState(0);

 const pageSize = 10; // Number of records per page

 

    // Handle dropdown menu open/close
    const handleExportClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };


    useEffect(() => {
      if (chargeId) {
        fetchCharges(currentPage);
      }
    }, [chargeId, currentPage]);

    const fetchCharges = async (page = 0) => {
      try {
        const response = await fetchPaymentDetails(chargeId, pageSize, page * pageSize);
        console.log('Fetched Payment Details:', response);
  
        if (response) {
          setPaymentStatus(response || []); 
          setOriginalPaymentData(response || []);
          setTotalRecords(response[0].totalRecords);
          setSocietyDetails(response.societyDetails);
        }
      } catch (error) {
        console.error('Error fetching payment details:', error);
        setPaymentStatus([]); 
      }
    };

  // Handle Pagination Change
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    fetchCharges(newPage);
  };

  // Unified Sorting and Search Logic
  useEffect(() => {
    let updatedData = [...originalPaymentData];

    if (sortOption === 'A-Z') {
      updatedData.sort((a, b) => a.userName.localeCompare(b.userName));
    } else if (sortOption === 'Z-A') {
      updatedData.sort((a, b) => b.userName.localeCompare(a.userName));
    }

    if (searchTerm) {
      updatedData = updatedData.filter((payment) =>
        payment.userName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setPaymentStatus(updatedData);
  }, [sortOption, searchTerm, originalPaymentData]);

  // Define the columns for the table
  const columnNameArray = [
    { field: 'serialNumber', headerName: 'Sr. No.' },
    { field: 'name', headerName: 'Name' },
    { field: 'dueDate', headerName: 'Due Date' },
    { field: 'amount', headerName: 'Amount' },
    { field: 'status', headerName: 'Status' },
    { field: 'mobile', headerName: 'Mobile No.' },
  ];

  // Prepare table data
  const mergedPaymentData = (paymentStatus || []).map((payment, index) => ({

    serialNumber: index + 1,
    name: (
      <Box display="flex" alignItems="center" justifyContent="left">
        <Avatar
          alt={payment.userName}
          src={payment.profilePicture}
          //  style={{ marginRight: 8, width: 24, height: 24 }}
          style={{ marginRight: 8 }}
        />
        {payment.userName}
      </Box>
    ),
    dueDate:  new Date(payment.dueDate).toLocaleDateString(), // Ensure dueDate is fetched in your API
    // dueDate: (dayjs(payment.dueDate).format('D MMM YYYY')),
    amount: payment.amount,
    status: (
      <Typography
      sx={{
        backgroundColor: payment.status === 'Completed' ? '#34A8531A' : '#E41D1D1A', // Light green for "Paid", light red for "Unpaid"
        color: payment.status === 'Completed' ? '#34A853' : '#E41D1D', // Green text for "Paid", red for "Unpaid"
        padding: '5px 15px', // Padding to match the badge appearance
        borderRadius: '8px', // Rounded corners
        display: 'inline-block', // Ensure it behaves like a badge
        fontWeight: '300', // Make the text bold
        textAlign: 'center', // Center the text
      }}
      >
        {payment.status === 'Completed' ? 'Paid' : 'Unpaid'}
      </Typography>
    ),
    mobile: payment.userMobile || 'N/A',
  }));

  const handleSortSelect = (sortOption) => {
    setSortOption(sortOption);
  };

  const handleSearchChange = (term) => {
    setSearchTerm(term);
  };

  const handleClearFilters = () => {
    setPaymentStatus(originalPaymentData); // Reset to original data
    setSearchTerm('');
    // setSortOption(null);
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

    const exportToPDF = async () => {

      
    // const imageUrl = 'logo.png';
    // const base64Image = await getBase64ImageFromURL(imageUrl);


     base64Image = pdfData[0].societyLogoBase64 
    ? `${pdfData[0].societyLogoBase64}` :await getBase64ImageFromURL('logo.png');
  

      const docDefinition = {
        content: [
          // Top Thick Line
          {
            canvas: [
              {
                type: 'line',
                x1: 0,
                y1: 0,
                x2: 515,
                y2: 0,
                lineWidth: 8,
                lineColor: '#000B4D',
              },
            ],
            margin: [0, 10, 0, 10],
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
                    text: `${societyDetails.societyName}`,
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

          // Header Title
          { text: "Fee Name", style: 'subheader1', alignment: 'center' },
          { text: `${chargeName}`, style: 'header', alignment: 'center' },
    
              {
                    columns: [
                      { text: `Amount: ${pdfData[0].FeeAmount}`, style: 'subheader2',alignment: 'left'  },
                      { text: `Due date ${dayjs(pdfData.dueDate).format('DD-MM-YYYY')}`, style: 'subheader2',alignment: 'right'  },
                    ],
                  },
                 
                  { text: "Name", style: 'subheader1', alignment: 'left' },
          // Table
          {
            table: {
              headerRows: 1,
              widths: ['*', 'auto', 'auto', 'auto'],
              body: [
                // Table Header
                [
                  { text: 'Name', style: 'tableHeader' },
                  { text: 'Payment Date', style: 'tableHeader' },
                  // { text: 'Amount', style: 'tableHeader' },
                  { text: 'Status', style: 'tableHeader' },
                  { text: 'Mobile No.', style: 'tableHeader' },
                ],
                // Table Data
                ...paymentStatus.map((member) => [
                  member.userName,
                  member.paidDate ?  dayjs(member.paidDate).format('D MMM YYYY') : 'Not paid',
                  // dayjs(member.paidDate).format('D MMM YYYY'),
                  // member.amount,
                  member.status === 'Completed' ? 'Paid' : 'Not Paid',
                  member.userMobile,
                ]),
              ],
            },
            layout: {
              fillColor: (rowIndex) => (rowIndex === 0 ? '#B1B0B0' : null),
              paddingLeft: () => 15,
              paddingRight: () => 15,
              paddingTop: () => 15,
              paddingBottom: () => 15,
              hLineColor: '#D3D3D3',
              vLineColor: '#D3D3D3',
            },
          },
    
          // Bottom Thick Line
          {
            canvas: [
              {
                type: 'line',
                x1: 0,
                y1: 0,
                x2: 515,
                y2: 0,
                lineWidth: 8,
                lineColor: '#000B4D',
                dash: { length: 207, space: 100 },
              },
            ],
            margin: [0, 10, 0, 10],
          },
        ],
    
        // Footer
        footer: function (currentPage, pageCount) {
          return [
            {
              canvas: [
                {
                  type: 'line',
                  x1: 40,
                  y1: 0,
                  x2: 555,
                  y2: 0,
                  lineWidth: 1,
                  lineColor: '#000B4D',
                },
              ],
              margin: [0, 0, 0, 5],
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
          color:'#000B4D',
          fontSize: 28,
          bold: true,
          decoration: 'underline',
           decorationStyle: 'solid',
            decorationColor: '#000B4D',
          margin: [0, 0, 0, 10],
        },
        subheader1: {
          color:'#000B4D',
          fontSize: 12,
          margin: [0, 5, 0, 15],
          bold:true,
          decoration: 'underline',
        },
        subheader2: {
          color:'#000B4D',
          fontSize: 12,
          margin: [0, 5, 0, 15],
          bold:true
        },
        tableHeader: {
          color:'#000B4D',
          bold: true,
          fontSize: 13,
          textAlign:'center'

        },
        footerText: {
          fontSize: 12,
          alignment: 'right',
          margin: [0, 0, 20, 0], // Adjust the right margin as needed
        },
      },
    };
      // Create and download PDF
      pdfMake.createPdf(docDefinition).download(`${chargeName}_payment_status.pdf`);
      handleClose();
    };
    
     // CSV Headers for export 
     const csvHeaders = [
      { label: 'Name', key: 'userName' },
      { label: 'Due Date', key: 'dueDate' },
      { label: 'Amount', key: 'amount' },
      { label: 'status',key: 'status'},
      { label: 'Mobile No.', key: 'userMobile' },
    ];


     // Trigger CSV Download
     const exportToCSV = () => {
      // Map the data to convert date and mobile to string

    
      if (csvLinkRef.current) {
        csvLinkRef.current.link.click(); // Programmatically trigger CSV download
      }
      



  
    handleClose();
    
    };
    

    // console.log("pdfdff",originalPaymentData[0].totalRecords);

  return (
    <>
     <ArrowBackIcon
                fontSize="large"
                onClick={() => {
                  setChargeMemberStatus(false);
                }}
                sx={{marginBottom:"5px"}}
      />
      <Box sx={{ width: '100%' }} className="custom-container">
     
        <Box display="flex" justifyContent="space-between" alignItems="center" sx={{flexDirection: { xs: 'column', sm: 'column', md: 'column', lg: 'column' }}}>
       
          <Typography variant="text12" marginLeft={3} sx={{textWrap:"nowrap"}}> {chargeName} </Typography>
          <FilterListTableHeader
            filterOptions={filterOptions}
            onFilterSelect={() => {}} // Add filter functionality if needed
            sortOptions={['A-Z', 'Z-A']}
            onSortSelect={handleSortSelect}
            Buttontext="Export"
            buttonIcon={<FileUploadIcon/>}
            onButtonClick={handleExportClick}
            onSearchChange={handleSearchChange}
            onClearFilters={handleClearFilters}
            onSearchClear={() => setSearchTerm('')}
            onClearFilterSortOption={() => setSortOption(null)}
            onClearFilterOption={() => console.log('Cleared filter options')}
            showSearch={true}
            showFilter={false}
            showSort={true}
            showButton={true}
          />
        </Box>
        {paymentStatus.length === 0 ? ( // Condition to check if no bills are pending
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            marginTop="5%"
          >
            <Box sx={{ textAlign: 'center' }}>
              <img src="/images/Frame.png" alt="No Pending Payments" />
              <Typography variant="text12">No Pending Payments</Typography>
            </Box>
          </Box>
        ) : (
          <Box
            sx={{
              width: { xs: '315px', sm: '400px', md: '100%', lg: '100%' },
              textAlign: 'center',
              padding: '2%',
            }}
          >
            <FilterListTable
              tableData={mergedPaymentData}
              columnNameArray={columnNameArray}
              toDisplayFooter={false}
            />

{totalRecords > 0 && (
  <PaginationFooter
              currentPage={currentPage}
              totalRecords={totalRecords}
              pageSize={pageSize}
              onPageChange={handlePageChange}
            />
)}

          </Box>
        )}
      </Box>

      
      <CSVLink
               data={paymentStatus.map((member) => ({
                ...member,
                date: (member?.dueDate).toString(),
                status: member?.status === 'Completed' ? 'Paid' : 'Not Paid',
                mobile: `'${member?.userMobile.toString()}`,
              }))}
        headers={csvHeaders}
        filename={`${chargeName}_registered_members.csv`}
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

export default ViewPaymentStatus;
