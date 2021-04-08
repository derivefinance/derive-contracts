import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre
  const { deploy, get, log, read, save } = deployments
  const { deployer } = await getNamedAccounts()

  // Constructor arguments
  const TOKEN_ADDRESSES = [
    "0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c", //BTCB
    "0xfce146bf3146100cfe5db4129cf6c82b0ef4ad8c", //renBTC,
    "0x19e0E8413DEe3AfFd94bdd42519d01935a0CF0c2" //oBTC
  ]
  const TOKEN_DECIMALS = [18, 8, 8]
  const LP_TOKEN_NAME = "Derive BTCB/renBTC/oBTC"
  const LP_TOKEN_SYMBOL = "deriveBTC"
  const INITIAL_A = 200
  const SWAP_FEE = 4e6 // 4bps
  const ADMIN_FEE = 0
  const WITHDRAW_FEE = 0
  const ALLOWLIST_ADDRESS = (await get("Allowlist")).address

  await deploy("DeriveBTCPool", {
    from: deployer,
    log: true,
    contract: "SwapGuarded",
    libraries: {
      SwapUtilsGuarded: (await get("SwapUtilsGuarded")).address,
    },
    args: [
      TOKEN_ADDRESSES,
      TOKEN_DECIMALS,
      LP_TOKEN_NAME,
      LP_TOKEN_SYMBOL,
      INITIAL_A,
      SWAP_FEE, // 4bps
      ADMIN_FEE,
      WITHDRAW_FEE,
      ALLOWLIST_ADDRESS,
    ],
    skipIfAlreadyDeployed: true,
  })

  const lpTokenAddress = (await read("DeriveBTCPool", "swapStorage")).lpToken
  log(`BTC pool LP Token at ${lpTokenAddress}`)

  await save("DeriveBTCPoolLPToken", {
    abi: (await get("BTCB")).abi, // Generic ERC20 ABI
    address: lpTokenAddress,
  })
}
export default func
func.tags = ["BTCPool"]
func.dependencies = ["Allowlist", "SwapUtilsGuarded", "BTCPoolTokens"]
