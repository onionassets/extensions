// ==UserScript==
// @name         extract account id
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  Скрипт для автоматического вывода ID аккаунта. Также скрипт создает кнопку для перехода на страницу со всеми привязками этого человека, используя вместо никнейма ID аккаунта, что упрощает действия логера (аналог шаблонов от SetHP Script, но сразу с ID аккаунта, что будет чуть удобнее для такой задачи, как проверка привязок).
// @author       vk.com/okeyflexer
// @match        https://arizonarp.logsparser.info/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let targetAccountIDs = [];

    // Функция для поиска и добавления ID аккаунтов
    function addAccountID() {
        let rows = document.querySelectorAll('tr');

        rows.forEach(row => {
            let dataCell = row.querySelector('td:nth-child(3)');
            let additionalInfoCells = row.querySelectorAll('td:nth-child(3) .app__hidden');

            if (dataCell && additionalInfoCells.length > 0) {
                let idMatches = [];

                additionalInfoCells.forEach(additionalInfoCell => {
                    let dataText = additionalInfoCell.innerText.trim();
                    let matches = dataText.match(/ID аккаунта:\s*(\d+)/g);
                    if (matches) {
                        matches.forEach(match => {
                            let accountId = match.match(/\d+/)[0];
                            idMatches.push(accountId);
                        });
                    }
                });

                if (idMatches.length > 0) {
                    let codeElement = document.createElement('code');
                    codeElement.innerHTML = `ID аккаунта: ${idMatches.join(' | ')}`;
                    dataCell.appendChild(codeElement);

                    // Проверяем наличие одного никнейма в строке
                    let rowText = row.innerText.trim();
                    let playerNames = rowText.match(/Игрок \S+/g); // Ищем все упоминания "Игрок <никнейм>"

                    if (playerNames && playerNames.length === 1) {
                        targetAccountIDs.push(...idMatches);
                    }
                }
            }
        });

        createAccountIDButton();
    }

    // Функция для создания кнопки
    function createAccountIDButton() {
        const buttonContainer = document.querySelector('.filter-buttons');

        if (buttonContainer && targetAccountIDs.length > 0) {
            let existingButton = document.querySelector('.filter-buttons .btn-success.account-id-button');

            if (!existingButton) {
                const button = document.createElement('button');
                button.innerHTML = 'Привязки';
                button.className = 'btn btn-success account-id-button';
                button.style.marginRight = '10px';
                button.onclick = (event) => {
                    event.preventDefault();
                    const url = `https://arizonarp.logsparser.info/?server_number=30&type%5B%5D=vk_attache&type%5B%5D=vk_deattach&type%5B%5D=telegram_attach&type%5B%5D=telegram_deattach&type%5B%5D=acmail&type%5B%5D=googleauth_enable&type%5B%5D=googleauth_disable&type%5B%5D=mail_enable&type%5B%5D=mail_disable&type%5B%5D=mail&type%5B%5D=password&type%5B%5D=vk_attach&type%5B%5D=vk_detach&type%5B%5D=googleauth_attach&type%5B%5D=googleauth_detach&sort=desc&player=${targetAccountIDs.join('&player=')}`;
                    window.open(url, '_blank');
                };

                buttonContainer.appendChild(button);
                console.log('Кнопка "Привязки" была добавлена.');
            } else {
                console.log('Кнопка "Привязки" уже существует.');
            }
        } else if (!buttonContainer) {
            console.error('Контейнер не найден');
        }
    }

    // Функция для проверки и повторного добавления кнопки через определенные промежутки времени
    function monitorAccountIDButton() {
        const interval = setInterval(() => {
            console.log('Проверка наличия кнопки "Привязки"...');
            createAccountIDButton();
        }, 1500);
    }

    window.addEventListener('load', () => {
        addAccountID();
        monitorAccountIDButton();
    });
})();
