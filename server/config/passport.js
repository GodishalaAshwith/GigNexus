const passport = require('passport');
const User = require('../models/User');

// Only configure OAuth strategies if environment variables are set
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  const GitHubStrategy = require('passport-github2').Strategy;
  
  // GitHub Strategy
  passport.use(new GitHubStrategy({
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: `${process.env.API_URL}/api/auth/github/callback`
    },
    async function(accessToken, refreshToken, profile, done) {
      try {
        let user = await User.findOne({ 
          oauthProvider: 'github',
          oauthId: profile.id
        });

        if (!user) {
          user = new User({
            email: profile.emails[0].value,
            oauthProvider: 'github',
            oauthId: profile.id,
            role: 'freelancer', // Default role for GitHub users
            profile: {
              name: profile.displayName || profile.username,
              avatar: profile.photos[0].value,
              bio: profile._json.bio
            }
          });
          await user.save();
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  ));
}

// Only configure LinkedIn strategy if environment variables are set
if (process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_SECRET) {
  const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
  
  // LinkedIn Strategy
  passport.use(new LinkedInStrategy({
      clientID: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
      callbackURL: `${process.env.API_URL}/api/auth/linkedin/callback`,
      scope: ['r_emailaddress', 'r_liteprofile']
    },
    async function(accessToken, refreshToken, profile, done) {
      try {
        let user = await User.findOne({ 
          oauthProvider: 'linkedin',
          oauthId: profile.id
        });

        if (!user) {
          user = new User({
            email: profile.emails[0].value,
            oauthProvider: 'linkedin',
            oauthId: profile.id,
            role: 'business', // Default role for LinkedIn users
            profile: {
              name: profile.displayName,
              avatar: profile.photos[0].value,
              companyName: profile._json.positions?.values?.[0]?.company?.name
            }
          });
          await user.save();
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  ));
}
