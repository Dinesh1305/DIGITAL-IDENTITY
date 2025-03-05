// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

contract Digital_identity {
    address owner;

    constructor() {
        owner = msg.sender;
    }

    // Mapping to store certificate requests from companies to students
    mapping(address => address[]) public request;
    
    // Mapping to track registered colleges
    mapping(address => bool) public college;
    
    // Mapping to track registered online platforms
    mapping(address => bool) public online_platform;
    
    // Mapping to track certificates issued by colleges and online platforms
    mapping(address => mapping(address => mapping(string => bool))) public certificate;
    
    // Mapping to track students associated with colleges and online platforms
    mapping(address => mapping(address => bool)) public students;
    
    // Mapping to store certificate access permissions
    mapping(address => mapping(address => mapping(address => mapping(string => bool)))) public certificateAccess;
    
    // Mapping to store certificates that a company has accessed for a student
    mapping(address => mapping(address => string[])) private companyCertificates;
    
    // New mapping: Allows students to add and manage their own personal certificates
    mapping(address => mapping(string => bool)) public studentCertificates;

    // Events for logging actions
    event CollegeAdded(address indexed collegeAddress);
    event OnlinePlatformAdded(address indexed onlinePlatformAddress);
    event CertificateAdded(address indexed platform, address indexed student, string certificateName);
    event CollegeCertificateAdded(address indexed college, address indexed student, string certificateName);
    event StudentAddedToCollege(address indexed student, address indexed collegeAddress);
    event StudentAddedToOnlinePlatform(address indexed student, address indexed onlinePlatformAddress);
    event CertificateAccessGranted(address indexed student, address indexed viewer, address indexed institution, string certificateHash);
    event CertificateRequested(address indexed student, address indexed company);
    event StudentCertificateAdded(address indexed student, string certificateName);
    event StudentCertificateRemoved(address indexed student, string certificateName);

    // Function to add a college to the system (Only Admin can add)
    function addCollege(address college_address) external {
        require(msg.sender == owner, "ONLY THE ADMIN CAN ADD THE COLLEGE");

        college[college_address] = true;
        emit CollegeAdded(college_address);
    }

    // Function to add an online learning platform (Only Admin can add)
    function addOnlinePlatform(address online_platform_address) external {
        require(msg.sender == owner, "ONLY THE ADMIN CAN ADD THE ONLINE PLATFORM");
        online_platform[online_platform_address] = true;
        emit OnlinePlatformAdded(online_platform_address);
    }

    // Function to add a certificate issued by an online platform
    function addCertificate(string memory certificateName, address student) external {
        require(online_platform[msg.sender] == true, "ONLY ONLINE PLATFORMS CAN ISSUE CERTIFICATES");
         require(students[student][msg.sender]==true,"THE STUDENT DOES NOT HAVE RESGITER IN THE ONLINE PLATFORM");
        certificate[msg.sender][student][certificateName] = true;
        emit CertificateAdded(msg.sender, student, certificateName);
    }

    // Function to add a certificate issued by a college
    function addCollegeCertificate(string memory certificateName, address student) external {
        require(college[msg.sender] == true, "ONLY COLLEGES CAN ISSUE CERTIFICATES");
        certificate[msg.sender][student][certificateName] = true;
        emit CollegeCertificateAdded(msg.sender, student, certificateName);
    }

    // Function to add a student to a college
    function addStudentToCollege(address student) external {
        require(college[msg.sender] == true, "COLLEGE DOES NOT EXIST");
        students[student][msg.sender] = true;
        emit StudentAddedToCollege(student, msg.sender);
    }

    // Function to add a student to an online platform
    function addStudentToOnlinePlatform(address student, address online_platform_address) external {
        require(online_platform[online_platform_address] == true, "ONLINE PLATFORM DOES NOT EXIST");
       students[msg.sender][student]=true;
        emit StudentAddedToOnlinePlatform(student, online_platform_address);
    }

    // Function for companies to request access to a student's certificates
    function requestCertificateAccess(address student) external {
        request[student].push(msg.sender);
        emit CertificateRequested(student, msg.sender);
    }

    // Function to grant access to a requested certificate
    function grantCertificateAccess(address viewer, address institution, string memory certificateHash) external {
        require(certificate[institution][msg.sender][certificateHash] == true, "CERTIFICATE DOES NOT EXIST");
        certificateAccess[msg.sender][viewer][institution][certificateHash] = true;
        companyCertificates[viewer][msg.sender].push(certificateHash);
        removeViewerFromRequest(msg.sender, viewer);
        emit CertificateAccessGranted(msg.sender, viewer, institution, certificateHash);
    }

    // Function for students to add their own personal certificates
    function addStudentCertificate(address educationalplace,string memory certificatehash) external {
        require(certificate[educationalplace][msg.sender][certificatehash]==true,"CERTIFICATE DOES NOT EXIST");
        studentCertificates[msg.sender][certificatehash] = true;
        emit StudentCertificateAdded(msg.sender, certificatehash);
    }

    // Function for students to remove their own personal certificates
    function removeStudentCertificate(string memory certificateName) external {
        require(studentCertificates[msg.sender][certificateName] == true, "CERTIFICATE DOES NOT EXIST");
        delete studentCertificates[msg.sender][certificateName];
        emit StudentCertificateRemoved(msg.sender, certificateName);
    }

    // Function to retrieve the list of companies requesting access to a student's certificates
    function getCompanyRequests() external view returns (address[] memory) {
        return request[msg.sender];
    }

    // Internal function to remove a viewer from the request list after access is granted
    function removeViewerFromRequest(address student, address viewer) internal {
        address[] storage temp = request[student];
        for (uint j = 0; j < temp.length; j++) {
            if (temp[j] == viewer) {
                temp[j] = temp[temp.length - 1];
                temp.pop();
                break;
            }
        }
    }
 function removeViewer(address student, address viewer)external {
        address[] storage temp = request[student];
        for (uint j = 0; j < temp.length; j++) {
            if (temp[j] == viewer) {
                temp[j] = temp[temp.length - 1];
                temp.pop();
                break;
            }
        }
    }
    // Function to check if a viewer has access to a student's certificate
    function canViewCertificate(address student, address institution, string memory certificateHash) external view returns (bool) {
        return certificateAccess[student][msg.sender][institution][certificateHash];
    }

    // Function for a company to retrieve a student's certificates they have access to
    function getStudentCertificatesForCompany(address student) external view returns (string[] memory) {
        return companyCertificates[msg.sender][student];
    }
}