$(document).ready(function () {
    let calc = $('.calculate');
    let input = $('input');
    var position = [],
        state = [];

    $('.clear').on('click', function () {
        clearFunc()
    })
    $('.remove').on('click', function () {
        removeLast();
    })
    $('.numbers').on('click', function () {
        numFunc($(this).text())
    })
    $('.operation').on('click', function () {
        operatFunc($(this).text())
    })
    $('.dot').on('click', function () {
        dotFunc($(this).text());
    });
    calc.on('click', function () {
        calcFunc();
    })
    window.addEventListener('keyup', function (e) {
        const key = e.key.toLowerCase();
        if (key === 'c') {
            clearFunc();
        } else if (key === 'backspace') {
            removeLast()
        } else if (parseInt(key) >= 0 && parseInt(key) <= 9) {
            numFunc(key)
        } else if (key === '+' || key === '/' || key === '*' || key === '-') {
            operatFunc(key);
        } else if (key === '.') {
            dotFunc(key)
        }

    })
    function removeLast() {
        const value = $('input').val().trim();
        const last = value.slice(length - 1);
        if (last === '.') {
            toggleButton()
        } else if (last === '+' || last === '-' || last === '/' || last === '*') {
            position.pop();
            state.pop();

            if (!position.length) {
                if (value.indexOf('.') === - 1) {
                    toggleButton();
                } else {
                    toggleButton(true);
                }
            } else {
                if (value.indexOf('.', position[position.length - 1]) === -1) {
                    toggleButton();
                } else {
                    toggleButton(true)
                }
            }
        }


        let res = value.slice(0, value.length - 1);
        input.val(res);
    }
    function toggleButton(isAcctive = false) {
        if (isAcctive) {
            $('.dot').prop('disabled', true).css({ 'cursor': 'not-allowed' })
        } else {
            $('.dot').prop('disabled', false).css({ 'cursor': 'pointer' })
        }
    }
    function dotFunc(temp) {
        toggleButton(true);
        const value = $('input').val().trim();
        const last = value.slice(value.length - 1);
        if (value === "") {
            input.val(value + '0.');
        } else if (last === '+' || last === '-' || last === '/' || last === '*') {
            input.val(value + '0.');
        } else if (last !== '.') {
            const text = value + temp;
            input.val(text);
        }
    }
    function operatFunc(temp2) {
        const value = $('input').val().trim();
        const last = value.slice(value.length - 1);
        if (value === "" && $(this).text() === '-') {
            input.val('-')
            position.push(input.val().length - 1);
            state.push('-');
        } else if (last !== '' && last !== '+' && last !== '-' && last !== '/' && last !== '*x' && last !== '.') {
            let operat = value + temp2;
            input.val(operat);
            position.push(input.val().length - 1);
            state.push(temp2);
            toggleButton();
        }
    }
    function numFunc(temp) {
        const value = $('input').val().trim();
        const last = value.slice(value.length - 1);
        if (last === '/' && temp === '0') {
            alert('0 Bolish mumkin emas!');
            input.val('');
            return;
        }
        let numValue = value + temp;
        input.val(numValue);
    }
    function clearFunc() {
        input.val("");
        toggleButton()
        position = [],
            state = [];
    }

    function calcFunc() {
        var value = $('input').val().trim();
        const last = value.slice(value.length - 1);
        if (!Number.isInteger(parseInt(last))) {
            value = value.slice(0, value.length - 1);
        }

        if (value === '') {
            alert('Raqam kiriting!');
        } else if (!position.length) {
            input.val(value);
        } else {
            var isEmpty = true;

            while (isEmpty) {
                if (value.indexOf('/') > - 1) {
                    const ps = value.indexOf('/');
                    value = handleResult(value, ps, '/*-+', '/')
                } else
                    if (value.indexOf('*') > - 1) {
                        const ps = value.indexOf('*');
                        value = handleResult(value, ps, '*-+', '*')
                    } else
                        if (value.indexOf('-') > - 1 && value[0] !== '-') {
                            const ps = value.indexOf('-');
                            value = handleResult(value, ps, '-+', '-')
                        } else
                            if (value.indexOf('+') > - 1) {
                                const ps = value.indexOf('+');
                                value = handleResult(value, ps, '+', '+')
                            } else {
                                isEmpty = false;
                            }
            }
            input.val(value)
        }

    }
    function findNextIndex(str, massiv, index) {
        var nextIndex = str.length;
        for (var i = index + 1; i < str.length; i++) {
            if (massiv.indexOf(str[i]) > -1) {
                return i;
            }
        }
        return nextIndex;
    }

    function findPrevIndex(str, massiv, index) {
        var prevIndex = 0;
        for (var i = 0; i < index; i++) {
            if (massiv.indexOf(str[i]) > -1) {
                prevIndex = i;
            }
        }
        return prevIndex;
    }

    function handleResult(value, ps, massiv, type) {
        const nextIndex = findNextIndex(value, massiv, ps);
        const prevIndex = findPrevIndex(value, massiv, ps);

        const nextEl = parseFloat(value.slice(ps + 1, nextIndex));
        const prevEl = parseFloat(value.slice(prevIndex > 0 ? prevIndex + 1 : 0, ps));

        const result = (
            function () {
                switch (type) {
                    case '/':
                        return prevEl / nextEl;
                    case '*':
                        return prevEl * nextEl;
                    case '-':
                        return prevEl - nextEl;
                    case '+':
                        return prevEl + nextEl;
                    default:
                        return '';
                }
            }
        )()
        const start = value.slice(0, (prevIndex > 0 ? prevIndex + 1 : 0));
        const end = value.slice(nextIndex);

        if (start[start.length - 1] === '+' && result[0] === '-') {
            start = start.slice(0, start.length - 1);
        }

        return value = start + '' + result + '' + end;
    }
})