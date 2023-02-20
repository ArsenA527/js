const blocks = [
	digitalio_1,
	digitalio_2,
	analogio_1,
	analogio_2,


	mino1_2,
	mino1_13,
	mino1_12,
	mino1_14,

	mino1_6,
	mino1_8,
	mino1_11,
	mino1_9,
	mino2_1,
	mino2_3,
	mino2_5,
	mino2_7,
	mino2_9,
	mino2_11,
	mino_ddi1,
	mino1_15,
	mino1_3,
	mino1_4,
	mino1_5,
	mino2_13,
	mino2_14,
	mino2_15,
	mino2_16,
	mino1_1,

	impt100_1,
	impt100_2,
	impt100_3,
	impt100_4,

	powersource_1,
	powersource_2
];

blocks.forEach(obj => {
	obj.active = true;
	delay(100);
});

const indicators = {
	redOff: "border-radius: 50%; background-color: rgba(255, 0, 0, 0.2);",
	redOn: "border-radius: 50%; background-color: rgba(255, 0, 0, 1);",
	greenOff: "border-radius: 50%; background-color: rgba(0, 255, 0, 0.2);",
	greenOn: "border-radius: 50%; background-color: rgba(0, 255, 0, 1);",
};

ui.greenIndicator.styleSheet = indicators.greenOff;
ui.redIndicator.styleSheet = indicators.redOff;
ui.labelError.text = "";
ui.LogText.plainText = "";

let step = 0,
	count = 1,
	countError = 0,
	flag = false,
	flagTest = false, // ----------------
	start,
	startTime,
	finalReport = '';

function getTime(flag = false) {
	const currentdate = new Date();

	dd = (currentdate.getDate() < 10) ? "0" + currentdate.getDate() : currentdate.getDate();
	mm = ((currentdate.getMonth() + 1) < 10) ? "0" + (currentdate.getMonth() + 1) : (currentdate.getMonth() + 1);
	hh = (currentdate.getHours() < 10) ? "0" + currentdate.getHours() : currentdate.getHours();
	min = (currentdate.getMinutes() < 10) ? "0" + currentdate.getMinutes() : currentdate.getMinutes();
	ss = (currentdate.getSeconds() < 10) ? "0" + currentdate.getSeconds() : currentdate.getSeconds();

	if (flag)
		return dd + "." + mm + "." + currentdate.getFullYear() + "__" + hh + "" + min + "" + ss;

	return dd + "." + mm + "." +
		currentdate.getFullYear() + " " +
		hh + ":" + min + ":" + ss + " ";
}
// --------------------
function saveLog(typeTest, startTime, text, flag = false) {
	let filename = "";
	if (flag) filename = "BA-SNG-80" + typeTest + "_.txt";
	else filename = "BA-SNG-80" + typeTest + "_" + startTime + ".txt";
	writeFileText("c:/dev/" + filename, text);
}
// --------------------

function turnIndicator(state = 'GREEN') {
	if (state == 'GREEN') {
		ui.greenIndicator.styleSheet = indicators.greenOn;
		ui.redIndicator.styleSheet = indicators.redOff;
	} else {
		ui.greenIndicator.styleSheet = indicators.greenOff;
		ui.redIndicator.styleSheet = indicators.redOn;
	}
}

function validateFN(value) {
	let num = +value;
	return value.length === 3 &&
		((num instanceof Number || typeof num === 'number') && !isNaN(num));
};

function getReport(count, countError) {
	return `\nВсего тестов: ${count}\nУспешных тестов: ${count - countError}\n`;
}

