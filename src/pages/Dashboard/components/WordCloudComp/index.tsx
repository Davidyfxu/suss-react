import { useEffect, useState } from 'react';
import { draw_wordcloud } from '../../api.ts';
import { useUserStore } from '../../../../stores/userStore';
import { WordCloud } from '@ant-design/charts';

const WordCloudComp = () => {
  const courseCode = useUserStore((state) => state.courseCode);
  const [words, setWords] = useState<{ value: number; text: string }>([]);
  const [loading, setLoading] = useState(false);
  const getWords = async () => {
    try {
      setLoading(true);
      const { entry_contents = {} } = await draw_wordcloud({
        option_course: courseCode
      });
      setWords(
        Object.keys(entry_contents).map((e) => ({
          text: e,
          value: (entry_contents?.[e] || 0) as number
        }))
      );
    } catch (e) {
      console.error('getWords', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    courseCode && getWords();
  }, [courseCode]);

  const config = {
    paddingTop: 40,
    data: words,
    layout: { spiral: 'rectangular' },
    colorField: 'text',
    wordStyle: {
      rotation: 0, // 固定旋转角度为0，使词云更紧凑
      rotationSteps: 2, // 减少旋转步数，使词云更紧凑
      fontSize: [12, 60], // 设置字体大小范围
      padding: 2 // 设置单词之间的间距
    },
    mask: {
      width: 800, // 设置词云的宽度
      height: 600 // 设置词云的高度
    }
  };

  return <WordCloud loading={loading} {...config} />;
};

export default WordCloudComp;
