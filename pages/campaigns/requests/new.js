import React, { Component } from "react";
import { Button, Form, Input, Message } from "semantic-ui-react";
import web3 from "../../../ethereum/web3";
import Campaign from "../../../ethereum/campaign";
import { Link, Router } from "../../../routes";
import Layout from "../../../components/Layout";
export class RequestNew extends Component {
	state = {
		title: "",
		value: "",
		description: "",
		reciptient: "",
		loading: false,
		errorMessage: ""
	};
	static async getInitialProps(props) {
		const { address } = props.query;

		return { address };
	}

	onSubmit = async (event) => {
		event.preventDefault();

		const campaign = Campaign(this.props.address);
		const { value, description, recipient } = this.state;
		console.log({ campaign, value, description, recipient });

		this.setState({ loading: true, errorMessage: "" });
		console.log("HERRE");
		try {
			const accounts = await web3.eth.getAccounts();
			console.log({
				accounts
			});
			await campaign.methods
				.createRequest(description, web3.utils.toWei(value, "ether"), recipient)
				.send({
					from: accounts[0]
				});
		} catch (error) {
			this.setState({ errorMessage: error.message });
		}
		this.setState({ loading: false });
	};

	render() {
		const { value, description, recipient, errorMessage, loading } = this.state;

		return (
			<Layout>
				<Link route={`/campaigns/${this.props.address}/requests`}>
					<a>Back</a>
				</Link>
				<Form onSubmit={this.onSubmit} error={Boolean(this.state.errorMessage)}>
					<h3>Create a Request</h3>
					<Form.Field>
						<label> Description</label>
						<Input
							value={description}
							onChange={(e) => this.setState({ description: e.target.value })}
						/>
					</Form.Field>
					<Form.Field>
						<label> Value in Ether</label>
						<Input
							label="ether"
							labelPosition="right"
							value={value}
							onChange={(e) => this.setState({ value: e.target.value })}
						/>
					</Form.Field>
					<Form.Field>
						<label> Recipient</label>
						<Input
							value={recipient}
							onChange={(e) => this.setState({ recipient: e.target.value })}
						/>
					</Form.Field>
					<Message error header="Oops!" content={errorMessage} />
					<Button primary loading={loading}>
						Create !
					</Button>
				</Form>
			</Layout>
		);
	}
}

export default RequestNew;
