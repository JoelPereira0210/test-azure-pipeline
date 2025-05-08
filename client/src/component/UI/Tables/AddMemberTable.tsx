import React, { useState } from 'react';
import { DataGrid, GridColDef, GridRowSelectionModel, GridCellParams } from '@mui/x-data-grid';
import { Box, useMediaQuery, useTheme } from '@mui/material';

const columns: GridColDef[] = [
    {
        field: 'name',
        headerName: 'Name',
        width: 190,
        sortable: false,
    },
    {
        field: 'mobileNumber',
        headerName: 'Mobile Number',
        width: 300,
        sortable: false,
        renderCell: (params) => (
            <div style={{ position: 'relative' }}>
                <span>{params.row.mobileNumber}</span>
                {params.row.error && (
                    <span style={{ color: 'red', fontSize: '14px', position: 'absolute', top: '14px', left: 0 }}>
                        {params.row.error}
                    </span>
                )}
            </div>
        ),
    },
];

interface Props {
    jsonData: any[];
    setEditForm: React.Dispatch<any>;
    setSelectedEntries: React.Dispatch<React.SetStateAction<any[]>>;
    setShowTable: React.Dispatch<React.SetStateAction<boolean>>
}

const AddMemberTable = (props: Props) => {
    const theme = useTheme();
    const isMobile = useMediaQuery('(max-width:640px)');
    const [clickedRowId, setClickedRowId] = useState<number | null>(null); // Track clicked rows
    const [clickedRowCheckbox, setClickedRowCheckbox] = useState<number | null>(null); // Track clicked rows
    const [checkboxSelectedRows, setCheckboxSelectedRows] = useState<number[]>([]); // Track checkbox selected rows

    const rows = props.jsonData.map((item, index) => ({
        id: item.id,
        name: `${item.firstName} ${item.lastName}`,
        mobileNumber: item.mobileNumber,
        error: item.error,
    }));

    const handleSelectionChange = (selectionModel: number[]) => {
        setCheckboxSelectedRows(selectionModel as number[]);
        console.log("selectionModel", selectionModel)
        props.setSelectedEntries(selectionModel);
    };

    const handleCellClick = (params: GridCellParams, event: React.MouseEvent) => {
        if ((event.target as HTMLElement).tagName === 'INPUT' && (event.target as HTMLInputElement).type === 'checkbox') {
            console.log("checkbox")
            const rowData = params.row;
            console.log("rowData checkbox", rowData)
            setClickedRowCheckbox(params.id as number);
        } else if (params.field === 'name' || params.field === 'mobileNumber') {
            console.log("name or number")
            const rowData = params.row;
            console.log("rowData", rowData)
            props.setEditForm(rowData);
            setClickedRowId(params.id as number);
            if (isMobile) {
                props.setShowTable(false);
            }
        }
    };

    return (
        <Box className="flex flex-col items-center">
            <Box
                sx={{
                    height: 315,
                    width: '100%',
                    overflowX: 'auto', // Enable horizontal scrolling
                    '@media (max-width: 640px)': {
                        maxWidth: 340,
                        '& .MuiDataGrid-root': {
                            minWidth: 340, // Set a minimum width for the table to trigger scrolling
                        }
                    }
                }}
            >
                <DataGrid
                    className="addMembersTable"
                    rows={rows}
                    columns={columns}
                    getRowId={(row) => row.id}
                    onRowSelectionModelChange={handleSelectionChange}
                    checkboxSelection
                    getRowClassName={(params) => {
                        if (params.id === clickedRowId) {
                            return 'clicked-row';
                        } else if (params.row.error) {
                            return 'error-row';
                        }
                        if (params.id === clickedRowCheckbox) {
                            return 'checkbox-selected-row';
                        }
                        return '';
                    }}
                    onCellClick={handleCellClick}
                    sx={{
                        '&.MuiButtonBase-root': {
                            color: 'red!important',
                        },
                        '&.Mui-checked': {
                            color: 'red!important',
                        },
                        '.MuiDataGrid-columnHeaderTitleContainer': {
                            '.MuiSvgIcon-root': {
                                'path': {
                                    color: `${theme.palette.mode === 'light' ? 'var(--tw-bg-light-background)' : 'var(--tw-bg-light-background)'}`
                                }
                            },
                        },
                        '.MuiSvgIcon-root': {
                            'path': {
                                color: `${theme.palette.mode === 'light' ? 'var(--tw-bg-dark-background)' : 'var(--tw-bg-light-background)'}`
                            }
                        },
                        '& .error-row': {
                            color: 'var(--tw-text-light-redText)', // Style for error rows
                        },
                    }}
                />
            </Box>
        </Box>
    );
};

export default AddMemberTable;
