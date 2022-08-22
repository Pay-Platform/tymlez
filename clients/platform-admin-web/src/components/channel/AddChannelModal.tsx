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
import type {
  IChannel,
  IQueryCircuit,
  IQueryMeter,
} from '@tymlez/platform-api-interfaces';
import { usePostForm, usePutForm } from '../../api/usePostForm';
import { modalStyle, StyledTypography } from '../../layout/CustomizedModal';
import {
  fetchChannelDetail,
  fetchCircuitData,
  fetchMeterData,
} from '../../api/useFetchData';

interface AddChannelProps {
  open: boolean;
  onClose: () => void;
  channelName?: string;
}

export function AddChannelModal({
  open,
  onClose,
  channelName,
}: AddChannelProps) {
  const form = usePostForm<IChannel>('Channels');
  const updateForm = usePutForm<IChannel>('Channels', channelName as string);

  const initialValidator = {
    name: false,
    label: false,
    meter: false,
    circuit: false,
  };

  const initialFormData: IChannel = {
    name: '',
    label: '',
    meter: null,
    circuit: null,
  } as any;

  const [errorMessage, setErrorMessage] = React.useState('');
  const [isValidated, setValidated] = React.useState(false);
  const [validators, setValidators] = React.useState({ ...initialValidator });
  const [formData, setFormData] = React.useState<IChannel>({
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
      (bAllSatisfied_Add && channelName === undefined) ||
        (bAllSatisfied_Update && channelName !== undefined && isEditing),
    );
  }, [validators, channelName, isEditing]);

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
    ['Channels/details/ChannelName', channelName],
    async () => {
      if (channelName) {
        const data = await fetchChannelDetail(channelName);
        setFormData({ ...data });
        return data;
      }
      return undefined;
    },
    { refetchOnWindowFocus: false },
  );

  const { data: dataMeter } = useQuery<IQueryMeter>(
    ['meter-info'],
    () => fetchMeterData(),
    {
      staleTime: 10000,
    },
  );
  const { data: dataCircuit } = useQuery<IQueryCircuit>(
    ['circuits'],
    () => fetchCircuitData(),
    {
      staleTime: 10000,
    },
  );

  return (
    <Modal open={open} onClose={closeForm}>
      <Box sx={modalStyle as any}>
        {channelName ? (
          <StyledTypography>Channel {channelName}</StyledTypography>
        ) : (
          <StyledTypography>Add a Channel</StyledTypography>
        )}

        {form.isLoading ? (
          <div>Loading...</div>
        ) : (
          <>
            <TextField
              disabled={!!channelName}
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
                Circuit
              </InputLabel>
              <Select
                variant="filled"
                labelId="circuit-simple-select-required-label"
                id="selectCircuit"
                value={formData.circuit}
                label="Circuit *"
                name="circuit"
                onChange={updateField}
                error={validators.circuit}
              >
                {dataCircuit?.circuits?.map((circuit) => (
                  <MenuItem key={circuit.name} value={circuit.name}>
                    {circuit.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

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
                {dataMeter?.meters?.map((meter) => (
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
              {channelName ? (
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
