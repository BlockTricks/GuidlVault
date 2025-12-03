const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("GuidlVault", function () {
  let guidlVault;
  let owner;
  let admin;
  let treasurer;
  let member1;
  let member2;
  let token;

  const MIN_DEPOSIT = ethers.parseEther("0.01");
  const MAX_WITHDRAWAL = ethers.parseEther("10");
  const REQUIRED_APPROVALS = 2;

  beforeEach(async function () {
    [owner, admin, treasurer, member1, member2] = await ethers.getSigners();

    // Deploy a mock ERC20 token for testing
    const MockERC20 = await ethers.getContractFactory("MockERC20");
    token = await MockERC20.deploy(
      "Test Token",
      "TEST",
      ethers.parseEther("1000000")
    );
    await token.waitForDeployment();

    // Deploy GuidlVault
    const GuidlVault = await ethers.getContractFactory("GuidlVault");
    guidlVault = await GuidlVault.deploy(
      admin.address,
      treasurer.address,
      MIN_DEPOSIT,
      MAX_WITHDRAWAL,
      REQUIRED_APPROVALS
    );
    await guidlVault.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the correct admin and treasurer", async function () {
      expect(
        await guidlVault.hasRole(await guidlVault.ADMIN_ROLE(), admin.address)
      ).to.be.true;
      expect(
        await guidlVault.hasRole(
          await guidlVault.TREASURER_ROLE(),
          treasurer.address
        )
      ).to.be.true;
    });

    it("Should set the correct configuration", async function () {
      expect(await guidlVault.minDepositAmount()).to.equal(MIN_DEPOSIT);
      expect(await guidlVault.maxWithdrawalAmount()).to.equal(MAX_WITHDRAWAL);
      expect(await guidlVault.requiredApprovals()).to.equal(REQUIRED_APPROVALS);
    });
  });

  describe("Native ETH Deposits", function () {
    it("Should allow native ETH deposits above minimum", async function () {
      const depositAmount = ethers.parseEther("0.1");
      await expect(
        guidlVault.connect(member1).depositNative({ value: depositAmount })
      )
        .to.emit(guidlVault, "Deposit")
        .withArgs(member1.address, ethers.ZeroAddress, depositAmount, anyValue);

      expect(await guidlVault.getBalance(ethers.ZeroAddress)).to.equal(
        depositAmount
      );
      expect(
        await guidlVault.getMemberDeposits(ethers.ZeroAddress, member1.address)
      ).to.equal(depositAmount);
    });

    it("Should reject deposits below minimum", async function () {
      const depositAmount = ethers.parseEther("0.001");
      await expect(
        guidlVault.connect(member1).depositNative({ value: depositAmount })
      ).to.be.revertedWith("GuidlVault: Amount below minimum");
    });

    it("Should accept deposits via receive function", async function () {
      const depositAmount = ethers.parseEther("0.1");
      await expect(
        member1.sendTransaction({
          to: await guidlVault.getAddress(),
          value: depositAmount,
        })
      )
        .to.emit(guidlVault, "Deposit")
        .withArgs(member1.address, ethers.ZeroAddress, depositAmount, anyValue);
    });
  });

  describe("ERC20 Token Deposits", function () {
    it("Should allow ERC20 token deposits", async function () {
      const depositAmount = ethers.parseEther("100");
      await token
        .connect(member1)
        .approve(await guidlVault.getAddress(), depositAmount);

      await expect(
        guidlVault
          .connect(member1)
          .depositToken(await token.getAddress(), depositAmount)
      )
        .to.emit(guidlVault, "Deposit")
        .withArgs(
          member1.address,
          await token.getAddress(),
          depositAmount,
          anyValue
        );

      expect(await guidlVault.getBalance(await token.getAddress())).to.equal(
        depositAmount
      );
      expect(
        await guidlVault.getMemberDeposits(
          await token.getAddress(),
          member1.address
        )
      ).to.equal(depositAmount);
    });

    it("Should reject token deposits below minimum", async function () {
      const depositAmount = ethers.parseEther("0.001");
      await token
        .connect(member1)
        .approve(await guidlVault.getAddress(), depositAmount);

      await expect(
        guidlVault
          .connect(member1)
          .depositToken(await token.getAddress(), depositAmount)
      ).to.be.revertedWith("GuidlVault: Amount below minimum");
    });
  });

  describe("Withdrawal Requests", function () {
    beforeEach(async function () {
      // Deposit some funds first
      const depositAmount = ethers.parseEther("5");
      await guidlVault.connect(member1).depositNative({ value: depositAmount });
    });

    it("Should allow treasurer to create withdrawal request", async function () {
      const withdrawalAmount = ethers.parseEther("1");
      const tx = await guidlVault
        .connect(treasurer)
        .createWithdrawalRequest(
          ethers.ZeroAddress,
          member2.address,
          withdrawalAmount,
          "Test withdrawal"
        );

      await expect(tx)
        .to.emit(guidlVault, "WithdrawalRequestCreated")
        .withArgs(
          0,
          ethers.ZeroAddress,
          member2.address,
          withdrawalAmount,
          "Test withdrawal"
        );

      const request = await guidlVault.getWithdrawalRequest(0);
      expect(request.recipient).to.equal(member2.address);
      expect(request.amount).to.equal(withdrawalAmount);
      expect(request.executed).to.be.false;
    });

    it("Should not allow non-treasurer to create withdrawal request", async function () {
      const withdrawalAmount = ethers.parseEther("1");
      await expect(
        guidlVault
          .connect(member1)
          .createWithdrawalRequest(
            ethers.ZeroAddress,
            member2.address,
            withdrawalAmount,
            "Test withdrawal"
          )
      ).to.be.reverted;
    });

    it("Should execute withdrawal after required approvals", async function () {
      const withdrawalAmount = ethers.parseEther("1");
      await guidlVault
        .connect(treasurer)
        .createWithdrawalRequest(
          ethers.ZeroAddress,
          member2.address,
          withdrawalAmount,
          "Test withdrawal"
        );

      // Add another treasurer for approval
      await guidlVault
        .connect(admin)
        .grantRole(await guidlVault.TREASURER_ROLE(), member1.address);

      // First approval
      await guidlVault.connect(treasurer).approveWithdrawalRequest(0);

      // Second approval (should auto-execute)
      await expect(guidlVault.connect(member1).approveWithdrawalRequest(0))
        .to.emit(guidlVault, "WithdrawalRequestExecuted")
        .withArgs(0, member2.address, withdrawalAmount);

      const request = await guidlVault.getWithdrawalRequest(0);
      expect(request.executed).to.be.true;
    });
  });

  describe("Admin Functions", function () {
    it("Should allow admin to update min deposit amount", async function () {
      const newAmount = ethers.parseEther("0.05");
      await expect(guidlVault.connect(admin).setMinDepositAmount(newAmount))
        .to.emit(guidlVault, "MinDepositAmountUpdated")
        .withArgs(MIN_DEPOSIT, newAmount);

      expect(await guidlVault.minDepositAmount()).to.equal(newAmount);
    });

    it("Should allow admin to pause the contract", async function () {
      await guidlVault.connect(admin).pause();
      expect(await guidlVault.paused()).to.be.true;

      await expect(
        guidlVault.connect(member1).depositNative({ value: MIN_DEPOSIT })
      ).to.be.revertedWithCustomError(guidlVault, "EnforcedPause");
    });

    it("Should allow admin to unpause the contract", async function () {
      await guidlVault.connect(admin).pause();
      await guidlVault.connect(admin).unpause();
      expect(await guidlVault.paused()).to.be.false;
    });

    it("Should allow admin to perform emergency withdrawal", async function () {
      const depositAmount = ethers.parseEther("5");
      await guidlVault.connect(member1).depositNative({ value: depositAmount });

      const withdrawalAmount = ethers.parseEther("2");
      await expect(
        guidlVault
          .connect(admin)
          .emergencyWithdraw(
            ethers.ZeroAddress,
            member2.address,
            withdrawalAmount
          )
      )
        .to.emit(guidlVault, "EmergencyWithdrawal")
        .withArgs(ethers.ZeroAddress, member2.address, withdrawalAmount);
    });
  });
});

// Helper function for anyValue matcher
function anyValue() {
  return true;
}

