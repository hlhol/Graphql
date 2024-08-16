// query.js

export const USER_ID_QUERY = `
  query {
    user {
      id
    }
  }
`;

export const GET_USER_DETAILS = `
  query GetUserDetails($userID: Int!) {
    user(where: { id: { _eq: $userID } }) {
      login
      email
      firstName
      campus
    }
  }
`;

export const GET_AUDIT_DONE = `
  query GetAuditDone($userID: Int!) { 
    audit(where: { 
      auditorId: { _eq: $userID }, 
      grade: { _gte: 1 } 
    }) {	
      grade
    }	
    user(where: { id: { _eq: $userID } }) {
      auditRatio
    } 
  }
`;

export const GET_AUDIT_FAILED = `
  query GetAuditFailed($userID: Int!) { 
    audit(where: { 
      auditorId: { _eq: $userID }, 
      grade: { _lt: 1 } 
    }) {	
      grade
    }	
  }
`;

export const TransactionQuery = `
  query Transaction($userID: Int!) {
    transaction(
      where: { eventId: { _eq: 20 }, userId: { _eq: $userID }, type: { _eq: "xp" } }
      order_by: { createdAt: desc }
    ) {
      amount
      createdAt
      path
    }
  }
`;

