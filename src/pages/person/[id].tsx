/* eslint-disable @next/next/no-img-element */

import { GetServerSideProps } from "next";
import { NextSeo } from "next-seo";

import { Credits } from "../../components/Credits";
import { api } from "../../services/api";
import { Container, Content } from "../../styles/person";
import { Details, Credits as CreditsType } from "../../types/person/details";

interface IPersonProps {
  details: Details;
  movieCredits: CreditsType;
  tvCredits: CreditsType;
}

export default function Person({
  details,
  movieCredits,
  tvCredits,
}: IPersonProps) {
  return (
    <Container>
      <title>{details.name}</title>
      <NextSeo
        title={details.name}
        description={`${details.biography.slice(0, 100)}...`}
        canonical={`https://cineapp.vercel.app/person/${details.id}`}
        openGraph={{
          url: `https://cineapp.vercel.app/person/${details.id}`,
          title: details.name,
          description: `${details.biography.slice(0, 100)}...`,
          images: [
            {
              url: `https://image.tmdb.org/t/p/original/${details.profile_path}`,
              alt: details.name,
              height: 1280,
              width: 720,
            },
          ],
        }}
      />

      <Content>
        <main>
          <aside>
            <img
              src={`https://image.tmdb.org/t/p/w500/${details.profile_path}`}
              alt={`Poster ${details.name}`}
            />
          </aside>
          <section>
            <h1>{details.name}</h1>
            <p>{details.biography}</p>
          </section>
        </main>

        <Credits title="Filmes" list={movieCredits} type="movies" />
        <Credits title="Séries" list={tvCredits} type="tv" />
      </Content>
    </Container>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { id } = ctx.query;
console.log(id)
  const { data: details } = await api.get(`/person/${id}`, {
    params: {
      api_key: process.env.NEXT_PUBLIC_IMBD_API_KEY,
      language: "en-US",
    },
  });

  const { data: movieCredits } = await api.get(`person/${id}/movie_credits`, {
    params: {
      api_key: process.env.NEXT_PUBLIC_IMBD_API_KEY,
      language: "en-US",
    },
  });

  const { data: tvCredits } = await api.get(`person/${id}/tv_credits`, {
    params: {
      api_key: process.env.NEXT_PUBLIC_IMBD_API_KEY,
      language: "en-US",
    },
  });

  return {
    props: { details, movieCredits, tvCredits },
  };
};
