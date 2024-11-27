import { Row, Col } from 'antd';

export default function Statistics() {
  const stats = [
    {
      number: '15,000+',
      label: 'Students',
      description: 'Active learners pursuing their dreams'
    },
    {
      number: '80+',
      label: 'Programs',
      description: 'Diverse academic offerings'
    },
    {
      number: '90%',
      label: 'Employment Rate',
      description: 'Of our graduates find employment'
    },
    {
      number: '100+',
      label: 'Industry Partners',
      description: 'Supporting practical education'
    }
  ];

  return (
    <section className="bg-gradient-to-r from-[#003D7C] to-[#004d9c] py-16 text-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Row gutter={[32, 32]} className="justify-center">
          {stats.map((stat, index) => (
            <Col xs={24} sm={12} md={6} key={index}>
              <div className="text-center">
                <div className="mb-2 text-4xl font-bold text-[#FF9E1B]">
                  {stat.number}
                </div>
                <div className="mb-1 text-xl font-semibold">{stat.label}</div>
                <div className="text-sm text-gray-300">{stat.description}</div>
              </div>
            </Col>
          ))}
        </Row>
      </div>
    </section>
  );
}
