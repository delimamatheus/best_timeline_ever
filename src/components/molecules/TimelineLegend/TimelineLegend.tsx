import React from 'react';
import { Box, Chip, useTheme } from '@mui/material';

const categoryColors: Record<string, string> = {
    HR: "#F87171",
    Education: "#60A5FA",
    Translation: "#34D399",
    Design: "#FBBF24",
    Development: "#A78BFA",
    QA: "#F472B6",
    Management: "#6EE7B7",
};

type Category = keyof typeof categoryColors;

interface Props {
    onCategoryClick: (category: Category) => void;
    selectedCategories: Category[];
}

export const TimelineLegend: React.FC<Props> = ({ onCategoryClick, selectedCategories }) => {
    const theme = useTheme();

    return (
        <Box sx={{ mt: 2, p: 1 }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {Object.keys(categoryColors).map((category) => {
                    const cat = category as Category;
                    const isSelected = selectedCategories.includes(cat);
                    const color = categoryColors[cat];

                    return (
                        <Chip
                            key={cat}
                            label={cat}
                            variant={isSelected ? 'filled' : 'outlined'}
                            onClick={() => onCategoryClick(cat)}
                            sx={{
                                cursor: 'pointer',
                                fontWeight: isSelected ? 'bold' : 'normal',
                                backgroundColor: isSelected ? color : 'transparent',
                                color: isSelected ? theme.palette.common.white : color,
                                borderColor: color,
                                transition: 'opacity 0.2s',
                                '&:hover': {
                                    opacity: 0.9,
                                    backgroundColor: isSelected ? color : 'transparent',
                                }
                            }}
                        />
                    );
                })}
            </Box>
        </Box>
    );
};