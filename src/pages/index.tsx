import { GetStaticProps } from 'next';

import Prismic from '@prismicio/client';
import Link from 'next/link';
import { FiUser } from 'react-icons/fi';
import { AiOutlineCalendar } from 'react-icons/ai';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { useRouter } from 'next/router';
import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

import Header from '../components/Header';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

const postsPaginationProps: PostPagination = {
  next_page: undefined,
  results: [],
};

export default function Home({ postsPagination }: HomeProps): JSX.Element {
  const { next_page, results } = postsPagination;
  const router = useRouter();

  if (postsPaginationProps.results[0]?.data === undefined) {
    postsPaginationProps.next_page = next_page;
    postsPaginationProps.results.push(...results);
  }

  function handleNextPage(): any {
    fetch(postsPaginationProps.next_page).then(post => {
      post.json().then(data => {
        postsPaginationProps.next_page = data.next_page;
        postsPaginationProps.results.push(...data.results);
      });
    });
    router.push('/');

    return <></>;
  }

  return (
    <main className={styles.container}>
      {next_page !== null ? (
        <div className={styles.posts}>
          {postsPaginationProps.results.map(post => {
            return (
              <Link key={post.uid} href={`post/${post.uid}`}>
                <a href="/#">
                  <strong>{post.data.title}</strong>
                  <p>{post.data.subtitle}</p>
                  <div className={styles.info}>
                    <div className={styles.calendar}>
                      <AiOutlineCalendar className={styles.iconCalendar} />
                      <time>
                        {format(
                          Date.parse(post.first_publication_date),
                          'dd MMM yyyy',
                          {
                            locale: ptBR,
                          }
                        )}
                      </time>
                    </div>
                    <div className={styles.user}>
                      <FiUser className={styles.iconUser} />
                      <p>{post.data.author}</p>
                    </div>
                  </div>
                </a>
              </Link>
            );
          })}
          <button onClick={() => handleNextPage()}>Carregar mais posts</button>
        </div>
      ) : (
        <div className={styles.posts}>
          {postsPaginationProps.results.map(post => {
            return (
              <Link key={post.uid} href={`post/${post.uid}`}>
                <a href="/#">
                  <strong>{post.data.title}</strong>
                  <p>{post.data.subtitle}</p>
                  <div className={styles.info}>
                    <div className={styles.calendar}>
                      <AiOutlineCalendar className={styles.iconCalendar} />
                      <time>
                        {format(
                          Date.parse(post.first_publication_date),
                          'dd/MM/yyyy',
                          {
                            locale: ptBR,
                          }
                        )}
                      </time>
                    </div>
                    <div className={styles.user}>
                      <FiUser className={styles.iconUser} />
                      <p>{post.data.author}</p>
                    </div>
                  </div>
                </a>
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query(
    [Prismic.Predicates.at('document.type', 'main')],
    {
      fetch: ['main.title', 'main.subtitle', 'main.author', 'main.content'],
      pageSize: 1,
    }
  );

  const postsPagination: PostPagination = {
    next_page: postsResponse.next_page,
    results: postsResponse.results,
  };

  const post: HomeProps = {
    postsPagination,
  };

  return {
    props: post,
    revalidate: 60 * 60 * 24,
  };
};
