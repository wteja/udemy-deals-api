const { merge } = require('lodash');

/**
 * Get specific records in database collection.
 * @param {*} collection Database collection
 * @param {*} options Query options
 */
function getItems(collection, options) {
    return new Promise((resolve, reject) => {
        let cursor = collection.find(options.filter, options.fields)

        if(options.page && options.limit) {
            const skip = (options.page > 0 ? options.page - 1 : 0) * options.limit;
            cursor.skip(skip)
            cursor.limit(options.limit)
        }

        if (options.sort) {
            cursor.sort(options.sort)
        }

        cursor.toArray((err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
};

/**
 * Couting all records in collection.
 * @param {*} collection Database collection
 */
function getTotalRecords(collection, options) {
    return new Promise((resolve, reject) => {
        collection.countDocuments(options.filter, (err, totalRecords) => {
            if (err) {
                reject(err);
            } else {
                resolve(totalRecords);
            }
        });
    });
};

/**
 * Get specific records in database collection with pagination information.
 * @param {*} collection Database collection
 * @param {*} options Query options
 */
module.exports = (collection, options) => {
    return new Promise((resolve, reject) => {
        options = merge({
            collection: null,
            filter: null,
            fields: null,
            sort: null,
            page: 1,
            limit: 100
        }, options);

        if (!collection) {
            return reject(new Error("Required MongoDB collection."));
        }

        if (!options.page || options.page < 1) {
            options.page = 1;
        }

        if (!options.limit) {
            options.limit = 1000;
        }

        let returns = {
            data: [],
            total: 0,
            pages: 0,
            limit: options.limit,
            page: options.page
        };

        getItems(collection, options)
            .then(items => {
                items.forEach(it => {
                    if (it._id) {
                        it.id = it._id.toString();
                        delete it._id;
                    }
                });
                returns.data = items;
                return getTotalRecords(collection, options);
            })
            .then(total => {
                returns.total = total;
                returns.pages = Math.ceil(total / options.limit);
                resolve(returns);
            })
            .catch(err => reject(err));

    });
};