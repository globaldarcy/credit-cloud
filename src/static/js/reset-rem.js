// reset rem
(function (window, document) {
    var docEl = document.documentElement,
        resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
        dpr = window.devicePixelRatio || 1;

    // set 1rem = viewWidth / 10
    function setRemUnit() {
        if (docEl.clientWidth >= 1680) {
            docEl.style.fontSize = '100px';
        } else if (docEl.clientWidth >= 1440) {
            docEl.style.fontSize = '80px';
        } else if (docEl.clientWidth >= 1024) {
            docEl.style.fontSize = '70px';
        } else if (docEl.clientWidth >= 750) {
            docEl.style.fontSize = '60px';
        } else {
            docEl.style.fontSize = 200 * (docEl.clientWidth / 750) + 'px';
        }
    }

    setRemUnit();

    // reset rem unit on page resize
    window.addEventListener(resizeEvt, setRemUnit);
    window.addEventListener('DOMContentLoaded', setRemUnit);
    window.addEventListener('pageshow', function (e) {
        if (e.persisted) {
            setRemUnit();
        }
    })

    // detect 0.5px supports
    if (dpr >= 2) {
        var fakeBody = document.createElement('body'),
            testElement = document.createElement('div');
        testElement.style.border = '.5px solid transparent';
        fakeBody.appendChild(testElement);
        docEl.appendChild(fakeBody);
        if (testElement.offsetHeight === 1) {
            docEl.classList.add('hairlines');
        }
        docEl.removeChild(fakeBody);
    }
}(window, document))