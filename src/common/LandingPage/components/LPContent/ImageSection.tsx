import { Image } from 'antd';
import { motion } from 'motion/react';
import ImageP1 from '../../../../assets/p1.png';
import ImageP2 from '../../../../assets/p2.png';
import ImageP3 from '../../../../assets/p3.png';

const ImageSection = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="flex flex-col items-center justify-center p-6 space-y-4 w-full md:w-1/2"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative"
      >
        <Image
          src={ImageP1}
          preview={false}
          className="w-full max-w-xs md:max-w-sm mb-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
        />
      </motion.div>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="flex flex-row justify-center space-x-4 w-full max-w-xs md:max-w-sm"
      >
        <Image
          src={ImageP2}
          preview={false}
          className="w-1/2 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
        />
        <Image
          src={ImageP3}
          preview={false}
          className="w-1/2 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
        />
      </motion.div>
    </motion.div>
  );
};

export default ImageSection;
