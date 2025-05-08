// Card.js

import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import GroupsIcon from '@mui/icons-material/Groups';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';

interface CardProps {
  title?: string;
  subtitle?: string;
  startDate?: string;
  description?: string;
  price?: string | null;
  percentage?: number | string;
  registeredMembersCount?: number;
  maxUsers?: number | string;
  buttonText?: string;
  buttonAction?: () => void;
  mode?: string;
  handleClickMenu?: (action: string) => void;
  showEditButton?: boolean;
}
const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  startDate,
  description,
  price,
  registeredMembersCount,
  maxUsers,
  percentage,
  buttonText,
  buttonAction,
  mode,
  // handleClickMenu,
  showEditButton = false,
}) => {
  const router = useRouter();

  return (
    <Box
      sx={{
        padding: '16px',
        border: '1px solid',
        borderColor: mode === 'light' ? 'var(--tw-text-light-mainText)' : 'var(--tw-text-dark-mainText)',
        borderRadius: '8px',
        position: 'relative',
        backgroundColor: mode === 'light' ? 'var(--tw-bg-light-sidebar)' : 'var(--tw-bg-dark-background)',
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.05)',
        marginRight: { xs: 'auto', sm: 'auto', md: '13%', lg: '13%' },
        width: { xs: '100%', sm: '100%', md: 'auto', lg: 'auto' },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="text2" sx={{ color: mode === 'light' ? 'var(--tw-text-light-mainText)' : 'var(--tw-text-dark-mainText)' }}>
            {title}
          </Typography>
          <Typography variant="text6" sx={{ color: mode === 'light' ? 'var(--tw-text-light-mainText)' : 'var(--tw-text-dark-mainText)' }}>
            {startDate ? dayjs(startDate).format('D MMM YYYY') : ''}
          </Typography>
        </Box>
        <Typography variant="text2" sx={{ color: price ? 'red' : 'green' }}>
          {price ? `₹ ${price}` : percentage ? `${percentage}%` : ''}
        </Typography>
      </Box>

      <Typography variant="text8" sx={{ color: mode === 'light' ? 'var(--tw-text-light-mainText)' : 'var(--tw-text-dark-mainText)' }}>
        {description.length > 80 ? `${description.substring(0, 80)}...` : description}
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <GroupsIcon color="primary" fontSize="large" />
          <Typography variant="text8" sx={{ color: mode === 'light' ? 'var(--tw-text-light-mainText)' : 'var(--tw-text-dark-mainText)' }}>
            &nbsp; {registeredMembersCount}/{maxUsers}
          </Typography>
        </Box>

        {showEditButton ? (
          <IconButton aria-label="edit" onClick={buttonAction}>
            <MoreHorizIcon fontSize="large" />
          </IconButton>
        ) : (
          <Box sx={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
            <Typography variant="text6" onClick={buttonAction} sx={{ cursor: 'pointer', color: mode === 'light' ? 'var(--tw-text-light-mainText)' : 'var(--tw-text-dark-mainText)' }}>
              {buttonText}
            </Typography>
            <IconButton onClick={() => router.push('/some-path')}>
              <MoreHorizIcon fontSize="small" />
            </IconButton>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Card;
