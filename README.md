🔐 Digital Identity - Certificate Management on Blockchain
A Solidity Smart Contract for managing digital certificates issued by colleges and online platforms, allowing students to control and share their academic records securely on the Ethereum blockchain.

🛠 Features
🏛️ Admin-controlled onboarding of Colleges and Online Platforms

🎓 Student management by institutions

📄 Certificate issuance by authorized institutions

🗃️ Student certificate management

🔑 Fine-grained access control for viewing certificates

🔍 View permission checks for third parties (e.g., employers)

🧱 Data Structures
college: Stores authorized colleges.

online_platform: Stores authorized online platforms.

certificate: Maps institutions → students → certificate hash → validity.

student_certificate: Maps students → institutions → certificate hash → validity.

certificateAccess: Maps student → viewer → institution → certificate hash → access status.

🔐 Roles
Role	Capabilities
Admin	Add colleges and online platforms.
College / Platform	Add students and issue certificates.
Student	Add certificates to their profile, revoke them, and share with viewers.
Viewer	Request or check certificate access granted by students.

⚙️ Core Functions
Function	Description
addCollege(address)	Admin adds a college.
addOnlinePlatform(address)	Admin adds an online platform.
addCertificate(string, address)	Platform issues a certificate to a student.
addCollegeCertificate(string, address)	College issues a certificate to a student.
addStudentToCollege(address, address)	Add a student to a specific college.
addStudentToOnlinePlatform(address, address)	Add a student to an online platform.
addCertificateForStudent(string, address)	Student registers a certificate for themselves.
removeCertificate(address, string)	Student revokes a certificate.
grantCertificateAccess(address, address, string)	Student grants viewing access to a certificate.
canViewCertificate(address, address, string)	Viewers check if they have access to a student’s certificate.

📦 Example Use Case
Admin adds an institute (MIT) and a platform (Coursera).

MIT adds a student and issues a degree certificate.

Student adds that certificate to their account.

Student grants access to an employer.

Employer checks access using canViewCertificate().

🔐 License
This project is licensed under the GNU GPL v3.0 — see the LICENSE file for details.

✍️ Author
Dinesh M.
Smart Contract Developer | Full Stack Enthusiast
