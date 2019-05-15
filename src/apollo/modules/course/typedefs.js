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

type Course  {
    title: String
    description: String
    thumbnailUrl: String
    url: String
    successCount: Int
}
`