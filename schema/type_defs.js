import { gql } from 'apollo-server-express';
export const typeDefs = gql`

 scalar Date
 scalar Upload
  enum UserTypeEnum {
    STUDENT
    TEACHER
  }
  type User {
   """
   User id \n
   """ 
  user_id: ID!
    """
    User name \n
    """
    name: String!
    """
    User email \n
    """
    email: String!
    """
    User password \n
    """
    password: String!
    """
    User type \n
    """
    type: UserTypeEnum!
  }

  type Journal {
  """
  Journal id \n
  """
    journal_id: ID!
  """
  Journal description \n
  """  
    description: String!
  """
  Attached type of the file \n
  """  
    attachment_type: String
  """
  Attached file name which be viewed going to the url : /$(filename)\n
  """

    attachment_value: String
  """
  Teacher id \n
  """  
    teacher_id: ID!
  """
  Journal published date \n
  """  
    published_at: Date!
  """
  List of Users who are all tagged in the journal \n
  """  
    userId: [ID!]!
  }
  
  type JournalFeed{
    journal_id: ID!
    description: String!
    attachment_type: String
    attachment_value: String
    teacher_id: ID!
    published_at: Date!
    }

   type UserAuthentication{
    user_id: ID!
    name: String!
    email: String!
    password: String!
    type: UserTypeEnum!
    token: String!
    }

  type Query {
  
    """
    \
    Authenticates user and returns token \n
    example:  \n
    userLogin(email:"siddu@gmail.com",password:"siddu") \n
    returns token
    """
    userLogin(email:String!,password:String!): UserAuthentication!
    """
    \
    Get all users \n
    example:\n 
      users() \n
    returns list of users
    """
    users: [User!]!

    """
    \
    Get all journals of a teacher \n
    example:\n
     TeacherFeed() \n
    returns list of journals
    """
    TeacherFeed: [JournalFeed!]!

    """
    \
    Get all journals of a student \n 
    example:\n
    StudentFeed() \n
    return list of journals
    """
    StudentFeed: [JournalFeed!]!
  }

  input CreateUserInput {
    name: String!
    email: String!
    password: String!
    type: UserTypeEnum!
  }
  input CreateJournalInput {
    description: String!
    published_at: Date!
    attachment_type:String
    userId: [ID!]!
    }
    
  input UpdateJournalInput {
    description: String
    published_at: Date
    attachment_value: String
    attachment_type: String
    userId: [ID!]
    }
   type OptionalJournal{
    journal_id: ID!
    description: String
    attachment_type: String
    attachment_value: String
    teacher_id: ID
    published_at: Date
    userId: [ID!]
    } 
  type Mutation {
   """
    \
    Creates a new user \n
    example: \n
    \        createUser(input:{name:"siddu",email:"siddu@gmail.com",password:"siddu",type:STUDENT}) \n
    returns user
    """
    createUser(input: CreateUserInput!): User!
    
    """
    \
    Creates a new journal \n
    example: \n
    \         createJournal(input:{description:"hello",published_at:"2021-05-05",userId:[1,2]}) \n
    returns journal
    """
    createJournal(input:CreateJournalInput!,file:Upload): Journal!
    
    """
    \
    Deletes a journal by id \n
    example: \n
    deleteJournal(journal_id:1) \n
    returns journal_id
    """
    deleteJournal(journal_id:ID!): ID!

    """
    \
    Updates a journal by id \n
    example: \n
    \       updateJournal(journal_id:1,input:{description:"hello",published_at:"2021-05-05",userId:[1,2]}) \n
    returns journal
    """

    updateJournal(journal_id:ID!,input:UpdateJournalInput!): OptionalJournal!
  }
`;
// module.exports = { typeDefs };
