const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());

const compiledFactory = require("../ethereum/build/CampaignFactory.json");
const compiledCampaign = require("../ethereum/build/Campaign.json");

const MINIMUM_CONTRIBUTION = "100";

let accounts;
let factory;
let campaignAddress;
let campaign;
beforeEach(async () => {
	accounts = await web3.eth.getAccounts();

	// deploy a new version of the contract (Factory)
	factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
		.deploy({
			data: compiledFactory.bytecode
		})
		.send({
			from: accounts[0],
			gas: "1000000"
		});

	// Create a Campaign
	await factory.methods.createCampaign(MINIMUM_CONTRIBUTION).send({
		from: accounts[0], // manager address
		gas: "1000000"
	});

	// get the first deployed Campaign
	const address = await factory.methods.getDeployedCampaigns().call();
	campaignAddress = address[0];

	// passed an address of an already contract deployed
	campaign = await new web3.eth.Contract(
		JSON.parse(compiledCampaign.interface),
		campaignAddress
	);
});

describe("Camapign", () => {
	it("deploys a factory and a campaign", () => {
		assert.ok(factory.options.address);
		assert.ok(campaign.options.address);
	});

	it("marks caller as a campaign manager", async () => {
		const manager = await campaign.methods.manager().call();
		assert.equal(accounts[0], manager);
	});

	it("allow people to contribute and marks them as appovers", async () => {
		await campaign.methods.contribute().send({
			value: "200",
			from: accounts[1]
		});
		const isContributor = await campaign.methods.approvers(accounts[1]).call();
		assert(isContributor);
	});

	it("requires a minimum contribution", async () => {
		try {
			// try to contribute with a amount lesser than the minimum contribution
			await campaign.methods.contribute().send({
				value: "5",
				from: accounts[1]
			});
			assert(false); // throw an error and excute the code into the catch block
		} catch (err) {
			assert(err);
		}
	});

	it("allows a manager to make a payment request", async () => {
		await campaign.methods
			.createRequest("Buy batteries", "100", accounts[1])
			.send({
				from: accounts[0], // on our contract only the manager can create a request
				gas: "1000000"
			});
		const request = await campaign.methods.requests(0).call();
		assert.equal("Buy batteries", request.description);
	});

	it("processes request", async () => {
		await campaign.methods.contribute().send({
			from: accounts[0],
			value: web3.utils.toWei("10", "ether")
		});

		await campaign.methods
			.createRequest("A", web3.utils.toWei("5", "ether"), accounts[1]) // account[1] is the recipitent (destinataire)
			.send({ from: accounts[0], gas: "1000000" }); // account[0] is the manager

		await campaign.methods.approveRequest(0).send({
			from: accounts[0],
			gas: "1000000"
		});

		await campaign.methods.finalizeRequest(0).send({
			from: accounts[0], // on our contract only the manager can finalize a request
			gas: "1000000"
		});

		let balance = await web3.eth.getBalance(accounts[1]); // check the account balance of this address
		balance = web3.utils.fromWei(balance, "ether");
		balance = parseFloat(balance);
		console.log(balance);
		assert(balance > 104); // should have at least 105 ether
	});
});
