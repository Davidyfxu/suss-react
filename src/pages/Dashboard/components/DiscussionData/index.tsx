import { useEffect, useState } from 'react';
import { Alert, Spin } from 'antd';
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  createColumnHelper,
  SortingState,
  ColumnResizeMode
} from '@tanstack/react-table';
import { get_discussion_participation } from '../../api.ts';
import { useUserStore } from '../../../../stores/userStore';
import { SelectSUSS } from '../../../../components';
import './index.css';

// Define the data type
interface DiscussionRecord {
  user_id: string;
  user_name: string;
  entry_id_posts: number;
  replies_received_count: number;
  interacted_users_count: number;
  entry_topic_count: number;
  entry_read_count: number;
  entry_likes_sum: number;
}

const columnHelper = createColumnHelper<DiscussionRecord>();

const DiscussionData = () => {
  const courseCode = useUserStore((state) => state.courseCode);
  const dateRange = useUserStore((state) => state.dateRange);
  const [topic, setTopic] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [records, setRecords] = useState<DiscussionRecord[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);

  const get_participation = async () => {
    try {
      setLoading(true);
      const res = await get_discussion_participation({
        option_course: courseCode,
        option_topic: topic,
        start_date: dateRange?.[0],
        end_date: dateRange?.[1]
      });
      setRecords(res?.discussions || []);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    columnHelper.accessor('user_name', {
      header: 'Name',
      size: 200,
      minSize: 100,
      maxSize: 400,
      enableSorting: true
    }),
    columnHelper.accessor('entry_id_posts', {
      header: '# posts',
      size: 100,
      minSize: 80,
      maxSize: 150,
      enableSorting: true,
      cell: (info) => <div className="numeric-cell">{info.getValue()}</div>
    }),
    columnHelper.accessor('replies_received_count', {
      header: '# replies received',
      size: 150,
      minSize: 120,
      maxSize: 200,
      enableSorting: true,
      cell: (info) => <div className="numeric-cell">{info.getValue()}</div>
    }),
    columnHelper.accessor('interacted_users_count', {
      header: '# users interacted with',
      size: 180,
      minSize: 150,
      maxSize: 250,
      enableSorting: true,
      cell: (info) => <div className="numeric-cell">{info.getValue()}</div>
    }),
    columnHelper.accessor('entry_topic_count', {
      header: '# topics participated',
      size: 160,
      minSize: 140,
      maxSize: 220,
      enableSorting: true,
      cell: (info) => <div className="numeric-cell">{info.getValue()}</div>
    }),
    columnHelper.accessor('entry_read_count', {
      header: '# reads',
      size: 100,
      minSize: 75,
      maxSize: 130,
      enableSorting: true,
      cell: (info) => <div className="numeric-cell">{info.getValue()}</div>
    }),
    columnHelper.accessor('entry_likes_sum', {
      header: '# likes',
      size: 100,
      minSize: 75,
      maxSize: 130,
      enableSorting: true,
      cell: (info) => <div className="numeric-cell">{info.getValue()}</div>
    })
  ];

  const table = useReactTable({
    data: records,
    columns,
    state: {
      sorting
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableColumnResizing: true,
    columnResizeMode: 'onChange' as ColumnResizeMode
  });

  useEffect(() => {
    courseCode && get_participation();
  }, [courseCode, topic, dateRange]);

  useEffect(() => {
    setTopic(undefined);
  }, [courseCode]);

  return (
    <div
      className={'flex-1 min-w-0 border rounded-lg p-2 h-full'}
      style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
    >
      <SelectSUSS
        allowClear
        placeholder={'Please select a topic from the course.'}
        className={'w-full'}
        handleSelect={(v) => setTopic(v)}
        value={topic}
      />
      <Alert
        message="Click the table header to sort the column (ascending/descending)."
        type="info"
        showIcon
      />
      <div
        className="table-container"
        style={{
          height: 'max(380px, calc(100vh - 280px))'
        }}
      >
        {loading ? (
          <div className="flex justify-center items-center w-full h-full">
            <Spin size="large" />.
          </div>
        ) : (
          <table className="tanstack-table">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className={header.column.getCanSort() ? 'sortable' : ''}
                      style={{
                        width: header.getSize()
                      }}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        <span className="sort-indicator">
                          {{
                            asc: '↑',
                            desc: '↓'
                          }[header.column.getIsSorted() as string] ?? null}
                        </span>
                      </div>
                      <div
                        className={`resize-handle ${header.column.getIsResizing() ? 'is-resizing' : ''}`}
                        onMouseDown={header.getResizeHandler()}
                        onTouchStart={header.getResizeHandler()}
                      />
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      style={{
                        width: cell.column.getSize()
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default DiscussionData;
