//passport authenication file
//require in the .env file
require('dotenv').config();
//require in passport
const mongoose = require('mongoose');
//import googleuser model
const GoogleUser = require('../../models/googleUserModel');
//require in googlestrategy

const GoogleStrategy = require('passport-google-oauth20').Strategy;

// passport.use(
//   new oauth(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID || '',
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
//       callbackURL: 'http://localhost:8080/api/google/callback',
//       passReqToCallback: true,
//     },
//     async function (
//       request: any,
//       accessToken: any,
//       refreshToken: any,
//       profile: any,
//       done: any
//     ) {
//       console.log('profile', profile);
//       done(null, profile);
//     }
//   )
// );
module.exports = function (passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: 'http://localhost:8080/api/google/callback',
        passReqToCallback: true,
      },
      async (
        request: any,
        accessToken: any,
        refreshToken: any,
        profile: any,
        done: any
      ) => {
        const newUser = {
          googleId: profile.id,
          displayName: profile.displayName,
          firstName: profile.name.givenName,
        };
        try {
          let gUser = await GoogleUser.findOne({ googleId: profile.id });
          if (gUser) {
            done(null, gUser);
          } else {
            gUser = await GoogleUser.create(newUser);
            done(null, gUser);
          }
        } catch (err) {
          console.error(err);
        }
      }
    )
  );

  // passport.use(
  //   new GoogleStrategy(
  //     {
  //       clientID: process.env.GOOGLE_CLIENT_ID || '',
  //       clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  //       callbackURL: 'http://localhost:8080/api/google/callback',
  //       passReqToCallback: true,
  //     },
  //     async function (
  //       accessToken: any,
  //       refreshToken: any,
  //       profile: any,
  //       done: any
  //     )

  //       console.log('user profile is: ', profile);
  //     }

  //   )
  // );

  // // used to serialize the user for the session
  passport.serializeUser(function (user: any, done: any) {
    done(null, user);
  });

  // used to deserialize the user
  passport.deserializeUser(function (user: any, done: any) {
    done(null, user);
  });
};
