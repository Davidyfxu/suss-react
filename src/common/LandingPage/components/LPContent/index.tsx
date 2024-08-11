import { Button, Card, Carousel, Image, Layout, Space, Typography } from 'antd';
import { CAROUSEL_IMGs, contentStyle, INTRO_PARTs } from '../../const.ts';
import { Link } from 'react-router-dom';
import { UserOutlined } from '@ant-design/icons';
const { Content } = Layout;
const { Title, Paragraph } = Typography;
const LPContent = () => {
  return (
    <Content>
      <div
        className={'flex flex-col md:flex-row justify-evenly'}
        style={{
          background: 'linear-gradient(to right, #001e60, #3498db)'
        }}
      >
        <div className={'flex flex-col items-center justify-center p-8'}>
          <Title style={{ color: '#eae8e6' }}>Welcome to XXXXXX</Title>
          <Paragraph style={{ color: '#eae8e6' }} className={'max-w-xl'}>
            In the process of internal desktop applications development, many
            different design specs and implementations would be involved, which
            might cause designers and developers difficulties and duplication
            and reduce the efficiency of development.
          </Paragraph>
        </div>
      </div>
      <Carousel autoplaySpeed={1500} arrows autoplay>
        {CAROUSEL_IMGs.map((img, idx) => (
          <div key={idx}>
            <div style={contentStyle}>
              <Image preview={false} src={img} />
            </div>
          </div>
        ))}
      </Carousel>
      <div className="flex flex-wrap justify-evenly my-4">
        {INTRO_PARTs.map((p, idx) => (
          <Card
            className="w-full m-4 max-w-xl text-base md:w-1/2"
            key={idx}
            title={
              <Space>
                <span style={{ color: '#DA291C' }}>{idx + 1}</span>
                <span className={'text-lg'} style={{ color: '#001e60' }}>
                  {p.title}
                </span>
              </Space>
            }
            hoverable
          >
            {p.intro}
          </Card>
        ))}
      </div>
      <div
        className={
          'text-center p-8 bg-opacity-30 bg-gradient-to-br from-blue-200 to-gray-100'
        }
      >
        <Title style={{ color: '#001e60' }}>
          {/*<Title style={{ color: '#DA291C' }}>*/}
          Enjoy your learning journey with Canvas Dashboard!
        </Title>
        <Link to={'/login'}>
          <Button icon={<UserOutlined />} size={'large'} type={'primary'}>
            Log in
          </Button>
        </Link>
      </div>
    </Content>
  );
};

export default LPContent;
