import { useState } from "react";
import PropTypes from "prop-types";

import loginService from "./../services/login";
import notesService from "./../services/notes";

function LoginForm({ setErrorMessage, setUser }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (ev) => {
    ev.preventDefault();
    // console.log(`logged with: ${username} ${password}`);

    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem("loggedNoteAppUser", JSON.stringify(user));
      notesService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
    } catch (error) {
      setErrorMessage("Wrong Credentials");
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
      setUsername("");
      setPassword("");
    }
  };
  return (
    <div>
      <h2>Login</h2>
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
    </div>
  );
}

LoginForm.propTypes = {
  setErrorMessage: PropTypes.string.isRequired,
  setUser: PropTypes.string.isRequired,
};
export default LoginForm;
