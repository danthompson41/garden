import Link from 'next/link';
import { getPosts } from '../utils/mdx-utils';
import conn from '../lib/db'

import Footer from '../components/Footer';
import Header from '../components/Header';
import Layout, { GradientBackground } from '../components/Layout';
import ArrowIcon from '../components/ArrowIcon';
import { getGlobalData } from '../utils/global-data';
import SEO from '../components/SEO';

export default function Index({ posts, globalData, results }) {
  return (
    <Layout>
      <SEO title={globalData.name} description={globalData.blogTitle} />
      <Header name={globalData.name} />
      <main className="w-full">
        <h1 className="text-3xl lg:text-5xl text-center mb-12">
          {globalData.blogTitle}
        </h1>
        <ul className="w-full">
          {results.map((habit) => (
            <li
              key={habit.habit_name}
              className="md:first:rounded-t-lg md:last:rounded-b-lg backdrop-blur-lg bg-white dark:bg-black dark:bg-opacity-30 bg-opacity-10 hover:bg-opacity-20 dark:hover:bg-opacity-50 transition border border-gray-800 dark:border-white border-opacity-10 dark:border-opacity-10 border-b-0 last:border-b hover:border-b hovered-sibling:border-t-0"
            >
              <Link
                as={`/habit/${habit.habit_id}`}
                href={`/habit/[slug]`}
              >
                <a className="py-6 lg:py-10 px-6 lg:px-16 block focus:outline-none focus:ring-4">
                  <h2 className="text-2xl md:text-3xl">{habit.habit_name}</h2>
                  {habit.habit_name && (
                    <>
                      <p className="mt-3 text-lg opacity-60">
                        Daily Percent Complete: {habit.daily_percent_complete} {habit.unit}
                      </p>
                      <p className="mt-3 text-lg opacity-60">
                        Daily target: {habit.daily_target}
                      </p>
                      <p className="mt-3 text-lg opacity-60">
                        Weekly Percent Complete: {habit.weekly_percent_complete}
                      </p>
                      <p className="mt-3 text-lg opacity-60">
                        Weekly target: {habit.weekly_target}
                      </p>
                    </>
                  )}
                  <ArrowIcon className="mt-4" />
                </a>
              </Link>
            </li>
          ))}
        </ul>
        <p>{JSON.stringify(results)}</p>
      </main>
      <Footer copyrightText={globalData.footerText} />
      <GradientBackground
        variant="large"
        className="fixed top-20 opacity-40 dark:opacity-60"
      />
      <GradientBackground
        variant="small"
        className="absolute bottom-0 opacity-20 dark:opacity-10"
      />
    </Layout>
  );
}


export async function getServerSideProps() {
  const posts = getPosts();
  const globalData = getGlobalData();
  let results = null;
  try {
    const query = "WITH x AS ( SELECT habits.habit_id AS habit_id, habits.habit_name, 0 AS daily_volume, 0 AS weekly_volume, habits.target / 7 AS daily_target, habits.target AS weekly_target FROM habits UNION SELECT habits.habit_id AS habit_id, habits.habit_name, 0 AS daily_volume, sum(unit_volume) as weekly_volume, habits.target / 7 AS daily_target, habits.target AS weekly_target FROM habit_events RIGHT JOIN habits ON habit_events.habit_id = habits.habit_id WHERE time > date_trunc('week', now()) GROUP BY habits.habit_id, habits.habit_name, habits.target UNION SELECT habits.habit_id AS habit_id, habits.habit_name, sum(unit_volume) AS daily_volume, 0 AS weekly_volume, habits.target / 7 AS daily_target, habits.target AS weekly_target FROM habit_events RIGHT JOIN habits ON habit_events.habit_id = habits.habit_id WHERE time > date_trunc('week', now()) GROUP BY habits.habit_id, habits.habit_name, habits.target ) SELECT habit_id, habit_name, max(daily_volume), max(weekly_volume), daily_target, weekly_target, max(daily_volume) / daily_target * 100 AS daily_percent_complete, max(weekly_volume) / weekly_target * 100 AS weekly_percent_complete, max(daily_volume) / weekly_target * 100 >= 100 AS daily_done, max(weekly_volume) / daily_target * 100 >= 100 AS weekly_done FROM x GROUP BY habit_id, habit_name, daily_target, weekly_target;"
    const result = await conn.query(
      query
    );
    console.log("ttt", result);
    results = result.rows;
  } catch (error) {
    console.log(error);
  }

  return { props: { posts, globalData, results } };

}
