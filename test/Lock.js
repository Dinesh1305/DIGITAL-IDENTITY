const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Digital_identity Smart Contract (Negative Test Cases)", function () {
    let DigitalIdentity;
    let digitalIdentity;
    let owner, college, onlinePlatform, student, unauthorizedUser, viewer;

    beforeEach(async function () {
        [owner, college, onlinePlatform, student, unauthorizedUser, viewer] = await ethers.getSigners();

        // Deploy the contract
        DigitalIdentity = await ethers.getContractFactory("Digital_identity");
        digitalIdentity = await DigitalIdentity.deploy();
        await digitalIdentity.deployed();
    });

    // ❌ Trying to add a college by a non-admin
    it("should revert if a non-admin tries to add a college", async function () {
        await expect(digitalIdentity.connect(unauthorizedUser).addCollege(college.address))
            .to.be.revertedWith("ONLY THE ADMIN CAN ADD THE COLLEGE");
    });

    // ❌ Trying to add an online platform by a non-admin
    it("should revert if a non-admin tries to add an online platform", async function () {
        await expect(digitalIdentity.connect(unauthorizedUser).addOnlinePlatform(onlinePlatform.address))
            .to.be.revertedWith("ONLY THE ADMIN CAN ADD THE ONLINE PLATFORM");
    });

    // ❌ Unauthorized user trying to add a certificate
    it("should revert if an unauthorized user tries to add a certificate", async function () {
        await expect(digitalIdentity.connect(unauthorizedUser).addCollegeCertificate("CertX", student.address))
            .to.be.revertedWith("ONLY COLLEGES CAN ADD CERTIFICATES");
    });

    // ❌ Student adding a certificate without being part of a college
    it("should revert if a student tries to add a certificate without being in a college", async function () {
        await digitalIdentity.connect(owner).addCollege(college.address); // College exists, but student isn't added
        await digitalIdentity.connect(college).addCollegeCertificate("CertA", student.address); // Certificate exists

        await expect(digitalIdentity.connect(student).addCertificateForStudent("CertA", college.address))
            .to.be.revertedWith("COLLEGE OR ONLINE PLATFORM DOES NOT EXIST");
    });

    // ❌ Trying to add a certificate that doesn't exist
    it("should revert if a student tries to add a non-existing certificate", async function () {
        await digitalIdentity.connect(owner).addCollege(college.address);
        await digitalIdentity.connect(college).addStudentToCollege(student.address, college.address);

        await expect(digitalIdentity.connect(student).addCertificateForStudent("FakeCert", college.address))
            .to.be.revertedWith("THE CERTIFICATE DOES NOT EXIST");
    });

    // ❌ Trying to remove a non-existing certificate
    it("should revert if a student tries to remove a certificate that does not exist", async function () {
        await expect(digitalIdentity.connect(student).removeCertificate(college.address, "FakeCert"))
            .to.be.revertedWith("THE STUDENT DOES NOT HAVE THIS CERTIFICATE FROM THE EDUCATIONAL INSTITUTION");
    });

    // ❌ Trying to view a certificate without access
    it("should return false if a viewer does not have access to a certificate", async function () {
        const hasAccess = await digitalIdentity.connect(viewer).canViewCertificate(student.address, college.address, "CertA");
        expect(hasAccess).to.equal(false);
    });

    // ❌ Trying to grant access to a non-existing certificate
    it("should revert if a student tries to grant access to a non-existing certificate", async function () {
        await expect(digitalIdentity.connect(student).grantCertificateAccess(viewer.address, college.address, "FakeCert"))
            .to.be.revertedWith("CERTIFICATE DOES NOT EXIST");
    });

    // ❌ Trying to add a duplicate certificate for the same student
    it("should allow adding a certificate only once", async function () {
        await digitalIdentity.connect(owner).addCollege(college.address);
        await digitalIdentity.connect(college).addStudentToCollege(student.address, college.address);
        await digitalIdentity.connect(college).addCollegeCertificate("CertA", student.address);

        // First attempt should pass
        await digitalIdentity.connect(student).addCertificateForStudent("CertA", college.address);

        // Second attempt should fail
        await expect(digitalIdentity.connect(student).addCertificateForStudent("CertA", college.address))
            .to.be.revertedWith("THE CERTIFICATE DOES NOT EXIST"); // Because it's already added
    });

    // ❌ Trying to add a student to a non-existing college
    it("should revert if a student is added to a non-existing college", async function () {
        await expect(digitalIdentity.connect(college).addStudentToCollege(student.address, college.address))
            .to.be.revertedWith("COLLEGE DOES NOT EXIST");
    });

    // ❌ Trying to add a student to a non-existing online platform
    it("should revert if a student is added to a non-existing online platform", async function () {
        await expect(digitalIdentity.connect(onlinePlatform).addStudentToOnlinePlatform(student.address, onlinePlatform.address))
            .to.be.revertedWith("ONLINE PLATFORM DOES NOT EXIST");
    });

});
