import { GetServerSideProps } from "next";
import { NextSeo } from "next-seo";
import { useState } from "react";
import Select from "react-select";

import { CardList } from "../../components/CardList";
import { Cardlist } from "../../components/CardList/styles";
import { api } from "../../services/api";
import { Container, Content } from "../../styles/tvs";

type SimpleTv = {
  id: number;
  title: string;
  poster_path: string;
  backdrop_path: string;
  name: string;
  overview: string;
  vote_average: number;
};

interface ITVProps {
  popular: SimpleTv[];
  topRated: SimpleTv[];
  current: SimpleTv[];
  actionAdventure: SimpleTv[];
  animation: SimpleTv[];
  crime: SimpleTv[];
  documentary: SimpleTv[];
  drama: SimpleTv[];
  family: SimpleTv[];
  kids: SimpleTv[];
  mistery: SimpleTv[];
  news: SimpleTv[];
  reality: SimpleTv[];
  sciFi: SimpleTv[];
  soap: SimpleTv[];
  talk: SimpleTv[];
  warPolitics: SimpleTv[];
  western: SimpleTv[];
}

const options = [
  { value: "all", label: "All" },
  { value: "actionAdventure", label: "Action Adventure" },
  { value: "animation", label: "Animation" },
  { value: "crime", label: "Crime" },
  { value: "documentary", label: "Documentary" },
  { value: "drama", label: "Drama" },
  { value: "family", label: "Family" },
  { value: "kids", label: "kids" },
  { value: "mistery", label: "Mistery" },
  { value: "news", label: "News" },
  { value: "reality", label: "Reality" },
  { value: "sciFi", label: "SciFi" },
  { value: "soap", label: "Soap" },
  { value: "talk", label: "Talk" },
  { value: "warPolitics", label: "War Politics" },
  { value: "western", label: "Western" },
];

export default function Tv({
  popular,
  topRated,
  current,
  actionAdventure,
  animation,
  crime,
  documentary,
  drama,
  family,
  kids,
  mistery,
  news,
  reality,
  sciFi,
  soap,
  talk,
  warPolitics,
  western,
}: ITVProps) {
  const [target, updateTarget] = useState<{ value: string; label: string }>({
    value: "all",
    label: "All",
  });

  const handleChange = (select: { value: string; label: string }) => {
    updateTarget(select);
  };

  function SwitchTVGenre(value: string) {
    switch (value) {
      case "actionAdventure":
        return actionAdventure;
      case "animation":
        return animation;
      case "crime":
        return crime;
      case "documentary":
        return documentary;
      case "drama":
        return drama;
      case "family":
        return family;
      case "kids":
        return kids;
      case "mistery":
        return mistery;
      case "news":
        return news;
      case "reality":
        return reality;
      case "sciFi":
        return sciFi;
      case "soap":
        return soap;
      case "talk":
        return talk;
      case "warPolitics":
        return warPolitics;
      case "western":
        return western;
    }
  }

  return (
    <Container>
      <title>Cineapp | TV</title>
      <NextSeo
        title="Cineapp | TV"
        description="Saiba tudo sobre séries de tv, como nota, diretores, orçamento, bilheteria, semelhantes, recomendados e temporadas!"
        canonical="https://cineapp.vercel.app/tv"
        openGraph={{
          url: "https://cineapp.vercel.app/tv",
          title: "Cineapp | TV",
          description:
            "Saiba tudo sobre séries de tv, como nota, diretores, orçamento, bilheteria, semelhantes, recomendados e temporadas!",
          images: [
            {
              url: "https://cineapp.vercel.app/img/tv.jpg",
              width: 1920,
              height: 1080,
              alt: "Cineapp | TV",
            },
          ],
        }}
      />

      <Content>
        <div className="title">
          <h1>TV</h1>
          <Select
            options={options}
            placeholder="genres"
            value={target}
            onChange={handleChange as unknown as undefined}
          />
        </div>
        {target.value === "all" ? (
          <>
            <CardList list={popular} title="🔥 Trending" type="tv" />
            <CardList list={topRated} title="👌 Top Rated" type="tv" />
            <CardList list={current} title="📅 Current" type="tv" />
            <CardList
              list={actionAdventure}
              title="👊 Action Adventure"
              type="tv"
            />
            <CardList list={animation} title="💡 Animation" type="tv" />
            <CardList list={crime} title="🚔 Crime" type="tv" />
            <CardList list={documentary} title="📄 Documentary" type="tv" />
            <CardList list={drama} title="🎭 Drama" type="tv" />
            <CardList list={family} title="👪 Damily" type="tv" />
            <CardList list={kids} title="🧒 kids" type="tv" />
            <CardList list={mistery} title="🤔 Mistery" type="tv" />
            <CardList list={news} title="📰 News" type="tv" />
            <CardList list={reality} title="👥 Reality" type="tv" />
            <CardList list={sciFi} title="🧪 SciFi" type="tv" />
            <CardList list={soap} title="📺 Soap" type="tv" />
            <CardList list={talk} title="🔊 Talk" type="tv" />
            <CardList
              list={warPolitics}
              title="💣 War Politics"
              type="tv"
            />
            <CardList list={western} title="🌵 western" type="tv" />
          </>
        ) : (
          <CardList
            list={SwitchTVGenre(target.value) as SimpleTv[]}
            title={target.label}
            type="tv"
          />
        )}
      </Content>
    </Container>
  );
}

