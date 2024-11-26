import { Card, Col, Row } from 'antd';
import { BookOutlined, TeamOutlined, GlobalOutlined, BulbOutlined } from '@ant-design/icons';

export default function FeaturesPlanet() {
  const features = [
    {
      icon: <BookOutlined className="text-4xl text-[#003D7C]" />,
      title: 'Flexible Learning',
      description: 'Balance your studies with work and life through our flexible learning pathways'
    },
    {
      icon: <TeamOutlined className="text-4xl text-[#003D7C]" />,
      title: 'Industry Relevance',
      description: 'Programs designed with industry partners to ensure workplace relevance'
    },
    {
      icon: <GlobalOutlined className="text-4xl text-[#003D7C]" />,
      title: 'Global Perspective',
      description: 'Gain international exposure through our global partnerships and exchange programs'
    },
    {
      icon: <BulbOutlined className="text-4xl text-[#003D7C]" />,
      title: 'Applied Learning',
      description: 'Practice-oriented curriculum that emphasizes real-world application'
    }
  ];

  return (
    <section className="relative bg-gray-50 py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900">Why Choose SUSS?</h2>
          <p className="mb-12 text-xl text-gray-600">
            Experience excellence in education through our unique approach
          </p>
        </div>
        
        <Row gutter={[32, 32]} className="justify-center">
          {features.map((feature, index) => (
            <Col xs={24} sm={12} md={12} lg={6} key={index}>
              <Card 
                className="h-full text-center transition-all hover:shadow-lg"
                bordered={false}
              >
                <div className="mb-6">{feature.icon}</div>
                <h3 className="mb-4 text-xl font-bold text-gray-900">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </section>
  );
}
