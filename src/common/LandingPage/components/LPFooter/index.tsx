import { Layout } from 'antd';
const { Footer } = Layout;

const LPFooter = () => {
  return (
    <Footer style={{ textAlign: 'center' }}>
      ©{new Date().getFullYear()} Copyright <strong>SUSS</strong>. All Rights
      Reserved
    </Footer>
  );
};

export default LPFooter;