async function getTvByGenreId(genreId: number) {
  const response = await api.get("/discover/tv", {
    params: {
      api_key: process.env.NEXT_PUBLIC_IMBD_API_KEY,
      with_genres: genreId,
      "release_date.lte": new Date(),
      sort_by: "popularity.desc",
      page: Math.floor(Math.random() * 10) + 1,
      language: "en-US",
    },
  });

  const tv = response.data.results.map((item: any) => {
    return {
      id: String(item.id),
      title: item.name,
      poster_path: item.poster_path,
      overview: item.overview,
      backdrop_path: item.backdrop_path,
      vote_average: item.vote_average,
    };
  });

  return tv;
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const popularResponse = await api.get("/tv/popular", {
    params: {
      api_key: process.env.NEXT_PUBLIC_IMBD_API_KEY,
      language: "en-US",
    },
  });

  const popular = popularResponse.data.results.map((movie: any) => {
    return {
      id: String(movie.id),
      title: movie.name,
      poster_path: movie.poster_path,
      overview: movie.overview,
      backdrop_path: movie.backdrop_path,
      vote_average: movie.vote_average,
    };
  });

  const topRatedResponse = await api.get("/tv/top_rated", {
    params: {
      api_key: process.env.NEXT_PUBLIC_IMBD_API_KEY,
      language: "en-US",
    },
  });

  const topRated = topRatedResponse.data.results.map((movie: any) => {
    return {
      id: String(movie.id),
      title: movie.name,
      poster_path: movie.poster_path,
      overview: movie.overview,
      backdrop_path: movie.backdrop_path,
      vote_average: movie.vote_average,
    };
  });

  const currentResponse = await api.get("/tv/on_the_air", {
    params: {
      api_key: process.env.NEXT_PUBLIC_IMBD_API_KEY,
      language: "en-US",
    },
  });

  const current = currentResponse.data.results.map((movie: any) => {
    return {
      id: String(movie.id),
      title: movie.name,
      poster_path: movie.poster_path,
      overview: movie.overview,
      backdrop_path: movie.backdrop_path,
      vote_average: movie.vote_average,
    };
  });

  const actionAdventure = await getTvByGenreId(10759);
  const animation = await getTvByGenreId(35);
  const crime = await getTvByGenreId(80);
  const documentary = await getTvByGenreId(99);
  const drama = await getTvByGenreId(18);
  const family = await getTvByGenreId(10751);
  const kids = await getTvByGenreId(10762);
  const mistery = await getTvByGenreId(9648);
  const news = await getTvByGenreId(10763);
  const reality = await getTvByGenreId(10764);
  const sciFi = await getTvByGenreId(10765);
  const soap = await getTvByGenreId(10766);
  const talk = await getTvByGenreId(10767);
  const warPolitics = await getTvByGenreId(10768);
  const western = await getTvByGenreId(37);

  return {
    props: {
      popular,
      topRated,
      current,
      actionAdventure,
      animation,
      crime,
      documentary,
      drama,
      family,
      kids,
      mistery,
      news,
      reality,
      sciFi,
      soap,
      talk,
      warPolitics,
      western,
    },
  };
};
