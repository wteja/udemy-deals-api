module.exports = {
    Query: {
        courses: async (parent, args, context) => {
            return context.repo.getCourses(args);
        }
    }
}