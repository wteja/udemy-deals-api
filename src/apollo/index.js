const { ApolloServer, gql } = require('apollo-server-express')
const GraphQLJSON = require('graphql-type-json')
const path = require('path');
const fs = require('fs');
const { merge } = require('lodash')

const create = options => {
    const modulesDir = path.join(__dirname, 'modules');
    const items = fs.readdirSync(modulesDir);
    const typeDefs = [gql`
        scalar JSON

        type Query {
            _empty: String
        }

        type Mutation {
            _empty: String
        }
        `];
    let resolvers = {
        Query: {
            _empty: () => ""
        },
        Mutation: {
            _empty: () => ""
        },
        JSON: GraphQLJSON
    };
    
    items.forEach(itemName => {
        const stat = fs.statSync(path.join(modulesDir, itemName));
        if (stat.isDirectory()) {
            const td = require(`./modules/${itemName}/typedefs`)
            const r = require(`./modules/${itemName}/resolvers`)
            typeDefs.push(td)
            resolvers = merge(resolvers, r)
        }
    })
    
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: {
            repo: options.repo
        }
    })

    return server
}

module.exports = {
    create
}