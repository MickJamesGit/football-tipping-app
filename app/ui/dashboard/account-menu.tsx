import React from "react";
import {
  Box,
  Tooltip,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
} from "@mui/material";
import { PersonAdd, Settings, Logout } from "@mui/icons-material";
import { deepPurple } from "@mui/material/colors";

export default function AccountMenu({ anchorEl, open, onClose }) {
  return (
    <Menu
      anchorEl={anchorEl}
      id="account-menu"
      open={open}
      onClose={onClose}
      onClick={onClose}
      PaperProps={{
        elevation: 0,
        sx: {
          overflow: "visible",
          filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
          mt: -2, // Position above the bottom nav bar
          ml: -2, // Shift a bit to the left
          "& .MuiAvatar-root": {
            width: 32,
            height: 32,
            ml: -0.5,
            mr: 1,
          },
          "&::before": {
            content: '""',
            display: "none",
            position: "absolute",
            top: 0,
            right: 14,
            width: 10,
            height: 10,
            bgcolor: "background.paper",
            transform: "translateY(-50%) rotate(45deg)",
            zIndex: 0,
          },
        },
      }}
      transformOrigin={{ horizontal: "right", vertical: "bottom" }}
      anchorOrigin={{ horizontal: "right", vertical: "top" }}
    >
      <MenuItem onClick={onClose}>
        <Avatar sx={{ bgcolor: deepPurple[500] }}>MJ</Avatar> Profile
      </MenuItem>
      <MenuItem onClick={onClose}>
        <Avatar /> My account
      </MenuItem>
      <Divider />
      <MenuItem onClick={onClose}>
        <ListItemIcon>
          <Logout fontSize="small" />
        </ListItemIcon>
        Logout
      </MenuItem>
    </Menu>
  );
}
