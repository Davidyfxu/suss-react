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
    colorField: 'text'
  };

  return <WordCloud loading={loading} {...config} />;
};

export default WordCloudComp;
