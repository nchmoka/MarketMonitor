import React, { useState } from "react";
import { Table } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretUp, faCaretDown } from "@fortawesome/free-solid-svg-icons";
import PriceChart from "./PriceChart";
import Flag from "react-world-flags";

const companies = [
    {
        name: "Apple Inc.",
        logo: "https://logo.clearbit.com/apple.com",
        marketCap: "$2.4T",
        price: "$149.64",
        today: "+1.34%",
        price30Days: "+2.50%",
        country: "USA",
        countryCode: "US",
    },
    {
        name: "Microsoft",
        logo: "https://logo.clearbit.com/microsoft.com",
        marketCap: "$2.2T",
        price: "$294.30",
        today: "+0.86%",
        price30Days: "+1.50%",
        country: "USA",
        countryCode: "US",
    },
    {
        name: "Amazon",
        logo: "https://logo.clearbit.com/amazon.com",
        marketCap: "$1.7T",
        price: "$3,399.38",
        today: "+0.55%",
        price30Days: "+0.50%",
        country: "USA",
        countryCode: "US",
    },
];

const prices = [1.5, 2, 3, 5, 1.5, 6, 7, 8, 7, 9, 10];

const CompanyTable = () => {
    const [sortConfig, setSortConfig] = useState({
        key: null,
        direction: "asc",
    });

    const onSort = (key) => {
        let direction = "asc"; // ascending order
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
    };

    const sortedCompanies = [...companies]
        .sort((a, b) => {
            const marketCapA = parseFloat(
                a.marketCap.replace(/[^0-9.-]+/g, "")
            );
            const marketCapB = parseFloat(
                b.marketCap.replace(/[^0-9.-]+/g, "")
            );
            return marketCapB - marketCapA;
        })
        .map((company, index) => ({ ...company, rank: index + 1 }));

    if (sortConfig.key) {
        sortedCompanies.sort((a, b) => {
            const valueA = a[sortConfig.key];
            const valueB = b[sortConfig.key];

            if (sortConfig.key === "marketCap" || sortConfig.key === "price") {
                // Remove non-numeric characters for marketCap and price
                const numA = parseFloat(valueA.replace(/[^0-9.-]+/g, ""));
                const numB = parseFloat(valueB.replace(/[^0-9.-]+/g, ""));
                return (
                    (numA - numB) * (sortConfig.direction === "asc" ? 1 : -1)
                );
            }

            if (valueA < valueB) {
                return sortConfig.direction === "asc" ? -1 : 1;
            }
            if (valueA > valueB) {
                return sortConfig.direction === "asc" ? 1 : -1;
            }
            return 0;
        });
    }

    return (
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
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                }}
                            >
                                {key.charAt(0).toUpperCase() + key.slice(1)}
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        marginLeft: "5px",
                                    }}
                                >
                                    <FontAwesomeIcon
                                        icon={faCaretUp}
                                        style={{
                                            color:
                                                sortConfig.key === key &&
                                                sortConfig.direction === "asc"
                                                    ? "black"
                                                    : "lightgray",

                                            marginBottom: "-10px",
                                        }}
                                    />
                                    <FontAwesomeIcon
                                        icon={faCaretDown}
                                        style={{
                                            color:
                                                sortConfig.key === key &&
                                                sortConfig.direction === "desc"
                                                    ? "black"
                                                    : "lightgray",
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
                    const todayValue = parseFloat(
                        company.today.replace("%", "")
                    );
                    const todayClass =
                        todayValue > 0 ? "text-success" : "text-danger";
                    const todayIcon = todayValue > 0 ? faCaretUp : faCaretDown;

                    return (
                        <tr key={index}>
                            <td>{company.rank}</td>
                            <td>
                                <img
                                    src={company.logo}
                                    alt={company.name}
                                    style={{
                                        width: "20px",
                                        height: "20px",
                                        marginRight: "10px",
                                    }}
                                />
                                {company.name}
                            </td>
                            <td>{company.marketCap}</td>
                            <td>{company.price}</td>
                            <td className={todayClass}>
                                <FontAwesomeIcon
                                    icon={todayIcon}
                                    style={{ marginRight: "5px" }}
                                />
                                {company.today}
                            </td>
                            <td>
                                <PriceChart prices={prices} />
                            </td>
                            <td>
                                <Flag
                                    code={company.countryCode}
                                    style={{
                                        width: "20px",
                                        height: "15px",
                                        marginRight: "10px",
                                    }}
                                />
                                {company.country}
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </Table>
    );
};

export default CompanyTable;
