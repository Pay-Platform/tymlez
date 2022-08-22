import * as React from 'react';
import {
  Button,
  Modal,
  TextField,
  FormHelperText,
  Stack,
  Divider,
  Box,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from '@mui/material';
import { useQuery } from 'react-query';
import type { ICircuit, IQueryMeter } from '@tymlez/platform-api-interfaces';
import { usePostForm, usePutForm } from '../../api/usePostForm';
import { modalStyle, StyledTypography } from '../../layout/CustomizedModal';
import { fetchCircuitDetail, fetchMeterData } from '../../api/useFetchData';

interface AddCircuitProps {
  open: boolean;
  onClose: () => void;
  circuitName?: string;
}

export function AddCircuitModal({
  open,
  onClose,
  circuitName,
}: AddCircuitProps) {
  const form = usePostForm<ICircuit>('circuits');
  const updateForm = usePutForm<ICircuit>('circuits', circuitName as string);

  const initialValidator = {
    name: false,
    label: false,
    meter: false,
  };

  const initialFormData: ICircuit = {
    name: '',
    label: '',
    meter: null,
  } as any;

  const [errorMessage, setErrorMessage] = React.useState('');
  const [isValidated, setValidated] = React.useState(false);
  const [validators, setValidators] = React.useState({ ...initialValidator });
  const [formData, setFormData] = React.useState<ICircuit>({
    ...initialFormData,
  });
  const [isEditing, setIsEdtting] = React.useState(false);

  const submitForm = async () => {
    form.mutate({ ...formData } as any, {
      onSuccess: (res: any) => {
        if (res.data.success) {
          closeForm();
        } else {
          setErrorMessage(res.data.message.join(','));
        }
      },
    });
  };

  const editForm = async () => {
    updateForm.mutate({ ...formData } as any, {
      onSuccess: (res: any) => {
        if (res.data.success) {
          closeForm();
        } else {
          setErrorMessage(res.data.message.join(','));
        }
      },
    });
  };

  React.useEffect(() => {
    const bAllSatisfied_Add = !Object.values(validators).includes(true);
    const bAllSatisfied_Update = !Object.values(validators).includes(true);
    setValidated(
      (bAllSatisfied_Add && circuitName === undefined) ||
        (bAllSatisfied_Update && circuitName !== undefined && isEditing),
    );
  }, [validators, circuitName, isEditing]);

  const updateField = (e: any) => {
    const mergedValidator = {
      ...validators,
      [e.target.name]: e.target.value === '',
    };
    setIsEdtting(true);
    setValidators(mergedValidator);
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const closeForm = () => {
    setFormData({ ...initialFormData });
    setValidators({ ...initialValidator });
    setErrorMessage('');
    setIsEdtting(false);
    form.reset();
    updateForm.reset();
    onClose();
  };

  useQuery(
    ['circuits/details/circuitName', circuitName],
    async () => {
      if (circuitName) {
        const data = await fetchCircuitDetail(circuitName);
        setFormData({ ...data });
        return data;
      }
      return undefined;
    },
    { refetchOnWindowFocus: false },
  );

  const { data } = useQuery<IQueryMeter>(
    ['meter-info'],
    () => fetchMeterData(),
    {
      staleTime: 10000,
    },
  );

  return (
    <Modal open={open} onClose={closeForm}>
      <Box sx={modalStyle as any}>
        {circuitName ? (
          <StyledTypography>Circuit {circuitName}</StyledTypography>
        ) : (
          <StyledTypography>Add a Circuit</StyledTypography>
        )}

        {form.isLoading ? (
          <div>Loading...</div>
        ) : (
          <>
            <TextField
              disabled={!!circuitName}
              required
              fullWidth
              id="txtName"
              error={validators.name}
              variant="filled"
              value={formData.name}
              name="name"
              onChange={updateField}
              label="Name"
              margin="normal"
              sx={{ marginTop: 3 }}
              autoFocus
            />

            <TextField
              required
              fullWidth
              id="txtLabel"
              error={validators.label}
              variant="filled"
              value={formData.label}
              name="label"
              onChange={updateField}
              label="Label"
              margin="normal"
              sx={{ marginTop: 3 }}
            />

            <FormControl required fullWidth sx={{ marginTop: 3 }}>
              <InputLabel id="site-simple-select-required-label">
                Meter
              </InputLabel>
              <Select
                variant="filled"
                labelId="meter-simple-select-required-label"
                id="selectMeter"
                value={formData.meter}
                label="Meter *"
                name="meter"
                onChange={updateField}
                error={validators.meter}
              >
                {data?.meters?.map((meter) => (
                  <MenuItem key={meter.name} value={meter.name}>
                    {meter.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Divider sx={{ mt: 5 }} />

            {(updateForm.isError || form.isError) && (
              <Box sx={{ mt: 3 }}>
                <FormHelperText error>Server internal error</FormHelperText>
              </Box>
            )}

            {errorMessage !== '' && (
              <Box sx={{ mt: 3 }}>
                <FormHelperText error>{errorMessage}</FormHelperText>
              </Box>
            )}

            <Stack
              direction="row"
              spacing={15}
              justifyContent="center"
              sx={{ p: 1 }}
            >
              {circuitName ? (
                <Button
                  size="large"
                  disabled={!isValidated}
                  variant="contained"
                  color="primary"
                  type="submit"
                  onClick={editForm}
                >
                  Confirm Changes
                </Button>
              ) : (
                <Button
                  size="large"
                  disabled={!isValidated}
                  variant="contained"
                  color="primary"
                  type="submit"
                  onClick={submitForm}
                >
                  Confirm
                </Button>
              )}
              <Button
                variant="contained"
                color="inherit"
                size="large"
                onClick={closeForm}
              >
                Cancel
              </Button>
            </Stack>
          </>
        )}
      </Box>
    </Modal>
  );
}
