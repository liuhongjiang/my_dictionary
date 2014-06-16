
test = ["ðo", "ð", "kən,ɡrætʃu'leʃən", "sæm", "dɪ'veləpmənts", "ˈbɪznɪs", "kɑr", "'dʒʊəlri"]
// test = ["kən,ɡrætʃu'leʃən"]
// test = ["dɪ'veləpmənts"]

allYB = {
	// 长元音
	"CYY": {"ɑ:":1, "ɔ:":1, "ɜ:":1,"u:":1},
	// 短元音
	"DYY": {"ʌ":1, "ɒ":1, "ə":1, "ɪ":1, "u":1, "e":1, "æ":1, "ɑ":1, "i":1, "ɚ":1},
	// 双元音
	"SYY": {"eɪ":1, "aɪ":1, "ɔɪ":1, "ɪə":1, "eə":1, "ʊə":1, "əʊ":1, "aʊ":1, "o":1, "ʊə":1},
	// 轻辅音
	"QFY": {"p":1, "t":1, "k":1, "f":1, "θ":1, "s":1, "ʃ":1, "h":1, "ts":1, "tʃ":1, "tr":1, "tʃ":1},
	// 浊辅音
	"ZFY": {"b":1, "d":1, "g":1, "v":1, "ð":1, "z":1, "ʒ":1, "r":1, "dz":1, "dʒ":1, "dr":1, "ɡ":1, "r":1},
	// 鼻音，边音
	"BY": {"m":1, "n":1, "ŋ":1, "ǀ":1, "l":1},
	// 半元音
	"BYY": {"j":1, "w":1}
}

// 重读
ZD = {"ˈ":1, ",":1, "'":1}

// var isyy = function (yb) {
// 	for (key in allYB) {
// 		if (yb in allYB[key]) {
// 			if (key === "CYY" || key === "DYY" || key === "SYY") {
// 				return "yy";
// 			} else if (key === "BY") {
// 				return "by";
// 			} else if (key === "ZD") {
// 				return "zd";
// 			} else {
// 				return "fy";
// 			}
// 		}
// 	}
// 	console.log("-- not yb - " + yb);
// 	// throw new Error("not yb");
// 	return false
// }

// console.log(isyy(test[0]));

// return;

var canDivided = function (yb) {
	// console.log(yb);
	for (key in allYB) {
		if (yb in allYB[key]) {
			if (key === "CYY" || key === "DYY" || key === "SYY") {
				return true;
			} else if (key === "ZD") {
				return true;
			} else {
				return false;
			}
		}
	}
	throw new Error("-- not yb - " + yb);
	return false
}

var isZD = function (yb) {
	return yb in ZD;
}

var isBY = function (part) {
	return part in allYB["BY"];
}

var combineBY = function (parts) {
	if (parts.length <= 1) {
		return parts;
	}

	var combinedParts = [];
	for (var i = 0; i < parts.length - 1; i++) {
		if (isBY(parts[i + 1])) {
			combinedParts.push(parts[i] + parts[i + 1]);
			i = i + 1;
		} else {
			combinedParts.push(parts[i]);
		}
	};
	if (i === parts.length - 1) {
		combinedParts.push(parts[i]);
	}
	return combinedParts;
}

var divide = exports.divide = function (pronounce) {
	var parts = [];
	var onePart = "";
	var startPos = 0;
	var i = 0;
	var lastFlag = true;
	console.log("pronounce in divide: " + pronounce);
	while (i < pronounce.length) {
	// for (var i = 0; i < pronounce.length; i++) {
		debugger;
		var divideFlag = false;
		var step = 0;
		console.log("here")
		console.log("current index: " + i)
		console.log(pronounce.substring(i, i + 1));
		console.log(isZD(pronounce.substring(i, i + 1)))
		if (isZD(pronounce.substring(i, i + 1))) {
			if (i !== 0 && startPos < i) {
				parts.push(pronounce.substring(startPos, i));
				startPos = i;
				lastFlag = true;
			}
			i = i + 1;
			continue;
		}

		try {
			divideFlag = canDivided(pronounce.substring(i, i + 2));
			if (i + 2 <= pronounce.length) {
				step = 2;
			} else {
				step = 1;
			}
		} catch (err) {
			console.log("lhj catch error");
			divideFlag = canDivided(pronounce.substring(i, i + 1));
			step = 1;
		}
		console.log(step);
		console.log(divideFlag);
		i = i + step;
		if (divideFlag) {
			parts.push(pronounce.substring(startPos, i));
			startPos = i;
			lastFlag = true;
		} else {
			if (lastFlag === false) {
				parts.push(pronounce.substring(startPos, i - step));
				startPos = i - step;
				lastFlag = true;
			} else {
				lastFlag = false;
			}
		}
	};

	// console.log("here")
	// console.log(startPos);
	// console.log(parts);
	if (startPos < i) {
		parts.push(pronounce.substring(startPos, i));
	}
	return parts;
}



for (var i = 0; i <= test.length - 1; i++) {
	// for ( key in yb) {
	// 	if (test[0].substring(i, i+1) in yb[key]) {
	// 		console.log("in " + key);
	// 	}
	// }
	// try {
	// console.log(test[0].substring(i, i+2) + " - " + canDivided(test[0].substring(i, i+2)));
	// console.log(test[0].substring(i, i+1) + " - " + canDivided(test[0].substring(i, i+1)));
	// } catch (err) {
	// 	console.log(err);
	// }
	parts = divide(test[i]);
	console.log(parts);
	console.log(combineBY(parts));
}

// get max ying biao
// var max = 0;
// for (key in allYB) {
// 	for (key1 in allYB[key]) {
// 		if (max < key1.length ) {
// 		max = key1.length;
// 		}
// 	}
// }
// console.log(max)


// if (zfy[4] in zfy) {console.log("zfy 4 in zfy")};

// for (var i = zfy.length - 1; i >= 0; i--) {
// 	if (zfy[4] == zfy[i]) {
// 		console.log("haha 4");
// 	}
// 	console.log(zfy[i])
// };