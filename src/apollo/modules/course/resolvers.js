module.exports = {
    Query: {
        courses: (parent, args, context) => {
            return context.repo.getCourses(args);
        }
    },
    Mutation: {
        voteCourseSuccess: (parent, args, context) => {
            return context.repo.voteCourseSuccess(args.id, args.success)
        }
    },
    Course: {
        successRate: parent => {
            const successCount = parent.successVote.filter(vote => vote === true).length
            const successRate = Math.floor(successCount / parent.successVote.length * 100)
            return successRate
        }
    }
}