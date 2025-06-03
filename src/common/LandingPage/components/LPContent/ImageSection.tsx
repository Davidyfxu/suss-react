import { Image } from 'antd';
import { motion } from 'motion/react';
import ImageP1 from '../../../../assets/p1.png';
import { useResponsive } from 'ahooks';

const ImageSection = () => {
  const responsive = useResponsive();
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="flex flex-col items-center justify-center md:py-6 md:w-1/2 md:pr-6"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <Image
          src={ImageP1}
          style={{ width: responsive.md ? '140%' : '100%' }}
          preview={false}
          className="max-w-[24rem] md:max-w-[32rem] mb-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
        />
      </motion.div>
    </motion.div>
  );
};

export default ImageSection;
