import { Link } from "../../../routes";
import React, { Component } from "react";
import { Button, Table } from "semantic-ui-react";
import Layout from "../../../components/Layout";
import Campaign from "../../../ethereum/campaign";
import RequestRow from "../../../components/RequestRow";

class RequestIndex extends Component {
	static async getInitialProps(props) {
		const { address } = props.query;

		const campaign = Campaign(address);
		const approversCount = await campaign.methods.approversCount().call();

		// In  order to retrieve all campaign requests, currently (in this solidty version) we can't
		// create a function to getRequests cause we cannot create an array of Struct
		// so we have to :

		// 1- Get the total number of request to a campaign
		const requestCount = await campaign.methods.getRequestsCount().call();

		// 2- base of requestCount create a array and iterate to fetch all campaign requests
		const requests = await Promise.all(
			Array(parseInt(requestCount))
				.fill()
				.map((element, index) => {
					return campaign.methods.requests(index).call();
				})
		);
		return { address, requests, requestCount, approversCount };
	}
	renderRows() {
		const { requests, address, approversCount } = this.props;
		return requests.map((request, index) => (
			<RequestRow
				key={index}
				id={index}
				request={request}
				address={address}
				approversCount={approversCount}
			/>
		));
	}
	render() {
		const { requestCount, requests, address } = this.props;
		console.log({ requests, requestCount });

		const { Header, Row, Body, HeaderCell } = Table;
		return (
			<Layout>
				<h3>Request List</h3>
				<Link route={`/campaigns/${address}/requests/new`}>
					<a href="">
						<Button primary floated="right" style={{ marginBottom: 10 }}>
							Add Request
						</Button>
					</a>
				</Link>
				<Table>
					<Header>
						<Row>
							<HeaderCell>Id</HeaderCell>
							<HeaderCell>Description </HeaderCell>
							<HeaderCell>Amount</HeaderCell>
							<HeaderCell>Recipient</HeaderCell>
							<HeaderCell>Approval</HeaderCell>
							<HeaderCell>Approve</HeaderCell>
							<HeaderCell>Finalize</HeaderCell>
						</Row>
					</Header>
					<Body>{this.renderRows()}</Body>
				</Table>
				<div>Found: {requestCount} requests</div>
			</Layout>
		);
	}
}

export default RequestIndex;
