import sussLogoWithTagline from '../../../../assets/suss-logo-with-tagline.jpg';
import { Image } from 'antd';

export default function Logo() {
  return (
    <Image
      preview={false}
      style={{ cursor: 'pointer' }}
      height={28}
      src={sussLogoWithTagline}
      onClick={() => window.open(`https://www.suss.edu.sg/`, '_blank')}
    />
  );
}
