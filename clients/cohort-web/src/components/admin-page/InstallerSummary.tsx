import type { FC } from 'react';
import { Card, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useQuery } from 'react-query';
import type { ISummary } from '@tymlez/platform-api-interfaces';
import axios from 'axios';

interface Props {
  refreshTime: Date;
}
const HeaderTypographyStyled = styled(Typography)({
  color: 'textPrimary',
  variant: 'body1',
});

const BodyTypographyStyled = styled(Typography)({
  color: 'textPrimary',
  variant: 'body2',
  fontSize: 25,
  fontWeight: 'bold',
  p: 1,
});

export const InstallerSummary: FC<Props> = ({ refreshTime }) => {
  const {
    data: queryResult = { totalInstaller: 0, totalDevice: 0, status: '' },
  } = useQuery(
    ['installers/summary', refreshTime],
    async () => {
      const { data } = await axios.get<ISummary>(
        `${process.env.NEXT_PUBLIC_COHORT_API_URL}/installer/summary`,
      );
      return data;
    },
    { refetchOnWindowFocus: false },
  );

  return (
    <>
      <Card sx={{ p: 3, textAlign: 'center' }}>
        <HeaderTypographyStyled>Total Installers</HeaderTypographyStyled>

        <BodyTypographyStyled>
          {queryResult.totalInstaller}
        </BodyTypographyStyled>
      </Card>

      <Card sx={{ p: 3, textAlign: 'center' }}>
        <HeaderTypographyStyled>Devices Installed</HeaderTypographyStyled>
        <BodyTypographyStyled>{queryResult.totalDevice}</BodyTypographyStyled>
      </Card>

      <Card sx={{ p: 3, textAlign: 'center' }}>
        <HeaderTypographyStyled>Installer Status</HeaderTypographyStyled>
        <BodyTypographyStyled>{queryResult.status}</BodyTypographyStyled>
        <CheckCircleIcon color="primary" fontSize="large" />
      </Card>
    </>
  );
};
