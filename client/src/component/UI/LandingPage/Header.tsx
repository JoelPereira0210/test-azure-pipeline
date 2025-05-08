
'use client';
import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Button from '@mui/material/Button';
import Link from 'next/link';
import { Typography } from '@mui/material';

const Header = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const navItems = ['Home', 'About', 'Plans', 'Contact'];
  const societyLogo = 'BASE64_STRING_HERE'; // Replace with your base64 string dynamically

  const toggleDrawer = (open: boolean) => () => {
    setDrawerOpen(open);
  };

  return (
    <AppBar
      position="relative"
      sx={{ background: '#C4DBF7', boxShadow: 'none' }}
    >
      <Box
        sx={{
          // height: '128px', // Take the whole screen height
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Toolbar
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          {/* Logo */}
          <Box
            sx={{
              width: {
                xs: '7rem',
                sm: '8rem',
                md: '9rem',
                lg: '10rem',
                xl: '11rem',
              },
              height: {
                xs: '5rem',
                sm: '6rem',
                md: '7rem',
                lg: '8rem',
                xl: '9rem',
              },
              marginLeft: { xs: 0, sm: 0, md: '5rem' }, 
            }}
          >
            <img
              src="/images/landingpagelogo.png"
              alt="Logo"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
              }}
            />
          </Box>

          {/* Desktop Navigation */}
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              gap: 3,
              marginRight: '7%',
            }}
          >
            {/* Navigation Items */}
            {navItems.map((item) => (
              <Link key={item} href={`/${item.toLowerCase()}`} passHref>
                <Button sx={{ color: '#1F64FF', fontWeight: '500' }}>
                  {item}
                </Button>
              </Link>
            ))}
            <Button
              variant="outlined"
              sx={{
                borderColor: '#1F64FF',
                color: '#1F64FF',
                fontSize: '16px',
                textTransform: 'none',
                fontWeight: '600',
                '&:hover': {
                  backgroundColor: '#e6f0ff',
                  borderColor: '#1F64FF',
                },
              }}
            >
              <Link
                href="/signup?signin"
                style={{ textDecoration: 'none', color: '#1F64FF' }}
              >
                Sign In
              </Link>
            </Button>
            <Button
              variant="contained"
              sx={{
                backgroundColor: '#1F64FF',
                color: '#fff',
                textTransform: 'none',
                fontWeight: '500',
                '&:hover': { backgroundColor: '#1653cc' },
              }}
            >
              <Link
                 href="/signup"
                style={{ textDecoration: 'none', color: '#fff' }}
              >
                Register Society
              </Link>
            </Button>
          </Box>

          {/* Mobile Drawer */}
          <Box sx={{ display: { xs: 'block', md: 'none' } }}>
            <IconButton
              edge="end"
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer(true)}
              sx={{ color: '#1F64FF' }}
            >
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="right"
              open={drawerOpen}
              onClose={toggleDrawer(false)}
            >
              <Box
                sx={{ width: 250 }}
                role="presentation"
                onClick={toggleDrawer(false)}
                onKeyDown={toggleDrawer(false)}
              >
                <List>
                  {navItems.map((item) => (
                    <ListItem button key={item}>
                      <ListItemText>
                        <Link
                          href={`/${item.toLowerCase()}`}
                          style={{ textDecoration: 'none', color: '#1F64FF' }}
                        >
                          {item}
                        </Link>
                      </ListItemText>
                    </ListItem>
                  ))}
                  <ListItem>
                    <Button
                      variant="outlined"
                      fullWidth
                      sx={{
                        borderColor: '#1F64FF',
                        color: '#1F64FF',
                        textTransform: 'none',
                        fontWeight: '500',
                        '&:hover': {
                          backgroundColor: '#e6f0ff',
                          borderColor: '#1F64FF',
                        },
                      }}
                    >
                      <Link
                        href="/signin"
                        style={{ textDecoration: 'none', color: '#1F64FF' }}
                      >
                        Sign In
                      </Link>
                    </Button>
                  </ListItem>
                  <ListItem>
                    <Button
                      variant="contained"
                      fullWidth
                      sx={{
                        backgroundColor: '#1F64FF',
                        color: '#fff',
                        textTransform: 'none',
                        fontWeight: '500',
                        '&:hover': { backgroundColor: '#1653cc' },
                      }}
                    >
                      <Link
                        href="/register"
                        style={{ textDecoration: 'none', color: '#fff' }}
                      >
                        Register Society
                      </Link>
                    </Button>
                  </ListItem>
                </List>
              </Box>
            </Drawer>
          </Box>
        </Toolbar>
      </Box>
    </AppBar>
  );
};

export default Header;
