import { Card, Col, Row, Tag, Button } from 'antd';
import {
  CalendarOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined
} from '@ant-design/icons';
import HappyLearning from '../../../assets/suss-happylearning-2.jpg';
import GivingImpact from '../../../assets/suss_giving-impact.jpg';
export default function NewsAndEvents() {
  const news = [
    {
      type: 'News',
      title: 'SUSS Launches New AI & Data Science Centre',
      date: 'March 15, 2024',
      image: HappyLearning,
      description:
        'The new centre will focus on developing cutting-edge AI solutions and nurturing future data scientists.'
    },
    {
      type: 'Research',
      title: 'SUSS Researchers Win International Award',
      date: 'March 10, 2024',
      image: GivingImpact,
      description:
        'Our researchers received recognition for their groundbreaking work in sustainable urban development.'
    }
  ];

  const events = [
    {
      title: 'Open House 2024',
      date: 'April 5, 2024',
      time: '10:00 AM - 4:00 PM',
      location: 'SUSS Campus',
      type: 'Admissions'
    },
    {
      title: 'Industry-Academia Forum',
      date: 'April 12, 2024',
      time: '2:00 PM - 6:00 PM',
      location: 'SUSS Auditorium',
      type: 'Career'
    },
    {
      title: 'International Conference on Social Sciences',
      date: 'April 20, 2024',
      time: '9:00 AM - 5:00 PM',
      location: 'Virtual Event',
      type: 'Academic'
    }
  ];

  const getTagColor = (type: string) => {
    const colors = {
      News: 'blue',
      Research: 'purple',
      Admissions: 'green',
      Career: 'orange',
      Academic: 'geekblue'
    };
    return colors[type as keyof typeof colors] || 'default';
  };

  return (
    <section className="bg-gray-50 py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900">
            Latest News & Events
          </h2>
          <p className="text-xl text-gray-600">
            Stay updated with the latest happenings at SUSS
          </p>
        </div>

        {/* News Section */}
        <div className="mb-16">
          <h3 className="mb-8 text-2xl font-bold text-[#003D7C]">
            Featured News
          </h3>
          <Row gutter={[32, 32]}>
            {news.map((item, index) => (
              <Col xs={24} md={12} key={index}>
                <Card
                  hoverable
                  cover={
                    <div className="relative h-48 overflow-hidden">
                      <img
                        alt={item.title}
                        src={item.image}
                        className="h-full w-full object-cover"
                      />
                      <Tag
                        color={getTagColor(item.type)}
                        className="absolute left-4 top-4"
                      >
                        {item.type}
                      </Tag>
                    </div>
                  }
                  className="h-full transition-all hover:shadow-lg"
                >
                  <Card.Meta
                    title={<h4 className="text-lg font-bold">{item.title}</h4>}
                    description={
                      <div>
                        <p className="mb-2 text-gray-500">{item.date}</p>
                        <p className="text-gray-600">{item.description}</p>
                      </div>
                    }
                  />
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        {/* Events Section */}
        <div>
          <h3 className="mb-8 text-2xl font-bold text-[#003D7C]">
            Upcoming Events
          </h3>
          <Row gutter={[24, 24]}>
            {events.map((event, index) => (
              <Col xs={24} md={8} key={index}>
                <Card className="h-full transition-all hover:shadow-lg">
                  <Tag color={getTagColor(event.type)} className="mb-4">
                    {event.type}
                  </Tag>
                  <h4 className="mb-4 text-lg font-bold">{event.title}</h4>
                  <div className="space-y-2 text-gray-600">
                    <p className="flex items-center">
                      <CalendarOutlined className="mr-2" />
                      {event.date}
                    </p>
                    <p className="flex items-center">
                      <ClockCircleOutlined className="mr-2" />
                      {event.time}
                    </p>
                    <p className="flex items-center">
                      <EnvironmentOutlined className="mr-2" />
                      {event.location}
                    </p>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        <div className="mt-12 text-center">
          <Button
            type="primary"
            size="large"
            className="bg-[#E31837] hover:bg-[#FF9E1B]"
          >
            View All News & Events
          </Button>
        </div>
      </div>
    </section>
  );
}
