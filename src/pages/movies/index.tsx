import { GetStaticProps } from "next";
import { NextSeo } from "next-seo";
import { useState } from "react";
import Select from "react-select";

import { CardList } from "../../components/CardList";
import { api } from "../../services/api";
import { Container, Content } from "../../styles/movies";

type SimpleMovie = {
  id: number;
  title: string;
  poster_path: string;
  backdrop_path: string;
  name: string;
  overview: string;
  vote_average: number;
};

interface IMoviesProps {
  trending: SimpleMovie[];
  nowPlaying: SimpleMovie[];
  topRated: SimpleMovie[];
  upComing: SimpleMovie[];
  action: SimpleMovie[];
  adventure: SimpleMovie[];
  animation: SimpleMovie[];
  comedy: SimpleMovie[];
  crime: SimpleMovie[];
  documentary: SimpleMovie[];
  drama: SimpleMovie[];
  family: SimpleMovie[];
  fantasy: SimpleMovie[];
  history: SimpleMovie[];
  horror: SimpleMovie[];
  mistery: SimpleMovie[];
  romance: SimpleMovie[];
  sciFi: SimpleMovie[];
  western: SimpleMovie[];
}

const options = [
  { value: "all", label: "All" },
  { value: "action", label: "Action" },
  { value: "adventure", label: "Adventure" },
  { value: "animation", label: "Animation" },
  { value: "comedy", label: "Comedy" },
  { value: "crime", label: "Crime" },
  { value: "documentary", label: "Documentary" },
  { value: "drama", label: "Drama" },
  { value: "family", label: "Family" },
  { value: "fantasy", label: "Fantasy" },
  { value: "history", label: "History" },
  { value: "horror", label: "Horror" },
  { value: "mistery", label: "Mistery" },
  { value: "romance", label: "Romance" },
  { value: "sciFi", label: "SciFi" },
  { value: "western", label: "Western" },
];

export default function Movies({
  trending,
  topRated,
  upComing,
  action,
  adventure,
  animation,
  comedy,
  crime,
  documentary,
  drama,
  family,
  fantasy,
  history,
  horror,
  mistery,
  romance,
  sciFi,
  western,
}: IMoviesProps) {
  const [target, updateTarget] = useState<{ value: string; label: string }>({
    value: "all",
    label: "All",
  });

  const handleChange = (select: { value: string; label: string }) => {
    updateTarget(select);
  };

  function SwitchMovieGenre(value: string) {
    switch (value) {
      case "action":
        return action;
      case "adventure":
        return adventure;
      case "animation":
        return animation;
      case "comedy":
        return comedy;
      case "crime":
        return crime;
      case "documentary":
        return documentary;
      case "drama":
        return drama;
      case "family":
        return family;
      case "fantasy":
        return fantasy;
      case "history":
        return history;
      case "horror":
        return horror;
      case "mistery":
        return mistery;
      case "romance":
        return romance;
      case "sciFi":
        return sciFi;
      case "western":
        return western;
    }
  }

  return (
    <Container>
      <title>Cineapp | Filmes</title>
      <NextSeo
        title="Cineapp | Filmes"
        description="Saiba tudo sobre filmes, como nota, elenco, or??amento, bilheteria, semelhantes e recomendados! "
        canonical="https://cineapp.vercel.app/movies"
        openGraph={{
          url: "https://cineapp.vercel.app/movies",
          title: "Cineapp | Filmes",
          description:
            "Saiba tudo sobre filmes, como nota, elenco, or??amento, bilheteria, semelhantes e recomendados! ",
          images: [
            {
              url: "https://cineapp.vercel.app/img/movies.jpg",
              width: 1920,
              height: 1080,
              alt: "Cineapp | Filmes",
            },
          ],
        }}
      />
      <Content>
        <div className="title">
          <h1>Movies</h1>
          <Select
            options={options}
            placeholder="genres"
            value={target}
            onChange={handleChange as unknown as undefined}
          />
        </div>
        {target.value === "all" ? (
          <>
            <CardList list={trending} title="???? Trending" type="movies" />
            <CardList list={topRated} title="???? Top Rated" type="movies" />
            <CardList list={upComing} title="??? Up Coming" type="movies" />
            <CardList list={action} title="???? Action" type="movies" />
            <CardList list={adventure} title="???? Adventure" type="movies" />
            <CardList list={animation} title="???? Animation" type="movies" />
            <CardList list={comedy} title="???? Comedy" type="movies" />
            <CardList list={crime} title="???? Crime" type="movies" />
            <CardList
              list={documentary}
              title="???? Documentary"
              type="movies"
            />
            <CardList list={drama} title="???? Drama" type="movies" />
            <CardList list={family} title="???? Family" type="movies" />
            <CardList list={fantasy} title="???? Fantasy" type="movies" />
            <CardList list={history} title="???? History" type="movies" />
            <CardList list={horror} title="???? Horror" type="movies" />
            <CardList list={mistery} title="???? Mistery" type="movies" />
            <CardList list={romance} title="???? Romance" type="movies" />
            <CardList list={sciFi} title="??????????? SciFi" type="movies" />
            <CardList list={western} title="???? western" type="movies" />
          </>
        ) : (
          <CardList
            list={SwitchMovieGenre(target.value) as SimpleMovie[]}
            title={target.label}
            type="movies"
          />
        )}
      </Content>
    </Container>
  );
}

