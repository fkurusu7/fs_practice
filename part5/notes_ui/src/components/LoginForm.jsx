function LoginForm({
  handleLogin,
  setUsername,
  username,
  setPassword,
  password,
}) {
  return (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          type="text"
          name="Username"
          value={username}
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="password"
          name="Password"
          value={password}
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  );
}

export default LoginForm;
