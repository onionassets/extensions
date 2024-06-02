// ==UserScript==
// @name         logs export
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Скрипт для экспорта логов со страницы с логами
// @author       vk.com/okeyflexer
// @match        https://arizonarp.logsparser.info/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Функция для создания кнопки
    function createExportButton() {
        // Находим контейнер для кнопок по указанному селектору
        const buttonContainer = document.querySelector('.filter-buttons');

        // Если контейнер найден, создаем кнопку и добавляем её в контейнер
        if (buttonContainer) {
            let existingButton = document.querySelector('.filter-buttons .btn-success.export-button');

            if (!existingButton) {
                const button = document.createElement('button');
                button.innerHTML = 'Выгрузить в txt';
                button.className = 'btn btn-success export-button';
                button.style.marginRight = '10px';
                button.onclick = exportLogs;

                buttonContainer.appendChild(button);
                console.log('Кнопка "Выгрузить в txt" была добавлена.');
            } else {
                console.log('Кнопка "Выгрузить в txt" уже существует.');
            }
        } else {
            console.error('Контейнер не найден');
        }
    }

    // Функция для экспорта логов
    function exportLogs(event) {
        event.preventDefault(); // Предотвращаем перезапуск страницы

        const logs = [];
        // Находим все строки таблицы логов
        const rows = document.querySelectorAll('table tbody tr');

        // Проходим по каждой строке и извлекаем данные
        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length > 0) {
                const dateTime = cells[0].innerText.trim();
                const message = cells[1].innerText.trim();
                logs.push(`${dateTime}\t${message}`);
            }
        });

        const logText = logs.join('\n');
        const blob = new Blob([logText], {type: 'text/plain'});
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'logs.txt';
        link.click();
    }

    // Функция для проверки и повторного добавления кнопки через определенные промежутки времени
    function monitorExportButton() {
        const interval = setInterval(() => {
            console.log('Проверка наличия кнопки "Выгрузить в txt"...');
            createExportButton();
        }, 15500);
    }

    window.addEventListener('load', () => {
        createExportButton();
        monitorExportButton();
    });
})();
