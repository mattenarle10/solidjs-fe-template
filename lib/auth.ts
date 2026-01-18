import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserPool,
  type CognitoUserSession,
} from "amazon-cognito-identity-js";
import { env } from "./env";

const userPool = new CognitoUserPool({
  UserPoolId: env.COGNITO_USER_POOL_ID,
  ClientId: env.COGNITO_CLIENT_ID,
});

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthTokens {
  idToken: string;
  accessToken: string;
  refreshToken: string;
}

export function signIn(credentials: LoginCredentials): Promise<AuthTokens> {
  return new Promise((resolve, reject) => {
    const authDetails = new AuthenticationDetails({
      Username: credentials.email,
      Password: credentials.password,
    });

    const cognitoUser = new CognitoUser({
      Username: credentials.email,
      Pool: userPool,
    });

    cognitoUser.authenticateUser(authDetails, {
      onSuccess: (session: CognitoUserSession) => {
        resolve({
          idToken: session.getIdToken().getJwtToken(),
          accessToken: session.getAccessToken().getJwtToken(),
          refreshToken: session.getRefreshToken().getToken(),
        });
      },
      onFailure: (err) => {
        reject(err);
      },
      newPasswordRequired: () => {
        reject(new Error("New password required - please contact admin"));
      },
    });
  });
}

export function signOut(): Promise<void> {
  return new Promise((resolve) => {
    const cognitoUser = userPool.getCurrentUser();
    if (cognitoUser) {
      cognitoUser.signOut();
    }
    resolve();
  });
}

export function getCurrentSession(): Promise<CognitoUserSession | null> {
  return new Promise((resolve) => {
    const cognitoUser = userPool.getCurrentUser();
    if (!cognitoUser) {
      resolve(null);
      return;
    }

    cognitoUser.getSession(
      (err: Error | null, session: CognitoUserSession | null) => {
        if (err || !session || !session.isValid()) {
          resolve(null);
          return;
        }
        resolve(session);
      },
    );
  });
}

export function getIdToken(): Promise<string | null> {
  return getCurrentSession().then((session) =>
    session ? session.getIdToken().getJwtToken() : null,
  );
}
