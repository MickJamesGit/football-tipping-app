"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Divider,
  Typography,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MailIcon from "@mui/icons-material/Mail";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import Avatar from "@mui/material/Avatar";
import PersonIcon from "@mui/icons-material/Person";

const AvatarDrawer = ({ image, alias, name }) => {
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  const list = (anchor) => (
    <Box
      sx={{ width: anchor === "top" || anchor === "bottom" ? "auto" : 250 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: 2,
        }}
      >
        <Avatar src={image} alt={alias} sx={{ width: 100, height: 100 }} />
        <Typography variant="h6" sx={{ marginTop: 1 }}>
          {name}
        </Typography>
      </Box>
      <Divider />
      <List>
        {[
          { text: "Account details", icon: <AccountCircleIcon /> },
          { text: "Communication preferences", icon: <MailIcon /> },
        ].map(({ text, icon }) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>{icon}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <PowerSettingsNewIcon />
            </ListItemIcon>
            <ListItemText primary="Sign out" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <div>
      <AccountCircleIcon
        onClick={toggleDrawer("right", true)}
        style={{ cursor: "pointer", color: "white", fontSize: "36px" }}
      />
      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={toggleDrawer("right", false)}
      >
        {list("right")}
      </Drawer>
    </div>
  );
};

export default AvatarDrawer;
