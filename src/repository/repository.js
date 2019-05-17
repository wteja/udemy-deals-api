const paginate = require('./paginate')
const { merge } = require('lodash')
const { ObjectId } = require('mongodb')

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

    const voteCourseSuccess = (id, success) => {
        return new Promise((resolve, reject) => {
            courses.findOne({ _id: new ObjectId(id) }, (err, doc) => {
                if (err)
                    return reject(err)

                if (!doc)
                    return reject(new Error("Course not found."))

                if (!doc.successVote || !doc.successVote.length) {
                    doc.successVote = [true]
                }

                doc.successVote.push(success)

                updateCourseSuccess(doc._id, doc.successVote).then(result => {
                    const successCount = result.successVote.filter(vote => vote === true).length
                    const successRate = Math.floor(successCount / result.successVote.length * 100)
                    resolve({
                        successRate
                    })
                })
            })
        })
    }

    const updateCourseSuccess = (_id, successVote) => {
        return new Promise((resolve, reject) => {
            courses.findOneAndUpdate({ _id },
                { $set: { successVote } },
                { returnNewDocument: true }, (err, res) => {
                    if (err)
                        return reject(err)

                    resolve(res.value)
                })
        })
    }

    return {
        getCourses,
        voteCourseSuccess
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