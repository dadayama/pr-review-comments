import Link from 'next/link';
import { useState, useEffect, useMemo } from 'react';
import { useTable, Column } from 'react-table';
import { useOctokit } from '@/hooks/useOctokit';
import { Layout } from '@/components/Layout';

type Data = {
  number: number;
  title: string;
  state: string;
  author: string;
  avatarUrl: string;
  pageUrl: string;
};

const TOKEN = process.env.GITHUB_PERSONAL_ACCESS_TOKEN;
const octokit = useOctokit(TOKEN);

const Home = () => {
  const [data, setData] = useState<Data[]>([]);

  useEffect(() => {
    (async () => {
      const {
        data: { items },
      } = await octokit.rest.search.issuesAndPullRequests({
        q: `org:dayone-jp+author:dadayama+is:pr`,
        sort: 'created',
        order: 'desc',
        per_page: 100,
        page: 1,
      });
      const newData = items.map(
        ({ number, title, user: { login: author, avatar_url: avatarUrl }, html_url: pageUrl, state }) => ({
          number,
          author,
          title,
          avatarUrl,
          pageUrl,
          state,
        })
      );

      // useState経由で生成した値を使わないと、useTable利用時に型の不一致でエラーが出る
      setData(newData);
    })();
  }, []);

  const columns = useMemo<Column<Data>[]>(
    () => [
      {
        Header: 'Number',
        accessor: 'number' as const,
      },
      {
        Header: 'Author',
        accessor: 'author' as const,
      },
      {
        Header: 'Title',
        accessor: 'title' as const,
        Cell: ({ row }) => <Link href={`/pulls/${row.values.number}/reviews`}>{row.values.title}</Link>,
      },
      {
        Header: 'State',
        accessor: 'state' as const,
      },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable<Data>({ columns, data });

  if (data.length) {
    return (
      <Layout>
        <table {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => (
                    <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </Layout>
    );
  }

  return <p>loading...</p>;
};

export default Home;
