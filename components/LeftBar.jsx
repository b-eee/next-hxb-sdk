import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { userService } from "../services";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import WorkIcon from "@mui/icons-material/Work";

export { LeftBar };

function LeftBar() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  let url = router.basePath;
  useEffect(() => {
    const subscription = userService.user.subscribe((x) => setUser(x));
    return () => subscription.unsubscribe();
  }, []);

  function logout() {
    userService.logout();
  }
  // only show nav when logged in
  if (!user) return null;

  return (
    <div className="left-main">
      <div className="left-main-top"></div>
      <hr className="left-main-hr" />
      <nav className="left-main-nav">
        {/* <div className="left-item">
          <div className="left-svg-boby">
            <svg
              className="svg-item"
              focusable="false"
              aria-hidden="true"
              viewBox="0 0 24 24"
              data-testid="DashboardIcon"
            >
              <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"></path>
            </svg>
          </div>
          <div className="left-text-boby">
            <span className="text-item">
              <Link href={`${url}/workspaces`}>Workspace</Link>
            </span>
          </div>
        </div> */}
        <List>
          <Link href={`${url}/workspaces`}>
            <ListItem>
              <ListItemButton>
                <ListItemIcon>
                  <WorkIcon />
                </ListItemIcon>
                <ListItemText primary="Workspace" />
              </ListItemButton>
            </ListItem>
          </Link>
        </List>
      </nav>
    </div>
  );
}
