import { QueryResolvers } from '@/__generated__/resolvers-types'
import Cycle from '../../lib/mongoose/models/Cycle'
import Report from '../../lib/mongoose/models/Report'
import User from '../../lib/mongoose/models/User'
import { resolveReport } from './reports'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../../lib/constants'
const queries: QueryResolvers = {
  Query: {
    hello: () => {
      return 'Hello world!'
    },
    getUsers: async () => {
      try {
        const users = await User.find()
        return users
      } catch (error) {
        throw new Error('Error fetching users from the database')
      }
    },
    getUser: async (_: any, { id }: { id: String }) => {
      try {
        const user = await User.findById(id)
        return user
      } catch (error) {
        throw new Error('Error fetching users from the database')
      }
    },
    login: async (
      _: any,
      {
        email,
        password,
      }: {
        email: String
        password: String
      }
    ) => {
      try {
        const user = await User.findOne({
          email,
          hashedPw: password,
        })

        const id = user?._id
        if (!id) {
          throw new Error('User not found')
        }

        const token = jwt.sign({ id, email }, JWT_SECRET, {
          expiresIn: '1h',
        })
        return { token, id }
      } catch (error) {
        throw new Error('Error fetching users from the database')
      }
    },
    getReport: resolveReport,
    getCurrentCycle: async (_: any) => {
      return await Cycle.getCurrentCycle()
    },
    getUserByName: async (_: any, { fullName }: { fullName: string }) => {
      try {
        const user = await User.findOne({ fullName })
        return user
      } catch (error) {
        throw new Error('Error fetching users from the database')
      }
    },
    getAssignedReviews: async (
      _: any,
      { cycleId, reviewerId }: { cycleId: string; reviewerId: string }
    ) => {
      try {
        const reports = await Report.find({
          '_id.cycleId': cycleId,
          'reviews.peers': {
            $elemMatch: {
              reviewerId: reviewerId,
            },
          },
        })
        return reports
      } catch (error) {
        throw new Error('Error fetching report from the database')
      }
    },
  },
}

export default queries