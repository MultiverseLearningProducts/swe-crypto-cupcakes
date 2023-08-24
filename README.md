# SWE Crypto Cupcakes

This branch removes some of the work we did last time: we no longer have `/user`
endpoints for signing up, logging in, or logging out. These are now provided by
the Auth0 SDK `express-openid-connect`. This refactor should allow us to sign in
with Google, and benefit from all the goodness Auth0 provides: user management
database, account merging, premade middleware and UI, no-hassle security updates
and a team of security experts monitoring the landscape at all times.

The past two sessions have been quite heavy - lots of manually handling tokens
etc. This session should feel like a bit of a relief because Auth0 handles a lot
of the difficulty for us.

## Coach notes

In `app.js`, you will notice a new `config` object: this is for Auth0.

```js
const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env['TOKEN_SECRET'],
  baseURL: 'http://localhost:4000',
  clientID: 'r6k6Qugzo6DmFAuSjjmwtkiE9WlexKzr',
  issuerBaseURL: 'https://dev-kqcvt5qlx045drmf.us.auth0.com'
}
```

Whlist the app would probably work on your machine, you wouldn't be able to go
to Auth0 and show the new user being added to the user management dashboard,
because the client id and issuer base url are registered to
kathleen.law@multiverse.io. It would be a great idea to get hold of your own
values for these by setting up your own Auth0 account and making a SWE Crypto Cupcakes
application - follow the tutorial for an Express.js traditional web app to see
how the whole process works.

## Things to see and do

### Auth0 website

Take a look at the website and the documentation. Take a look at how the steps
have been implemented:

- `"express-openid-connect": "^2.16.0"` is the SDK in `package.json`
- the config object in `app.js`
- `app.use(auth(config))` to create the routes (n.b. this should be done before
  other route handlers are registered)
- the `requiresAuth()` middleware on endpoints in various routes
- the `req.oidc.user` object in the `/user` router

### Config

Notice that we still need a secret to give to the Auth0 config. Why is this?
What is it for?

What is the client id?

What is the difference between the base url and the issuer base url?

### Protected endpoints

Run the app with `npm run dev` and try visiting `/cupcakes`. What happens? How is
this related to the fact that

```js
app.use(auth(config))
```

is registered _before_

```js
app.use('/cupcakes', routes.cupcake)
```

in `app.js`?

### Create an account

Try making an email/password account. Try making one with a third party
provider.

Notice that signing up also logs you in, which is a much better UX.

Take a look at the user management in Auth0.

## Next steps

Auth0 have SDKs for most languages/frameworks
[here](https://auth0.com/docs/quickstart/webapp#webapp). Auth0 provide solutions
for pure APIs, web apps, SPAs and mobile apps. The pure API solution is
essentially a reimplementation of the JWT flow we have already done, and isn't
the best way to get OIDC working. We strongly recommend following the tutorial
for "traditional web app" - as a bonus, it comes with a "Login with Google"
integration by default (this hasn't been tested on all languages, though - some
additional setup could be needed for this).

The Auth0 docs are really strong, and there are sample projects available.

### Extension

There should be plenty to be getting on with, but you could challenge
apprentices to add "sign in with Github" to their Auth0 solution.

Could they use the access token to read some protected information from their
Google or Github account? (They may need to add scopes!)
