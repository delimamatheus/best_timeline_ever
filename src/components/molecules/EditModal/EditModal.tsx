import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, Button } from '@mui/material';
import { TimelineItemData } from '../../../utils/assignLanes';

interface EditModalProps {
    open: boolean;
    onClose: () => void;
    item: TimelineItemData;
    onSave: (updatedItem: TimelineItemData) => void;
}

const modalStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: 300, sm: 400 },
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export const EditModal: React.FC<EditModalProps> = ({ open, onClose, item, onSave }) => {
    const [name, setName] = useState(item.name);

    useEffect(() => {
        setName(item.name);
    }, [item]);

    const handleSubmit = () => {
        const updatedItem: TimelineItemData = {
            ...item,
            name,
        };
        onSave(updatedItem);
    };

    return (
        <Modal open={open} onClose={onClose} aria-labelledby="modal-title">
            <Box sx={modalStyle}>
                <Typography id="modal-title" variant="h6" component="h2" mb={2}>
                    Edit task: {item.id}
                </Typography>
                <TextField
                    fullWidth
                    label="Nome do Item"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    margin="normal"
                />

                <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
                    <Button onClick={onClose} variant="outlined">
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} variant="contained" color="primary">
                        Save
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};