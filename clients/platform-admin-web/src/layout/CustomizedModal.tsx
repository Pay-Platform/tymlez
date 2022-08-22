import { styled, Typography } from '@mui/material';

export const modalStyle = {
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
// const Input = styled('input')({
//   display: 'none',
// });

export const StyledTypography = styled(Typography)({
  color: 'textPrimary',
  variant: 'body1',
  fontSize: 20,
  fontWeight: 'bold',
  marginBottom: 5,
  p: 1,
});
