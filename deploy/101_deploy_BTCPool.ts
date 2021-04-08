import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre
  const { deploy, get, log, read, save } = deployments
  const { deployer } = await getNamedAccounts()

  // Constructor arguments
  const TOKEN_ADDRESSES = [
    (await get("BTCB")).address,
    (await get("RENBTC")).address,
    (await get("OBTC")).address,
  ]
  const TOKEN_DECIMALS = [18, 8, 18]
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
