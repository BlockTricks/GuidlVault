// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IYieldStrategy {
    /**
     * @notice Deposit funds into the strategy
     * @param amount Amount of tokens to deposit
     * @return shares Amount of shares/yield tokens received
     */
    function deposit(uint256 amount) external returns (uint256 shares);

    /**
     * @notice Withdraw funds from the strategy
     * @param amount Amount of underlying assets to withdraw
     * @param recipient Address to send the withdrawn assets to
     * @return sharesBurned Amount of shares burned
     */
    function withdraw(uint256 amount, address recipient) external returns (uint256 sharesBurned);

    /**
     * @notice Get the underlying asset address
     */
    function asset() external view returns (address);

    /**
     * @notice Get the total value of assets managed by this strategy for the caller
     * @param account Account to check balance for
     */
    function balanceOf(address account) external view returns (uint256);
}
