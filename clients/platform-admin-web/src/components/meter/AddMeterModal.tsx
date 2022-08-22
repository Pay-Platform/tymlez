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
import axios from 'axios';
import type { IMeter, IQuerySite } from '@tymlez/platform-api-interfaces';
import { usePostForm, usePutForm } from '../../api/usePostForm';
import { modalStyle, StyledTypography } from '../../layout/CustomizedModal';
import { fetchSiteData } from '../../api/useFetchData';

interface AddMeterProps {
  open: boolean;
  onClose: () => void;
  meterName?: string;
}

const meterReadingTypes = ['ww', 'ee', 'nem'];

export function AddMeterModal({ open, onClose, meterName }: AddMeterProps) {
  const form = usePostForm<any>('meter-info');
  const updateForm = usePutForm<any>('meter-info', meterName as string);

  const initialValidator = {
    name: false,
    label: false,
    description: false,
    // lat: false,
    // lng: false,
    // meter_id: false,
    site: false,
    type: false,
    // interval:false,
    // billingChannelIndex:false,
    // isMain: false
  };

  const initialFormData: IMeter = {
    name: '',
    label: '',
    description: '',
    lat: undefined,
    lng: undefined,
    meter_id: '',
    site: null,
    type: meterReadingTypes[0],
    interval: undefined,
    billingChannelIndex: undefined,
    isMain: false,
  } as any;

  const [errorMessage, setErrorMessage] = React.useState('');
  const [isValidated, setValidated] = React.useState(false);
  const [validators, setValidators] = React.useState({ ...initialValidator });
  const [formData, setFormData] = React.useState<IMeter>({
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
      (bAllSatisfied_Add && meterName === undefined) ||
        (bAllSatisfied_Update && meterName !== undefined && isEditing),
    );
    //  console.log('testValidate', validators, bAllSatisfied_Add, meterName,isValidated);
  }, [validators, meterName, isEditing]);

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
    ['meter-info/details/meterName', meterName],
    async () => {
      if (meterName) {
        const { data } = await axios.get<IMeter>(
          `${process.env.NEXT_PUBLIC_PLATFORM_API_URL}/meter-info/details/${meterName}`,
        );
        setFormData({ ...data });
        return data;
      }
      return undefined;
    },
    { refetchOnWindowFocus: false },
  );

  const { data } = useQuery<IQuerySite>(['sites'], () => fetchSiteData());

  return (
    <Modal open={open} onClose={closeForm}>
      <Box sx={modalStyle as any}>
        {meterName ? (
          <StyledTypography>Meter {meterName}</StyledTypography>
        ) : (
          <StyledTypography>Add a Meter</StyledTypography>
        )}

        {form.isLoading ? (
          <div>Loading...</div>
        ) : (
          <>
            <TextField
              disabled={!!meterName}
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
              // required
              fullWidth
              // error={validators.meter_id}
              id="txtMeterId"
              variant="filled"
              value={formData.meter_id}
              name="meter_id"
              onChange={updateField}
              label="Meter Id"
              margin="normal"
              sx={{ marginTop: 3 }}
            />

            <TextField
              required
              fullWidth
              error={validators.description}
              id="txtDescription"
              variant="filled"
              value={formData.description}
              name="description"
              onChange={updateField}
              label="Description"
              margin="normal"
              sx={{ marginTop: 3 }}
            />

            <TextField
              // required
              fullWidth
              type="number"
              id="txtLat"
              variant="filled"
              // error={validators.lat}
              sx={{ marginTop: 3 }}
              value={formData.lat}
              name="lat"
              onChange={updateField}
              label="Lat"
              margin="normal"
            />

            <TextField
              // required
              fullWidth
              type="number"
              id="txtLng"
              variant="filled"
              // error={validators.lng}
              sx={{ marginTop: 3 }}
              value={formData.lng}
              name="lng"
              onChange={updateField}
              label="Lng"
              margin="normal"
            />

            <FormControl required fullWidth sx={{ marginTop: 3 }}>
              <InputLabel id="type-simple-select-required-label">
                Type
              </InputLabel>
              <Select
                variant="filled"
                labelId="type-simple-select-required-label"
                id="selectType"
                value={formData.type}
                label="Type *"
                name="type"
                onChange={updateField}
                error={validators.type}
              >
                {meterReadingTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              // required
              fullWidth
              id="txtInterval"
              // error={validators.interval}
              variant="filled"
              sx={{ marginTop: 3 }}
              value={formData.interval}
              name="interval"
              onChange={updateField}
              label="Interval"
              margin="normal"
            />

            <TextField
              // required
              fullWidth
              id="txtbillingChannelIndex"
              // error={validators.billingChannelIndex}
              variant="filled"
              sx={{ marginTop: 3 }}
              value={formData.billingChannelIndex}
              name="billingChannelIndex"
              onChange={updateField}
              label="Billing Channel Index"
              margin="normal"
            />

            <FormControl
              // required
              fullWidth
              sx={{ marginTop: 3 }}
            >
              <InputLabel id="isMain-simple-select-required-label">
                Is Main
              </InputLabel>
              <Select
                variant="filled"
                labelId="isMain-simple-select-required-label"
                id="isMain"
                // error={validators.isMain}
                value={formData.isMain}
                // label="Is Main *"
                name="isMain"
                onChange={updateField}
              >
                <MenuItem value="true">Yes</MenuItem>
                <MenuItem value="false">No</MenuItem>
              </Select>
            </FormControl>

            <FormControl required fullWidth sx={{ marginTop: 3 }}>
              <InputLabel id="site-simple-select-required-label">
                Site
              </InputLabel>
              <Select
                variant="filled"
                labelId="client-simple-select-required-label"
                id="selectSite"
                value={formData.site}
                label="Site *"
                name="site"
                onChange={updateField}
                error={validators.site}
              >
                {data?.sites?.map((site) => (
                  <MenuItem key={site.name} value={site.name}>
                    {site.name}
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
              {meterName ? (
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
