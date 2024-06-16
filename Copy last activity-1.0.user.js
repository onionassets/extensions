// ==UserScript==
// @name         Copy last activity
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Copy last activity date to clipboard on click
// @author       by @okeyflexer
// @match        https://arizona-rp.com/*
// @grant        GM_setClipboard
// ==/UserScript==

(function() {
    'use strict';

    // Функция для копирования текста в буфер обмена
    function copyToClipboard(text) {
        GM_setClipboard(text, 'text');
    }

    // Уведомление
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.position = 'fixed';
        notification.style.bottom = '20px';
        notification.style.right = '20px';
        notification.style.padding = '10px 20px';
        notification.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        notification.style.color = 'white';
        notification.style.borderRadius = '5px';
        notification.style.zIndex = '1000';
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.transition = 'opacity 0.5s';
            notification.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 500);
        }, 2000);
    }

    function setClickListener() {
        const lastVisitElement = document.querySelector('.userPopup_option__dFjXJ span:nth-child(34)');
        const lastVisitValue = document.querySelector('.userPopup_value__L4WTW span:nth-child(34)');

        if (lastVisitElement && lastVisitValue) {
            console.log('Элемент найден:', lastVisitElement);
            lastVisitValue.addEventListener('click', function() {
                const lastVisitText = lastVisitValue.textContent.trim();
                copyToClipboard(lastVisitText);
                showNotification('Скопировано в буфер обмена: ' + lastVisitText);
            });
        } else {
            console.log('Элемент не найден, повторная проверка...');
        }
    }

    // Периодическая проверка элемента на сранице
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            setClickListener();
        });
    });
    observer.observe(document.body, { childList: true, subtree: true });

    setClickListener();
})();
