import React, { Component } from "react";
import { Table, Button } from "semantic-ui-react";
import Campaign from "../ethereum/campaign";
import web3 from "../ethereum/web3";

export class RequestRow extends Component {
	onApprove = async () => {
		const campaign = Campaign(this.props.address);
		const accounts = await web3.eth.getAccounts();
		await campaign.methods.approveRequest(this.props.id).send({
			from: accounts[0]
		});
	};
	onFinalize = async () => {
		const campaign = Campaign(this.props.address);
		const accounts = await web3.eth.getAccounts();
		await campaign.methods.finalizeRequest(this.props.id).send({
			from: accounts[0]
		});
	};
	render() {
		const { request, address, id, approversCount } = this.props;
		const { description, value, recipient, approvalCount, complete } = request;
		const readyToFinalize = request.approvalCount > approversCount / 2;

		const { Row, Cell } = Table;

		return (
			<Row disabled={complete} positive={readyToFinalize && !request.complete}>
				<Cell>{id}</Cell>
				<Cell>{description}</Cell>
				<Cell>{web3.utils.fromWei(value, "ether")}</Cell>
				<Cell>{recipient}</Cell>

				<Cell>
					{approvalCount}/{approversCount}
				</Cell>
				<Cell>
					{complete ? null : (
						<Button onClick={this.onApprove} color="green" basic>
							Approve
						</Button>
					)}
				</Cell>
				<Cell>
					{complete ? null : (
						<Button onClick={this.onFinalize} color="teal" basic>
							Finalize
						</Button>
					)}
				</Cell>
			</Row>
		);
	}
}

export default RequestRow;
