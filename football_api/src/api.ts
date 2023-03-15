import axios from 'axios'

export const fetchCompetitionsApi = async (
  leagueCode: string,
  prefix?: string,
) => {
  const token = process.env.FOOTBALL_API_TOKEN

  try {
    const { data } = await axios.get(
      `https://api.football-data.org/v4/competitions/${leagueCode}/${
        prefix || ''
      }`,
      {
        headers: {
          'X-Auth-Token': token,
        },
      },
    )
    return { data }
  } catch (error) {
    return { error }
  }
}
