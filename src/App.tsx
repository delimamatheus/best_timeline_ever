import React from "react";
import { CssBaseline, Container, Typography } from "@mui/material";
import Timeline from "./components/organisms/Timeline/Timeline";

const App: React.FC = () => {
  return (
    <>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom textAlign="center">
          Airtable Timeline
        </Typography>
        <Timeline />
      </Container>
    </>
  );
};

export default App;
