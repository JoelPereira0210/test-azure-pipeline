import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import ButtonInput from '../UI/Button/Button';
import { AddMembersDataType as FormValues } from '@/src/lib/types/addMembers.types';
import InputField from '../UI/InputField/InputField';
import MobileInput from '../UI/MobileInput/MobileInput';
import { style } from '@/src/component/modals/modalStyle';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { addMembersSchema } from '@/src/lib/zod/members';
import ExcelUpload from '../ExcelUpload';
import AddMemberTable from '../UI/Tables/AddMemberTable';
import { addMembersActions } from '@/src/actions/addMembers';
import toast from 'react-hot-toast';
import { useMediaQuery, useTheme, Button } from '@mui/material';
// import ShowMembersTable from './showMembersTable';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// import { fetchMembersAction } from '@/src/actions/designation';
import FilterListTable from '../UI/Tables/FilterListTable';
import Avatar from '@mui/material/Avatar';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { CiEdit } from 'react-icons/ci';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import MemberListDisplay from '../MemberListDispay';

interface Props {
  modalButtonAdd: string;
  modalButtonCancel: string;
  open: boolean;

  onClose: () => void; // Function to close the modal
}
const normalizeMobileNumber = (mobileNumber: string) => {
  return mobileNumber.replace(/\s+/g, ''); // Remove all spaces
};
const AddMembers = (props: Props) => {
  const theme = useTheme();
  const mode = theme.palette.mode;
  const [jsonData, setJsonData] = useState<any[]>([]); // State to store the JSON data
  const [jsonMemberData, setJsonMemberData] = useState<any[]>([]);
  const [editForm, setEditForm] = useState<any>(null); // State to store the JSON data
  const [selectedEntries, setSelectedEntries] = useState<any[]>([]);
  const [showTable, setShowTable] = useState<boolean>(false);
  const [showMembersListTable, setShowMembersListTable] =
    useState<boolean>(false);
  const isMobile = useMediaQuery('(max-width:640px)');

  const {
    control,
    handleSubmit,
    trigger,
    setError,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(addMembersSchema),
    defaultValues: {
      mobileNumber: '',
      firstName: '',
      lastName: '',
    },
  });
  useEffect(() => {
    if (editForm != null) {
      const [firstName, ...lastNameParts] = editForm.name.split(' ');
      const lastName = lastNameParts.join(' ');
      reset({
        mobileNumber: editForm.mobileNumber,
        firstName: firstName,
        lastName: lastName,
      });
    }
  }, [editForm]);
  const onSubmit = async (newEntry: FormValues) => {
    // if (isDuplicate) {
    //     setError("mobileNumber", {
    //         type: "manual",
    //         message: `Mobile number ${newEntry.mobileNumber} already added to another member`,
    //     })
    // } else {
    if (editForm) {
      // Find the index of the row to update
      const updatedData = jsonData.map((item) => {
        if (item.id === editForm.id) {
          // Update the existing row with new values
          return {
            ...item,
            mobileNumber: newEntry.mobileNumber,
            firstName: newEntry.firstName,
            lastName: newEntry.lastName,
            error: null, // Reset the error state
          };
        }
        return item; // Return other rows as they are
      });

      // Update the jsonData with the updated row
      setJsonData(updatedData);
      // Clear the edit form after updating
      setEditForm(null);
      reset({
        mobileNumber: '',
        firstName: '',
        lastName: '',
      });
    } else {
      const isDuplicate = jsonData.some(
        (item) =>
          normalizeMobileNumber(item.mobileNumber) ===
          normalizeMobileNumber(newEntry.mobileNumber)
      );
      console.log('jsonData', jsonData);
      console.log('newEntry', newEntry);
      console.log('DDDD', isDuplicate);
      if (isDuplicate) {
        setError('mobileNumber', {
          type: 'manual',
          message: `Mobile number ${newEntry.mobileNumber} already added to another member`,
        });
      } else {
        if (jsonData.length > 0) {
          let errorData: any[] = []; // Array to store duplicates
          let uniqueDataMap: any = {}; // Object to store unique mobile numbers
          let uniqueData: any[] = []; // Array to store unique entries

          jsonData.forEach((item: any, index: number) => {
            const mobileNumber = item['mobileNumber']; // Extract mobile number from the existing data

            // Check if the mobile number is already in uniqueDataMap (for duplicates)
            if (uniqueDataMap[mobileNumber]) {
              // If the mobile number already exists, it's a duplicate
              errorData.push({
                id: index + 1, // Assign ID for error data
                ...item,
              });
            } else {
              // If the mobile number is not a duplicate, add to uniqueData and map
              uniqueDataMap[mobileNumber] = true;

              // Transform the data into the desired structure
              uniqueData.push({
                id: jsonData.length + uniqueData.length + 1, // Incremental ID
                mobileNumber: item['mobileNumber'], // Existing number
                firstName: item['firstName'],
                lastName: item['lastName'],
              });
            }
          });

          // Now check if the newEntry mobile number is already present in the uniqueDataMap
          if (uniqueDataMap[newEntry.mobileNumber]) {
            // If the mobile number already exists in jsonData, handle it as a duplicate
            const newJsonData = {
              id: jsonData.length + 1,
              mobileNumber: newEntry.mobileNumber,
              firstName: newEntry.firstName,
              lastName: newEntry.lastName,
              error: 'This mobile number already exists',
            };
            console.log('Duplicate entry:', newEntry.mobileNumber);
            console.log('Adding new entry:', newJsonData);
            setJsonData([...jsonData, newJsonData]);
          } else {
            // If no duplicate, add the new entry
            const newJsonData = {
              id: jsonData.length + uniqueData.length + 1,
              mobileNumber: newEntry.mobileNumber,
              firstName: newEntry.firstName,
              lastName: newEntry.lastName,
              error: null,
            };
            console.log('Adding new entry:', newJsonData);
            setJsonData([...jsonData, newJsonData]); // Add new entry to the jsonData state
            reset({
              mobileNumber: '',
              firstName: '',
              lastName: '',
            });
          }
        } else {
          // If jsonData is empty, just add the new entry
          const newJsonData = {
            id: jsonData.length + 1,
            mobileNumber: newEntry.mobileNumber,
            firstName: newEntry.firstName,
            lastName: newEntry.lastName,
            error: null,
          };
          console.log('Adding new entry to empty jsonData:', newJsonData);
          setJsonData([...jsonData, newJsonData]); // Add new entry to the jsonData state
          reset({
            mobileNumber: '',
            firstName: '',
            lastName: '',
          });
        }
      }
    }
    if (isMobile) {
      setShowTable(true);
    }
   
  };
  const onRemove = async () => {
    console.log('selectedEntries', selectedEntries);
    const filteredData = jsonData.filter(
      (item) => !selectedEntries.includes(item.id)
    );
    setJsonData(filteredData);
  };
  
  const addMembersHandler = async () => {
    try {
      const response = await addMembersActions(jsonData);

      console.log('Response:', response); // Log the full response for debugging

      setShowMembersListTable(true);
    } catch (error) {
      console.error('Error fetching members:', error);
      toast.error('Error fetching members');
    }
  };

  const openTableHandler = () => {
    setShowTable(true);
  };
  const closeTableHandler = () => {
    setShowTable(false);
  };
  console.log('jsonData', jsonData);

  return (
    <>
      {showMembersListTable ? (
        <MemberListDisplay />
      ) : (
        <Modal
          open={props.open}
          // onClose={(e, reason) => reason === 'backdropClick' && e.stopPropagation()}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box
            sx={{
              ...style,
              maxWidth: 1200,
              height: 768,
              padding: '1% 2%',
              '@media (max-width: 640px)': {
                height: 640,
              },
            }}
            onClick={(e) => e.stopPropagation()} 
          >
            <>
              {showTable === true ? (
                <>
                  <Box sx={{ marginBottom: '1rem' }}>
                    <Box
                      onClick={() => {
                        closeTableHandler();
                      }}
                    >
                      <ArrowBackIcon
                        sx={{
                          color: `${
                            theme.palette.mode === 'light' ? 'black' : '#fff'
                          }`,
                        }}
                      />
                    </Box>
                    <Typography>Details</Typography>
                  </Box>
                  <AddMemberTable
                    setShowTable={setShowTable}
                    jsonData={jsonData}
                    setEditForm={setEditForm}
                    setSelectedEntries={setSelectedEntries}
                  />
                  <Box
                    className="flex justify-center gap-4"
                    sx={{ marginTop: '2rem' }}
                  >
                    <ButtonInput
                      styles={{
                        width: '112px',
                      }}
                      text="Remove"
                      buttonBackgroundColor="var(--tw-bg-light-redBackground)"
                      buttonFontColor="var(--tw-text-light-redText)"
                      fontSize={16}
                      fontWeight={600}
                      type="button"
                   /*    disabled={false} */
                   disabled={!jsonData || jsonData.length === 0}  // Safe check for jsonData
                      loading={false}
                      onClick={() => {
                        onRemove();
                      }}
                    />
                    <ButtonInput
                      styles={{
                        width: '112px',
                      }}
                      text="Submit"
                      fontSize={16}
                      fontWeight={600}
                      type="button"
                     /*  disabled={false} */
                     disabled={!jsonData || jsonData.length === 0}  // Safe check for jsonData
                      loading={false}
                      onClick={() => {
                        addMembersHandler();
                      }}
                    />
                  </Box>
                </>
              ) : (
                <>
                  <Box className="flex flex-row items-center justify-center  w-full">
                    <Box
                      className="flex flex-row items-center justify-end  w-full"
                      sx={{
                        justifyContent: 'flex-end',
                      }}
                    >
                      <Typography
                        id="modal-modal-title"
                        className="text-center"
                        sx={{
                          marginBottom: '20px',
                        }}
                        variant="h6"
                        component="h2"
                        gutterBottom
                      >
                        Add Members
                      </Typography>
                    </Box>
                    <Box
                      className="flex w-full"
                      sx={{ cursor: 'pointer', justifyContent: 'flex-end' }}
                    >
                      <HighlightOffIcon
                        sx={{
                          cursor: 'pointer',
                        }}
                        fontSize="large"
                        className="cursor-pointer"
                        onClick={() => {
                          props.onClose();
                        }}
                      />
                    </Box>
                  </Box>
                  <Box
                    className="flex"
                    sx={{
                      flexDirection: 'row',
                    }}
                  >
                    <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
                      <Box className="flex md:flex-row flex-col gap-4 items-center w-full">
                        <Controller
                          name="mobileNumber"
                          control={control}
                          render={({ field }) => (
                            <MobileInput
                              name="mobileNumber"
                              control={control}
                              label={'Mobile Number'}
                              placeholder="Mobile Number"
                              country={'IN'}
                              error={errors.mobileNumber?.message}
                            />
                          )}
                        />

                        <Controller
                          name="firstName"
                          control={control}
                          rules={{ required: true }}
                          render={({ field }) => (
                            <InputField
                              label="First Name"
                              type="text"
                              required={true}
                              errorMessage={errors.firstName?.message}
                              placeholder="First Name"
                              {...field}
                              onChange={(e) => {
                                field.onChange(e);
                                trigger('firstName');
                              }}
                              classes=""
                            />
                          )}
                        />

                        <Controller
                          name="lastName"
                          control={control}
                          rules={{ required: true }}
                          render={({ field }) => (
                            <InputField
                              label="Last Name"
                              type="text"
                              required={true}
                              errorMessage={errors.lastName?.message}
                              placeholder="Last Name"
                              {...field}
                              onChange={(e) => {
                                field.onChange(e);
                                trigger('lastName');
                              }}
                              classes=""
                            />
                          )}
                        />
                      </Box>
                      <Box
                        sx={{
                          marginTop: '1rem',
                        }}
                        className="flex md:flex-row gap-4 justify-between"
                      >
                        <ExcelUpload
                          jsonData={jsonData}
                          setJsonData={setJsonData}
                          setShowTable={setShowTable}
                        />
                        <ButtonInput
                          text={'Add'}
                          disabled={false}
                          fontWeight={600}
                          type="submit"
                          loading={false}
                          fontSize={16}
                          styles={{
                            maxWidth: 210,
                            height: 50,
                            '@media (max-width: 640px)': {
                              maxWidth: 110,
                              fontSize: 13,
                              height: 35,
                            },
                          }}
                        />
                      </Box>
                      <Box
                        sx={{
                          maxWidth: 260,
                          '@media (max-width: 640px)': {
                            maxWidth: '100%',
                          },
                        }}
                      >
                        <Typography
                          fontSize={16}
                          fontWeight={600}
                          component="span"
                          color={'var(--tw-text-light-redText)'}
                        >
                          Note:{' '}
                        </Typography>
                        <Typography
                          fontSize={12}
                          fontWeight={500}
                          component="span"
                        >
                          CSV should have three mandatory columns with column
                          titles as &quot;First Name&quot;, &quot;Last
                          Name&quot; and &quot;Mobile Number&quot;
                        </Typography>
                      </Box>
                    </form>
                  </Box>

                  <Box className="flex flex-col items-center">
                    {!isMobile ? (
                      <AddMemberTable
                        setShowTable={setShowTable}
                        jsonData={jsonData}
                        setEditForm={setEditForm}
                        setSelectedEntries={setSelectedEntries}
                      />
                    ) : null}
                    <Box
                      className="flex"
                      sx={{
                        marginTop: '2rem',
                        gap: '1.5rem',
                      }}
                    >
                      <ButtonInput
                        styles={{
                          width: '112px',
                          border: `1px solid ${
                            theme?.palette?.mode === 'light' ? 'black' : 'white'
                          }`,
                        }}
                        text="Cancel"
                        buttonBackgroundColor="transparent"
                        buttonFontColor={`${
                          theme?.palette?.mode === 'light' ? 'black' : 'white'
                        }`}
                        fontSize={16}
                        fontWeight={600}
                        type="button"
                        disabled={false}
                        loading={false}
                        onClick={() => {
                          props.onClose();
                        }}
                      />
                      {!isMobile ? (
                        <>
                          <ButtonInput
                            styles={{
                              width: '112px',
                            }}
                            text="Remove"
                            buttonBackgroundColor="var(--tw-bg-light-redBackground)"
                            buttonFontColor="var(--tw-text-light-redText)"
                            fontSize={16}
                            fontWeight={600}
                            type="button"
                            disabled={!jsonData || jsonData.length === 0}  // Safe check for jsonData
                            /*  disabled={false} */
                            loading={false}
                            onClick={() => {
                              onRemove();
                            }}
                          />
                          <ButtonInput
                            styles={{
                              width: '112px',
                            }}
                            text="Submit"
                            fontSize={16}
                            fontWeight={600}
                            type="button"
                           /*  disabled={false} */
                           disabled={!jsonData || jsonData.length === 0}  // Safe check for jsonData

                            loading={false}
                            onClick={() => {
                              addMembersHandler();
                            }}
                          />
                        </>
                      ) : null}
                      {isMobile === true ? (
                        <ButtonInput
                          styles={{
                            width: '112px',
                          }}
                          text="View"
                          fontSize={16}
                          fontWeight={600}
                          type="button"
                          disabled={false}
                          loading={false}
                          onClick={() => {
                            // addMembersHandler()
                            openTableHandler();
                          }}
                        />
                      ) : null}
                    </Box>
                  </Box>
                </>
              )}
            </>
          </Box>
        </Modal>
      )}
    </>
  );
};

export default AddMembers;
