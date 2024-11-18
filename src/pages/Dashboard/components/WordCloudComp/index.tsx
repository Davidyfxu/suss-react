import { useEffect, useState, useCallback } from 'react';
import { draw_wordcloud } from '../../api.ts';
import { useUserStore } from '../../../../stores/userStore';
import ReactWordcloud from 'react-wordcloud';
import { Spin } from 'antd';

const WordCloudComp = () => {
  const courseCode = useUserStore((state) => state.courseCode);
  const [words, setWords] = useState<{ value: number; text: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const getWords = useCallback(async () => {
    try {
      setLoading(true);
      const { entry_contents = {} } = await draw_wordcloud({
        option_course: courseCode
      });
      setWords(
        Object.keys(entry_contents)
          .map((e) => ({
            text: e,
            value: (entry_contents?.[e] || 0) as number
          }))
          .sort((a, b) => b.value - a.value)
      );
    } catch (e) {
      console.error('getWords', e);
    } finally {
      setLoading(false);
    }
  }, [courseCode]);

  useEffect(() => {
    courseCode && getWords();
  }, [courseCode]);

  return (
    <div
      className={
        'w-full h-full flex justify-center items-center flex-col gap-4'
      }
    >
      {loading ? (
        <Spin size={'large'} />
      ) : (
        <ReactWordcloud
          words={words}
          options={{
            enableTooltip: true,
            deterministic: false,
            fontSizes: [12, 80],
            padding: 2,
            rotations: 2,
            rotationAngles: [0, 0],
            scale: 'log',
            spiral: 'archimedean',
            transitionDuration: 300
          }}
        />
      )}
    </div>
  );
};

export default WordCloudComp;
