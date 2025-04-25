import { Typography } from 'antd';
import { motion } from 'motion/react';

const { Title, Paragraph } = Typography;

interface WelcomeSectionProps {
  title: string;
  subtitle: string;
  abbreviation: string;
  description: string;
}

const WelcomeSection = ({
  title,
  subtitle,
  abbreviation,
  description
}: WelcomeSectionProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className={
        'flex flex-col items-start md:items-center justify-center p-6 w-full md:w-1/2'
      }
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="flex flex-col items-center"
      >
        <Title level={2} style={{ color: 'black', marginBottom: 0 }}>
          {title}
        </Title>
        <Title
          level={5}
          style={{
            color: '#003366',
            marginTop: 0,
            marginBottom: 0,
            fontSize: '1.5rem',
            fontWeight: 500
          }}
        >
          {subtitle}
        </Title>
        <Title
          level={5}
          style={{
            color: '#003366',
            marginTop: 0,
            marginBottom: 16,
            fontSize: '1.5rem',
            fontWeight: 500
          }}
        >
          ({abbreviation})
        </Title>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <Paragraph
          style={{
            color: '#D92D27',
            fontWeight: 'bold',
            lineHeight: '1.8'
          }}
          className={'max-w-xl'}
        >
          {abbreviation}
          {'  '}
          <span style={{ color: 'black', fontWeight: 'normal' }}>
            {description}
          </span>
        </Paragraph>
      </motion.div>
    </motion.div>
  );
};

export default WelcomeSection;
