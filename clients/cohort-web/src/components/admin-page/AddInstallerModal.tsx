import * as React from 'react';
import {
  Box,
  Typography,
  Button,
  Modal,
  TextField,
  FormHelperText,
  styled,
  List,
  ListItem,
  Stack,
  Divider,
  FormLabel,
} from '@mui/material';
import { grey } from '@mui/material/colors';
import AddIcon from '@mui/icons-material/Add';
import { useQuery } from 'react-query';
import axios from 'axios';
import type {
  IDoc,
  IInstaller,
} from '@tymlez/platform-api-interfaces/src/installer';
import { readFile, usePostForm, usePutForm } from './api/usePostForm';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.default',
  //border: '2px solid #000',
  //boxShadow: 24,
  //borderRadius: 2,
  p: 4,
  overflow: 'scroll',
  height: '100%',
};
const Input = styled('input')({
  display: 'none',
});

const StyledTypography = styled(Typography)({
  color: 'textPrimary',
  variant: 'body1',
  fontSize: 20,
  fontWeight: 'bold',
  marginBottom: 5,
  p: 1,
});

interface AddInstallerProps {
  open: boolean;
  onClose: () => void;
  installerId?: string;
}

export function AddInstallerModal({
  open,
  onClose,
  installerId,
}: AddInstallerProps) {
  const form = usePostForm<any>('installer');
  const updateForm = usePutForm<any>('installer', installerId as string);

  const initialValidator = {
    name: false,
    company: false,
    certificateNo: false,
    certificateUrl: false,
    certificateDocs: false,
  };
  const initialFormData = {
    name: '',
    company: '',
    createdAt: new Date().getTime(),
    certificateNo: '',
    certificateUrl: '',
    certificateDocs: [],
    createdBy: undefined,
  };

  const [errorMessage, setErrorMessage] = React.useState('');
  const [isValidated, setValidated] = React.useState(false);
  const [validators, setValidators] = React.useState({ ...initialValidator });
  const [formData, setFormData] = React.useState<IInstaller>({
    ...initialFormData,
  });
  const [selectedFiles, setSelectedFiles] = React.useState<File[]>([]);
  const [isEditing, setIsEdtting] = React.useState(false);

  const onFileSelectedHandle = (event: any) => {
    setErrorMessage('');
    const files = [...event.target.files];

    const pdfs = files.filter((f: any) => f.name.match(/\.pdf/gi));
    if (pdfs.length) {
      setSelectedFiles([...selectedFiles, ...pdfs]);
    }
    if (pdfs.length !== files.length) {
      setErrorMessage('Please select pdf file');
    }
  };

  const submitForm = async () => {
    const certificateDocs = await Promise.all(
      selectedFiles.map((file: File) => readFile(file)),
    );
    form.mutate({ ...formData, certificateDocs } as any, {
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
    const certificateDocs = await Promise.all(
      selectedFiles.map((file: File) => readFile(file)),
    );
    updateForm.mutate(
      { ...formData, certificateDocs: [...certificateDocs] } as any,
      {
        onSuccess: (res: any) => {
          if (res.data.success) {
            closeForm();
          } else {
            setErrorMessage(res.data.message.join(','));
          }
        },
      },
    );
  };

  React.useEffect(() => {
    const bAllSatisfied = !Object.values(validators).includes(true);
    setValidated(
      bAllSatisfied &&
        (selectedFiles.length > 0 || (installerId !== undefined && isEditing)),
    );
  }, [validators, selectedFiles, installerId, isEditing]);

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
    setSelectedFiles([]);
    setValidators({ ...initialValidator });
    setErrorMessage('');
    setIsEdtting(false);
    setCreatedBy('');
    form.reset();
    updateForm.reset();
    onClose();
  };
  const [createdBy, setCreatedBy] = React.useState('');

  useQuery(
    ['installers/id', installerId],
    async () => {
      if (installerId) {
        const { data } = await axios.get<IInstaller>(
          `${process.env.NEXT_PUBLIC_COHORT_API_URL}/installer/${installerId}`,
        );
        setFormData({
          ...data,
          certificateDocs: data.certificateDocs,
        });
        setCreatedBy(data.createdBy?.email as string);
        return data;
      }
      return undefined;
    },
    { refetchOnWindowFocus: false },
  );

  return (
    <Modal open={open} onClose={closeForm}>
      <Box sx={modalStyle as any}>
        {installerId ? (
          <StyledTypography>Installer {installerId}</StyledTypography>
        ) : (
          <StyledTypography>Add an Installer</StyledTypography>
        )}

        {form.isLoading ? (
          <div>Loading...</div>
        ) : (
          <>
            <TextField
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
            {/* <FormHelperText sx={{ fontWeight: 'bold' }}> </FormHelperText> */}

            <TextField
              required
              fullWidth
              error={validators.company}
              id="txtCompany"
              variant="filled"
              value={formData.company}
              name="company"
              onChange={updateField}
              label="Company"
              margin="normal"
              sx={{ marginTop: 3 }}
            />

            <TextField
              required
              fullWidth
              id="txtCertificateNo"
              variant="filled"
              error={validators.certificateNo}
              sx={{ marginTop: 3 }}
              value={formData.certificateNo}
              name="certificateNo"
              onChange={updateField}
              label="Certification No."
              margin="normal"
            />

            <TextField
              required
              fullWidth
              id="txtCertificateURL"
              error={validators.certificateUrl}
              variant="filled"
              sx={{ marginTop: 3 }}
              value={formData.certificateUrl}
              name="certificateUrl"
              onChange={updateField}
              label="Certification URL"
              margin="normal"
            />

            {installerId && (
              <Box>
                <TextField
                  fullWidth
                  id="txtCreatedBy"
                  disabled
                  variant="filled"
                  sx={{ marginTop: 3 }}
                  value={createdBy}
                  name="Created By"
                  label="Created By"
                  margin="normal"
                />
                <TextField
                  fullWidth
                  id="txtCreatedOn"
                  disabled
                  variant="filled"
                  sx={{ marginTop: 3 }}
                  value={formData.createdAt}
                  name="Created On"
                  label="Created On"
                  margin="normal"
                />
              </Box>
            )}

            <Box
              sx={{
                overflow: 'auto',
                // borderRadius: 2,
                mt: 3,
                width: 1,
                height: 150,
                bgcolor: grey[200],
              }}
            >
              <List>
                {formData.certificateDocs &&
                  formData.certificateDocs.map((item: IDoc) => (
                    <ListItem key={item.name}>{item.name}</ListItem>
                  ))}

                {selectedFiles.map((item: File) => (
                  <ListItem key={item.name}>{item.name}</ListItem>
                ))}
              </List>
            </Box>
            <Stack direction="row" spacing={3} justifyContent="space-between">
              <Typography sx={{ mt: 1 }} variant="subtitle2">
                Certification Documents
              </Typography>

              <FormLabel htmlFor="contained-button-file">
                <Input
                  accept=".pdf"
                  id="contained-button-file"
                  multiple
                  type="file"
                  onChange={onFileSelectedHandle}
                />
                <Button
                  size="medium"
                  sx={{ mt: 1 }}
                  variant="contained"
                  component="span"
                  startIcon={<AddIcon />}
                  fullWidth
                  color="primary"
                >
                  Add
                </Button>
              </FormLabel>
            </Stack>
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
              {installerId ? (
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
            {installerId && (
              <Box textAlign="center">
                <Button
                  sx={{ mt: 5 }}
                  size="large"
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  View Installed Devices
                </Button>
              </Box>
            )}
          </>
        )}
      </Box>
    </Modal>
  );
}
