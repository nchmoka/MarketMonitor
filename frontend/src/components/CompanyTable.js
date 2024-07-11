import { Table } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretUp, faCaretDown } from "@fortawesome/free-solid-svg-icons";
import Flag from "react-world-flags";

const companies = [
    {
        rank: 1,
        name: "Apple Inc.",
        logo: "https://logo.clearbit.com/apple.com",
        marketCap: "$2.4T",
        price: "$149.64",
        today: "+1.34%",
        price30Days: "+2.50%",
        country: "USA",
        countryCode: "US",
    },
    // add more companies here
    {
        rank: 2,
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
        rank: 3,
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

const CompanyTable = () => {
    return (
        <Table bordered={false} hover responsive className="table-sm">
            <thead>
                <tr>
                    <th>Rank</th>
                    <th>Name</th>
                    <th>Market Cap</th>
                    <th>Price</th>
                    <th>Today</th>
                    <th>Price (30 Days)</th>
                    <th>Country</th>
                </tr>
            </thead>
            <tbody>
                {companies.map((company, index) => {
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
                            <td>{company.price30Days}</td>
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
