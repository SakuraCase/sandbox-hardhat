// SPDX-License-Identifier: MIT
// https://github.com/sushiswap/sushiswap/blob/710c2a739b2806ade49dd5a3b805d6cba8d92366/contracts/interfaces/IRewarder.sol
// https://github.com/sushiswap/sushiswap/blob/710c2a739b2806ade49dd5a3b805d6cba8d92366/LICENSE.txt

pragma solidity 0.6.12;
import "@boringcrypto/boring-solidity/contracts/libraries/BoringERC20.sol";
interface IRewarder {
    using BoringERC20 for IERC20;
    function onSushiReward(uint256 pid, address user, address recipient, uint256 sushiAmount, uint256 newLpAmount) external;
    function pendingTokens(uint256 pid, address user, uint256 sushiAmount) external view returns (IERC20[] memory, uint256[] memory);
}