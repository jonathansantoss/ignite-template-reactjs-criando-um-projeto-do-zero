import { GetStaticPaths, GetStaticProps } from 'next';

import { FiUser, FiClock } from 'react-icons/fi';
import { AiOutlineCalendar } from 'react-icons/ai';

import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { useRouter } from 'next/router';
import { RichText } from 'prismic-dom';
import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps): any {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Carregando...</div>;
  }

  const contents = post.data.content.reduce((valueBefore, valueAfter): any => {
    return valueBefore.body.concat(valueAfter.body);
  });

  const bodyText = RichText.asText(contents);

  return (
    <div className={styles.container}>
      <img src={post.data.banner.url} alt="banner" />
      <main>
        <strong>{post.data.title}</strong>
        <div className={styles.info}>
          <div className={styles.calendar}>
            <AiOutlineCalendar className={styles.iconCalendar} />
            <time>
              {format(Date.parse(post.first_publication_date), 'dd MMM yyyy', {
                locale: ptBR,
              })}
            </time>
          </div>
          <div className={styles.user}>
            <FiUser className={styles.iconUser} />
            <p>{post.data.author}</p>
          </div>
          <div className={styles.clock}>
            <FiClock className={styles.iconclock} />
            <time>{`${Math.ceil(bodyText.split(' ').length / 200)} min`}</time>
          </div>
        </div>
        <div className={styles.content}>
          {post.data.content.map(content => {
            return (
              <div key={content.heading}>
                <div className={styles.header}>
                  {content.heading}
                  <div className={styles.body}>
                    {content.body.map(value => {
                      return <p key={Math.random()}>{value.text}</p>;
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [
      { params: { slug: 'como-utilizar-hooks' } },
      { params: { slug: 'criando-um-app-cra-do-zero' } },
    ],
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }: context) => {
  const { slug } = params;
  const prismic = getPrismicClient();

  const response: Post = (await prismic.getByUID(
    'main',
    String(slug),
    {}
  )) as Post;

  const post: PostProps = { post: response };

  return {
    props: post,
  };
};
