import React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

const EditTask = ({ open, updateClick, status, index, elements, setElements }) => {
  const handleChange = (event) => {
    const { name, value } = event?.target;

    setElements({
        ...elements,
        [status]: elements?.[status]?.map((m, ind) => ind !== index ? m : ({
            ...m,
            [name]: value
        })),
    });
  };

  const item = elements?.[`${status}`]?.[index] || {};

  return (
    <div>
      <Button variant="outlined" onClick={() => updateClick(true)}>
        Edit Task
      </Button>
      <Dialog open={open} onClose={() => updateClick(false)}>
        <DialogTitle>Edit Task</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="content"
            label="Title"
            name="content"
            value={item?.content || ''}
            fullWidth
            onChange={handleChange}
            variant="standard"
          />
          <TextField
            autoFocus
            margin="dense"
            id="description"
            label="Description"
            value={item?.description || ''}
            name="description"
            onChange={handleChange}
            fullWidth
            variant="standard"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default EditTask;
