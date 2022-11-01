import { Button } from "@mui/material";
import { useState, useEffect } from "react";
import { userService } from "../services";
export { Nav };

function Nav() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const subscription = userService.user.subscribe((x) => setUser(x));
    return () => subscription.unsubscribe();
  }, []);

  function logout() {
    userService.logout();
  }

  if (!user) return null;

  return (
    <div className="top-header">
      <div className="header-body" style={{ paddingRight: "20px" }}>
        <h1 className="title-header">HEXABASE</h1>
        <Button onClick={logout} variant="outlined" sx={{ color: "white" }}>
          Logout
        </Button>
      </div>
    </div>
  );
}
