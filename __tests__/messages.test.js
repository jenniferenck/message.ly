// May need to authenticate before allowing access
beforeEach(async () => {
  const hashedPassword = await bcrypt.hash('secret', 1);
  let result = await db.query(
    `INSERT INTO users (username, password, first_name, last_name, phone)
      VALUES ('test', $1, 'John', 'Smith', '555-555-5555')`,
    [hashedPassword]
  );

  const response = await request(app)
    .post('/login')
    .send({
      username: 'test',
      password: 'secret'
    });

  // Store current user for future requests
  user = result.rows[0];

  // Store token for future requests
  user.token = response.body.token;
});
