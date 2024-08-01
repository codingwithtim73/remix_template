import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";
import { Strategy as AppleStrategy } from "passport-apple";
import { Strategy as LinkedInStrategy } from "passport-linkedin-oauth2";
import { Strategy as GitHubStrategy } from "passport-github2";
import { Strategy as DiscordStrategy } from "passport-discord";
import dotenv from "dotenv";
import User from "./models/User.js"; // Adjust the path according to your project structure

dotenv.config();

const strategies = [
  {
    Strategy: GoogleStrategy,
    name: "google",
    options: {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BASE_URL}:${process.env.PORT}/auth/google/callback`,
    },
    profileParser: (profile) => ({
      providerId: profile.id,
      email: profile.emails[0].value,
      firstName: profile.name.givenName,
      lastName: profile.name.familyName,
      profilePicture: profile.photos[0].value,
      profile,
    }),
  },
  {
    Strategy: FacebookStrategy,
    name: "facebook",
    options: {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: `${process.env.BASE_URL}:${process.env.PORT}/auth/facebook/callback`,
      profileFields: ["id", "emails", "name", "picture.type(large)"],
    },
    profileParser: (profile) => ({
      providerId: profile.id,
      email: profile.emails[0].value,
      firstName: profile.name.givenName,
      lastName: profile.name.familyName,
      profilePicture: profile.photos ? profile.photos[0].value : null,
      profile,
    }),
  },
  {
    Strategy: AppleStrategy,
    name: "apple",
    options: {
      clientID: process.env.APPLE_CLIENT_ID,
      teamID: process.env.APPLE_TEAM_ID,
      callbackURL: `${process.env.BASE_URL}:${process.env.PORT}/auth/apple/callback`,
      keyID: process.env.APPLE_KEY_ID,
      privateKeyString: process.env.APPLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    },
    profileParser: (profile) => ({
      providerId: profile.id,
      email: profile.email,
      firstName: profile.name ? profile.name.firstName : null,
      lastName: profile.name ? profile.name.lastName : null,
      profilePicture: null,
      profile,
    }),
  },
  {
    Strategy: LinkedInStrategy,
    name: "linkedin",
    options: {
      clientID: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
      callbackURL: `${process.env.BASE_URL}:${process.env.PORT}/auth/linkedin/callback`,
      scope: ["r_emailaddress", "r_liteprofile"],
    },
    profileParser: (profile) => ({
      providerId: profile.id,
      email: profile.emails[0].value,
      firstName: profile.name.givenName,
      lastName: profile.name.familyName,
      profilePicture: profile.photos.length ? profile.photos[0].value : null,
      profile,
    }),
  },
  {
    Strategy: GitHubStrategy,
    name: "github",
    options: {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: `${process.env.BASE_URL}:${process.env.PORT}/auth/github/callback`,
    },
    profileParser: (profile) => ({
      providerId: profile.id,
      email: profile.emails[0].value,
      username: profile.username,
      profilePicture: profile.photos.length ? profile.photos[0].value : null,
      profile,
    }),
  },
  {
    Strategy: DiscordStrategy,
    name: "discord",
    options: {
      clientID: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      callbackURL: `${process.env.BASE_URL}:${process.env.PORT}/auth/discord/callback`,
      scope: ["identify", "email"],
    },
    profileParser: (profile) => ({
      providerId: profile.id,
      email: profile.email,
      username: profile.username,
      profilePicture: profile.avatar
        ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`
        : null,
      profile,
    }),
  },
];

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

strategies.forEach(({ Strategy, name, options, profileParser }) => {
  passport.use(
    new Strategy(options, async (accessToken, refreshToken, profile, done) => {
      try {
        const {
          providerId,
          email,
          firstName,
          lastName,
          username,
          profilePicture,
          profile: fullProfile,
        } = profileParser(profile);

        // Check if the user exists by email
        const user = await User.findOne({ email });

        if (user) {
          // If the user exists and the provider is different, reject the login
          const providerExists = user.providers.some(
            (provider) =>
              provider.providerName === name &&
              provider.providerId === providerId
          );

          if (!providerExists) {
            const capitalizedProviderName = capitalizeFirstLetter(
              user.providers[0].providerName
            );
            return done(null, false, {
              message: `Email is already associated with another provider: ${capitalizedProviderName}.`,
            });
          }
          // If the provider exists, log in the user
          return done(null, user);
        } else {
          // Create a new user if they don't exist
          const newUser = new User({
            email,
            firstName,
            lastName,
            username,
            profilePicture,
            providers: [
              { providerName: name, providerId, profile: fullProfile },
            ],
          });
          await newUser.save();
          return done(null, newUser);
        }
      } catch (err) {
        return done(err, false);
      }
    })
  );
});

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

export default passport;
