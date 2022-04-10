import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre
  const { execute, get, getOrNull, log, read, save } = deployments
  const { deployer } = await getNamedAccounts()

  // Manually check if the pool is already deployed
  //let deriveUSDPool = await getOrNull("DeriveUSDPoolMods")
  //if (deriveUSDPool) {
  //  log(`reusing "DeriveUSDPool" at ${deriveUSDPool.address}`)
  //} else {
    // Constructor arguments
    const TOKEN_ADDRESSES = [
      (await get("BUSD")).address,
      (await get("USDC")).address,
      (await get("USDT")).address,
      (await get("OUSD")).address,
    ]
    const TOKEN_DECIMALS = [18, 18, 18, 18]
    const LP_TOKEN_NAME = "Derive DAI/USDC/USDT/OUSD (4 assets)"
    const LP_TOKEN_SYMBOL = "DUSD4"
    const INITIAL_A = 200
    const SWAP_FEE = 4e6 // 4bps
    const ADMIN_FEE = 0
    const WITHDRAW_FEE = 0

    const receipt = await execute(
      "SwapDeployer",
      { from: deployer, log: true },
      "deploy",
      (await get("SwapFlashLoan")).address,
      TOKEN_ADDRESSES,
      TOKEN_DECIMALS,
      LP_TOKEN_NAME,
      LP_TOKEN_SYMBOL,
      INITIAL_A,
      SWAP_FEE,
      ADMIN_FEE,
      WITHDRAW_FEE,
    )

    const newPoolEvent = receipt?.events?.find(
      (e: any) => e["event"] == "NewSwapPool",
    )
    const usdSwapAddress = newPoolEvent["args"]["swapAddress"]
    console.log(
      `deployed USD pool clone (targeting "SwapFlashLoan") at ${usdSwapAddress}`,
    )
    await save("DeriveUSDPoolMods", {
      abi: (await get("SwapFlashLoan")).abi,
      address: usdSwapAddress,
    })
  //}

  const lpTokenAddress = (await read("DeriveUSDPoolMods", "swapStorage")).lpToken
  log(`USD pool LP Token at ${lpTokenAddress}`)

  await save("DeriveUSDPoolLPTokenMods", {
    abi: (await get("DAI")).abi, // Generic ERC20 ABI
    address: lpTokenAddress,
  })
}
export default func
func.tags = ["USDPoolMods"]
func.dependencies = [
  "SwapUtils",
  "SwapDeployer",
  "SwapFlashLoan",
  "USDPoolTokensMods",
]
