import { Layout } from 'antd';
const { Footer } = Layout;

const LPFooter = () => {
  return (
    <Footer
      style={{
        padding: 16,
        textAlign: 'center',
        backgroundColor: 'transparent'
      }}
    >
      ©{new Date().getFullYear()} Copyright <strong>SUSS</strong>. All Rights
      Reserved
    </Footer>
  );
};

export default LPFooter;
