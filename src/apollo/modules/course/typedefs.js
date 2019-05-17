const { gql } = require('apollo-server-express')
const params = require('../../param-list')

module.exports = gql`
extend type Query {
    courses(${params}): CoursesList
}

type CoursesList {
    data: [Course]
    page: Int
    limit: Int
    pages: Int
    total: Int
    final: Boolean
}

type Course {
    id: ID,
    title: String
    description: String
    thumbnailUrl: String
    url: String
    successVote: [Boolean]
    successRate: Int
}

type CourseVoteResult {
    successRate: Int
}

extend type Mutation {
    voteCourseSuccess(id: ID!, success: Boolean!): CourseVoteResult
}
`