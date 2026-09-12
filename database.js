const defaultUsers = [
	{
		email: "onotevukowhodante@gmail.com",
		password: "DANTE1234LIFE3",
		fName: "Dante",
		lName: "Alighieri",
		role: "owner"
	}
];

function validateUser(email, password) {
	return Boolean(getUser(email, password));
}

function getUser(email, password) {
	return allUsers().find(user => user.email === email && user.password === password);
}

function allUsers() {
	return defaultUsers.concat(JSON.parse(localStorage.getItem('vondanteUsers') || '[]'));
}

function registerUser(email, password) {
	if (!email || password.length < 6 || allUsers().some(user => user.email === email)) return false;
	const users = JSON.parse(localStorage.getItem('vondanteUsers') || '[]');
	users.push({ email, password, role: 'customer' });
	localStorage.setItem('vondanteUsers', JSON.stringify(users));
	return true;
}
