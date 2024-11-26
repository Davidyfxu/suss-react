import { Card, Avatar, Rate } from 'antd';
import Avatar1 from '../images/avatar-01.jpg';
import Avatar2 from '../images/avatar-02.jpg';
import Avatar3 from '../images/avatar-03.jpg';
export default function Testimonials() {
  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Business Administration Graduate',
      avatar: Avatar1,
      rating: 5,
      text: 'SUSS provided me with the flexibility to pursue my degree while working. The practical knowledge I gained has been invaluable in my career progression.'
    },
    {
      name: 'Michael Tan',
      role: 'Psychology Student',
      avatar: Avatar2,
      rating: 5,
      text: 'The blend of theoretical knowledge and practical application at SUSS has prepared me well for my future career in counseling.'
    },
    {
      name: 'Lisa Wong',
      role: 'Technology Professional',
      avatar: Avatar3,
      rating: 5,
      text: 'The industry-relevant curriculum and experienced faculty at SUSS have helped me stay ahead in the fast-paced tech industry.'
    }
  ];

  return (
    <section className="bg-[#003D7C] py-20 text-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center">
          <h2 className="mb-4 text-3xl font-bold">Student Testimonials</h2>
          <p className="mb-12 text-xl text-gray-200">
            Hear from our students and alumni about their SUSS experience
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="bg-white/10 backdrop-blur-lg"
              bordered={false}
            >
              <div className="flex flex-col items-center">
                <Avatar size={64} src={testimonial.avatar} className="mb-4" />
                <h3 className="mb-1 text-xl text-gray-100 font-bold">
                  {testimonial.name}
                </h3>
                <p className="mb-2 text-gray-300">{testimonial.role}</p>
                <Rate
                  disabled
                  defaultValue={testimonial.rating}
                  className="mb-4 text-[#FF9E1B]"
                />
                <p className="text-center text-gray-200">{testimonial.text}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
