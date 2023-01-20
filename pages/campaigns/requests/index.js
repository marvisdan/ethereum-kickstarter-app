import { Link } from "../../../routes";
import React, { Component } from "react";
import { Button } from "semantic-ui-react";
import Layout from "../../../components/Layout";

class RequestIndex extends Component {
	static async getInitialProps(props) {
		const { address } = props.query;

		return { address };
	}
	render() {
		const { address } = this.props;

		return (
			<Layout>
				<h3>Request List</h3>
				<Link route={`/campaigns/${address}/requests/new`}>
					<a href="">
						<Button primary>Add Request</Button>
					</a>
				</Link>
			</Layout>
		);
	}
}

export default RequestIndex;
