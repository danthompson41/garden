import { getGlobalData } from "../../utils/global-data";

import Head from "next/head";
import Link from "next/link";
import ArrowIcon from "../../components/ArrowIcon";
import CustomLink from "../../components/CustomLink";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import Layout, { GradientBackground } from "../../components/Layout";
import SEO from "../../components/SEO";
import { useRouter } from "next/router";
import conn from "../../lib/db";
import { useState } from "react";
import axios from "axios";

export default function HabitPage({ habit_results, event_results }) {
  const router = useRouter();
  const [count, setCount] = useState(0.0);
  let habit_name = habit_results[0].habit_name;
  console.log("ASD", habit_results[0].habit_name);

  const submitValue = () => {
    const post = {
      time: Date.now(),
      unit_volume: count,
      habit_id: router.query.habit_id,
    };
    console.log(post);
    axios.post("/api/log_habit_event", post).then((response) => {
      console.log(response);
    });
  };

  return (
    <Layout>
      <Link href="/">Home</Link>
      <h1 className="text-3xl lg:text-5xl text-center mb-12">{habit_name}</h1>
      <input
        className="text-stone-950"
        type="text"
        value={count}
        onChange={(e) => setCount(e.target.value)}
      ></input>
      <button onClick={submitValue}>Submit</button>
    </Layout>
  );
}

export async function getServerSideProps(params) {
  let habit_results = null;
  let event_results = null;
  const habit_id = params.params.habit_id;
  try {
    const habit_query = `SELECT * from habits where habit_id = \'${habit_id}\';`;
    console.log("habit_query", habit_query);
    const result = await conn.query(habit_query);
    console.log("result_habit_query", result);
    habit_results = result.rows;
  } catch (error) {
    console.log(error);
  }
  try {
    const event_query = `SELECT * from habit_events where habit_id = \'${habit_id}\';`;
    console.log("event_query", event_query);
    const result = await conn.query(event_query);
    console.log("result_event_query", result);
    event_results = result.rows;
  } catch (error) {
    console.log(error);
  }
  var replacer = function (key, value) {
    if (this[key] instanceof Date) {
      return this[key].toUTCString();
    }

    return value;
  };
  event_results = JSON.parse(JSON.stringify(event_results, replacer));
  return { props: { habit_results, event_results } };
}
