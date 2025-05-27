import { TogetherModel } from '@/types/types';
import { FC } from 'react';
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';

interface Props {
  model: TogetherModel;
  onChange: (model: TogetherModel) => void;
}

export const ModelSelect: FC<Props> = ({ model, onChange }) => {
  const handleChange = (event: SelectChangeEvent<TogetherModel>) => {
    onChange(event.target.value as TogetherModel);
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
        <MenuItem value="meta-llama/Llama-3.3-70B-Instruct-Turbo">CodeLlama 70B Instruct Turbo</MenuItem>
        <MenuItem value="bigcode/starcoder2-15b">Starcoder2 15B</MenuItem>
        <MenuItem value="deepseek-ai/deepseek-coder-33b-instruct">DeepSeek Coder 33B Instruct</MenuItem>
      </Select>
    </FormControl>
  );
};
