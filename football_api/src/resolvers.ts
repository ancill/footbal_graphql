import { Coach, Player, Prisma, Team } from '@prisma/client'
import { Context } from './context'
import { getPlayers, getTeam } from './db'
import { fetchCompetitionsApi } from './api'

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
      const players = await getPlayers({ leagueCode, teamName }, context)
      // Throw an error if no players are found
      if (players.length === 0) {
        throw new Error(
          `No players found for league code ${leagueCode} and team ${
            teamName || ''
          }`,
        )
      }

      return players
    },
    team: async (
      _parent,
      { name, withPlayers }: { name: string; withPlayers: boolean },
      context: Context,
    ) => {
      const team = await getTeam({ name, withPlayers }, context)

      if (!team) {
        throw new Error(`No team found for name ${name} `)
      }

      return team
    },
  },
  Mutation: {
    importLeague: async (
      _parent,
      { leagueCode }: { leagueCode: string },
      context: Context,
    ) => {
      const competitionResult = await fetchCompetitionsApi(leagueCode)

      //created competition and team assigned to it
      const createdCompetition = await context.prisma.competition.create({
        data: {
          id: competitionResult.data.id,
          name: competitionResult.data.name,
          code: competitionResult.data.code,
          areaName: competitionResult.data.area.code,
        },
      })

      const teamResult = await fetchCompetitionsApi(leagueCode, 'teams')

      // creating teams
      const teams = await context.prisma.team.createMany({
        data: teamResult.data.teams.map(
          (team) =>
            ({
              id: team.id,
              areaName: team.area.name,
              name: team.name,
              shortName: team.shortName,
              tla: team.tla,
              address: team.address,
              competitionId: createdCompetition.id,
              coachId: team.coach.id,
            } as Team),
        ),
        d,
      })

      // creating coaches
      const createdCoaches = await context.prisma.coach.createMany({
        data: teamResult.data?.teams.map(
          (team) =>
            ({
              dateOfBirth: team.coach.dateOfBirth,
              id: team.coach.id,
              name: team.coach.name,
              nationality: team.coach.nationality,
              teamId: team.id,
            } as Coach),
        ),
      })

      let players = teamResult.data?.teams.map((team) => {
        return team.squad.map(
          (player) =>
            ({
              dateOfBirth: player.dateOfBirth,
              id: player.id,
              name: player.name,
              nationality: player.nationality,
              teamId: team.id,
              position: player.position,
            } as Player),
        )
      }) as Player[]

      // creating players
      players
        .flatMap((players) => players)
        .forEach(
          async (player) =>
            await context.prisma.player.create({
              data: player,
            }),
        )

      return createdCompetition
    },
  },
}
