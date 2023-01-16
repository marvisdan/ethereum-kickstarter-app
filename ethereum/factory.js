import web3 from "./web3";
import CampaignFactory from "./build/CampaignFactory.json";

const instance = new web3.eth.Contract(
	JSON.parse(CampaignFactory.interface),
	"0x865701d92bbc7d3250e62b3d3313acfc156f7eca"
);

export default instance;
