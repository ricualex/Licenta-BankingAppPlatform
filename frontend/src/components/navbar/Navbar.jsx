import { Link, useMatch, useResolvedPath } from "react-router-dom";
import "./NavbarStyle.css";

export default function Navbar() {
  return (
    <div className="nav-wrapper">
      <nav className="nav">
        <Link to="/" className="site-title">
          {"Banking App"}
        </Link>
        <ul>
          <CustomLink to="/credits">Credits</CustomLink>
          <CustomLink to="/cards">Cards</CustomLink>
          <CustomLink to="/finance">Finance</CustomLink>
          <CustomLink to="/ibanking">InternetBanking</CustomLink>
        </ul>
      </nav>
    </div>
  )
}

function CustomLink({ to, children, ...props }) {
  const resolvedPath = useResolvedPath(to)
  const isActive = useMatch({ path: resolvedPath.pathname, end: true })

  return (
    <li className={isActive ? "active" : ""}>
      <Link to={to} {...props}>
        {children}
      </Link>
    </li>
  )
}
