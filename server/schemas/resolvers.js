const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        me: async (_, args) => {
            return await User.findById(args.id);
        }
    },


    Mutation: {
        addUser: async (_, args) => {
            const user = await User.create(args);
            const token = signToken(user);
            return { token, user };
        },


        login: async (_, args) => {
            const user = await User.findOne(args.email);

            if (!user) {
                throw new AuthenticationError('No user found with this email address');
            }

            const pass = await user.isCorrectPassword(args.password);

            if (!pass) {
                throw new AuthenticationError('Incorrect credentials');
            }

            const token = signToken(user);
            return { token, user };
        },


        saveBook: async (_, args) => {
            try {
                const book = await User.findOneAndUpdate(
                    { _id: args.id },
                    { $addToSet: { savedBooks: args.criteria } },
                    { new: true, runValidators: true }
                );
                return res.json(book);
            } catch (err) {
                console.log(err);
                return res.status(400).json(err);
            }
        },

        removeBook: async (_, args) => {
            const book = await User.findOneAndUpdate(
                { _id: args.id },
                { $pull: { savedBooks: { bookId: args.bookId } } },
                { new: true }
            );
            if (!book) {
                return res.status(404).json({ message: "Couldn't find user with this id!" });
            }
            return res.json(book);
        }
    }
};

module.exports = resolvers;