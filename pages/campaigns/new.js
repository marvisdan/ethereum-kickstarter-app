import React, { Component } from "react";
import { Button, Form, Input, Message } from "semantic-ui-react";
import Layout from "../../components/Layout";
import factory from "../../ethereum/factory";
import web3 from "../../ethereum/web3";

export class CampaignNew extends Component {
	state = {
		minimumContribution: "",
		errorMessage: "",
		loading: false
	};
	onSubmit = async (event) => {
		event.preventDefault();
		this.setState({ loading: true });
		this.setState({ errorMessage: "" });
		try {
			const accounts = await web3.eth.getAccounts();
			await factory.methods
				.createCampaign(this.state.minimumContribution)
				.send({ from: accounts[0] });
		} catch (err) {
			this.setState({ errorMessage: err.message });
		}
		this.setState({ loading: false });
	};
	render() {
		return (
			<Layout>
				<h3>Create a campaign </h3>
				<Form onSubmit={this.onSubmit} error={Boolean(this.state.errorMessage)}>
					<Form.Field>
						<label>Minimum contribution</label>
						<Input
							label="wei"
							value={this.state.minimumContribution}
							onChange={(e) =>
								this.setState({ minimumContribution: e.target.value })
							}
							labelPosition="right"
						/>
					</Form.Field>
					<Message error header="Oops!" content={this.state.errorMessage} />

					<Button loading={this.state.loading} primary>
						Create!
					</Button>
				</Form>
			</Layout>
		);
	}
}

export default CampaignNew;
