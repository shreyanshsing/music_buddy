import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Typography } from '@mui/material';

const rotation = css`
  @keyframes rotation {
    from {
      transform: rotateZ(0deg);
    }
    to {
      transform: rotateZ(360deg);
    }
  }
  animation: rotation 2s infinite linear;
`;

export const RotatingImage = styled.img`
  ${rotation}
`;

export const TinyText = styled(Typography)({
    fontSize: '1rem',
    opacity: 0.7,
    fontWeight: 700,
    letterSpacing: 0.5
})
