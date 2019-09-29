var can = document.getElementById('can')
var con = can.getContext('2d')

var cS = 0
var hS = localStorage.getItem('hS')

var isFull = false
var win = false
var over = false

var step = 0

var color = {
	1: 'crimson',
	2: '#F44336',
	4: '#009688',
	8: '#795548',
	16: '#E91E63',
	32: '#4CAF50',
	64: '#9C27B0',
	128: '#8BC34A',
	256: '#673AB7',
	512: '#CDDC39',
}

function newBlankNode() {
	return [
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[0, 0, 0, 0]
	]
}

var node = newBlankNode()

function draw() {
	var baru = addNum()
	con.clearRect(0, 0, 415, 415)
	for (var i = 0; i < 4; i++) {
		for (var j = 0; j < 4; j++) {

			if (node[i][j] != 0) {
				con.fillStyle = color[node[i][j]]
			} else {
				con.fillStyle = 'lightblue'
			}
			con.fillRect(105 * j, 105 * i, 100, 100)

			if (node[i][j] != 0) {
				if (node[i][j] > 100) {
					con.font = '48px Segoe UI'
				} else {
					con.font = '64px Segoe UI'
				}
				con.textAlign = 'center'
				con.fillStyle = 'white'
				if (node[i][j] == 1) {
					con.fillText('W', 105 * j + 50, 105 * i + 70)
				} else {
					con.fillText(node[i][j], 105 * j + 50, 105 * i + 70)
				}
				con.strokeStyle = 'black'
				con.strokeRect(105 * baru.y, 105 * baru.x, 100, 100)
			}
		}
	}
}

draw()

function genNum() {
	var a = Math.random()
	if (step == 7) {
		step = -1
		return 1
	} else {
		if (a >= 0.5) {
			return 2
		} else {
			return 4
		}
	}
}

function addNum() {
	var posKo = []
	for (var i = 0; i < 4; i++) {
		for (var j = 0; j < 4; j++) {
			if (node[i][j] == 0) {
				posKo.push({
					x: i,
					y: j
				})
			}
		}
	}

	if (posKo.length - 1 == 0) {
		isFull = true
	} else {
		isFull = false
	}

	if (posKo.length > 0) {
		var posisi = acakPo(posKo)
		node[posisi.x][posisi.y] = genNum()
		return {
			x: posisi.x,
			y: posisi.y
		}
	}
}

function acakPo(posKo) {
	var a = Math.floor(Math.random() * posKo.length)
	return posKo[a]
}

function isWin(node) {
	for (i = 0; i < 4; i++) {
		for (j = 0; j < 4; j++) {
			if (node[i][j] == 512) {
				win = true
				return true
			}
		}
	}
	return false
}

window.addEventListener('keydown', function (e) {
	if (win == false && over == false) {
		var press = e.keyCode
		var isFlip = false
		var isRotate = false

		var lastNode = copyNode(node)

		switch (press) {
			case 37:
				// 
				break
			case 38:
				node = rotateNode(node)
				isRotate = true
				break
			case 39:
				node = flipNode(node)
				isFlip = true
				break
			case 40:
				node = rotateNode(node)
				isRotate = true
				node = flipNode(node)
				isFlip = true
				break
		}

		if (press >= 37 && press <= 40) {

			for (var i = 0; i < 4; i++) {
				node[i] = slideNode(node[i])
				node[i] = kombin(node[i])
				node[i] = kombin(node[i])
				node[i] = slideNode(node[i])
			}

			if (isFlip) {
				node = flipNode(node)
			}

			if (isRotate) {
				node = rotateNode(node)
				node = rotateNode(node)
				node = rotateNode(node)
			}

			var isChange = compareNode(lastNode, node)

			if (isChange) {
				draw()
				skoring(cS)
				step++
			}

			if (isWin(node)) {
				showModal('MENANG PAK !')
			}

			if (isChange == false && isFull == true) {
				over = true
				showModal('GAME OVER')
			}

		}
	}

})

function slideNode(row) {
	var hapus = row.filter(a => a)
	var sisa = 4 - hapus.length
	var isi = Array(sisa).fill(0)
	return hapus.concat(isi)
}

function kombin(row) {
	for (var i = 3; i >= 0; i--) {
		if (row[i] == 1 && row[i - 1] != 0) {
			if (row[i - 1]) {
				row[i - 1] = row[i - 1] * 2
				row[i] = 0
			} else {
				row[i] = 2
				cS += row[i]
			}
		} else if (row[i] == row[i - 1]) {
			row[i - 1] = row[i] + row[i - 1]
			row[i] = 0
			cS += row[i - 1]
		}
	}
	return row
}

function flipNode(node) {
	for (i = 0; i < 4; i++) {
		node[i] = node[i].reverse()
	}

	return node
}

function rotateNode(node) {
	var newNode = newBlankNode()
	for (i = 0; i < 4; i++) {
		for (j = 0; j < 4; j++) {
			newNode[i][j] = node[j][i]
		}
	}

	return newNode
}

function copyNode(node) {
	var newNode = newBlankNode()
	for (i = 0; i < 4; i++) {
		for (j = 0; j < 4; j++) {
			newNode[i][j] = node[i][j]
		}
	}

	return newNode
}

function compareNode(a, b) {
	for (i = 0; i < 4; i++) {
		for (j = 0; j < 4; j++) {
			if (a[i][j] != b[i][j]) {
				return true
			}
		}
	}

	return false
}

function skoring(skor) {
	if (skor >= hS) {
		document.getElementById('cS').innerHTML = skor
		document.getElementById('hS').innerHTML = skor
		localStorage.setItem('hS', skor)
	} else {
		document.getElementById('cS').innerHTML = skor
		document.getElementById('hS').innerHTML = hS
	}
}

skoring(cS)

function newGame() {
	node = newBlankNode()
	draw()
	cS = 0
	skoring(cS)
	win = false
	over = false
}

var modal = document.querySelector('.modal')

function showModal(msg) {
	document.getElementById('msg').innerHTML = msg
	modal.style.height = '100%'
}

function hideModal() {
	modal.style.height = '0%'
}

function mainLagi() {
	hideModal()
	newGame()
}