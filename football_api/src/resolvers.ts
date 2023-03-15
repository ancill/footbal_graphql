import { Context } from './context'
import axios from 'axios'
const fetchCompetitionsApi = async (leagueCode: string, prefix?: string) => {
  try {
    const { data } = await axios.get(
      `https://api.football-data.org/v4/competitions/${leagueCode}/${
        prefix || ''
      }`,
      {
        headers: {
          'X-Auth-Token': '2bfccee4efd549f5b0f6d36af8c00802',
        },
      },
    )
    return { data }
  } catch (error) {
    return { error }
  }
}

export const resolvers = {
  Query: {
    players: async (
      _parent,
      {
        leagueCode,
        teamName,
      }: {
        leagueCode: string
        teamName: string
      },
      context: Context,
    ) => {
      const players = await context.prisma.player.findMany({
        where: {
          team: {
            competition: {
              code: leagueCode,
            },
            name: {
              contains: teamName || '',
            },
          },
        },
        include: {
          team: {
            include: {
              coach: true,
            },
          },
        },
      })

      return players
    },
    team: (
      _parent,
      { name, withPlayers }: { name: string; withPlayers: boolean },
      context: Context,
    ) => {
      return context.prisma.team.findFirst({
        where: {
          name: name,
        },
        include: {
          players: withPlayers,
        },
      })
    },
  },
  Mutation: {
    importLeague: async (
      _parent,
      { leagueCode }: { leagueCode: string },
      context: Context,
    ) => {
      // just only for area
      const {
        data: { name, code, area },
      } = await fetchCompetitionsApi(leagueCode)

      const createdCompetition = await context.prisma.competition.create({
        data: {
          name: name,
          code: code,
          areaName: area.name,
        },
      })

      const {
        data: { teams },
      } = await fetchCompetitionsApi(leagueCode, 'teams')

      teams.forEach(async (team) => {
        await context.prisma.competition.update({
          where: {
            id: createdCompetition.id,
          },
          data: {
            teams: {
              create: [
                {
                  areaName: team.area.name,
                  name: team.name,
                  shortName: team.shortName,
                  tla: team.tla,
                  address: team.address,
                  coach: {
                    create: {
                      name: team.coach.name,
                      dateOfBirth: team.coach.dateOfBirth,
                      nationality: team.coach.nationality,
                    },
                  },
                  players: {
                    create: team.squad,
                  },
                },
              ],
            },
          },
        })
      })

      return context.prisma.competition.findUnique({
        where: {
          id: createdCompetition.id,
        },
        include: {
          teams: true,
        },
      })
    },
  },
}