function oneCheck() {
	typeTest = ui.FPKPushButton.text;

	if (step == 4) {
		step = 0;
		count = 0;
		ui.LogText.plainText = "";
		ui.greenIndicator.styleSheet = indicators.greenOff;
		ui.redIndicator.styleSheet = indicators.redOff;
	}

	switch (step) {
		case 0:
			buksng_1.active = false;
			buksng_1.alg_state = 0;
			buksng_1.fails_mask0 = 0;
			buksng_1.fails_mask1 = 0;

			powersource_1.on = true;
			powersource_2.on = true;

			start = getTime();
			startTime = getTime(true);



			ui.LogText.plainText += "Заводской номер: " + ui.lineEditFN.text + "\n";
			ui.LogText.plainText += typeTest + " - старт: " + start + "\n";

			delay(3000);

			ui.LogText.plainText += `\nИдет проверка...`;
			step++;
			break;
		case 1:
			if (buksng_1.alg_state == 2) {
				ui.LogText.plainText = `${typeTest} - старт: ${start}\n${script_3.result_out}\n`;

				if (script_3.result_error_out.includes('СНГ-ОТКАЗ')) flag = false;
				else flag = true;

				step++;
			} else buksng_1.active = true;
			break;
		case 2:
			ui.LogText.plainText = `${typeTest} - старт: ${start} \n${script_3.result_out}\n`;

			if (flag) {
				ui.LogText.plainText += "БА-СНГ-80-исправен\n";
				turnIndicator();
			} else turnIndicator('RED');

			ui.LogText.plainText += typeTest + " - конец: " + getTime() + "\n";
			step++;
			break;

		case 3:
			finalReport = ui.LogText.plainText;
			break;

		default:
			break;
	}
}

function moreCheck() {
	typeTest = ui.FPKPushButton.text;

	if (step == 4) {
		step = 0;
		count = 1;
		ui.LogText.plainText = "";
		ui.greenIndicator.styleSheet = indicators.greenOff;
		ui.redIndicator.styleSheet = indicators.redOff;
	}

	switch (step) {
		case 0:
			buksng_1.active = false;
			buksng_1.alg_state = 0;
			buksng_1.fails_mask0 = 0;
			buksng_1.fails_mask1 = 0;

			powersource_1.on = true;
			powersource_2.on = true;

			startTime = getTime(true);

			step++;
			break;
		case 1:
			start = getTime();
			ui.LogText.plainText = `Заводской номер: ${ui.lineEditFN.text} \n ${typeTest} - проверка №${count} старт: ${start}\n`;
			delay(3000);
			step++;
			break;
		case 2:
			if (buksng_1.alg_state == 2) {
				if (script_3.result_error_out !== '') flag = false;
				else flag = true;

				step++;
			} else buksng_1.active = true;
			break;
		case 3:
			if (flag) {
				ui.LogText.plainText += "БА-СНГ-80-исправен\n";
				turnIndicator();
			} else {
				countError++
				ui.LogText.plainText += script_3.result_error_out;
				turnIndicator('RED');
			}

			ui.LogText.plainText += `${typeTest} - проверка №${count} конец: ${getTime()}\n`;
			step = 31;
			break;
		case 31:
			buksng_1.selftest = true;
			buksng_1.selftest = false;
			delay(1000);
			step = 1;
			count++;

			finalReport += ui.LogText.plainText;
			ui.LogText.plainText += '\n';
			ui.LogText.plainText += '\n';

			saveLog(typeTest, startTime, finalReport, true); // ----------------------
			break;

		default:
			break;
	}
}

while (!isAbort()) {
	delay(500);

	if (ui.SaveLogButton.checked) {
		if (ui.cbMultiple.checked && finalReport !== '') {
			finalReport += getReport(count, countError);
		}
		saveLog(typeTest, startTime, finalReport, ui.cbMultiple.checked); // ----------------------
		ui.SaveLogButton.checked = false;
	}

	if (ui.ClearLogPushButton.checked) {
		ui.LogText.plainText = "";
		ui.lineEditFN.text = ""
		ui.ClearLogPushButton.checked = false;
		ui.greenIndicator.styleSheet = indicators.greenOff;
		ui.redIndicator.styleSheet = indicators.redOff;
	}

	if (!ui.FPKPushButton.checked) {
		ui.greenIndicator.styleSheet = indicators.greenOff;
		ui.redIndicator.styleSheet = indicators.redOff;
		powersource_1.on = false;
		powersource_2.on = false;
		step = 4;
		flagTest = false;

	}

	if (ui.FPKPushButton.checked) {
		if (validateFN(ui.lineEditFN.text)) {
			ui.labelError.text = "";

			if (!ui.cbMultiple.checked) oneCheck();
			else {
				flagTest = true; // ----------------
				moreCheck();
			}
		} else {
			ui.labelError.text = "Некорректный номер";
			ui.FPKPushButton.checked = false;
		}
	}
}