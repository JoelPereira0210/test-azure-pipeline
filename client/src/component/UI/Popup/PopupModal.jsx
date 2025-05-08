import { useTheme } from '@mui/material';
import React from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
// type PopupModalProps = {
//   children: React.ReactElement; // Ensure children are React elements
//   trigger: React.ReactNode; // The trigger can be any ReactNode
// };

const PopupModal = ({ children, trigger }) => {
  const theme = useTheme();
  const contentStyle = {
    background: `${theme.palette.mode === 'light'
      ? 'var(--tw-bg-light-background)'
      : 'var(--tw-bg-dark-background)'
      }`,
    borderColor: 'black',
  };

  return (
    <Popup
      className="upload-modal"
      closeOnDocumentClick
      trigger={trigger}
      position="right center"
      modal
      {...{ contentStyle }}
    >
      {/* <div>{React.cloneElement(children, { close: () => { } })}</div> */}
      {(close) => (
        <div>{React.cloneElement(children, { close })}</div>
      )}
    </Popup>
  );
};

export default PopupModal;
