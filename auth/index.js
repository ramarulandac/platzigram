var LocalStrategy = require('passport-local').Strategy
var FacebookStrategy = require('passport-facebook').Strategy
var platzigram = require('platzigram-client')
var jwt = require('jsonwebtoken')
var config = require('../config')

var client = platzigram.createClient(config.client)

exports.localStrategy = new LocalStrategy((username, password, done) => {
  //  done callback --> used to finish the authentication OK or KO
  client.auth(username, password, (err, token) => {
    if (err) {
      return done(null, false, {message: 'username and password not found'})
    }
    //  getting the whole user by name
    client.getUser(username, (err, user) => {
      if (err) {
        return done(null, false, { message: `an error ocurred: ${err.message}`})
      }
      user.token = token
      return done(null, user)
    })
  })
})

//  Facebook authentication Strategy
exports.facebookStrategy = new FacebookStrategy({
  clientID: config.auth.facebook.clientID,
  clientSecret: config.auth.facebook.clientSecret,
  callbackURL: config.auth.facebook.callbackURL,
  enableProof: true,
  profileFields: ['id', 'displayName', 'email']
  //  accessToken to authenticate user
  // refreshToken to ask a new token by user
}, function (accessToken, refreshToken, profile, done) {
  var userProfile = {
    username: profile._json.id,
    name: profile._json.name,
    email: profile._json.email,
    facebook: true
  }


  findOrCreate(userProfile, (err, user) => {
    if (err) return done(err)
  //  ------------User token creation
    jwt.sign({ userId: user.username}, config.secret, {}, (e, token) => {
      if (e) return done(e)

      user.token = token

      return done(null, user)
    })
  })

  function findOrCreate (user, callback) {
    client.getUser(user.username, (err, usr) => {
      if (err) {
        return client.saveUser(user, callback)
      }

      callback(null, usr)
    })
  }
})

//  Serializer gets the whole user and takes just session data
exports.serializeUser = function (user, done) {
  done(null, {
    username: user.username,
    token: user.token
  })
}
//  from
exports.deserializeUser = function (user, done) {

    client.getUser(user.username, (err, usr) => {
      if (err) return done(err)
      usr.token = user.token
      done(null, usr)
  })
}
