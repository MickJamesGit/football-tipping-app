"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Box,
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
import { signOut } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface AvatarDrawerProps {
  image: string;
  alias: string;
  name: string;
}

const AvatarDrawer: React.FC<AvatarDrawerProps> = ({ image, alias, name }) => {
  const [isDrawerOpen, setDrawerOpen] = useState<boolean>(false);

  const toggleDrawer =
    (anchor: "top" | "left" | "bottom" | "right", open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }
      setDrawerOpen(open);
    };

  const handleSignOut = async () => {
    await signOut();
  };

  const list = (anchor: "top" | "left" | "bottom" | "right") => (
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
        <Avatar className="h-[100px] w-[100px] rounded-full">
          <AvatarImage src={image} />
          <AvatarFallback className="bg-gray-400 text-white flex items-center justify-center h-full w-full text-2xl">
            {alias
              .split(" ")
              .map((word) => word[0])
              .slice(0, 2)
              .join("")
              .toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <Typography variant="h6" sx={{ marginTop: 1 }}>
          {name}
        </Typography>
      </Box>
      <Divider />
      <List>
        {[
          {
            text: "Account details",
            icon: <AccountCircleIcon />,
            href: "/dashboard/account",
          },
          {
            text: "Communication preferences",
            icon: <MailIcon />,
            href: "/dashboard/account",
          },
        ].map(({ text, icon, href }) => (
          <Link href={href} key={text} passHref>
            <ListItem disablePadding component="a">
              <ListItemButton>
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          </Link>
        ))}
      </List>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={handleSignOut}>
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
