import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import { useTable, Column } from 'react-table';
import { useOctokit } from '@/hooks/useOctokit';
import { Layout } from '@/components/Layout';
import { Link } from '@/components/Link';
import { AvatarIcon } from '@/components/AvatarIcon';
import { formatDate } from '@/lib/format-date';

type Data = {
  author: string;
  avatarUrl: string;
  file: string;
  diff: string;
  comment: string;
  pageUrl: string;
  commentedAt: string;
};

const OWNER = process.env.GITHUB_OWNER;
const REPOSITORY = process.env.GITHUB_REPOSITORY;
const USER = process.env.GITHUB_USER;

const TOKEN = process.env.GITHUB_PERSONAL_ACCESS_TOKEN;
const octokit = useOctokit(TOKEN);

const Reviews = () => {
  const router = useRouter();
  const { number } = router.query;
  const pullNumber = +(number as string);

  const [data, setData] = useState<Data[]>([]);

  let page: number = 1;

  useEffect(() => {
    if (Number.isNaN(pullNumber)) return;

    (async () => {
      // コメントを全て取得するまでループする
      // eslint-disable-next-line no-constant-condition
      while (true) {
        // eslint-disable-next-line no-await-in-loop
        const { data: items } = await octokit.rest.pulls.listReviewComments({
          owner: OWNER,
          repo: REPOSITORY,
          pull_number: pullNumber,
          sort: 'created',
          direction: 'desc',
          per_page: 100,
          page,
        });

        if (items.length === 0 || page === 10) break;

        const newData = items
          .filter((item) => item.user.login !== USER)
          .map(
            ({
              user: { login: author, avatar_url: avatarUrl },
              path: file,
              diff_hunk: diff,
              body: comment,
              html_url: pageUrl,
              created_at: commentedAt,
            }) => ({
              author,
              avatarUrl,
              file: file.split('/').reduce((p, c, i) => `${p}\n${' '.repeat(i * 2)}└ ${c}`),
              diff: diff.replace(/@@.+?@@/, ''),
              comment,
              pageUrl,
              commentedAt: formatDate(commentedAt),
            })
          );

        // useState経由で生成した値を使わないと、useTable利用時に型の不一致でエラーが出る
        setData([...data, ...newData]);
        page += 1;
      }
    })();
  }, [pullNumber]);

  const columns = useMemo<Column<Data>[]>(
    () => [
      {
        Header: 'Author',
        accessor: 'author' as const,
        Cell: ({ row }) => <AvatarIcon src={row.values.avatarUrl} alt={row.values.author} />,
      },
      {
        Header: 'Avatar URL',
        accessor: 'avatarUrl' as const,
      },
      {
        Header: 'File',
        accessor: 'file' as const,
        Cell: ({ row }) => <pre>{row.values.file}</pre>,
      },
      {
        Header: 'Diff',
        accessor: 'diff' as const,
        Cell: ({ row }) => <pre>{row.values.diff}</pre>,
      },
      {
        Header: 'Comment',
        accessor: 'comment' as const,
        Cell: ({ row }) => <pre>{row.values.comment}</pre>,
      },
      {
        Header: 'Commented At',
        accessor: 'commentedAt' as const,
      },
      {
        Header: 'Page URL',
        accessor: 'pageUrl' as const,
        Cell: ({ row }) => (
          <Link href={row.values.pageUrl ?? ''} blank>
            URL
          </Link>
        ),
      },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable<Data>({
    columns,
    data,
    initialState: {
      hiddenColumns: ['avatarUrl'],
    },
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

export default Reviews;
