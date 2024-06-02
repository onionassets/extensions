// ==UserScript==
// @name         extract account id
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Скрипт для автоматического вывода ID аккаунта. Также скрипт создает кнопку для перехода на страницу со всеми привязками этого человека, используя вместо никнейма ID аккаунта, что упрощает действия логера (аналог шаблонов от SetHP Script, но сразу с ID аккаунта, что будет чуть удобнее для такой задачи, как проверка привязок).
// @author       vk.com/okeyflexer
// @match        https://arizonarp.logsparser.info/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let firstAccountID = null;

    // Функция для поиска и добавления ID аккаунта
    function addAccountID() {
        let rows = document.querySelectorAll('tr');

        rows.forEach(row => {
            let dataCell = row.querySelector('td:nth-child(3)');
            let additionalInfoCell = row.querySelector('td:nth-child(3) .app__hidden');

            if (dataCell && additionalInfoCell) {
                let dataText = additionalInfoCell.innerText.trim();
                let idMatch = dataText.match(/ID аккаунта:\s*(\d+)/);

                if (idMatch) {
                    let accountID = idMatch[1];

                    if (!firstAccountID) {
                        firstAccountID = accountID;
                    }

                    let codeElement = dataCell.querySelector('code');
                    let cellColor = codeElement ? getComputedStyle(codeElement).color : getComputedStyle(dataCell).color;

                    let span = document.createElement('span');
                    span.style.color = cellColor;
                    span.textContent = ` ID аккаунта: ${accountID}`;
                    dataCell.appendChild(span);
                }
            }
        });

        createButton();
    }

    // Функция для создания кнопки
    function createButton() {
        const buttonContainer = document.querySelector('.filter-buttons');

        if (buttonContainer && firstAccountID) {
            const button = document.createElement('button');
            button.innerHTML = 'Привязки';
            button.className = 'btn btn-success';
            button.style.marginRight = '10px';
            button.onclick = (event) => {
                event.preventDefault();
                const url = `https://arizonarp.logsparser.info/?server_number=30&type%5B%5D=vk_attache&type%5B%5D=vk_deattach&type%5B%5D=telegram_attach&type%5B%5D=telegram_deattach&type%5B%5D=acmail&type%5B%5D=googleauth_enable&type%5B%5D=googleauth_disable&type%5B%5D=mail_enable&type%5B%5D=mail_disable&type%5B%5D=mail&type%5B%5D=password&type%5B%5D=vk_attach&type%5B%5D=vk_detach&type%5B%5D=googleauth_attach&type%5B%5D=googleauth_detach&sort=desc&player=${firstAccountID}`;
                window.open(url, '_blank');
            };

            buttonContainer.appendChild(button);
        } else {
            console.error('Контейнер не найден или ID аккаунта не найден');
        }
    }

    window.addEventListener('load', addAccountID);
})();
