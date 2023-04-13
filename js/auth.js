// global variables
const jwt = localStorage.getItem('jwt');
const email = document.getElementById('email');
const pwd = document.getElementById('pwd');
const form = document.getElementById('form');
const errorLabel = document.getElementById('error');

// auth logic
const onError = err => {
	errorLabel.style.display = 'block';
	console.error(err);
};

const auth = async (email, pwd) => {
	const requestData = {
		identifier: email,
		password: pwd,
	};

	const response = await fetch('http://localhost:1337/api/auth/local', {
		method: 'POST',
		mode: 'cors',
		cache: 'no-cache',
		credentials: 'same-origin',
		headers: {
			'Content-Type': 'application/json',
		},
		redirect: 'follow',
		referrerPolicy: 'no-referrer',
		body: JSON.stringify(requestData),
	}).catch(err => {
		onError(err);
	});
	const data = await response.json();

	// validating the error again
	if (!!data?.error) {
		onError(data);
	}

	return data;
};

form.addEventListener('submit', async e => {
	e.preventDefault();

	const data = await auth(email.value, pwd.value);

	if (!!data?.jwt) {
		window.location.href = '/';
		localStorage.setItem('jwt', data.jwt);
	}
});

// checking if user is authorized
const authMe = async jwt => {
	if (!jwt) return;

	const response = await fetch('http://localhost:1337/api/users/me', {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${jwt}`,
		},
	});

	const data = await response.json();

	if (!!data.error) {
		localStorage.removeItem('jwt');
	} else {
		if (!!jwt) {
			window.location.href = '/';
		}
	}
};

authMe(jwt);
