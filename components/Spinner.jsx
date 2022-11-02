import { Backdrop, CircularProgress } from "@mui/material";

export { Spinner };

function Spinner() {
  return (
    <Backdrop
      sx={{ color: "#fff", zIndex: 1201 }}
      open={open}
      onClick={() => null}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
}
