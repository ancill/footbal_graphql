import { DateTimeResolver } from 'graphql-scalars'
import { Context } from './context'
import axios from 'axios'
import { error } from 'console'

enum SortOrder {
  asc = 'asc',
  desc = 'desc',
}

interface PostOrderByUpdatedAtInput {
  updatedAt: SortOrder
}

interface UserUniqueInput {
  id?: number
  email?: string
}

interface PostCreateInput {
  title: string
  content?: string
}

interface UserCreateInput {
  email: string
  name?: string
  posts?: PostCreateInput[]
}

export const resolvers = {
  Query: {
    players: (_parent, { leagueCode, teamName }, context: Context) => {
      const players = context.prisma.player.findMany({
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
      })
      return players
    },

    // allUsers: (_parent, _args, context: Context) => {
    //   return context.prisma.user.findMany()
    // },
    // postById: (_parent, args: { id: number }, context: Context) => {
    //   return context.prisma.post.findUnique({
    //     where: { id: args.id || undefined },
    //   })
    // },
    // feed: (
    //   _parent,
    //   args: {
    //     searchString: string
    //     skip: number
    //     take: number
    //     orderBy: PostOrderByUpdatedAtInput
    //   },
    //   context: Context,
    // ) => {
    //   const or = args.searchString
    //     ? {
    //         OR: [
    //           { title: { contains: args.searchString } },
    //           { content: { contains: args.searchString } },
    //         ],
    //       }
    //     : {}

    //   return context.prisma.post.findMany({
    //     where: {
    //       published: true,
    //       ...or,
    //     },
    //     take: args?.take,
    //     skip: args?.skip,
    //     orderBy: args?.orderBy,
    //   })
    // },
    // draftsByUser: (
    //   _parent,
    //   args: { userUniqueInput: UserUniqueInput },
    //   context: Context,
    // ) => {
    //   return context.prisma.user
    //     .findUnique({
    //       where: {
    //         id: args.userUniqueInput.id || undefined,
    //         email: args.userUniqueInput.email || undefined,
    //       },
    //     })
    //     .posts({
    //       where: {
    //         published: false,
    //       },
    //     })
    // },
  },
  Mutation: {
    importLeague: async (
      _parent,
      { leagueCode }: { leagueCode: string },
      context: Context,
    ) => {
      const {
        data: { name, code, area },
      } = await axios.get(
        `https://api.football-data.org/v4/competitions/${leagueCode}`,
        {
          headers: {
            'X-Auth-Token': '2bfccee4efd549f5b0f6d36af8c00802',
          },
        },
      )

      const createdCompetition = await context.prisma.competition.create({
        data: {
          name: name,
          code: code,
          areaName: area.name,
        },
      })

      return createdCompetition
    },
    // signupUser: (
    //   _parent,
    //   args: { data: UserCreateInput },
    //   context: Context,
    // ) => {
    //   const postData = args.data.posts?.map((post) => {
    //     return { title: post.title, content: post.content || undefined }
    //   })

    //   return context.prisma.user.create({
    //     data: {
    //       name: args.data.name,
    //       email: args.data.email,
    //       posts: {
    //         create: postData,
    //       },
    //     },
    //   })
    // },
    // createDraft: (
    //   _parent,
    //   args: { data: PostCreateInput; authorEmail: string },
    //   context: Context,
    // ) => {
    //   return context.prisma.post.create({
    //     data: {
    //       title: args.data.title,
    //       content: args.data.content,
    //       author: {
    //         connect: { email: args.authorEmail },
    //       },
    //     },
    //   })
    // },
    // togglePublishPost: async (
    //   _parent,
    //   args: { id: number },
    //   context: Context,
    // ) => {
    //   try {
    //     const post = await context.prisma.post.findUnique({
    //       where: { id: args.id || undefined },
    //       select: {
    //         published: true,
    //       },
    //     })

    //     return context.prisma.post.update({
    //       where: { id: args.id || undefined },
    //       data: { published: !post?.published },
    //     })
    //   } catch (error) {
    //     throw new Error(
    //       `Post with ID ${args.id} does not exist in the database.`,
    //     )
    //   }
    // },
    // incrementPostViewCount: (
    //   _parent,
    //   args: { id: number },
    //   context: Context,
    // ) => {
    //   return context.prisma.post.update({
    //     where: { id: args.id || undefined },
    //     data: {
    //       viewCount: {
    //         increment: 1,
    //       },
    //     },
    //   })
    // },
    // deletePost: (_parent, args: { id: number }, context: Context) => {
    //   return context.prisma.post.delete({
    //     where: { id: args.id },
    //   })
    // },
    // addProfileForUser: (
    //   _parent,
    //   args: { userUniqueInput: UserUniqueInput; bio: string },
    //   context: Context,
    // ) => {
    //   return context.prisma.profile.create({
    //     data: {
    //       bio: args.bio,
    //       user: {
    //         connect: {
    //           id: args.userUniqueInput?.id,
    //           email: args.userUniqueInput?.email,
    //         },
    //       },
    //     },
    //   })
    // },
  },
  DateTime: DateTimeResolver,
  //   User: {
  //     posts: (parent, _args, context: Context) => {
  //       return context.prisma.user
  //         .findUnique({
  //           where: { id: parent?.id },
  //         })
  //         .posts()
  //     },
  //     profile: (parent, _args, context: Context) => {
  //       return context.prisma.user
  //         .findUnique({
  //           where: { id: parent?.id },
  //         })
  //         .profile()
  //     },
  //   },
  //   Profile: {
  //     user: (parent, _args, context: Context) => {
  //       return context.prisma.profile
  //         .findUnique({
  //           where: { id: parent?.id },
  //         })
  //         .user()
  //     },
  //   },
}
