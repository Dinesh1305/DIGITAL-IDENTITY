// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract Digital_identity {
    address owner;
    
    constructor() {
        owner = msg.sender;
    }
    
    // Mapping of college addresses to bool
    mapping(address => bool) college;
    
    // Mapping of online platform addresses to bool
    mapping(address => bool) online_platform;
    
    // Mapping of college/online platform to student to hash to bool (certificates)
    mapping(address => mapping(address => mapping(string => bool))) certificate;
    
    // Mapping of student addresses to college/online platform addresses
    mapping(address => mapping(address => bool)) students;
    
    // Mapping of student to educational institution to hash to bool
    mapping(address => mapping(address => mapping(string => bool))) student_certificate;
    
    // Mapping of student => viewer => institution => certificateHash => bool
    mapping(address => mapping(address => mapping(address => mapping(string => bool)))) public certificateAccess;

    // Events
    event CollegeAdded(address indexed collegeAddress);
    event OnlinePlatformAdded(address indexed onlinePlatformAddress);
    event CertificateAdded(address indexed platform, address indexed student, string certificateName);
    event CollegeCertificateAdded(address indexed college, address indexed student, string certificateName);
    event StudentAddedToCollege(address indexed student, address indexed collegeAddress);
    event StudentAddedToOnlinePlatform(address indexed student, address indexed onlinePlatformAddress);
    event CertificateForStudentAdded(address indexed student, address indexed institution, string certificateHash);
    event CertificateRemoved(address indexed student, address indexed institution, string certificateHash);
    event CertificateAccessGranted(address indexed student, address indexed viewer, address indexed institution, string certificateHash);

    // Function for admin to add a college
    function addCollege(address college_address) external {
        require(msg.sender == owner, "ONLY THE ADMIN CAN ADD THE COLLEGE");
        college[college_address] = true;
        emit CollegeAdded(college_address);
    }

    // Function for admin to add an online platform
    function addOnlinePlatform(address onlineplatform_address) external {
        require(msg.sender == owner, "ONLY THE ADMIN CAN ADD THE ONLINE PLATFORM");
        online_platform[onlineplatform_address] = true;
        emit OnlinePlatformAdded(onlineplatform_address);
    }

    // Function for online platforms to add certificates for students
    function addCertificate(string memory certificateName, address student) external {
        require(online_platform[msg.sender] == true, "ONLY ONLINE PLATFORMS CAN ADD CERTIFICATES");
        certificate[msg.sender][student][certificateName] = true;
        emit CertificateAdded(msg.sender, student, certificateName);
    }

    // Function for colleges to add certificates for students
    function addCollegeCertificate(string memory certificateName, address student) external {
        require(college[msg.sender] == true, "ONLY COLLEGES CAN ADD CERTIFICATES");
        certificate[msg.sender][student][certificateName] = true;
        emit CollegeCertificateAdded(msg.sender, student, certificateName);
    }

    // Function for colleges to add students
    function addStudentToCollege(address student, address college_address) external {
        require(college[college_address] == true, "COLLEGE DOES NOT EXIST");
        students[student][college_address] = true;
        emit StudentAddedToCollege(student, college_address);
    }

    // Function for online platforms to add students
    function addStudentToOnlinePlatform(address student, address online_platform_address) external {
        require(online_platform[online_platform_address] == true, "ONLINE PLATFORM DOES NOT EXIST");
        students[student][online_platform_address] = true;
        emit StudentAddedToOnlinePlatform(student, online_platform_address);
    }

    // Function for students to add certificates
    function addCertificateForStudent(string memory certificateHash, address educational_institution) external {
        require(students[msg.sender][educational_institution] == true, "COLLEGE OR ONLINE PLATFORM DOES NOT EXIST");
        student_certificate[msg.sender][educational_institution][certificateHash] = true;
        emit CertificateForStudentAdded(msg.sender, educational_institution, certificateHash);
    }

    // Function for students to remove certificates
    function removeCertificate(address educational_institution, string memory certificateHash) external {
        require(student_certificate[msg.sender][educational_institution][certificateHash] == true, "THE STUDENT DOES NOT HAVE THIS CERTIFICATE FROM THE EDUCATIONAL INSTITUTION");
        student_certificate[msg.sender][educational_institution][certificateHash] = false;
        emit CertificateRemoved(msg.sender, educational_institution, certificateHash);
    }


    // Function for students to grant certificate access to viewers
    function grantCertificateAccess(address viewer, address institution, string memory certificateHash) external {
        require(student_certificate[msg.sender][institution][certificateHash] == true, "CERTIFICATE DOES NOT EXIST");
        certificateAccess[msg.sender][viewer][institution][certificateHash] = true;
        emit CertificateAccessGranted(msg.sender, viewer, institution, certificateHash);
    }

    // Function for viewers to check if they have access to a certificate
    function canViewCertificate(address student, address institution, string memory certificateHash) external view returns (bool) {
        return certificateAccess[student][msg.sender][institution][certificateHash];
    }
}
