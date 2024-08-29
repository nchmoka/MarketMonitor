import React, { useState, useEffect } from "react";
import { Table, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretUp, faCaretDown } from "@fortawesome/free-solid-svg-icons";
import PriceChart from "./PriceChart";
import Flag from "react-world-flags";

const CompanyTable = () => {
    const [companies, setCompanies] = useState([]);
    const [sortConfig, setSortConfig] = useState({
        key: null,
        direction: "asc",
    });
    const [error, setError] = useState(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; // Define how many items per page

    useEffect(() => {
        const fetchCoinsFromServer = async () => {
            try {
                const response = await fetch('/api/stocks');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setCompanies(data);
                setError(null);
            } catch (error) {
                setError('Error fetching data from server: ' + error.message);
            }
        };

        fetchCoinsFromServer();
    }, []);

    const onSort = (key) => {
        let direction = "asc"; // ascending order
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
    };

    // Get the current page items
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = companies.slice(startIndex, startIndex + itemsPerPage);

    // Sort companies
    const sortedCompanies = [...currentItems].sort((a, b) => {
        if (sortConfig.key) {
            const valueA = a[sortConfig.key];
            const valueB = b[sortConfig.key];

            if (sortConfig.key === "marketCap" || sortConfig.key === "price") {
                const numA = parseFloat(valueA.replace(/[^0-9.-]+/g, ""));
                const numB = parseFloat(valueB.replace(/[^0-9.-]+/g, ""));
                return (numA - numB) * (sortConfig.direction === "asc" ? 1 : -1);
            }

            if (sortConfig.key === "today") {
                const numA = parseFloat(valueA.replace("%", ""));
                const numB = parseFloat(valueB.replace("%", ""));
                return (numA - numB) * (sortConfig.direction === "asc" ? 1 : -1);
            }

            if (valueA < valueB) {
                return sortConfig.direction === "asc" ? -1 : 1;
            }
            if (valueA > valueB) {
                return sortConfig.direction === "asc" ? 1 : -1;
            }
            return 0;
        }

        return 0;
    });

    const nextPage = () => {
        setCurrentPage((prevPage) => prevPage + 1);
    };

    const prevPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    };

    return (
        <>
            {error && <div className="alert alert-danger">{error}</div>}
            <Table bordered={false} hover responsive className="table-sm">
                <thead>
                    <tr>
                        {[
                            "rank",
                            "name",
                            "marketCap",
                            "price",
                            "today",
                            "Price (30 Days)",
                            "country",
                        ].map((key) => (
                            <th
                                key={key}
                                onClick={() => onSort(key)}
                                style={{ textAlign: "center" }}
                            >
                                <div style={{ display: "flex", alignItems: "center" }}>
                                    {key.charAt(0).toUpperCase() + key.slice(1)}
                                    <div style={{ display: "flex", flexDirection: "column", marginLeft: "5px" }}>
                                        <FontAwesomeIcon
                                            icon={faCaretUp}
                                            style={{
                                                color: sortConfig.key === key && sortConfig.direction === "asc" ? "black" : "lightgray",
                                                marginBottom: "-10px",
                                            }}
                                        />
                                        <FontAwesomeIcon
                                            icon={faCaretDown}
                                            style={{
                                                color: sortConfig.key === key && sortConfig.direction === "desc" ? "black" : "lightgray",
                                            }}
                                        />
                                    </div>
                                </div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {sortedCompanies.map((company, index) => {
                        const todayValue = parseFloat(company.today.replace("%", ""));
                        const todayClass = todayValue > 0 ? "text-success" : "text-danger";
                        const todayIcon = todayValue > 0 ? faCaretUp : faCaretDown;

                        return (
                            <tr key={index}>
                                <td>{company.rank}</td>
                                <td>
                                    <img
                                        src={company.logo}
                                        alt={company.name}
                                        style={{ width: "20px", height: "20px", marginRight: "10px" }}
                                    />
                                    {company.name}
                                </td>
                                <td>{company.marketCap}</td>
                                <td>{company.price}</td>
                                <td className={todayClass}>
                                    <FontAwesomeIcon icon={todayIcon} style={{ marginRight: "5px" }} />
                                    {company.today}
                                </td>
                                <td>
                                    <PriceChart prices={company.price30Days} />
                                </td>
                                <td>
                                    <Flag
                                        code={company.countryCode}
                                        style={{ width: "20px", height: "15px", marginRight: "10px" }}
                                    />
                                    {company.country}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </Table>
            {/* Pagination Controls */}
            <div className="d-flex justify-content-between">
                <Button
                    variant="outline-primary"
                    onClick={prevPage}
                    disabled={currentPage === 1}
                >
                    Previous
                </Button>
                <Button
                    variant="outline-primary"
                    onClick={nextPage}
                    disabled={startIndex + itemsPerPage >= companies.length}
                >
                    Next
                </Button>
            </div>
        </>
    );
};

export default CompanyTable;

