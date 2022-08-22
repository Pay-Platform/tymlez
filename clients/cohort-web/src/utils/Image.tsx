import NextImage, { ImageProps } from 'next/image';
import React, { FC } from 'react';

export type PropsType = {
  src: string;
};

const customLoader = (props: PropsType) => {
  const { src } = props;
  return src;
};

export const Image: FC<ImageProps> = (props) => {
  const { loader, ...rest } = props;
  return <NextImage {...rest} loader={loader || customLoader} />;
};
