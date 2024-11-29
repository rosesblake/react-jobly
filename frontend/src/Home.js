import { Link } from "react-router-dom";

function Home({ token, currUser }) {
  return (
    <div>
      <h1>Jobly</h1>
      <p>All the jobs in one, convenient place.</p>

      {!token ? (
        <div>
          <Link to={"/login"}>
            <button>Log In</button>
          </Link>
          <Link to={"/signup"}>
            <button>Sign Up</button>
          </Link>
        </div>
      ) : (
        <div>
          <p>Welcome Back! {currUser.username}</p>
        </div>
      )}
    </div>
  );
}

export default Home;
