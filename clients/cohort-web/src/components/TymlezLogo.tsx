import type { SxProps } from '@mui/system';
import type { FC } from 'react';
// import TymlezLogoGreen from './TymlezLogoGreen.svg';

export const TymlezLogo: FC<SxProps> = () => {
  return (
    <img
      alt="tymlez_icon"
      style={{
        width: 150,
        // height: 50,
      }}
      src="/tymlezlogolime.png"
    />
  );
};
