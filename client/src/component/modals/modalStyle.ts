export const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',  // Adjusted width for responsiveness
    maxWidth: 400, // Maximum width to ensure it doesn't get too wide
    bgcolor: 'background.paper',
    borderRadius: '8px',
    boxShadow: 24,
    p: 4,
    '@media (max-width: 600px)': {
        width: '95%', // Adjust width for smaller screens
        p: 2, // Adjust padding for smaller screens
    },
};