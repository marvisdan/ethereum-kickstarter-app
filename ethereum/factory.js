import web3 from "./web3";
import CampaignFactory from "./build/CampaignFactory.json";

const instance = new web3.eth.Contract(
	JSON.parse(CampaignFactory.interface),
	"0x46cc1009BC1f5902A01334Dac9477753Be668A5c"
);

export default instance;