async function getMoviesByGenreId(genreId: number) {
  const response = await api.get("/discover/movie", {
    params: {
      api_key: process.env.NEXT_PUBLIC_IMBD_API_KEY,
      with_genres: genreId,
      "release_date.lte": new Date(),
      sort_by: "popularity.desc",
      page: Math.floor(Math.random() * 10) + 1,
      language: "en-US",
    },
  });

  const movie = response.data.results.map((item: any) => {
    return {
      id: String(item.id),
      title: item.title,
      poster_path: item.poster_path,
      overview: item.overview,
      backdrop_path: item.backdrop_path,
      vote_average: item.vote_average,
    };
  });

  return movie;
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  const trendingResponse = await api.get("/trending/movie/week", {
    params: {
      api_key: process.env.NEXT_PUBLIC_IMBD_API_KEY,
      language: "en-US",
    },
  });

  const trending = trendingResponse.data.results.map((movie: any) => {
    return {
      id: String(movie.id),
      title: movie.title,
      poster_path: movie.poster_path,
      overview: movie.overview,
      backdrop_path: movie.backdrop_path,
      vote_average: movie.vote_average,
    };
  });

  const nowPlayingResponse = await api.get("/movie/now_playing", {
    params: {
      api_key: process.env.NEXT_PUBLIC_IMBD_API_KEY,
      language: "en-US",
    },
  });

  const nowPlaying = nowPlayingResponse.data.results.map((movie: any) => {
    return {
      id: String(movie.id),
      title: movie.title,
      poster_path: movie.poster_path,
      overview: movie.overview,
      backdrop_path: movie.backdrop_path,
      vote_average: movie.vote_average,
    };
  });

  const topRatedResponse = await api.get("/movie/top_rated", {
    params: {
      api_key: process.env.NEXT_PUBLIC_IMBD_API_KEY,
      language: "en-US",
    },
  });

  const topRated = topRatedResponse.data.results.map((movie: any) => {
    return {
      id: String(movie.id),
      title: movie.title,
      poster_path: movie.poster_path,
      overview: movie.overview,
      backdrop_path: movie.backdrop_path,
      vote_average: movie.vote_average,
    };
  });

  const upComingResponse = await api.get("/movie/upcoming", {
    params: {
      api_key: process.env.NEXT_PUBLIC_IMBD_API_KEY,
      language: "en-US",
    },
  });

  const upComing = upComingResponse.data.results.map((movie: any) => {
    return {
      id: String(movie.id),
      title: movie.title,
      poster_path: movie.poster_path,
      overview: movie.overview,
      backdrop_path: movie.backdrop_path,
      vote_average: movie.vote_average,
    };
  });

  const action = await getMoviesByGenreId(28);
  const adventure = await getMoviesByGenreId(12);
  const animation = await getMoviesByGenreId(16);
  const comedy = await getMoviesByGenreId(35);
  const crime = await getMoviesByGenreId(80);
  const documentary = await getMoviesByGenreId(99);
  const drama = await getMoviesByGenreId(18);
  const family = await getMoviesByGenreId(10751);
  const fantasy = await getMoviesByGenreId(14);
  const history = await getMoviesByGenreId(36);
  const horror = await getMoviesByGenreId(27);
  const mistery = await getMoviesByGenreId(9648);
  const romance = await getMoviesByGenreId(10749);
  const sciFi = await getMoviesByGenreId(878);
  const western = await getMoviesByGenreId(37);

  return {
    props: {
      trending,
      nowPlaying,
      topRated,
      upComing,
      action,
      adventure,
      animation,
      comedy,
      crime,
      documentary,
      drama,
      family,
      fantasy,
      history,
      horror,
      mistery,
      romance,
      sciFi,
      western,
    },
    revalidate: 60 * 60 * 24, // 1 day
  };
};
