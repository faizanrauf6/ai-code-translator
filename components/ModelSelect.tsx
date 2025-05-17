import { OpenAIModel } from '@/types/types';
import { FC } from 'react';
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';

interface Props {
  model: OpenAIModel;
  onChange: (model: OpenAIModel) => void;
}

export const ModelSelect: FC<Props> = ({ model, onChange }) => {
  const handleChange = (event: SelectChangeEvent<OpenAIModel>) => {
    onChange(event.target.value as OpenAIModel);
  };

  return (
    <FormControl size="small" sx={{ minWidth: 180 }}>
      <InputLabel sx={{ color: '#ddd' }}>Model</InputLabel>
      <Select
        value={model}
        label="AI Model"
        onChange={handleChange}
        sx={{
          backgroundColor: '#1F2937',
          color: '#ddd',
          borderRadius: 1,
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#444',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#666',
          },
          '& .MuiSvgIcon-root': {
            color: '#ddd',
          },
        }}
      >
        <MenuItem value="gpt-3.5-turbo">GPT-3.5-Turbo</MenuItem>
        <MenuItem value="gpt-3.5-turbo-1106">GPT-3.5-Turbo-1106</MenuItem>
        <MenuItem value="gpt-3.5-turbo-0613">GPT-3.5-Turbo-0613</MenuItem>
        <MenuItem value="gpt-3.5-turbo-16k-0613">GPT-3.5-Turbo-16k-0613</MenuItem>
        <MenuItem value="gpt-4-turbo">GPT-4-Turbo</MenuItem>
        <MenuItem value="gpt-4-1106-preview">GPT-4-1106-Preview</MenuItem>
        <MenuItem value="gpt-4-0613">GPT-4-0613</MenuItem>
        <MenuItem value="gpt-4-32k-0613">GPT-4-32k-0613</MenuItem>
        <MenuItem value="babbage-002">Babbage-002</MenuItem>
        <MenuItem value="davinci-002">Davinci-002</MenuItem>
      </Select>
    </FormControl>
  );
};
