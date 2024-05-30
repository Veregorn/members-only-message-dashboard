// Import passport for authentication
const passport = require('passport');
// Import passport-local for local strategy
const LocalStrategy = require('passport-local').Strategy;
// Import User model
const User = require('./models/user');
// Import bcrypt for password hashing
const bcrypt = require('bcryptjs');

// Set up passport-local strategy with User model (called by passport.authenticate)
passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await User.findOne({ username: username });
        if (!user) {
          return done(null, false, { message: 'Incorrect username' });
        };
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
          return done(null, false, { message: 'Incorrect password' });
        };
        return done(null, user);
      } catch (err) {
        return done(err);
      };
    })
  );

// Serialize user for session management (called by passport.session)
passport.serializeUser((user, done) => {
    done(null, user.id); // Use user.id as session key (provided by MongoDB)
});
  
// Deserialize user for session management (called by passport.session)
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err);
    };
});

module.exports = passport;