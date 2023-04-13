// global variables
const table = document.getElementById('table');
const jwt = localStorage.getItem('jwt');

// functions / get all group students func
const getStudents = async () => {
	//from backend / strapi
	const response = await fetch('http://localhost:1337/api/students?populate=*', {
		method: 'GET',
		mode: 'cors',
		cache: 'no-cache',
		credentials: 'same-origin',
		headers: {
			Authorization: `Bearer ${jwt}`,
		},
		redirect: 'follow',
		referrerPolicy: 'no-referrer',
	});
	const data = await response.json();

	return data.data;
};

// add info func
const addNewInfo = value => {
	// just string/number info
	const newTd = document.createElement('td');
	newTd.innerHTML = value;

	return newTd;
};

const addNewBirthday = value => {
	// working with date
	const newTd = document.createElement('td');
	const date = new Date(value).toLocaleDateString();
	newTd.innerHTML = date;

	return newTd;
};

const addNewAge = value => {
	// working with date and calculating to age
	const newTd = document.createElement('td');

	// calculating year of student / not my code
	const date = new Date(value);

	//calculate month difference from current date in time
	const month_diff = Date.now() - date.getTime();
	//convert the calculated difference in date format
	const age_dt = new Date(month_diff);
	//extract year from date
	const year = age_dt.getUTCFullYear();
	//now calculate the age of the user
	const age = Math.abs(year - 1970);

	newTd.innerHTML = age;

	return newTd;
};

// add student parent info
const addStudentParents = parents => {
	const result = [[], []]; // 0 is mother 1 is father

	for (let i = 0; i < 2; i++) {
		result[i].push(addNewInfo(parents[i]['name']));
		result[i].push(addNewInfo(parents[i]['second_name']));
		result[i].push(addNewInfo(parents[i]['third_name']));
		result[i].push(addNewInfo(parents[i]['phone']));
		result[i].push(addNewInfo(parents[i]['job']));
		result[i].push(addNewInfo(parents[i]['job_address']));
		result[i].push(addNewInfo(parents[i]['family']));
		result[i].push(addNewBirthday(parents[i]['birthday']));
		result[i].push(addNewAge(parents[i]['birthday']));
	}

	return result;
};

// add student ta table
const addStudentToTable = student => {
	const newStudent = document.createElement('tr');

	// student info
	newStudent.appendChild(addNewInfo(student['name']));
	newStudent.appendChild(addNewInfo(student['second_name']));
	newStudent.appendChild(addNewInfo(student['third_name']));
	newStudent.appendChild(addNewInfo(student['address']));
	newStudent.appendChild(addNewInfo(student['phone']));
	newStudent.appendChild(addNewBirthday(student['birthday']));
	newStudent.appendChild(addNewAge(student['birthday']));
	newStudent.appendChild(addNewInfo(student['mail']));
	newStudent.appendChild(addNewInfo(student['UIN']));
	newStudent.appendChild(addNewInfo(student['family_number']));
	newStudent.appendChild(addNewInfo(student['nation']));
	newStudent.appendChild(addNewInfo(student['note']));

	// adding parents of student
	const mother = student['mother']['data']['attributes'];
	const father = student['father']['data']['attributes'];

	const parentsInfo = addStudentParents([mother, father]);
	// this is [ma, da][info] // info - html el

	for (let i = 0; i < parentsInfo.length; i++) {
		for (let j = 0; j < parentsInfo[i].length; j++) {
			newStudent.appendChild(parentsInfo[i][j]);
		}
	}

	// adding to table
	table.appendChild(newStudent);
};

// auth me to check if user is authorized
const authMe = async jwt => {
	if (!jwt) {
		window.location.href = '/auth.html';
	}

	const response = await fetch('http://localhost:1337/api/users/me', {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${jwt}`,
		},
	});

	const data = await response.json();

	if (!!data.error) {
		localStorage.removeItem('jwt');
		window.location.href = '/auth.html';
	}
};

// main functions
const main = async () => {
	authMe(jwt);

	// getting students from backend
	const students = await getStudents();

	// adding all students to table
	for (let i = 0; i < students.length; i++) {
		addStudentToTable(students[i].attributes);
	}
};

main();

// working with form for add a student to db
const form = document.getElementById('add-form');
const submitButton = document.getElementById('add-button');
const studentInputs = document.querySelectorAll('.add__input-student');
const studentMotherInputs = document.querySelectorAll('.add__input-mother');
const studentFatherInputs = document.querySelectorAll('.add__input-father');

// to disable reload on press key - enter
document.addEventListener('keypress', e => {
	if (e.key == 'Enter') {
		e.preventDefault();
	}
});

// on submit
submitButton.addEventListener('click', () => {
	//
});
