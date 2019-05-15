const paginate = require('./paginate')
const { merge } = require('lodash')

const repository = db => {
    const courses = db.collection('courses');

    const getCourses = options => {
        const defaultOptions = {
            page: 1,
            limit: 5,
            sort: { _id: -1 }
        }
        options = merge(defaultOptions, options)
        return paginate(courses, options)
    }

    return {
        getCourses
    };
}

module.exports = {
    connect: db => {
        return new Promise((resolve, reject) => {
            if (!db)
                return reject(new Error("Please provide database connection."))

            resolve(repository(db))
        })
    }
};