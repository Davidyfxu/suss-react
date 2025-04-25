import { Card, Space } from 'antd';
import { motion } from 'motion/react';
import { INTRO_PARTs } from '../../const';

interface IntroPart {
  title: string;
  intro: string;
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: (i + 1) * 0.5,
      duration: 0.5,
      ease: 'easeOut'
    }
  })
};

const IntroCards = () => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className="flex flex-wrap justify-evenly my-2"
    >
      {INTRO_PARTs.map((p: IntroPart, idx: number) => (
        <motion.div
          key={idx}
          custom={idx}
          variants={cardVariants}
          className="w-full m-2 max-w-xl md:w-1/2 lg:w-[48%]"
        >
          <Card
            className="h-full transition-all duration-300 hover:transform hover:scale-105"
            title={
              <Space>
                <span style={{ color: '#D92D27' }}>{idx + 1}</span>
                <span className={'text-lg'} style={{ color: '#20275C' }}>
                  {p.title}
                </span>
              </Space>
            }
            hoverable
          >
            <p className="text-gray-600 leading-relaxed">{p.intro}</p>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default IntroCards;
