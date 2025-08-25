// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Innovation is Ownable {
    struct Project {
        string name;
        string description;
        string githubUrl;
        string telegramId;
        address submitter;
        bool isApproved;
    }

    Project[] public projects;
    uint256 public constant BOUNTY_AMOUNT = 50000;
    uint256 public remainingBounties = 25;

    event ProjectSubmitted(address indexed submitter, string githubUrl, string telegramId);
    event ProjectApproved(address indexed submitter, uint256 projectId);

    function submitProject(
        string memory _name,
        string memory _description,
        string memory _githubUrl,
        string memory _telegramId
    ) external {
        require(remainingBounties > 0, "No bounties remaining");
        
        projects.push(Project({
            name: _name,
            description: _description,
            githubUrl: _githubUrl,
            telegramId: _telegramId,
            submitter: msg.sender,
            isApproved: false
        }));

        emit ProjectSubmitted(msg.sender, _githubUrl, _telegramId);
    }

    function approveProject(uint256 _projectId) external onlyOwner {
        require(_projectId < projects.length, "Invalid project ID");
        require(!projects[_projectId].isApproved, "Project already approved");
        require(remainingBounties > 0, "No bounties remaining");

        projects[_projectId].isApproved = true;
        remainingBounties--;

        emit ProjectApproved(projects[_projectId].submitter, _projectId);
    }

    function getProject(uint256 _projectId) external view returns (Project memory) {
        require(_projectId < projects.length, "Invalid project ID");
        return projects[_projectId];
    }

    function getProjectsCount() external view returns (uint256) {
        return projects.length;
    }
}