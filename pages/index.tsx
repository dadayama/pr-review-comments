import Link from 'next/link';
import Image from 'next/image';
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
  createdAt: string;
};

const OWNER = process.env.GITHUB_OWNER;
const REPOSITORY = `${OWNER}/${process.env.GITHUB_REPOSITORY}`;
const AUTHOR = process.env.GITHUB_USER;

const TOKEN = process.env.GITHUB_PERSONAL_ACCESS_TOKEN;
const octokit = useOctokit(TOKEN);

const Home = () => {
  const [data, setData] = useState<Data[]>([]);

  useEffect(() => {
    (async () => {
      const {
        data: { items },
      } = await octokit.rest.search.issuesAndPullRequests({
        q: `${REPOSITORY}+author:${AUTHOR}+is:pr`,
        sort: 'created',
        order: 'desc',
        per_page: 100,
        page: 1,
      });
      const newData = items.map(
        ({
          number,
          title,
          user: { login: author, avatar_url: avatarUrl },
          html_url: pageUrl,
          state,
          created_at: createdAt,
        }) => ({
          number,
          author,
          title,
          avatarUrl,
          pageUrl,
          state,
          createdAt,
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
        Cell: ({ row }) => <Image src={row.values.avatarUrl} alt={row.values.author} width={30} height={30} />,
      },
      {
        Header: 'Avatar URL',
        accessor: 'avatarUrl' as const,
      },
      {
        Header: 'Title',
        accessor: 'title' as const,
        Cell: ({ row }) => (
          <Link href={`/pulls/${row.values.number}/reviews`}>
            <a>{row.values.title}</a>
          </Link>
        ),
      },
      {
        Header: 'State',
        accessor: 'state' as const,
      },
      {
        Header: 'Created At',
        accessor: 'createdAt' as const,
      },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable<Data>({
    columns,
    data,
    initialState: { hiddenColumns: ['number', 'avatarUrl'] },
  });

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
