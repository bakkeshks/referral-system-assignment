import react from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { useNavigate } from "react-router-dom";
import Table from "react-bootstrap/Table";
import Pagination from "react-bootstrap/Pagination";

const Dashboard = () => {
  const navigate = useNavigate();
  const [referralCount, setReferralCount] = useState(0);
  const [referralCode, setReferralCode] = useState("");
  const [referredUsers, setReferredUsers] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5);

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = referredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const goToNextPage = () => {
    if (currentPage < Math.ceil(referredUsers.length / usersPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/signin");
    }
  }, [navigate]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = JSON.parse(atob(token.split(".")[1])).id;

    axios
      .get(
        `https://referral-system-assignment.onrender.com/user/${userId}/user-details`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        const { referralCount, referralCode, referredUsers } = response.data;
        console.log(referralCount, referralCode, referredUsers);
        setReferralCount(response.data.referralCount);
        setReferralCode(response.data.referralCode);
        setReferredUsers(response.data.referredUsers);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [navigate]);

  const [topReferrers, setTopReferrers] = useState([]);
  const [token, setToken] = useState("");
  useEffect(() => {
    const fetchTopReferrers = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await axios.get(
          "https://referral-system-assignment.onrender.com/user/get-top-referrers",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setTopReferrers(response.data.data);
        console.log(response.data.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchTopReferrers();
  }, [token]);

  return (
    <>
      <Navbar bg="dark" variant="dark" className="fixed-top">
        <Container>
          <Navbar.Brand href="#home">Referral System</Navbar.Brand>
          <Nav className="ms-auto gap-3">
            <Nav.Link>Referral Code: {referralCode}</Nav.Link>
            <Nav.Link> Referral Count: {referralCount}</Nav.Link>
            <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      <div className="container-fluid">
        <div className="row" style={{ marginTop: "-250px" }}>
          <div className="col-md-6">
            <div>
              <h4>Top 5 Referrers </h4>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Username</th>
                    <th>Referral Count</th>
                  </tr>
                </thead>
                <tbody>
                  {topReferrers.map((user, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{user.username}</td>
                      <td>{user.referralCount}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </div>

          <div className="col-md-4 ">
            <h4 style={{ textAlign: "center" }}>Referred Users: </h4>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>SL No.</th>
                  <th>Username</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user, index) => (
                  <tr key={user._id}>
                    <td>{indexOfFirstUser + index + 1}</td>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <nav aria-label="Page navigation">
              <ul className="pagination">
                <li
                  className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                >
                  <a className="page-link" href="#" onClick={goToPreviousPage}>
                    Previous
                  </a>
                </li>
                <li
                  className={`page-item ${
                    currentPage ===
                    Math.ceil(referredUsers.length / usersPerPage)
                      ? "disabled"
                      : ""
                  }`}
                >
                  <a className="page-link" href="#" onClick={goToNextPage}>
                    Next
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
