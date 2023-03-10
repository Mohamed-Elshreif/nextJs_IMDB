/* eslint-disable @next/next/no-img-element */

import { parseISO, format } from "date-fns";
import brazilLocale from "date-fns/locale/pt";
import { GetServerSideProps } from "next";
import { NextSeo } from "next-seo";
import Link from "next/link";

import { Banner } from "../../components/Banner";
import { Recommendations } from "../../components/Recommendations";
import { Similar } from "../../components/Similar";
import { api } from "../../services/api";
import { Container, Content } from "../../styles/movie";
import { CreditsType } from "../../types/credits";
import { DetailsType } from "../../types/details";
import { ProviderType } from "../../types/providers";
import { VideosType } from "../../types/videos";
import { FormatNote } from "../../utils/FormatNote";
import { FormatRuntime } from "../../utils/FormatRuntime";

type PropsType = {
  details: DetailsType;
  videos: VideosType;
  credits: CreditsType;
  providers: ProviderType;
  recommendations: any;
  similar: any;
};

export default function Movie({
  details,
  videos,
  credits,
  providers,
  recommendations,
  similar,
}: PropsType) {
  const note = FormatNote(details.vote_average);
  const noteArray = [];

  const provider = providers.results.BR;
  for (var i = 0; i < note; i++) {
    noteArray.push(i);
  }

  const date = parseISO(details.release_date);
  const formattedDate = format(date, "dd 'de' MMMM 'de' yyyy", {
    locale: brazilLocale,
  });

  return (
    <>
      <title>{details.title}</title>
      <NextSeo
        title={details.title}
        description={`${details.overview.slice(0, 100)}...`}
        canonical={`https://cineapp.vercel.app/movies/${details.id}`}
        openGraph={{
          url: `https://cineapp.vercel.app/movies/${details.id}`,
          title: details.title,
          description: `${details.overview.slice(0, 100)}...`,
          images: [
            {
              url: `https://image.tmdb.org/t/p/original/${details.backdrop_path}`,
              width: 1280,
              height: 720,
              alt: details.title,
            },
          ],
        }}
      />

      <Container>
        <Banner
          backdrop_path={details.backdrop_path}
          title={details.title}
          budget={details.budget}
          revenue={details.revenue}
          vote_average={details.vote_average}
          vote_count={details.vote_count}
          videos={videos}
          tagline={details.tagline}
          id={details.id}
          poster_path={details.poster_path}
          type="movie"
        />

        <Content>
          <section>
            <div className="details">
              <img
                src={`https://image.tmdb.org/t/p/w500/${details.poster_path}`}
                alt={details.title}
                className="poster"
              />

              {details.homepage && (
                <a href={details.homepage} target="_blank" rel="noreferrer">
                  <button>
                    <p>Official page</p>
                  </button>
                </a>
              )}
            </div>

            <main className="hero">
              <div>
                <h1>Information</h1>
                <div>
                  <p>
                    <span>Synopsis: </span>
                    {details.overview}
                  </p>
                </div>
                <div>
                  <p>
                    <span>Duration: </span>
                    {FormatRuntime(details.runtime)}
                  </p>
                </div>
                <div>
                  <p>
                    <span>Release date of: </span>
                    {formattedDate}
                  </p>
                </div>
                <div>
                  <p>
                    <span>genres: </span>
                    {details.genres.map((genre, index) => {
                      return index !== details.genres.length - 1
                        ? " " + genre.name + ","
                        : " " + genre.name + ".";
                    })}
                  </p>
                </div>
                <div>
                  <p>
                    <span>Cast:</span>
                    {credits.cast.slice(0, 10).map((participant, index) => {
                      return (
                        <Link
                          href={`/person/${participant.id}`}
                          key={participant.id}
                        >
                          <a>
                            {index !== 9
                              ? " " + participant.name + ","
                              : " " + participant.name + "..."}
                          </a>
                        </Link>
                      );
                    })}
                  </p>
                </div>
              </div>

              {provider && (
                <div className="provider">
                  <h1>Available in:</h1>
                  <a href={provider.link} target="_blank" rel="noreferrer">
                    {provider.flatrate
                      ? provider.flatrate.map((item) => {
                          return (
                            <img
                              src={`https://image.tmdb.org/t/p/w500/${item.logo_path}`}
                              alt={item.provider_name}
                              key={item.provider_id}
                            />
                          );
                        })
                      : provider.rent &&
                        provider.rent.map((item) => {
                          return (
                            <img
                              src={`https://image.tmdb.org/t/p/w500/${item.logo_path}`}
                              alt={item.provider_name}
                              key={item.provider_id}
                            />
                          );
                        })}
                  </a>
                </div>
              )}
            </main>
          </section>

          {recommendations.results.length > 1 && (
            <Recommendations recommendations={recommendations} type="movies" />
          )}
          {similar.results.length > 1 && (
            <Similar similar={similar} type="movies" />
          )}
        </Content>
      </Container>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { id } = ctx.query;

  const { data: details } = await api.get(`movie/${id}`, {
    params: {
      api_key: process.env.NEXT_PUBLIC_IMBD_API_KEY,
      language: "en-US",
    },
  });

  const { data: videos } = await api.get(`movie/${id}/videos`, {
    params: {
      api_key: process.env.NEXT_PUBLIC_IMBD_API_KEY,
      language: "en-US",
    },
  });

  const { data: credits } = await api.get(`movie/${id}/credits`, {
    params: {
      api_key: process.env.NEXT_PUBLIC_IMBD_API_KEY,
      language: "en-US",
    },
  });

  const { data: providers } = await api.get(`movie/${id}/watch/providers`, {
    params: {
      api_key: process.env.NEXT_PUBLIC_IMBD_API_KEY,
      language: "en-US",
    },
  });

  const { data: recommendations } = await api.get(
    `movie/${id}/recommendations`,
    {
      params: {
        api_key: process.env.NEXT_PUBLIC_IMBD_API_KEY,
        language: "en-US",
      },
    }
  );

  const { data: similar } = await api.get(`movie/${id}/similar`, {
    params: {
      api_key: process.env.NEXT_PUBLIC_IMBD_API_KEY,
      language: "en-US",
    },
  });

  return {
    props: {
      details,
      videos,
      credits,
      providers,
      recommendations,
      similar,
    },
  };
};
