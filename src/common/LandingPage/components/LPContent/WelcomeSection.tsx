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
        'flex flex-col items-center justify-center p-6 w-full md:w-1/2'
      }
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="flex flex-col items-center"
      >
        <Title
          level={1}
          style={{
            fontSize: '3rem',
            color: '#001e60',
            marginBottom: 0,
            fontFamily: 'Roboto Mono, monospace'
          }}
        >
          {title}
        </Title>
        <Title
          level={5}
          style={{
            color: '#001e60',
            marginTop: 0,
            marginBottom: 0,
            fontSize: '2.5rem',
            fontWeight: 500,
            fontStyle: 'italic',
            textAlign: 'center'
          }}
        >
          {subtitle}
        </Title>
        <Title
          level={5}
          style={{
            fontSize: '2.5rem',
            color: '#001e60',
            marginTop: 0,
            marginBottom: 16,
            fontWeight: 500,
            fontStyle: 'italic'
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
            fontSize: '1.5rem',
            color: '#da291c',
            fontWeight: 'bold',
            textAlign: 'center'
          }}
          className={'max-w-xl'}
        >
          {abbreviation}
          {'    '}
          <span
            style={{
              fontFamily: 'Roboto Mono, monospace',
              fontSize: '1rem',
              color: 'black',
              fontWeight: 'normal'
            }}
          >
            {description}
          </span>
        </Paragraph>
      </motion.div>
    </motion.div>
  );
};

export default WelcomeSection;
