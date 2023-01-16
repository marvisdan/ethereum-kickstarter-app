const path = require("path");
const solc = require("solc");
const fs = require("fs-extra");

// 1- Delete entire build folder
const buildPath = path.resolve(__dirname, "build");
fs.removeSync(buildPath);

// 2- read 'Campaign.sol' from the 'contracts' folder
const campaignPath = path.resolve(__dirname, "contracts", "Campaign.sol");
const source = fs.readFileSync(campaignPath, "utf8");

// 3- Compile both contracts (Campaign & CampaigndFactory) with solidity compiler
const output = solc.compile(source, 1).contracts;

// recreate the build folder
fs.ensureDirSync(buildPath);

// 4- Write output to the build directory
for (let contract in output) {
	fs.outputJSONSync(
		path.resolve(buildPath, contract.replace(":", "") + ".json"),
		output[contract]
	);
}
