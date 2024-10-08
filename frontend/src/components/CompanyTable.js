import React, { useState, useEffect } from "react";
import { Table, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretUp, faCaretDown } from "@fortawesome/free-solid-svg-icons";
import PriceChart from "./PriceChart";
import Flag from "react-world-flags";

const CompanyTable = () => {
    const [companies, setCompanies] = useState([]);
    const [totalMarketCap, setTotalMarketCap] = useState(0);
    const [sortConfig, setSortConfig] = useState({
        key: null,
        direction: "asc",
    });
    const [error, setError] = useState(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        const fetchCoinsFromServer = async () => {
            try {
                const response = await fetch('/api/stocks');
                if (!response.ok) {
                    throw new Error('stocks didnt fetched because of free api limit, try again later');
                }
                const data = await response.json();

                // Check if data is valid and non-empty
                if (Array.isArray(data) && data.length > 0) {
                    setCompanies(data);
                    setError(null);

                    // Calculate total market cap with validation
                    const totalCap = data.reduce((total, company) => {
                        const marketCapValue = company.marketCap
                            ? parseFloat(company.marketCap.replace(/[^0-9.-]+/g, ""))
                            : 0;
                        return total + (isNaN(marketCapValue) ? 0 : marketCapValue);
                    }, 0);
                    setTotalMarketCap(totalCap);
                } else {
                    throw new Error('No valid data received from server');
                }
            } catch (error) {
                setError('Error fetching data from server: ' + error.message);
            }
        };

        fetchCoinsFromServer();
    }, []);

    const onSort = (key) => {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
    };

    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = companies.slice(startIndex, startIndex + itemsPerPage);

    const sortedCompanies = [...currentItems].sort((a, b) => {
        if (sortConfig.key) {
            const valueA = a[sortConfig.key] || ""; // Add default empty string if missing
            const valueB = b[sortConfig.key] || ""; 

            if (sortConfig.key === "marketCap" || sortConfig.key === "price") {
                const numA = parseFloat(valueA.replace(/[^0-9.-]+/g, "")) || 0;
                const numB = parseFloat(valueB.replace(/[^0-9.-]+/g, "")) || 0;
                return (numA - numB) * (sortConfig.direction === "asc" ? 1 : -1);
            }

            if (sortConfig.key === "today") {
                const numA = parseFloat(valueA.replace("%", "")) || 0;
                const numB = parseFloat(valueB.replace("%", "")) || 0;
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

            {/* Display total market cap and number of companies */}
            <div className="mb-3" style={{ textAlign: "center" }}>
                <p>Number of Companies: {companies.length}, Total Market Cap: ${totalMarketCap.toLocaleString()}</p>
            </div>

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
                        const todayValue = company.today
                            ? parseFloat(company.today.replace("%", "")) || 0
                            : 0;
                        const todayClass = todayValue > 0 ? "text-success" : "text-danger";
                        const todayIcon = todayValue > 0 ? faCaretUp : faCaretDown;

                        return (
                            <tr key={index}>
                                <td>{company.rank || 'N/A'}</td>
                                <td>
                                    <img
                                        src={company.logo || '/default-logo.png'}
                                        alt={company.name || 'Unknown'}
                                        style={{ width: "20px", height: "20px", marginRight: "10px" }}
                                    />
                                    {company.name || 'N/A'}
                                </td>
                                <td>{company.marketCap || 'N/A'}</td>
                                <td>{company.price || 'N/A'}</td>
                                <td className={todayClass}>
                                    <FontAwesomeIcon icon={todayIcon} style={{ marginRight: "5px" }} />
                                    {company.today || '0%'}
                                </td>
                                <td>
                                    {company.price30Days ? (
                                        <PriceChart prices={company.price30Days} />
                                    ) : (
                                        'No data'
                                    )}
                                </td>
                                <td>
                                    <Flag
                                        code={company.countryCode || 'US'}
                                        style={{ width: "20px", height: "15px", marginRight: "10px" }}
                                    />
                                    {company.country || 'Unknown'}
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