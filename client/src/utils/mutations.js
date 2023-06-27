import { gql } from '@apollo/client';

//the following exports are all mutations, these mutations take in parameters, modify the db, and return the specified results, if any

export const LOGIN_USER = gql`

    mutation Login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
            token
            user {
                _id
                username
            }
        }
    }
`;

export const ADD_USER = gql`

    mutation AddUser($username: String!, $email: String!, $password: String!) {
        addUser(username: $username, email: $email, password: $password) {
            token
            user {
                _id
                username
                email
                bookCount
                savedBooks {
                    authors
                    bookId
                    image
                    link
                    title
                    description
                }
            }
        }
    }
`;

export const SAVE_BOOK = gql`

    mutation saveBook($criteria: BookInput!) {
        saveBook(criteria: $criteria) {
            username
            email
            bookCount
            savedBooks {
                authors
                description
                bookId
                image
                link
                title
            }
        }
    }
`;

export const REMOVE_BOOK = gql`

    mutation Mutation( $bookId: String!) {
        removeBook( bookId: $bookId) {
            username
            email
            bookCount
            savedBooks {
                authors
                bookId
                description
                image
                link
                title
            }
        }
    }
`;