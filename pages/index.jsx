"use client";
import Head from "next/head";
import { useState } from "react";
import dynamic from "next/dynamic";
import { useEffect } from "react";

export default function Home() {
  const [data, setData] = useState([]);
  const imgs = [["a.jpg", "something"], "a.jpg", "a.jpg", "a.jpg"];

  const gData = {
    nodes: imgs.map((img, id, text) => ({ id, img, text })),
    links: [...Array(imgs.length).keys()]

      .filter((id) => id)
      .map((id) => ({
        source: id,
        target: Math.round(Math.random() * (id - 1)),
      })),
  };

  const DynamicGraph = dynamic(() => import("./graphs/graphA"), {
    ssr: false,
  });

  useEffect(() => {
    fetch("data/mainData.json")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setData(data);
      });
  }, []);

  return (
    <main
      className="w-full flex-1 px-20 text-center
      bg-white"
    >
      <DynamicGraph graphData={data} />
    </main>
  );
}
// import fsPromises from "fs/promises";
// import path from "path";
// export async function getStaticProps() {
//   const filepath = path.join(process.cwd(), "./mainData.json");
//   const jsonData = await fsPromises.readFile(filepath);
//   const data = JSON.parse(jsonData);
//   return {
//     props: {
//       data,
//     },
//   };
// }
