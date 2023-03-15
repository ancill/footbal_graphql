import { Prisma } from '@prisma/client'
import { Context } from './context'

export const getTeam = async (
  {
    name,
    withPlayers,
  }: {
    name: string
    withPlayers: boolean
  },
  context: Context,
) => {
  try {
    return context.prisma.team.findFirst({
      where: {
        name: name,
      },
      include: {
        players: withPlayers,
      },
    })
  } catch (error) {
    throw error
  }
}

export const getPlayers = async (
  {
    leagueCode,
    teamName,
  }: {
    leagueCode: string
    teamName: string
  },
  context: Context,
) => {
  try {
    return await context.prisma.player.findMany({
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
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      // The .code property can be accessed in a type-safe manner
      if (e.code === 'P2002') {
        console.log('Handle error')
      }
    }
    throw e
  }
}
