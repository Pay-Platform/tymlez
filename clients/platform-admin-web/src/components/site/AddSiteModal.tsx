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
import type { ISite } from '@tymlez/platform-api-interfaces';
import { usePostForm, usePutForm } from '../../api/usePostForm';
import { modalStyle, StyledTypography } from '../../layout/CustomizedModal';
import { fetchSiteDetail } from '../../api/useFetchData';

interface AddSiteProps {
  open: boolean;
  onClose: () => void;
  siteName?: string;
}

const regions = ['QLD1', 'NSW1', 'TAS1', 'SA1', 'VIC1'];

export function AddSiteModal({ open, onClose, siteName }: AddSiteProps) {
  const form = usePostForm<ISite>('sites');
  const updateForm = usePutForm<ISite>('sites', siteName as string);

  const initialValidator = {
    name: false,
    label: false,
    address: false,
    lat: false,
    lng: false,
    // solcastResourceId: false,
    region: false,
    hasSolar: false,
    client: false,
  };
  const initialFormData: ISite = {
    name: '',
    label: '',
    address: '',
    lat: 0,
    lng: 0,
    hasSolar: false,
    solcastResourceId: '',
    region: 'QLD1',
    client: null,
  } as any;

  const [errorMessage, setErrorMessage] = React.useState('');
  const [isValidated, setValidated] = React.useState(false);
  const [validators, setValidators] = React.useState({ ...initialValidator });
  const [formData, setFormData] = React.useState<ISite>({ ...initialFormData });
  const [isEditing, setIsEdtting] = React.useState(false);
  // const [client,setClient]=React.useState('')

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
    const bAllSatisfied = !Object.values(validators).includes(true);
    setValidated(
      bAllSatisfied &&
        (siteName === undefined || (siteName !== undefined && isEditing)),
    );
  }, [validators, siteName, isEditing]);

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
    // if (e.target.name === 'client'){
    // setClient(e.target.value);}
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
    ['sites/details/siteName', siteName],
    async () => {
      if (siteName) {
        const data = await fetchSiteDetail(siteName);
        setFormData({ ...data });
        return data;
      }
      return undefined;
    },
    { refetchOnWindowFocus: false },
  );

  return (
    <Modal open={open} onClose={closeForm}>
      <Box sx={modalStyle as any}>
        {siteName ? (
          <StyledTypography>Site {siteName}</StyledTypography>
        ) : (
          <StyledTypography>Add a Site</StyledTypography>
        )}

        {form.isLoading ? (
          <div>Loading...</div>
        ) : (
          <>
            <TextField
              disabled={siteName === null}
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

            <TextField
              required
              fullWidth
              error={validators.address}
              id="txtAddress"
              variant="filled"
              value={formData.address}
              name="address"
              onChange={updateField}
              label="Address"
              margin="normal"
              sx={{ marginTop: 3 }}
            />

            <TextField
              required
              fullWidth
              type="number"
              id="txtLat"
              variant="filled"
              error={validators.lat}
              sx={{ marginTop: 3 }}
              value={formData.lat}
              name="lat"
              onChange={updateField}
              label="Lat"
              margin="normal"
            />

            <TextField
              required
              fullWidth
              type="number"
              id="txtLng"
              variant="filled"
              error={validators.lng}
              sx={{ marginTop: 3 }}
              value={formData.lng}
              name="lng"
              onChange={updateField}
              label="Lng"
              margin="normal"
            />

            <FormControl required fullWidth sx={{ marginTop: 3 }}>
              <InputLabel id="demo-simple-select-required-label">
                Has Solar
              </InputLabel>
              <Select
                variant="filled"
                labelId="demo-simple-select-required-label"
                id="selectHasSolar"
                value={formData.hasSolar}
                label="Has Solar *"
                name="hasSolar"
                onChange={updateField}
                error={validators.hasSolar}
              >
                <MenuItem value="true">Yes</MenuItem>
                <MenuItem value="false">No</MenuItem>
              </Select>
            </FormControl>

            <TextField
              // required
              fullWidth
              id="txtSolcastResourceId"
              // error={validators.solcastResourceId}
              variant="filled"
              sx={{ marginTop: 3 }}
              value={formData.solcastResourceId}
              name="solcastResourceId"
              onChange={updateField}
              label="Solcast Resource Id"
              margin="normal"
            />

            <FormControl required fullWidth sx={{ marginTop: 3 }}>
              <InputLabel id="region-simple-select-required-label">
                Region
              </InputLabel>
              <Select
                variant="filled"
                labelId="region-simple-select-required-label"
                id="region"
                error={validators.region}
                value={formData.region}
                label="Region *"
                name="region"
                onChange={updateField}
              >
                {regions.map((region) => (
                  <MenuItem key={region} value={region}>
                    {region}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl required fullWidth sx={{ marginTop: 3 }}>
              <InputLabel id="client-simple-select-required-label">
                Client
              </InputLabel>
              <Select
                variant="filled"
                labelId="client-simple-select-required-label"
                id="selectClient"
                value={formData.client}
                label="Client *"
                name="client"
                onChange={updateField}
                error={validators.client}
              >
                <MenuItem value="uon">Uon</MenuItem>
                <MenuItem value="cohort">Cohort</MenuItem>
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
              {siteName ? (
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
