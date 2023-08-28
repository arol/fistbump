import mongoose from 'mongoose'
import { generateRandomUserModels } from './generate-users'
import 'dotenv/config'
import User from '../models/User'
import generateReport, { pickRandomReviewers } from './generate-reports'
import Report from '../models/Report'
import { ReportModel } from '../../../../../../packages/types/models'
import { ObjectId, UserDoc } from './types'

const NUMBER_OF_USERS = 10
const NUMBER_OF_PEER_REVIEWS = 1
const NUMBER_OF_METRICS = 3
const MAX_RATING = 5
const COMPANY = 'Arol.Dev'

const mongoURL = process.env.MONGODB_URL

// Connect to mongodb implementation
async function seedDb() {
  try {
    if (mongoURL === undefined)
      throw new Error('Could not get MongoDB URL from .env')
    await mongoose.connect(mongoURL)
    await mongoose.connection.db.dropDatabase()
    console.log('🧑🏻‍💻👍🏻 Connected to DB')

    await seedData(NUMBER_OF_USERS)

    mongoose.connection.close()
  } catch (error: any) {
    console.log(error.message)
  }
}

async function seedData(count: number) {
  try {
    const userInput = generateRandomUserModels(count, COMPANY)
    const users = await User.insertMany(userInput)
    if (!users) throw new Error('User.insertMany() failed')
    console.log(`${users.length} users have been added to the database`)
    console.log(users)

    const fakeCycle = '131313'
    const fakeManager = new mongoose.Types.ObjectId()
    console.log(`💜 CYCLE ID: '${fakeCycle}' 💜`)
    const reportInput: ReportModel[] = []

    users.forEach((user, index) => {
      const reviewers = pickRandomReviewers(
        user._id,
        users,
        NUMBER_OF_PEER_REVIEWS
      )
      //! ~half the reports will have empty reviews
      const areReviewsEmpty = index < users.length / 2

      const report = generateReport(
        user._id,
        fakeCycle,
        fakeManager,
        reviewers,
        NUMBER_OF_METRICS,
        MAX_RATING,
        areReviewsEmpty
      )

      reportInput.push(report)
    })

    const reports = await Report.insertMany(reportInput)
    if (!reports) throw new Error('Report.insertMany() failed')
    console.log(`${reports.length} reports have been added to the database`)
    console.log(reports[0])
  } catch (error: any) {
    console.log(error.message)
  }
}

export default seedDb
