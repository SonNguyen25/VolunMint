// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";

contract BostonVolunteer is ERC20, ERC20Burnable, AccessControl, ERC20Permit {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant BOUNTY_MANAGER_ROLE = keccak256("BOUNTY_MANAGER_ROLE");

    struct Bounty {
        uint256 bountyID;
        string description;
        uint256 rewardAmount;
        mapping(address => bool) hasClaimed;
        mapping(address => bool) isActiveParticipant;
        bool isActive;
    }

    mapping(uint256 => Bounty) public bounties;
    uint256[] private bountyIds; // Tracking all bounty IDs for iteration

    constructor(address defaultAdmin, address minter)
        ERC20("Boston Credit", "BUSC")
        ERC20Permit("Boston Volunteer")
    {
        _mint(msg.sender, 1000 * 10 ** decimals());
        _grantRole(DEFAULT_ADMIN_ROLE, defaultAdmin);
        _grantRole(MINTER_ROLE, minter);
        _grantRole(BOUNTY_MANAGER_ROLE, defaultAdmin);
    }

    event BountyCreated(uint indexed bountyId, string description, uint256 rewardAmount);
    function createBounty(uint bountyId, string memory description, uint256 rewardAmount, address[] memory participants) public onlyRole(BOUNTY_MANAGER_ROLE) {
        require(bounties[bountyId].bountyID == 0, "Bounty ID already exists.");
        Bounty storage bounty = bounties[bountyId];
        bounty.bountyID = bountyId;
        bounty.description = description;
        bounty.rewardAmount = rewardAmount;
        bounty.isActive = true;
        bountyIds.push(bountyId); // Store the bounty ID for iteration
        for (uint i = 0; i < participants.length; i++) {
            bounty.isActiveParticipant[participants[i]] = true;
        }
        emit BountyCreated(bountyId, description, rewardAmount);
    }

    function claimBounty(uint bountyId, address claimant) public {
        require(bounties[bountyId].isActive, "Bounty does not exist or is not active.");
        require(bounties[bountyId].isActiveParticipant[claimant], "Not a participant or already claimed.");
        require(!bounties[bountyId].hasClaimed[claimant], "Already claimed.");
        bounties[bountyId].hasClaimed[claimant] = true;
        _mint(claimant, bounties[bountyId].rewardAmount * 10 ** decimals());
    }

    function deactivateBounty(uint bountyId) public onlyRole(BOUNTY_MANAGER_ROLE) {
        require(bounties[bountyId].bountyID != 0, "Bounty does not exist.");
        bounties[bountyId].isActive = false;
    }

    function getActiveBounties() public view returns (uint256[] memory) {
        uint256[] memory activeBounties = new uint256[](bountyIds.length);
        uint count = 0;
        for (uint i = 0; i < bountyIds.length; i++) {
            if (bounties[bountyIds[i]].isActive) {
                activeBounties[count++] = bountyIds[i];
            }
        }
        // Resize the array to fit active bounties only
        uint256[] memory resizedActiveBounties = new uint256[](count);
        for (uint j = 0; j < count; j++) {
            resizedActiveBounties[j] = activeBounties[j];
        }
        return resizedActiveBounties;
    }

    function getBounty(uint bountyId) public view returns (uint256, string memory, uint256, bool) {
        require(bounties[bountyId].bountyID != 0, "Bounty ID does not exist");
        Bounty storage bounty = bounties[bountyId];
        return (bounty.bountyID, bounty.description, bounty.rewardAmount, bounty.isActive);
    }

    function getBountyCount() public view returns (uint) {
        return bountyIds.length;
    }

    function listBountyTitles() public view returns (string[] memory) {
        string[] memory titles = new string[](bountyIds.length);
        for (uint i = 0; i < bountyIds.length; i++) {
            titles[i] = string(abi.encodePacked(uint2str(bounties[bountyIds[i]].bountyID), ": ", bounties[bountyIds[i]].description));
        }
        return titles;
    }

    // Helper function to convert uint to string
    function uint2str(uint _i) internal pure returns (string memory _uintAsString) {
        if (_i == 0) {
            return "0";
        }
        uint j = _i;
        uint len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint k = len - 1;
        while (_i != 0) {
            bstr[k--] = bytes1(uint8(48 + _i % 10));
            _i /= 10;
        }
        return string(bstr);
    }

    function mintHours(address to, uint256 amount) public onlyRole(MINTER_ROLE) {
        _mint(to, amount * 10 ** decimals());
    }
}
