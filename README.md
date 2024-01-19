# SWE Crypto Cupcakes

This branch deals with two security measures:

- encrypting the cupcake instructions
- creating user accounts

We have also refactored into separate routes for readability.

## Coach notes

The big concepts at play are

- [encryption](https://mv-swe-docs.netlify.app/backend/encryption)
- [hashing](https://mv-swe-docs.netlify.app/backend/hashing)
- the [basic auth](https://mv-swe-docs.netlify.app/backend/basic-auth.html)
  protocol

The primers linked to above are designed for colleagues to brush up on the
details, but it's fine to share them with apprentices to if you think they would
appreciate any of the details.

## Things to see and do

### encrypt.js

In `utils/encrypt.js` we can see the helper functions which encrypt and decrypt
data. There's quite a lot going on here and apprentices might want to search for
something simpler but less secure.

In order to use the functions, you will need to generate a 32-byte key. Recall
that **1 byte = 8 bits**, so 32 bytes is 256 bits, as required by the SHA256
algorithm that AES is based on. The function expects these 32 bytes as hex.

```bash
openssl rand -hex 32
```

would give us

```bash
df11c0c1d288a5dd9fc5e1aa0b06cca0b591244e8f033d47f23130dd2ac2c2a3
```

(You will notice that this is 64 characters long: 1 byte in hex is represented
by a pair of characters.)

Save your key in the `.env` file, then you can add some code to `encrypt.js`

```js
const text = 'Hello, world!'
const encrypted = encrypt(text)
const decrypted = decrypt(encrypted)

console.log(encrypted)
console.log(decrypted)
```

to demonstrate it. It is worth talking about why we put this in a `.env` file
and let them see you doing this step.

### Encrypting user data

In `cupcake.js` we can see that new instructions are now being encrypted!

In `seedData.json` we can also see that the instructions in the seed data are encrypted as well!

Try adding `console.log` in the `POST /cupcakes` endpoint so you can see the data
which actually gets stored, then try:

```bash
curl -v -XPOST \
-H "Content-type: application/json" \
-d '{ "flavor" : "marble", "instructions" : "freeze for 24 hours beforehand" }' \
'http://localhost:4000/cupcakes' | json_pp
```

Notice that the data is encrypted in the data store, but decrypted before being
returned by the API.

### Creating a user

To create a user, hit

```bash
curl -v -XPOST \
-H 'Authorization: Basic dGVzdEB1c2VyLmNvbTpwYXNzd29yZDEyMw==' \
'http://localhost:4000/users' | json_pp
```

Note that `dGVzdEB1c2VyLmNvbTpwYXNzd29yZDEyMw==` is the Base 64 encoding of the
string `'test@user.com:password123'`. This is the standard way of sending
credentials with basic auth. See
[basic auth](https://mv-swe-docs.netlify.app/backend/basic-auth.html) for more
information.

You could add a `console.log(users)` in this endpoint to verify that the
password gets hashed and salted.

### basicAuth

Take a look at the `basicAuth.js` middleware. It parses out the credentials from
the auth header and saves them in the `req` object for use by other
middleware/controllers.

This is implemented in the `GET /users` endpoint, which checks the password
against the stored value before sending back the user's data. We can say that
the `GET /users` endpoint is password protected.

Try accessing it with the header (you need to `POST` this user first!)

```bash
curl -v -XGET \
-H 'Authorization: Basic dGVzdEB1c2VyLmNvbTpwYXNzd29yZDEyMw==' \
'http://localhost:4000/users' | json_pp
```

without the header

```bash
curl -v -XGET \
'http://localhost:4000/users' | json_pp
```

or with the wrong password

```bash
curl -v -XGET \
-H 'Authorization: Basic dGVzdEB1c2VyLmNvbTpwYXNzd29yZDEyNA==' \
'http://localhost:4000/users' | json_pp
```

## Next steps

The apprentices are challenged to implement encryption and basic auth for
themselves. They will likely want to rely on libraries as much as possible: many
frameworks have canonical ways of doing these things which abstract much of the
complexity away. Encourage apprentices to go with the flow of what their
framework recommends. Express.js is very unopinionated so a lot of this feels
very manual, but there are libraries like `passport` which provide abstractions
and are well documented.

Apprentices shouldn't try to memorise what they've seen in the demo, but rather
use the documentation for their framework to implement the spec. Their
particular implementation might look very different and that is fine (encouraged
even!)
