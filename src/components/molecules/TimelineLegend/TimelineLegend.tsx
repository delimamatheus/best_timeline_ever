import React from "react";
import { Box, Typography } from "@mui/material";

const categoryColors: Record<string, string> = {
    HR: "#F87171",
    Education: "#60A5FA",
    Translation: "#34D399",
    Design: "#FBBF24",
    Development: "#A78BFA",
    QA: "#F472B6",
    Management: "#6EE7B7",
};

export const TimelineLegend: React.FC = () => {
    const categories = Object.keys(categoryColors);

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                flexWrap: { xs: 'nowrap', sm: 'wrap' },
                gap: { xs: 0.5, sm: 1.5 },
                maxWidth: '100%',
                p: 2,
            }}
        >
            {categories.map((category) => (
                <Box key={category} sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box
                        sx={{
                            width: 10,
                            height: 10,
                            borderRadius: '50%',
                            backgroundColor: categoryColors[category],
                            mr: 0.5,
                        }}
                    />
                    <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' } }}
                    >
                        {category}
                    </Typography>
                </Box>
            ))}
        </Box>
    );
};