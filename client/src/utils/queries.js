import { gql } from '@apollo/client';

//this query returns a user object, and all its properties, see typedefs and resolvers for more info

export const GET_ME = gql`
  query Me {
    me {
      _id
      username
      email
      bookCount
      savedBooks {
        bookId
        authors
        description
        title
        image
        link
      }
    }
  }
`;
