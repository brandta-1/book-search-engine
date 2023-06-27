const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

//these are similar to RESTful CRUD endpoints

const resolvers = {
    //find the current user using the context, see server.js for more info
    Query: {
        me: async (parent, args, context) => {  
            return await User.findOne({ _id: context.user._id }); 
          },
    },


    Mutation: {
        addUser: async (parent, { username, email, password }) => {
            const user = await User.create({ username, email, password });
            const token = signToken(user);
            return { token, user };
        },


        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });

            if (!user) {
                throw new AuthenticationError('No user found with this email address');
            }

            const pass = await user.isCorrectPassword(password);

            if (!pass) {
                throw new AuthenticationError('Incorrect credentials');
            }

            const token = signToken(user);
            return { token, user };
        },


        saveBook: async (parent, args, context) => {
            try {
                const book = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $addToSet: { savedBooks: args.criteria } },
                    { new: true }
                );
                return book;
            } catch (err) {
                console.log(err);
                return err;
            }
        },

        removeBook: async (parent, args, context) => {
            const book = await User.findOneAndUpdate(
                { _id: context.user._id },
                { $pull: { savedBooks: { bookId: args.bookId } } },
                { new: true }
            );
            if (!book) {
                return res.status(404).json({ message: "Couldn't find user with this id!" });
            }
            return book;
        }
    }
};

module.exports = resolvers;