import React, { useState } from "react";
import { CssBaseline, Container, Typography } from "@mui/material";
import { Timeline } from "./components/organisms/Timeline/Timeline";
import initialTimelineItems from "./data/timelineItems";

const App: React.FC = () => {

  const [timelineItems, setTimelineItems] = useState(initialTimelineItems);

  return (
    <>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom textAlign="center">
          Airtable Timeline
        </Typography>

        <Timeline
          items={timelineItems}
          setItems={setTimelineItems}
        />
      </Container>
    </>
  );
};

export default App;